import React, { createContext, useContext, useMemo } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth, useOrders, useProducts } from "../redux/ReduxProvider";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTab } from "../context/ActiveTabContext";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [authUser, setAuthUser] = useAuth();
  const [orders,setOrders] = useOrders();
  const [products,setProducts] = useProducts();
  const[newOrders,setNewOrders] = useState(0);
  const [activeTab,setActiveTab] = useTab();

  useEffect(() => {
    
    if (authUser) {
        const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const newSocket = io(backendURL,{
                query:{
                userId: authUser._id,
                role: authUser.role
            }
            }, {
          withCredentials: true,
        });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("orderPlaced", (order) => {
        setOrders((prev) => [order, ...prev]);
      });

      newSocket.on("newOrder", (order) => {
        if(authUser.role==="admin")
        {
            toast.success("New order received!");
            setNewOrders((newOrders) => newOrders + 1);
            setOrders((prev) => [order, ...prev]);
        }
      });

      newSocket.on("verified",(data) => {
        if(authUser._id==data.userId)
        {
          toast.success("Your account has been verified!");
        setAuthUser((prev) => ({ ...prev, isVerified: true }));
        }
      });

      newSocket.on("productsUpdated", (updatedProduct) => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
          )
        );
      });
      newSocket.on("newProduct", (newProduct) => {
        if(authUser.role!=="admin")setProducts((prevProducts) => [newProduct, ...prevProducts]);
      });
      newSocket.on("productDeleted", (deletedProductId) => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== deletedProductId)
        );
      });
      newSocket.on("orderDeleted", (deletedOrderId) => {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== deletedOrderId)
        );
      });

      return () => {
        newSocket.disconnect();
      }
    }
    else
    {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    }
  }, [authUser]);

  useEffect(() => {
    if (socket) {
        if(activeTab === 'orders' && newOrders>0)
        {
            setNewOrders(0);
        }
    }
  }, [activeTab]);

  return (
    <SocketContext.Provider value={[socket,onlineUsers,newOrders,setNewOrders]}>{children}</SocketContext.Provider>
  );
};
