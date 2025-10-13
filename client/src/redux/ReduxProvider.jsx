import React, { createContext, useState, useContext, useEffect, act } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useTab } from '../context/ActiveTabContext';

export const AuthContext = createContext();
export const ProductsContext = createContext();
export const OrdersContext = createContext();

export const AppProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState(undefined);
    const[activeTab,setActiveTab] = useTab();
    
    const { user } = useUser();

    useEffect(() => {
        const fetchProductsOnly = async () => {
            try {
                const productsRes = await axios.post(`${api}/product`, {}, { withCredentials: true });
                setProducts(productsRes.data.products || []);
            } catch (productError) {
                console.error("Failed to fetch public products:", productError);
                toast.error("Could not load products.");
                setProducts([]);
            }
        };

        const fetchAllDataForUser = async () => {
            try {
                // FIX: Ensure phoneNumber is always defined, even if it's null.
                const authPayload = {
                    name: user.fullName,
                    email: user.primaryEmailAddress.emailAddress,
                    clerkId: user.id,
                    phoneNumber: user?.unsafeMetadata?.phoneNumber ?? null,
                    role: user?.unsafeMetadata?.role ?? "user"
                };
                const authRes = await axios.post(`${api}/user/userDetails`, authPayload, { withCredentials: true });
                const fetchedUser = authRes.data.user;
                setAuthUser(fetchedUser);

                try {
                    const ordersRes = await axios.post(`${api}/order`, {authPayload}, { withCredentials: true });
                    setOrders(ordersRes.data.orders || []);
                } catch (orderError) {
                    console.error("Failed to fetch orders:", orderError);
                    toast.error("Could not load orders.");
                    setOrders([]);
                }

                // Now that user is authenticated and cookie is set, fetch products and orders
                try {
                    const productsRes = await axios.post(`${api}/product`, {}, { withCredentials: true });
                    setProducts(productsRes.data.products || []);
                } catch (productError) {
                    console.error("Failed to fetch products for user:", productError);
                    toast.error("Could not load products.");
                    setProducts([]);
                }


            } catch (authError) {
                console.error("Authentication failed:", authError);
                toast.error("Session may have expired. Please sign in again.");
                setAuthUser(null);
                setProducts([]);
                setOrders([]);
                // Fallback to public products if auth fails
                fetchProductsOnly();
            }
        };

        if (user) {
            // User is logged in, fetch everything in sequence
            fetchAllDataForUser();
        } else {
            // User is not logged in, fetch only public products
            fetchProductsOnly();
            // Clear any existing user-specific data
            setAuthUser(null);
            setOrders([]); // Set to empty array to stop loading skeletons
        }

    }, [user,useTab]);

    return (
        <AuthContext.Provider value={[authUser, setAuthUser]}>
            <ProductsContext.Provider value={[products, setProducts]}>
                <OrdersContext.Provider value={[orders, setOrders]}>
                    {children}
                </OrdersContext.Provider>
            </ProductsContext.Provider>
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export const useProducts = () => useContext(ProductsContext);
export const useOrders = () => useContext(OrdersContext);

