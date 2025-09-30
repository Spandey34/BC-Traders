import express from "express";
import { otpSignup, signup, login, forgotPassword, resetPassword, home } from "../controllers/userController.js";
import userMiddleware from "../middlewares/userMiddleware.js";

const router = express.Router();

router.get("/",userMiddleware,home);
router.post("/signup",otpSignup);
router.post("/signup/verify",signup);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

export default router;