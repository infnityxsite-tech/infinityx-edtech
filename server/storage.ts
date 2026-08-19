import { randomUUID } from "crypto";
import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from "cloudinary";

const REFERENCE_PREFIX = "cloudinary:";
let configured = false;

type CloudinaryReference = {
  publicId: string;
  format: string;
  resourceType: "image" | "raw" | "video";
  deliveryType: "upload" | "private" | "authenticated";
  version: number;
};

function configureCloudinary() {
  if (configured) return;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary server credentials are not configured");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
    signature_algorithm: "sha256",
  });
  configured = true;
}

function uploadBuffer(buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(new Error(`Cloudinary upload failed: ${error.message}`));
      if (!result) return reject(new Error("Cloudinary upload failed without a result"));
      resolve(result);
    });
    stream.end(buffer);
  });
}

function encodeReference(reference: CloudinaryReference): string {
  return `${REFERENCE_PREFIX}${Buffer.from(JSON.stringify(reference)).toString("base64url")}`;
}

function decodeReference(value: string): CloudinaryReference {
  if (!value.startsWith(REFERENCE_PREFIX)) throw new Error("Unsupported stored asset reference");
  const parsed = JSON.parse(Buffer.from(value.slice(REFERENCE_PREFIX.length), "base64url").toString("utf8"));
  if (!parsed.publicId || !parsed.format || !parsed.resourceType || !parsed.deliveryType) {
    throw new Error("Invalid stored asset reference");
  }
  return parsed as CloudinaryReference;
}

export async function uploadPublicImage(buffer: Buffer): Promise<{ key: string; url: string }> {
  const result = await uploadBuffer(buffer, {
    resource_type: "image",
    type: "upload",
    folder: "infinityx/public/admin",
    public_id: randomUUID(),
    overwrite: false,
  });

  const url = cloudinary.url(result.public_id, {
    secure: true,
    resource_type: "image",
    type: "upload",
    version: result.version,
    transformation: [{ fetch_format: "auto", quality: "auto" }],
  });
  return { key: result.public_id, url };
}

export async function uploadPrivateSubmission(buffer: Buffer): Promise<string> {
  const result = await uploadBuffer(buffer, {
    resource_type: "raw",
    type: "authenticated",
    folder: "infinityx/private/submissions",
    public_id: randomUUID(),
    overwrite: false,
  });

  return encodeReference({
    publicId: result.public_id,
    format: result.format || "bin",
    resourceType: "raw",
    deliveryType: "authenticated",
    version: result.version,
  });
}

export function getPrivateDownloadUrl(referenceValue: string, originalFilename: string): string {
  configureCloudinary();
  const reference = decodeReference(referenceValue);
  // attachment: true triggers Content-Disposition: attachment.
  // Cloudinary's type definition only accepts boolean; we append dl= for the
  // suggested filename by building the URL and appending the query param.
  const safeFilename = encodeURIComponent(
    originalFilename.replace(/[\r\n"\\/]/g, "_").slice(0, 180)
  );
  const baseUrl = cloudinary.utils.private_download_url(reference.publicId, reference.format, {
    resource_type: reference.resourceType,
    type: reference.deliveryType,
    expires_at: Math.floor(Date.now() / 1000) + 5 * 60,
    attachment: true,
  });
  return `${baseUrl}&dl=${safeFilename}`;
}

export async function destroyStoredAsset(referenceValue: string): Promise<void> {
  configureCloudinary();
  const reference = decodeReference(referenceValue);
  await cloudinary.uploader.destroy(reference.publicId, {
    resource_type: reference.resourceType,
    type: reference.deliveryType,
    invalidate: true,
  });
}

/** Existing generated-image integration, now backed by secure server credentials. */
export async function storagePut(
  _relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  if (typeof data === "string") throw new Error("String-based storage uploads are not supported");
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
  if (!contentType.startsWith("image/")) throw new Error("Generated storage currently accepts images only");

  const result = await uploadBuffer(buffer, {
    resource_type: "image",
    type: "upload",
    folder: "infinityx/public/generated",
    public_id: randomUUID(),
    overwrite: false,
  });
  return {
    key: result.public_id,
    url: cloudinary.url(result.public_id, {
      secure: true,
      resource_type: "image",
      type: "upload",
      version: result.version,
      transformation: [{ fetch_format: "auto", quality: "auto" }],
    }),
  };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  configureCloudinary();
  if (relKey.startsWith("https://")) return { key: relKey, url: relKey };
  return { key: relKey, url: cloudinary.url(relKey, { secure: true }) };
}

