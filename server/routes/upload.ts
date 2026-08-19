import express, { type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { requireAdmin } from "../_core/requestAuth";
import { uploadPublicImage } from "../storage";

const router = express.Router();
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
]);

function hasValidImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "image/jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === "image/gif") return ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"));
  if (mimeType === "image/webp") return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, ALLOWED_IMAGE_TYPES.get(extension) === file.mimetype);
  },
});

router.post(
  "/",
  requireAdmin,
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No valid image was uploaded" });
        return;
      }
      if (!hasValidImageSignature(req.file.buffer, req.file.mimetype)) {
        res.status(400).json({ error: "The file content does not match its image type" });
        return;
      }

      const uploaded = await uploadPublicImage(req.file.buffer);
      res.status(200).json({
        url: uploaded.url,
        filename: uploaded.key.split("/").at(-1),
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      console.error("Admin image upload failed:", message);
      const status = message.includes("credentials are not configured") ? 503 : 500;
      res.status(status).json({ error: status === 503 ? "Cloud storage is not configured" : "Upload failed" });
    }
  }
);

router.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large (max 20MB)" });
  }
  const message = error instanceof Error ? error.message : "Upload error";
  return res.status(400).json({ error: message });
});

export default router;

