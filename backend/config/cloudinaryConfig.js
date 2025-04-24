import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load from config.env
dotenv.config({ path: path.join(__dirname, '../config.env') });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });



// Create storages for different file types
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\.[^/.]+$/, "");
      return {
        folder: 'StreamLine/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
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

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'StreamLine/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 250, height: 250, crop: 'fill' }]
  }
});

const thumbnailStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'StreamLine/thumbnails',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 320, height: 180, crop: 'fill' }]
  }
});

// Create multer upload instances
export const uploadVideo = multer({ 
    storage: videoStorage,
    limits: { 
      fileSize: 100 * 1024 * 1024, // 100MB limit
      files: 1
    },
    fileFilter: (req, file, cb) => {
        
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only video files are allowed!'), false);
      }
    }
  });
export const uploadImage = multer({ 
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadThumbnail = multer({ 
  storage: thumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default cloudinary;