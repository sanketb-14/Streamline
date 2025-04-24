import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load config
dotenv.config({ path: path.join(__dirname, '../config.env') });

// Configure Cloudinary with longer timeout
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000 // 60 seconds timeout (up from default 30s)
});

// Video storage with chunked upload support
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\.[^/.]+$/, "");
    return {
      folder: 'StreamLine/videos',
      resource_type: 'video',
      allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
      chunk_size: 60000000, // 60MB chunks (critical for large files)
      transformation: [{ quality: 'auto' }],
      overwrite: false,
      invalidate: true,
      public_id: `video-${timestamp}-${originalName}`,
      eager: [
        { 
          format: "jpg",
          transformation: [
            { width: 320, height: 180, crop: "fill" },
            { quality: "auto" },
            { start_offset: "10%" }
          ]
        }
      ],
      eager_async: true
    };
  }
});

// Create multer instance with proper limits
export const uploadVideo = multer({ 
  storage: videoStorage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 1,
    fieldSize: 100 * 1024 * 1024 // Important for large files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Other storage configurations remain the same...
export const uploadImage = multer({ 
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadThumbnail = multer({ 
  storage: thumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default cloudinary;