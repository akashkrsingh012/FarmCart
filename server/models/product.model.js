import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Changed to String
        default: "",  // Default empty string
    },
    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "category",
        },
    ],
    subCategory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "subCategory",
        },
    ],
    unit: {
        type: String,
        default: "",
    },
    stock: {
        type: Number,
        default: null,
    },
    price: {
        type: Number,
        default: null, // Corrected typo (was 'defualt')
    },
    discount: {
        type: Number,
        default: null,
    },
    description: {
        type: String,
        default: "",
    },
    more_details: {
        type: Object,
        default: {},
    },
    publish: {
        type: Boolean,
        default: true,
    },
},
{
    timestamps: true,
});

// Create a text index
productSchema.index(
    {
        name: "text",
        description: "text",
    },
    {
        weights: { name: 10, description: 5 },
    }
);

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;
