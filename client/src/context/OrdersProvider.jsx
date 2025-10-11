import React, { createContext, useState, useContext } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import { useUser } from '@clerk/clerk-react';

export const OrdersContext = createContext();

export const OrdersProvider = ({children}) => {

    const [orders, setOrders] = useState(undefined);
    const {user} = useUser();
    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const payload = {
              name: user.fullName,
              email: user.primaryEmailAddress.emailAddress,
              clerkId: user.id
            };
            const res = await axios.post(api+"/user/orders",payload, { withCredentials: true});
            setOrders(res.data.user);
          } catch (error) {
            console.log(error);
          }
        };
        if(user) fetchOrders();
    },[user]);
  return (
    <OrdersContext.Provider value={[orders, setOrders]} >
        {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext);
