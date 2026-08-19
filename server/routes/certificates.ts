import express from "express";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { getCertificateByCertId } from "../db";

// ---------------------------------------------------------------------------
// Root cause of the blank-image bug:
//   The original single /download endpoint sent Content-Disposition: attachment,
//   so browsers refused to display it in an <img src="..."> tag. The frontend
//   was reusing the same download URL as the img src, so the image always
//   appeared broken/blank even though the PNG was generated correctly.
//
// Fix:
//   • /api/certificates/:certId/image   → Content-Disposition: inline  (for <img>)
//   • /api/certificates/:certId/download → Content-Disposition: attachment (for Save)
//
// The PNG is generated once and stored in a server-side memory cache shared
// between both endpoints. The second call is always a cache hit.
//
// QR code:
//   The original code fetched from api.qrserver.com (external). If that service
//   was slow or unavailable, certificate rendering failed or stalled.
//   Replaced with the 'qrcode' npm package (pure JS, no external calls).
//
// @napi-rs/canvas lazy loading:
//   Canvas is still loaded lazily, inside the request handler only.
//   All other API routes (health, tRPC, auth, etc.) remain fully operational
//   even if the canvas native binary is missing.
// ---------------------------------------------------------------------------

const router = express.Router();

// In-memory cache: certId → rendered PNG buffer (max 25 entries).
const certificateCache = new Map<string, Buffer>();

// Canvas module — loaded once on the first certificate request.
let canvasModule: typeof import("@napi-rs/canvas") | null = null;
let canvasLoadError: string | null = null;
let fontsRegistered = false;

async function getCanvas(): Promise<typeof import("@napi-rs/canvas")> {
  if (canvasModule) return canvasModule;
  if (canvasLoadError) throw new Error(canvasLoadError);

  try {
    canvasModule = await import("@napi-rs/canvas");
    return canvasModule;
  } catch (err) {
    canvasLoadError = err instanceof Error ? err.message : String(err);
    console.error("[certificates] @napi-rs/canvas failed to load:", canvasLoadError);
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
      console.log("[certificates] Fonts registered from:", fontDir);
    } catch (e: any) {
      console.warn("[certificates] Could not register fonts:", e.message);
    }
  } else {
    console.warn("[certificates] Font directory not found — using system fonts.");
  }
}

/** Draw text centred inside a bounding box, auto-scaling font to fit width. */
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

/**
 * Generate the certificate PNG and return the buffer.
 * Results are cached in `certificateCache` keyed by certId.
 */
async function renderCertificate(certId: string): Promise<Buffer> {
  // Cache hit.
  const cached = certificateCache.get(certId);
  if (cached) return cached;

  // Load DB record.
  const certificate = await getCertificateByCertId(certId.toUpperCase());
  if (!certificate) {
    throw Object.assign(new Error("Certificate not found"), { statusCode: 404 });
  }

  // Load canvas (lazy — throws if binary not available).
  let canvas: typeof import("@napi-rs/canvas");
  try {
    canvas = await getCanvas();
  } catch (err: any) {
    throw Object.assign(
      new Error(`Certificate generation unavailable: ${err.message}`),
      { statusCode: 503 }
    );
  }

  registerFontsOnce(canvas);

  // Verify template exists.
  const templatePath = path.join(process.cwd(), "uploads", "certification.png");
  if (!fs.existsSync(templatePath)) {
    console.error("[certificates] Template not found at", templatePath);
    throw Object.assign(
      new Error("Certificate template missing"),
      { statusCode: 500 }
    );
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

  // 6. QR code — generated locally with 'qrcode' (no external HTTP call).
  //    Previously fetched from api.qrserver.com which could stall/fail.
  const verifyUrl = `https://infx.space/certificates/${certificate.certId}`;
  let qrBuffer: Buffer;
  try {
    qrBuffer = await QRCode.toBuffer(verifyUrl, {
      errorCorrectionLevel: "M",
      type: "png",
      margin: 1,
      color: { dark: "#1e293b", light: "#ffffff" },
    });
  } catch (qrErr: any) {
    // QR generation failure is non-fatal: log and skip QR stamp.
    console.warn("[certificates] QR generation failed:", qrErr.message);
    qrBuffer = Buffer.alloc(0);
  }

  if (qrBuffer.length > 0) {
    const qrImage = await canvas.loadImage(qrBuffer);
    const qrW = 1225 - 1117; // 108
    const qrH = 770 - 653;   // 117
    const squareSize = Math.min(qrW, qrH); // 108
    ctx.drawImage(
      qrImage,
      1117 + (qrW - squareSize) / 2,
      653 + (qrH - squareSize) / 2,
      squareSize,
      squareSize
    );
  }

  const outBuffer = canvasArea.encodeSync("png");

  // Cache up to 25 rendered certificates.
  certificateCache.set(certId, outBuffer);
  if (certificateCache.size > 25) {
    const oldest = certificateCache.keys().next().value;
    if (oldest) certificateCache.delete(oldest);
  }

  console.log("[certificates] Rendered certificate:", certId);
  return outBuffer;
}

// ─── INLINE IMAGE ENDPOINT ───────────────────────────────────────────────────
// Used as <img src="/api/certificates/:certId/image"> in Certificate.tsx.
// Content-Disposition: inline so browsers render it in-page.

router.get("/:certId/image", async (req, res) => {
  try {
    const certId = req.params.certId.toUpperCase();
    const png = await renderCertificate(certId);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cache-Control", "private, max-age=300");
    res.send(png);
  } catch (err: any) {
    const status = err.statusCode ?? 500;
    console.error(`[certificates] image error (${req.params.certId}):`, err.message);
    res.status(status).send(err.message || "Error generating certificate");
  }
});

// ─── ATTACHMENT DOWNLOAD ENDPOINT ────────────────────────────────────────────
// Used by the Download Certificate button in Certificate.tsx.
// Content-Disposition: attachment triggers a browser Save dialog.

router.get("/:certId/download", async (req, res) => {
  try {
    const certId = req.params.certId.toUpperCase();
    const png = await renderCertificate(certId);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `attachment; filename="Certificate-${certId}.png"`);
    res.setHeader("Cache-Control", "private, max-age=300");
    res.send(png);
  } catch (err: any) {
    const status = err.statusCode ?? 500;
    console.error(`[certificates] download error (${req.params.certId}):`, err.message);
    res.status(status).send(err.message || "Error generating certificate");
  }
});

export default router;
