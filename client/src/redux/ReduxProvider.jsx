import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { api } from "../api/api";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

// 1. CREATE NEW CONTEXT FOR ALL USERS
export const AuthContext = createContext();
export const ProductsContext = createContext();
export const OrdersContext = createContext();
export const UsersContext = createContext(); // New context for the user list

export const AppProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState(undefined);
  const [users, setUsers] = useState([]); // 2. ADD NEW STATE FOR USERS
  const { user } = useUser();

  useEffect(() => {
    const fetchProductsOnly = async () => {
      try {
        const productsRes = await axios.post(
          `${api}/product`,
          {},
          { withCredentials: true }
        );
        setProducts(productsRes.data.products || []);
      } catch (productError) {
        console.error("Failed to fetch public products:", productError);
        toast.error("Could not load products.");
        setProducts([]);
      }
    };

    const fetchAllDataForUser = async () => {
      try {
        console.log(user.imageUrl);
        const authPayload = {
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          clerkId: user.id,
          phoneNumber: user.publicMetadata?.phoneNumber ?? null,
          role: user.publicMetadata?.role ?? "user",
          profilePic: user.imageUrl,
        };
        const authRes = await axios.post(
          `${api}/user/userDetails`,
          authPayload,
          { withCredentials: true }
        );
        const fetchedUser = authRes.data.user;
        setAuthUser(fetchedUser);

        // 3. CONDITIONALLY FETCH ALL USERS IF ADMIN
        if (fetchedUser.role === "admin") {
          try {
            const usersRes = await axios.post(
              `${api}/admin/all-users`,
              {},
              { withCredentials: true }
            );
            setUsers(usersRes.data.users || []);
          } catch (usersError) {
            console.error("Failed to fetch user list:", usersError);
            toast.error("Could not load user list.");
            setUsers([]);
          }
        } // Fetch products and orders in parallel for faster loading

        const productPromise = axios.post(
          `${api}/product`,
          {},
          { withCredentials: true }
        );
        const orderPromise = axios.post(
          `${api}/order`,
          {},
          { withCredentials: true }
        );

        const [productsRes, ordersRes] = await Promise.all([
          productPromise,
          orderPromise,
        ]);

        setProducts(productsRes.data.products || []);
        setOrders(ordersRes.data.orders || []);
      } catch (authError) {
        console.error("Authentication or data fetching failed:", authError);
        toast.error("Your session may have expired. Please sign in.");
        setAuthUser(null);
        setOrders([]);
        setUsers([]); // Fallback to public products if auth fails
        fetchProductsOnly();
      }
    };

    if (user) {
      fetchAllDataForUser();
    } else {
      fetchProductsOnly(); 
      setAuthUser(null);
      setOrders([]);
      setUsers([]);
    }
  }, [user]); 

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      <ProductsContext.Provider value={[products, setProducts]}>
        <OrdersContext.Provider value={[orders, setOrders]}>
          <UsersContext.Provider value={[users, setUsers]}>
            {children}
          </UsersContext.Provider>
        </OrdersContext.Provider>
      </ProductsContext.Provider>
    </AuthContext.Provider>
  );
};

// 5. EXPORT THE NEW HOOK
export const useAuth = () => useContext(AuthContext);
export const useProducts = () => useContext(ProductsContext);
export const useOrders = () => useContext(OrdersContext);
export const useUsers = () => useContext(UsersContext);
