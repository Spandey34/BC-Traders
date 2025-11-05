import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { io, userSocketMap } from '../socket/socketIo.js';

export const getOrders = async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Not authorized, token invalid." });
        }   

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        let orders;
        if (user.role === 'admin') {
            orders = await Order.find({}).sort({ createdAt: -1 });
        } else {
            orders = await Order.find({ 'user.userId': user._id }).sort({ createdAt: -1 });
        }

        return res.status(200).json({ orders });
        }   

     catch (error) {
        console.error("Error fetching orders:", error);
        res.status(401).json({ message: "Not authorized, token failed." });
    }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId, updates } = req.body;

    if (!orderId || !updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'Invalid request: Missing orderId or updates object.' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    io.to(userSocketMap[updatedOrder.user.userId]).emit('orderUpdated', updatedOrder);

    return res.status(200).json({ updatedOrder: updatedOrder });

  } catch (error){
    console.error("Error updating order:", error);
    res.status(500).json({ message: 'Server error while updating order.' });
  }
};

export const placeOrder = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        const {name, email, phoneNumber, cartItems, paymentMethod } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Missing required order information.' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const cartItem of cartItems) {
            const product = await Product.findById(cartItem._id);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${cartItem._id} not found.` });
            }

            if (product.inStockCount < cartItem.quantity) {
                 return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
            }

            totalAmount += product.sellingPrice * cartItem.quantity;
            orderItems.push({
                productId: product._id,
                name: product.name,
                quantity: cartItem.quantity,
                price: product.sellingPrice,
            });

            product.inStockCount -= cartItem.quantity;
            await product.save();
        }

        const newOrder = new Order({
            user: {
                userId: user._id,
                name,
                email,
                phoneNumber,
            },
            items: orderItems,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
        });
        ///68ec2861f9396536fa663578
        await newOrder.save();
        io.to(userSocketMap[user._id].socketId).emit('orderPlaced', newOrder);
        const productIds = newOrder.items.map(item => item.productId);
        const updatedProducts = await Product.find({ '_id': { $in: productIds } });
        if (updatedProducts.length > 0) {
            io.emit('productsUpdated', updatedProducts);
        }
        io.emit('newOrder', newOrder);
        
        // Find the user and push the new order's ID into their orders array
        user.orders.push(newOrder._id);
        await user.save();

        return res.status(201).json({ message: 'Order placed successfully', order: newOrder });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: 'Server error while placing order.' });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const {userId} = req.body.userId

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required.' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Optional: Restock items
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { inStockCount: item.quantity }
            });
        }

        // Remove the order reference from the user's order list
        await User.findOneAndUpdate(
            { 'clerkId': order.user.userId },
            { $pull: { orders: order._id } }
        );

        // Delete the order itself
        await Order.findByIdAndDelete(orderId);

        io.to(userSocketMap[userId]).emit('orderDeleted', orderId);

        res.status(200).json({ message: 'Order deleted successfully.' });

    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: 'Server error while deleting order.' });
    }
};