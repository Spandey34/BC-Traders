import React, { createContext, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    useEffect(() => {
        try {
            const localCart = localStorage.getItem('wholesaleCart');
            if (localCart) {
                setCartItems(JSON.parse(localCart));
            }
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            localStorage.removeItem('wholesaleCart');
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('wholesaleCart', JSON.stringify(cartItems));
    }, [cartItems]);
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };
    const updateQuantity = (productId, amount) => {
        setCartItems(prevItems =>
            prevItems
                .map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity + amount } : item
                )
                .filter(item => item.quantity > 0)
        );
    };
    const clearCart = () => {
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        updateQuantity,
        clearCart
    };
  return (
    <CartContext.Provider value={value} >
        {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext);
