import express from "express";
import {home, userDetails } from "../controllers/userController.js";
import userMiddleware from "../middlewares/userMiddleware.js";

const router = express.Router();

router.get("/",userMiddleware,home);
router.post("/userDetails", userDetails)

export default router;