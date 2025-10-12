import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    mrp: {
        type: Number,
        default: null
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: String,
        default: ""
    },
    inStockCount: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    offer: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        required: true
    }
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;