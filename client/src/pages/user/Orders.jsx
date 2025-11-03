import React, { useState } from 'react';
import { useUser, SignInButton } from "@clerk/clerk-react";
import toast from 'react-hot-toast';
import { useOrders } from '../../redux/ReduxProvider';
import { FiPackage } from "react-icons/fi";

const Orders = () => {
    const { isSignedIn } = useUser();
    // Using context instead of mock data
    const [orders,setOrders] = useOrders();

    return (
        <div className="">
            <div className="p-6 mb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">My Orders</h1>
                    <p className="text-gray-600 dark:text-gray-400">Track and manage your orders</p>
                </div>

                {isSignedIn && orders? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                    <div>
                                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{order.id}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                        {order.status}
                                    </span>
                                    <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                
                                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            {order.items.map((item, index) => (
                                                <p key={index} className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {item.quantity}x {item.name}
                                                </p>
                                            ))}
                                        </div>
                                        <p className="font-bold text-xl text-gray-800 dark:text-gray-100">₹{order.totalAmount}</p>
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