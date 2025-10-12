import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useProducts } from './ProductsProvider';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [products] = useProducts();

    useEffect(() => {
        try {
            const localCart = localStorage.getItem('Bc-Trders-Cart');
            if (localCart) {
                setCartItems(JSON.parse(localCart));
            }
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            localStorage.removeItem('Bc-Trders-Cart');
        }
    }, []);

    useEffect(() => {
        if (products.length > 0 && cartItems.length > 0) {
            let cartModified = false;
            
            const validatedCart = cartItems.reduce((acc, cartItem) => {
                const productInStock = products.find(p => p._id === cartItem._id);

                if (!productInStock || productInStock.inStockCount === 0) {
                    toast.error(`${cartItem.name} is now out of stock and has been removed.`);
                    cartModified = true;
                    return acc;
                }

                if (cartItem.quantity > productInStock.inStockCount) {
                    toast.warn(`Stock for ${cartItem.name} has changed. Your cart has been updated.`);
                    acc.push({ ...cartItem, quantity: productInStock.inStockCount });
                    cartModified = true;
                    return acc;
                }

                acc.push(cartItem);
                return acc;
            }, []);

            if (cartModified) {
                setCartItems(validatedCart);
            }
        }
    }, [products]); 

    useEffect(() => {
        localStorage.setItem('Bc-Trders-Cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        const productInStock = products.find(p => p._id === product._id);
        if (!productInStock || productInStock.inStockCount <= 0) {
            toast.error("This product is out of stock.");
            return;
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);

            if (existingItem) {
                if (existingItem.quantity >= productInStock.inStockCount) {
                    toast.error(`No more stock available for ${product.name}.`);
                    return prevItems;
                }
                toast.success(`Added another ${product.name} to cart!`);
                return prevItems.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            toast.success(`${product.name} added to cart!`);
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, amount) => {
        const productInStock = products.find(p => p._id === productId);
        if (!productInStock) return;

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === productId);
            if (!existingItem) return prevItems;

            const newQuantity = existingItem.quantity + amount;

            if (amount > 0 && newQuantity > productInStock.inStockCount) {
                toast.error(`Only ${productInStock.inStockCount} units of ${productInStock.name} are available.`);
                return prevItems;
            }

            if (newQuantity <= 0) {
                return prevItems.filter(item => item._id !== productId);
            }

            return prevItems.map(item =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            );
        });
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
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);