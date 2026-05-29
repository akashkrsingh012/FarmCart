import SubCategoryModel from "../models/subCategory.model.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ProductModel from "../models/product.model.js";

// Configure multer for subcategory images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads/subcategories';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'subcategory-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

export const subCategoryUpload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    },
    fileFilter: fileFilter
});

export const AddSubCategoryController = async(request, response) => {
    try {
        // Get data from request body and file
        const { name, category } = request.body;
        let imagePath = null;

        // Check if file was uploaded through multer
        if (request.file) {
            imagePath = request.file.path.replace(/\\/g, '/'); // Normalize path for all OS
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

        // Parse category if it's sent as a JSON string
        let parsedCategory;
        try {
            parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;
        } catch (err) {
            parsedCategory = category;
        }

        if (!name || !parsedCategory || !Array.isArray(parsedCategory) || parsedCategory.length === 0) {
            return response.status(400).json({
                message: "Provide name, image, and at least one category",
                error: true,
                success: false
            });
        }

        const payload = {
            name,
            image: imagePath,
            category: parsedCategory
        };

        const createSubCategory = new SubCategoryModel(payload);
        const save = await createSubCategory.save();

        return response.json({
            message: "Sub Category Created",
            data: save,
            error: false,
            success: true
        });

    } catch (error) {
        console.error("SubCategory creation error:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getSubCategoryController = async(request, response) => {
    try {
        const data = await SubCategoryModel.find().sort({createdAt: -1}).populate('category');
        
        // Transform data to include full image URLs
        const transformedData = data.map(subCategory => {
            const subCategoryObj = subCategory.toObject();
            
            // If image is a path, convert to URL
            if (subCategoryObj.image) {
                if (!subCategoryObj.image.startsWith('http')) {
                    // Normalize path by removing backslashes and ensuring no leading slash
                    const normalizedPath = subCategoryObj.image.replace(/\\/g, '/');
                    const cleanPath = normalizedPath.startsWith('/') 
                        ? normalizedPath.substring(1) 
                        : normalizedPath;
                    
                    subCategoryObj.imageUrl = `${request.protocol}://${request.get('host')}/${cleanPath}`;
                } else {
                    subCategoryObj.imageUrl = subCategoryObj.image;
                }
            } else {
                // Provide a default image URL if no image exists
                subCategoryObj.imageUrl = `${request.protocol}://${request.get('host')}/uploads/default/no-image.png`;
            }
            
            return subCategoryObj;
        });

        return response.json({
            message: "Sub Category data",
            data: transformedData,
            error: false,
            success: true
        });
    } catch (error) {
        console.error("Get subcategory error:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateSubCategoryController = async(request, response) => {
    try {
        const { _id, name } = request.body;
        let categoryData = request.body.category;
        
        if (!_id) {
            return response.status(400).json({
                message: "Subcategory ID is required",
                error: true,
                success: false
            });
        }

        // Find the old subcategory to get previous image
        const checkSub = await SubCategoryModel.findById(_id);
        if (!checkSub) {
            return response.status(404).json({
                message: "Subcategory not found",
                error: true,
                success: false
            });
        }

        // Parse category if it's sent as a JSON string
        try {
            categoryData = typeof categoryData === 'string' ? JSON.parse(categoryData) : categoryData;
        } catch (err) {
            // Use as is if parsing fails
        }

        // Prepare update object
        const updateData = {};
        if (name) updateData.name = name;
        if (categoryData) updateData.category = categoryData;
        
        // Handle image update
        if (request.file) {
            // New image uploaded - normalize path
            updateData.image = request.file.path.replace(/\\/g, '/');
            
            // Delete old image if it exists, isn't a URL, and file exists
            if (checkSub.image && 
                !checkSub.image.startsWith('http') && 
                fs.existsSync(checkSub.image)) {
                try {
                    fs.unlinkSync(checkSub.image);
                } catch (e) {
                    console.warn("Failed to delete old image:", e);
                    // Continue with update even if old image deletion fails
                }
            }
        } else if (request.body.image && request.body.image !== checkSub.image) {
            // New image path provided in request body
            updateData.image = request.body.image;
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id, updateData, { new: true });

        return response.json({
            message: 'Updated Successfully',
            data: updateSubCategory,
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Update error:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false 
        });
    }
};

export const deleteSubCategoryController = async(request, response) => {
    try {
        const { _id } = request.body;
        
        if (!_id) {
            return response.status(400).json({
                message: "Subcategory ID is required",
                error: true,
                success: false
            });
        }

        // Check if subcategory is used in any products
        const checkProduct = await ProductModel.find({
            subCategory: {
                "$in": [_id]
            }
        }).countDocuments();

        if (checkProduct > 0) {
            return response.status(400).json({
                message: "This subcategory is in use by products and cannot be deleted",
                error: true,
                success: false
            });
        }

        // Find subcategory to get image path before deletion
        const subCategory = await SubCategoryModel.findById(_id);
        if (!subCategory) {
            return response.status(404).json({
                message: "Subcategory not found",
                error: true,
                success: false
            });
        }

        // Delete the image file if it exists and isn't a URL
        if (subCategory.image && 
            !subCategory.image.startsWith('http') && 
            fs.existsSync(subCategory.image)) {
            try {
                fs.unlinkSync(subCategory.image);
            } catch (error) {
                console.warn("Failed to delete image file:", error);
                // Continue with deletion even if image deletion fails
            }
        }

        const deleteSub = await SubCategoryModel.findByIdAndDelete(_id);

        return response.json({
            message: "Delete successfully",
            data: deleteSub,
            error: false,
            success: true
        });
    } catch (error) {
        console.error("Delete error:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};