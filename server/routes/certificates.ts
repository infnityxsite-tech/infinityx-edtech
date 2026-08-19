import express from "express";
import fs from "fs";
import path from "path";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { getCertificateByCertId } from "../db";

const router = express.Router();
const certificateCache = new Map<string, Buffer>();

// Helper to draw text perfectly centered inside a bounding box, scaling size down if it overflows width.
function drawBoundedText(
    ctx: any,
    text: string,
    box: { x1: number; y1: number; x2: number; y2: number },
    options: { fontName: string; maxFontSize: number; color: string }
) {
    const width = box.x2 - box.x1;
    const height = box.y2 - box.y1;
    const cx = box.x1 + width / 2;
    const cy = box.y1 + height / 2;

    let fontSize = options.maxFontSize;
    ctx.fillStyle = options.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Auto-scale font down to fit bounding box
    do {
        ctx.font = `${fontSize}px "${options.fontName}"`;
        const metrics = ctx.measureText(text);
        if (metrics.width <= width) break;
        fontSize -= 1;
    } while (fontSize > 10);

    ctx.fillText(text, cx, cy);
}

// Pre-register fonts for Canvas mapping with dynamic path resolution
const possibleFontPaths = [
    path.join(process.cwd(), "client", "public", "fonts"),
    path.join(process.cwd(), "dist", "public", "fonts"),
    path.join(process.cwd(), "public", "fonts")
];
let fontDir = "";
for (const p of possibleFontPaths) {
    if (fs.existsSync(path.join(p, "PlayfairDisplay-Bold.ttf"))) {
        fontDir = p;
        break;
    }
}

if (fontDir) {
    try {
        GlobalFonts.registerFromPath(path.join(fontDir, "PlayfairDisplay-Bold.ttf"), "PlayfairDisplay Bold");
        GlobalFonts.registerFromPath(path.join(fontDir, "Inter-Bold.ttf"), "Inter Bold");
        GlobalFonts.registerFromPath(path.join(fontDir, "Inter-Medium.ttf"), "Inter Medium");
        console.log("✅ Custom fonts registered securely from:", fontDir);
    } catch (e: any) {
        console.log("Could not register fonts. Defaulting to system fonts. Error:", e.message);
    }
} else {
    console.log("❌ Certificate Fonts directory not found. Defaulting to system fonts.");
}

router.get("/:certId/download", async (req, res) => {
    try {
        const { certId } = req.params;
        const certificate = await getCertificateByCertId(certId.toUpperCase());

        if (!certificate) {
            return res.status(404).send("Certificate not found");
        }

        const cachedCertificate = certificateCache.get(certificate.certId);
        if (cachedCertificate) {
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Content-Disposition", `attachment; filename="Certificate-${certId}.png"`);
            res.setHeader("Cache-Control", "private, max-age=300");
            return res.send(cachedCertificate);
        }

        const templatePath = path.join(process.cwd(), "uploads", "certification.png");
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template image not found at ${templatePath}`);
        }

        // Fixed physical dimensions (Width: 1410 px, Height: 899 px)
        const CERT_WIDTH = 1410;
        const CERT_HEIGHT = 899;

        const canvasArea = createCanvas(CERT_WIDTH, CERT_HEIGHT);
        const ctx = canvasArea.getContext("2d");

        // 1. Draw Background Template
        const templateImage = await loadImage(templatePath);
        ctx.drawImage(templateImage, 0, 0, CERT_WIDTH, CERT_HEIGHT);

        // 2. Draw Bounded Student Name (X: 355 to 1063, Y: 338 to 397)
        drawBoundedText(ctx, certificate.studentName, { x1: 355, y1: 338, x2: 1063, y2: 397 }, {
            fontName: "PlayfairDisplay Bold",
            maxFontSize: 56,
            color: "#1e293b",
        });

        // 3. Draw Bounded Course Name (X: 320 to 1152, Y: 460 to 505)
        drawBoundedText(ctx, certificate.courseName, { x1: 320, y1: 460, x2: 1152, y2: 505 }, {
            fontName: "Inter Bold",
            maxFontSize: 28,
            color: "#1e40af",
        });

        // 4. Draw Date of Issue (X: 586 to 802, Y: 589 to 613)
        const formattedDate = new Date(certificate.issueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        drawBoundedText(ctx, formattedDate, { x1: 586, y1: 589, x2: 802, y2: 613 }, {
            fontName: "Inter Medium",
            maxFontSize: 18,
            color: "#334155",
        });

        // 5. Draw Certificate ID (X: 929 to 1198, Y: 594 to 616)
        drawBoundedText(ctx, `CERT ID: ${certificate.certId}`, { x1: 929, y1: 594, x2: 1198, y2: 616 }, {
            fontName: "Inter Medium",
            maxFontSize: 16,
            color: "#64748b",
        });

        // 6. Fetch and Draw QR Code Bounds (X: 1117 to 1225, Y: 653 to 770)
        const verifyUrl = `https://infx.space/certificates/${certificate.certId}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;
        const qrResponse = await fetch(qrUrl);
        if (!qrResponse.ok) throw new Error("Failed to fetch QR code");

        // We fetch as array buffer, then convert to node Buffer for canvas to ingest directly
        const qrBuffer = Buffer.from(await qrResponse.arrayBuffer());
        const qrImage = await loadImage(qrBuffer);

        // Stamping the QR precisely onto bounding box
        const qrW = 1225 - 1117; // 108
        const qrH = 770 - 653;   // 117
        // QR should remain fully square inside the box (taking nearest minimum dimension to avoid stretching)
        const squareSize = Math.min(qrW, qrH); // 108
        const qrX = 1117 + (qrW - squareSize) / 2; // Horizontally center within bounds
        const qrY = 653 + (qrH - squareSize) / 2;  // Vertically center within bounds

        ctx.drawImage(qrImage, qrX, qrY, squareSize, squareSize);

        const outBuffer = canvasArea.encodeSync("png");
        certificateCache.set(certificate.certId, outBuffer);
        if (certificateCache.size > 25) {
            const oldestKey = certificateCache.keys().next().value;
            if (oldestKey) certificateCache.delete(oldestKey);
        }

        res.setHeader("Content-Type", "image/png");
        res.setHeader("Content-Disposition", `attachment; filename="Certificate-${certId}.png"`);
        res.setHeader("Cache-Control", "private, max-age=300");
        res.send(outBuffer);

    } catch (err: any) {
        console.error("Certificate generation error:", err);
        res.status(500).send("Error generating certificate");
    }
});

export default router;
