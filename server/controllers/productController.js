import Product from "../models/productModel.js"
import { v2 as cloudinary } from 'cloudinary';
import jwt from "jsonwebtoken"

export const getProducts = async(req,res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ products: products });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const addProduct = async (req, res) => {
    try {
        const { name, description, mrp, sellingPrice, inStockCount, featured, offer, quantity } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Product image is required.' });
        }
        
        const newProduct = new Product({
            name,
            description,
            mrp,
            sellingPrice,
            quantity,
            inStockCount,
            featured: featured === 'true', 
            offer,
            imageUrl: req.file.path 
        });

        await newProduct.save();

        return res.status(201).json({ product: newProduct });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: 'Server error while adding product.' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { _id, name, description, mrp, sellingPrice, inStockCount, featured, offer, quantity } = req.body;

        const updateData = {
            name, description, mrp, sellingPrice, inStockCount, offer, quantity,
            featured: featured === 'true',
        };

        if (req.file) {
            updateData.imageUrl = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        return res.status(200).json({ product: updatedProduct });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Server error while updating product.' });
    }
};

export const deleteProduct = async (req, res) => {
    
    try {
        const token = req.cookies.jwt;
        if(!token)
        {
            return res.status(401).json({ message: 'Unauthorized: No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only.' });
        }
        const { _id } = req.body;

        const product = await Product.findById(_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const publicId = product.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`bc-traders-products/${publicId}`);
        
        await Product.findByIdAndDelete(_id);

        return res.status(200).json({ message: 'Product deleted successfully.' });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Server error while deleting product.' });
    }
};