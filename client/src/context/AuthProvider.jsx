import React, { createContext, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react';
import axios from 'axios';
import { api } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const initialUserState = Cookies.get("BC-Traders") || localStorage.getItem("BC-Traders");

    const [authUser, setAuthUser] = useState(initialUserState ? initialUserState : undefined);
    const[role, setRole] = useState("");
    useEffect(() => {
      if(authUser)
      {
        const fetchRole = async () => {
          try {
            const payload = { token: authUser };
            const res = await axios.post(api+"/user/getrole",payload, { withCredentials: true });
            setRole(res.data.role);
          } catch (error) {
            console.log(error);
          }
        };
        fetchRole();
      }
    }, [authUser, role]);
  return (
    <AuthContext.Provider value={[authUser, setAuthUser, role, setRole]} >
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
