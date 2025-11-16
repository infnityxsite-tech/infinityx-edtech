import type { VercelRequest, VercelResponse } from '@vercel/node';
import { IncomingForm, File as FormidableFile } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable body parsing, we'll handle it with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Parse the multipart form data
    const form = new IncomingForm({
      maxFileSize: 20 * 1024 * 1024, // 20MB
      uploadDir: '/tmp',
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Get the uploaded file
    const fileArray = files.file;
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];

    if (!allowedTypes.includes(file.mimetype || '')) {
      // Clean up the temp file
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid file type. Only image files are allowed.' 
      });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(file.filepath);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalFilename || '')}`;
    
    // In Vercel, we need to use a different storage solution
    // For now, we'll return the file as base64 and let the client handle it
    // In production, you should upload to S3, Cloudinary, or similar service
    
    const base64 = fileBuffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64}`;

    // Clean up the temp file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      url: dataUrl, // In production, replace with actual storage URL
      filename: fileName,
      size: file.size,
      mimetype: file.mimetype,
      message: 'Note: File stored as base64. For production, configure cloud storage (S3, Cloudinary, etc.)'
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Upload failed'
    });
  }
}
