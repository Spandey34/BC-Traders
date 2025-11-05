import React, { useState } from 'react';
import { useUser, SignInButton } from "@clerk/clerk-react";
import toast from 'react-hot-toast';
import { useOrders } from '../../redux/ReduxProvider';
import { FiPackage } from "react-icons/fi";

const Orders = () => {
    const { isSignedIn } = useUser();
    const [orders, setOrders] = useOrders();

    return (
        <div className="">
            <div className="p-6 mb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">My Orders</h1>
                    <p className="text-gray-600 dark:text-gray-400">Track and manage your orders</p>
                </div>

                {isSignedIn && orders ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                    <div>
                                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{order.id}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                        {order.status}
                                    </span>
                                    <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                                        {order.paymentStatus}
                                    </span>
                                    <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full ${order.paymentMethod === 'online' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'}`}>
                                        {order.paymentMethod}
                                    </span>
                                </div>
                                
                                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                    <div className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {item.quantity}x {item.name}
                                                </span>
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    ₹{item.quantity * item.price}
                                                </span>
                                            </div>
                                        ))}
                                        
                                        <div className="pt-2">
                                            <div className="border-t border-gray-200 dark:border-gray-700"></div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">Total</span>
                                            <span className="font-bold text-xl text-gray-800 dark:text-gray-100">
                                                ₹{order.totalAmount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No orders yet</h3>
                        {
                            isSignedIn ? "" : <>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Please log in to view your orders</p>
                                <SignInButton mode="modal">
                                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow duration-200">
                                        Sign In to View Orders
                                    </button>
                                </SignInButton>
                            </>
                        }
                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;