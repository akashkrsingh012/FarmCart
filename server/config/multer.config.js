import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Supported file types
const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: ['application/pdf'],
  // Add more as needed
};

// Create storage configuration
const createStorage = (folder) => {
  const uploadDir = `./uploads/${folder}`;
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${folder}-${uuidv4()}${ext}`);
    }
  });
};

// File filter factory
const createFileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} are allowed!`), false);
  }
};

// Pre-configured uploaders
export const uploaders = {
  imageUploader: (folder) => multer({
    storage: createStorage(folder),
    fileFilter: createFileFilter(FILE_TYPES.IMAGE),
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB
  }),
  
  documentUploader: (folder) => multer({
    storage: createStorage(folder),
    fileFilter: createFileFilter(FILE_TYPES.DOCUMENT),
    limits: { fileSize: 1024 * 1024 * 10 } // 10MB
  }),
  
  // Add more uploaders as needed
};

// Default export for generic uploads
export default uploaders;