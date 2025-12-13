// ============================================
// Cloudinary Storage Helper
// Replaces the old local/Forge storage
// ============================================

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// 1. Configure Cloudinary with the keys from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper to convert a Buffer into a Readable Stream
 * (Cloudinary needs a stream to upload files from memory)
 */
function bufferToStream(buffer: Buffer | Uint8Array) {
  const readable = new Readable();
  readable._read = () => {}; // No-op
  readable.push(buffer);
  readable.push(null);
  return readable;
}

/**
 * Uploads a file to Cloudinary
 * @param relKey - The filename or path (e.g. "my-image.png")
 * @param data - The file data (Buffer, Uint8Array, or Base64 string)
 * @param contentType - Mime type (optional)
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  
  return new Promise((resolve, reject) => {
    // Generate a unique ID based on the filename (removing extension for Cloudinary public_id)
    const publicId = relKey.replace(/\.[^/.]+$/, ""); 

    // Prepare the upload options
    const uploadOptions = {
      public_id: publicId,
      folder: "infinityx_uploads", // All images will go into this folder in Cloudinary
      resource_type: "auto" as const, // Auto-detect if it's an image or video
    };

    // If data is a simple string (URL or path), we can't upload it easily here without fetching it.
    // But usually, this function receives a Buffer from a file upload.
    
    if (Buffer.isBuffer(data) || data instanceof Uint8Array) {
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(new Error(`Cloudinary upload failed: ${error.message}`));
          if (!result) return reject(new Error("Cloudinary upload failed: No result"));
          
          // Success! Return the key (public_id) and the secure HTTPS URL
          resolve({
            key: result.public_id,
            url: result.secure_url,
          });
        }
      );
      
      // Pipe the data into the upload stream
      bufferToStream(data instanceof Uint8Array ? Buffer.from(data) : data).pipe(stream);
      
    } else if (typeof data === "string") {
      // If it's a base64 string or file path
      cloudinary.uploader.upload(data, uploadOptions, (error, result) => {
        if (error) return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        if (!result) return reject(new Error("Cloudinary upload failed: No result"));
        
        resolve({
          key: result.public_id,
          url: result.secure_url,
        });
      });
    } else {
      reject(new Error("Invalid data type provided for upload"));
    }
  });
}

/**
 * Gets the URL for a file
 * (For Cloudinary, the URL is public, so we just return it)
 */
export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  // Since we are not storing the mapping of Keys -> URLs in this file,
  // we assume the "relKey" passed here is actually the full Cloudinary URL
  // or the Public ID. 
  
  // If it's already a URL, just return it.
  if (relKey.startsWith("http")) {
    return { key: relKey, url: relKey };
  }

  // Otherwise, construct the Cloudinary URL manually
  const url = cloudinary.url(relKey, {
    secure: true,
  });

  return { key: relKey, url };
}