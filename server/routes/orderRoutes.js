import express from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { deleteOrder, getOrders, placeOrder, updateOrder } from "../controllers/orderController.js";
import userMiddleware from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post("/updateOrder",adminMiddleware, updateOrder);
router.post("/placeOrder",userMiddleware,placeOrder);
router.post("/",getOrders);
router.post("/delete",adminMiddleware,deleteOrder);

export default router;
