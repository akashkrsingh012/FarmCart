import { Router } from 'express';
import { uploaders } from '../config/multer.config.js';
import auth from '../middleware/auth.js';

const uploadRouter = Router();

// Generic file upload endpoint
uploadRouter.post('/upload', auth, uploaders.imageUploader('general').single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
        error: true,
        success: false
      });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

    return res.json({
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        path: req.file.path,
        url: fileUrl,
        mimetype: req.file.mimetype,
        size: req.file.size
      },
      success: true,
      error: false
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
});

// Get file route remains the same
uploadRouter.get('/:filename', (req, res) => {
  // ... existing code ...
});

export default uploadRouter;