import express from "express";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../controllers/productController.js"
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

router.post("/",getProducts);
router.post("/add",adminMiddleware, upload.single('image'), addProduct);

router.post("/update",adminMiddleware,  upload.single('image'), updateProduct);

router.post("/delete",adminMiddleware,  deleteProduct);

export default router;