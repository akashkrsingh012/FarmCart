import { Router } from 'express';
import auth from '../middleware/auth.js';
import { 
  AddCategoryController, 
  deleteCategoryController, 
  getCategoryController, 
  updateCategoryController
} from '../controllers/category.controller.js';
import { uploaders } from '../config/multer.config.js';

const categoryRouter = Router();

// Initialize uploader for categories
const categoryUpload = uploaders.imageUploader('categories');

// Add category with image upload
categoryRouter.post(
  '/add-category', 
  auth, 
  categoryUpload.single('image'), 
  AddCategoryController
);

// Get all categories (GET method more appropriate for fetching data)
categoryRouter.get(
  '/get', 
  getCategoryController
);

// Update category with optional image upload
categoryRouter.put(
  '/update/:id',  // Using params for ID is more RESTful
  auth, 
  categoryUpload.single('image'), 
  updateCategoryController
);

// Delete category (using DELETE method and params is more RESTful)
categoryRouter.delete(
  '/delete/:id', 
  auth, 
  deleteCategoryController
);

export default categoryRouter;