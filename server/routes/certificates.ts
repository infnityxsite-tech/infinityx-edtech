import express from "express";
import fs from "fs";
import path from "path";
import { getCertificateByCertId } from "../db";

// ---------------------------------------------------------------------------
// IMPORTANT: @napi-rs/canvas is a native module that requires a platform-
// specific binary. Loading it at the top level causes the ENTIRE Netlify
// Function (including /api/health, tRPC, courses, auth, etc.) to crash on
// cold start if the binary is not present for the current platform.
//
// Solution: load canvas lazily, inside the request handler only. All other
// routes remain fully operational even if canvas cannot be loaded.
// ---------------------------------------------------------------------------

const router = express.Router();
const certificateCache = new Map<string, Buffer>();

// Lazy-loaded canvas module — resolved once on first certificate request.
let canvasModule: typeof import("@napi-rs/canvas") | null = null;
let canvasLoadError: string | null = null;
let fontsRegistered = false;

async function getCanvas(): Promise<typeof import("@napi-rs/canvas")> {
  if (canvasModule) return canvasModule;
  if (canvasLoadError) throw new Error(canvasLoadError);

  try {
    // Dynamic import keeps the native binary OUT of the module-initialization
    // graph so esbuild/serverless-http never tries to require it at startup.
    canvasModule = await import("@napi-rs/canvas");
    return canvasModule;
  } catch (err) {
    canvasLoadError = err instanceof Error ? err.message : String(err);
    console.error("@napi-rs/canvas failed to load:", canvasLoadError);
    throw new Error(`Canvas native module unavailable: ${canvasLoadError}`);
  }
}

/** Register custom fonts once after canvas has been confirmed available. */
function registerFontsOnce(canvas: typeof import("@napi-rs/canvas")): void {
  if (fontsRegistered) return;
  fontsRegistered = true;

  const possibleFontPaths = [
    path.join(process.cwd(), "client", "public", "fonts"),
    path.join(process.cwd(), "dist", "public", "fonts"),
    path.join(process.cwd(), "public", "fonts"),
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
      canvas.GlobalFonts.registerFromPath(
        path.join(fontDir, "PlayfairDisplay-Bold.ttf"),
        "PlayfairDisplay Bold"
      );
      canvas.GlobalFonts.registerFromPath(
        path.join(fontDir, "Inter-Bold.ttf"),
        "Inter Bold"
      );
      canvas.GlobalFonts.registerFromPath(
        path.join(fontDir, "Inter-Medium.ttf"),
        "Inter Medium"
      );
      console.log("Certificate fonts registered from:", fontDir);
    } catch (e: any) {
      console.warn("Could not register certificate fonts:", e.message);
    }
  } else {
    console.warn("Certificate fonts directory not found — system fonts will be used.");
  }
}

// Helper: draw text perfectly centred inside a bounding box, auto-scaling.
function drawBoundedText(
  ctx: any,
  text: string,
  box: { x1: number; y1: number; x2: number; y2: number },
  options: { fontName: string; maxFontSize: number; color: string }
) {
  const width = box.x2 - box.x1;
  const cx = box.x1 + width / 2;
  const cy = box.y1 + (box.y2 - box.y1) / 2;

  let fontSize = options.maxFontSize;
  ctx.fillStyle = options.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  do {
    ctx.font = `${fontSize}px "${options.fontName}"`;
    if (ctx.measureText(text).width <= width) break;
    fontSize -= 1;
  } while (fontSize > 10);

  ctx.fillText(text, cx, cy);
}

router.get("/:certId/download", async (req, res) => {
  try {
    const { certId } = req.params;
    const certificate = await getCertificateByCertId(certId.toUpperCase());

    if (!certificate) {
      return res.status(404).send("Certificate not found");
    }

    // Serve from memory cache if available.
    const cached = certificateCache.get(certificate.certId);
    if (cached) {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename="Certificate-${certId}.png"`);
      res.setHeader("Cache-Control", "private, max-age=300");
      return res.send(cached);
    }

    // Load canvas now — only on the first actual certificate request.
    let canvas: typeof import("@napi-rs/canvas");
    try {
      canvas = await getCanvas();
    } catch (err: any) {
      console.error("Certificate canvas unavailable:", err.message);
      return res
        .status(503)
        .send("Certificate generation is temporarily unavailable (native module not loaded).");
    }

    // Register fonts once canvas is confirmed working.
    registerFontsOnce(canvas);

    const templatePath = path.join(process.cwd(), "uploads", "certification.png");
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Certificate template not found at ${templatePath}`);
    }

    const CERT_WIDTH = 1410;
    const CERT_HEIGHT = 899;

    const canvasArea = canvas.createCanvas(CERT_WIDTH, CERT_HEIGHT);
    const ctx = canvasArea.getContext("2d");

    // 1. Background template
    const templateImage = await canvas.loadImage(templatePath);
    ctx.drawImage(templateImage, 0, 0, CERT_WIDTH, CERT_HEIGHT);

    // 2. Student name  (X: 355–1063, Y: 338–397)
    drawBoundedText(
      ctx,
      certificate.studentName,
      { x1: 355, y1: 338, x2: 1063, y2: 397 },
      { fontName: "PlayfairDisplay Bold", maxFontSize: 56, color: "#1e293b" }
    );

    // 3. Course name  (X: 320–1152, Y: 460–505)
    drawBoundedText(
      ctx,
      certificate.courseName,
      { x1: 320, y1: 460, x2: 1152, y2: 505 },
      { fontName: "Inter Bold", maxFontSize: 28, color: "#1e40af" }
    );

    // 4. Issue date  (X: 586–802, Y: 589–613)
    const formattedDate = new Date(certificate.issueDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    drawBoundedText(
      ctx,
      formattedDate,
      { x1: 586, y1: 589, x2: 802, y2: 613 },
      { fontName: "Inter Medium", maxFontSize: 18, color: "#334155" }
    );

    // 5. Certificate ID  (X: 929–1198, Y: 594–616)
    drawBoundedText(
      ctx,
      `CERT ID: ${certificate.certId}`,
      { x1: 929, y1: 594, x2: 1198, y2: 616 },
      { fontName: "Inter Medium", maxFontSize: 16, color: "#64748b" }
    );

    // 6. QR code  (X: 1117–1225, Y: 653–770)
    const verifyUrl = `https://infx.space/certificates/${certificate.certId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;
    const qrResponse = await fetch(qrUrl);
    if (!qrResponse.ok) throw new Error("Failed to fetch QR code");

    const qrBuffer = Buffer.from(await qrResponse.arrayBuffer());
    const qrImage = await canvas.loadImage(qrBuffer);

    const qrW = 1225 - 1117; // 108
    const qrH = 770 - 653;   // 117
    const squareSize = Math.min(qrW, qrH); // 108
    ctx.drawImage(qrImage, 1117 + (qrW - squareSize) / 2, 653 + (qrH - squareSize) / 2, squareSize, squareSize);

    const outBuffer = canvasArea.encodeSync("png");

    // Keep up to 25 rendered certificates in memory.
    certificateCache.set(certificate.certId, outBuffer);
    if (certificateCache.size > 25) {
      const oldest = certificateCache.keys().next().value;
      if (oldest) certificateCache.delete(oldest);
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
