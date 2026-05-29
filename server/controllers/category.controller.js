import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import ProductModel from "../models/product.model.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for category images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads/categories';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'category-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

export const categoryUpload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    },
    fileFilter: fileFilter
});

export const AddCategoryController = async(request, response) => {
    try {
        const { name } = request.body;
        let imagePath = null;
        
        // Check if file was uploaded through multer
        if (request.file) {
            imagePath = request.file.path;
        } else if (request.body.image) {
            // If image is provided as a URL or path in request body
            imagePath = request.body.image;
        } else {
            return response.status(400).json({
                message: "Image is required",
                error: true,
                success: false
            });
        }

        if (!name) {
            return response.status(400).json({
                message: "Category name is required",
                error: true,
                success: false
            });
        }

        const addCategory = new CategoryModel({
            name,
            image: imagePath
        });

        const saveCategory = await addCategory.save();

        if (!saveCategory) {
            return response.status(500).json({
                message: "Category not created",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Category added successfully",
            data: saveCategory,
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getCategoryController = async(request, response) => {
    try {
        const data = await CategoryModel.find().sort({ createdAt: -1 });
        
        // Transform data to include full image URLs
        const transformedData = data.map(category => {
            const categoryObj = category.toObject();
            
            // If image is a path, convert to URL
            if (categoryObj.image && !categoryObj.image.startsWith('http')) {
                categoryObj.imageUrl = `${request.protocol}://${request.get('host')}/${categoryObj.image}`;
            } else {
                categoryObj.imageUrl = categoryObj.image;
            }
            
            return categoryObj;
        });

        return response.json({
            data: transformedData,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateCategoryController = async(request, response) => {
    try {
        const { _id, name } = request.body;
        
        if (!_id) {
            return response.status(400).json({
                message: "Category ID is required",
                error: true,
                success: false
            });
        }

        // Find the old category to get previous image
        const oldCategory = await CategoryModel.findById(_id);
        if (!oldCategory) {
            return response.status(404).json({
                message: "Category not found",
                error: true,
                success: false
            });
        }

        // Prepare update object
        const updateData = {};
        if (name) updateData.name = name;
        
        // Handle image update
        if (request.file) {
            // New image uploaded
            updateData.image = request.file.path;
            
            // Delete old image if it exists and isn't a URL
            if (oldCategory.image && !oldCategory.image.startsWith('http') && fs.existsSync(oldCategory.image)) {
                fs.unlinkSync(oldCategory.image);
            }
        } else if (request.body.image && request.body.image !== oldCategory.image) {
            // New image path provided in request body
            updateData.image = request.body.image;
        }

        const update = await CategoryModel.findByIdAndUpdate(_id, updateData, { new: true });

        return response.json({
            message: "Category updated successfully",
            success: true,
            error: false,
            data: update
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const deleteCategoryController = async(request, response) => {
    try {
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Category ID is required",
                error: true,
                success: false
            });
        }

        const checkSubCategory = await SubCategoryModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments();

        const checkProduct = await ProductModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments();

        if (checkSubCategory > 0 || checkProduct > 0) {
            return response.status(400).json({
                message: "Category is already in use and cannot be deleted",
                error: true,
                success: false
            });
        }

        // Find category to get image path before deletion
        const category = await CategoryModel.findById(_id);
        if (!category) {
            return response.status(404).json({
                message: "Category not found",
                error: true,
                success: false
            });
        }

        // Delete the image file if it exists and isn't a URL
        if (category.image && !category.image.startsWith('http') && fs.existsSync(category.image)) {
            fs.unlinkSync(category.image);
        }

        const deleteCategory = await CategoryModel.deleteOne({ _id: _id });

        return response.json({
            message: "Category deleted successfully",
            data: deleteCategory,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
};