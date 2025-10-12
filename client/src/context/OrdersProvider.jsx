import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import { useUser } from '@clerk/clerk-react';

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState(undefined);
    const { user } = useUser();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.post(api + "/order", {}, { withCredentials: true });
                setOrders(res.data.orders || []); // Set to an empty array if backend sends nothing
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                toast.error("Could not fetch orders.");
                setOrders([]); 
            }
        };

        if (user) {
            fetchOrders();
        } else {
            // If there's no user, we know there are no orders.
            // Setting to [] removes the loading skeleton.
            setOrders([]);
        }
    }, [user]);

    return (
        <OrdersContext.Provider value={[orders, setOrders]}>
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrders = () => useContext(OrdersContext);