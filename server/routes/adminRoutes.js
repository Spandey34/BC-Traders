import express from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {updateLogo} from "../controllers/adminController.js"
import { upload } from "../utils/cloudinary.js";
const router = express.Router();

router.post("/logo",adminMiddleware,upload.single('logo'), updateLogo);

export default router;