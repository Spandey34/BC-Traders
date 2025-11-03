import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useCart } from "../../context/CartContext";
import { useTab } from "../../context/ActiveTabContext";
import toast from "react-hot-toast";
import { api } from "../../api/api";
import axios from "axios";
import { useAuth } from "../../redux/ReduxProvider";
import PaymentDialog from "../../components/PaymentDialogBox";
import { FiPlus, FiMinus } from "react-icons/fi";
import {FaCartPlus} from "react-icons/fa";

const Cart = () => {
    const { isSignedIn, user } = useUser();
    const { cartItems, updateQuantity, clearCart } = useCart();
    const [, setActiveTab] = useTab();
    const [authUser, setAuthUser] = useAuth();
    
    const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);

    const initiateOrder = () => {
        if (!isSignedIn) {
            toast.error("Please log in to place an order.");
            setActiveTab("profile");
            return;
        }
        if ( !authUser.phoneNumber) {
            toast.error("Please Add Phone Number.");
            setActiveTab("profile");
            return;
        }
    
        if (!authUser.isVerified ) {
            toast.error("Your account is not verified.");
            return;
        }
        
        setPaymentDialogOpen(true);
    };

    const processOrder = async (paymentMethod) => {
        setPaymentDialogOpen(false);
        const toastId = toast.loading("Placing your order...");

        try {
            const payload = {
                name: user.fullName,
                email: user.primaryEmailAddress.emailAddress,
                phoneNumber: user.unsafeMetadata.phoneNumber,
                cartItems: cartItems,
                paymentMethod: paymentMethod,
            };

            await axios.post(api + '/order/placeOrder', payload, { withCredentials: true });
            
            clearCart();
            toast.success("Order placed successfully!", { id: toastId });
            setActiveTab("orders");
        } catch (error) {
            toast.error("Failed to place order. Please try again.", { id: toastId });
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <PaymentDialog
                isOpen={isPaymentDialogOpen}
                onClose={() => setPaymentDialogOpen(false)}
                onSelectPayment={processOrder}
            />

            <div className="p-6 pb-24 lg:pb-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Your Cart
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
                    </p>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                                    />
                                    <div className="flex-1 w-full min-w-0">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1 truncate">
                                            {item.name}
                                        </p>
                                        <div className="flex items-center gap-2 mb-3">
                                            <p className="text-blue-600 dark:text-blue-400 font-bold">
                                                ₹{item.sellingPrice.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-400 line-through">
                                                ₹{item.mrp.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item._id, -1)}
                                                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                                >
                                                    <FiMinus />
                                                </button>
                                                <span className="font-bold w-8 text-center text-gray-800 dark:text-gray-200">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, 1)}
                                                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                                >
                                                    <FiPlus />
                                                </button>
                                            </div>
                                            <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
                                                ₹{(item.sellingPrice * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                                    Order Summary
                                </h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                                        <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-gray-100">
                                            <span>Total</span>
                                            <span>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={initiateOrder}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 mb-4"
                                >
                                    {isSignedIn ? "Place Order" : "Sign In to Order"}
                                </button>
                                {cartItems.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="w-full text-gray-500 dark:text-gray-400 py-2 rounded-xl font-medium hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                                    >
                                        Clear Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCartPlus className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            Your cart is empty
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            Discover our amazing products and add them to your cart to see them here.
                        </p>
                        <button
                            onClick={() => setActiveTab("home")}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow duration-200"
                        >
                            Shop Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;