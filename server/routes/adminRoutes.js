import express from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {deleteUser, getAllUsers, updateLogo, verifyUser} from "../controllers/adminController.js"
import { upload } from "../utils/cloudinary.js";
const router = express.Router();

router.post("/logo",adminMiddleware,upload.single('logo'), updateLogo);
router.post("/all-users",adminMiddleware,getAllUsers)
router.post("/verify-user",adminMiddleware,verifyUser);
router.post("/delete-user",adminMiddleware,deleteUser);

export default router;