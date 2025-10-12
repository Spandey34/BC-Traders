import React, { createContext, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react';
import axios from 'axios';
import { api } from '../api/api';

export const ProductsContext = createContext();

export const ProductsProvider = ({children}) => {

    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const res = await axios.post(api+"/product",{}, { withCredentials: true});
            setProducts(res.data.products);
          } catch (error) {
            console.log(error);
          }
        };
        fetchProducts();
    },[]);
  return (
    <ProductsContext.Provider value={[products, setProducts]} >
        {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext);
