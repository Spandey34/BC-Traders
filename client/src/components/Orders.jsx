import React from 'react';
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useOrders } from '../context/OrdersProvider'; // Assuming this context exists

// Icon Component
const PackageIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="16.5" x2="7.5" y1="9.4" y2="9.4" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" x2="12" y1="22.08" y2="12" /></svg>);

const Orders = () => {
    const { isSignedIn } = useUser();
    // Using context instead of mock data
    const [orders] = useOrders(); 

    return (
        <div className="">
            <div className="p-6">
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
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Placed on: {new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                        {order.status}
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
                                        <p className="font-bold text-xl text-gray-800 dark:text-gray-100">₹{order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PackageIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
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