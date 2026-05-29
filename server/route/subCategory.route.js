import { Router } from "express";
import auth from "../middleware/auth.js";
import { 
  AddSubCategoryController, 
  deleteSubCategoryController, 
  getSubCategoryController, 
  updateSubCategoryController,
  subCategoryUpload
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

// Add subcategory with image upload
subCategoryRouter.post(
  '/create', 
  auth, 
  subCategoryUpload.single('image'), 
  AddSubCategoryController
);

// Get all subcategories
subCategoryRouter.get(
  '/get', 
  getSubCategoryController
);

// Update subcategory with optional image upload
subCategoryRouter.put(
  '/update/:id', 
  auth, 
  subCategoryUpload.single('image'), 
  (req, res, next) => {
    // Add the ID from params to the body for the controller
    req.body._id = req.params.id;
    next();
  },
  updateSubCategoryController
);

// Delete subcategory
subCategoryRouter.delete(
  '/delete/:id', 
  auth, 
  (req, res, next) => {
    // Add the ID from params to the body for the controller
    req.body._id = req.params.id;
    next();
  },
  deleteSubCategoryController
);

export default subCategoryRouter;