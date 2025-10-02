import React, { createContext, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react';
import axios from 'axios';
import { api } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [authUser, setAuthUser] = useState(undefined);
    useEffect(() => {
        const fetchRole = async () => {
          try {
            const payload = {};
            const res = await axios.post(api+"/user/userDetails",payload, { withCredentials: true});
            setAuthUser(res.data.user);
          } catch (error) {
            console.log(error);
          }
        };
        fetchRole();
    },[]);
  return (
    <AuthContext.Provider value={[authUser, setAuthUser]} >
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
