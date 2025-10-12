import express from "express";
import {userDetails } from "../controllers/userController.js";
import userMiddleware from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post("/userDetails", userDetails)

export default router;