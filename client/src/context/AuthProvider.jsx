import React, { createContext, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import { useUser } from '@clerk/clerk-react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [authUser, setAuthUser] = useState(undefined);
    const {user} = useUser();
    useEffect(() => {
        const fetchRole = async () => {
          try {
            const payload = {
              name: user.fullName,
              email: user.primaryEmailAddress.emailAddress,
              clerkId: user.id
            };
            const res = await axios.post(api+"/user/userDetails",payload, { withCredentials: true});
            setAuthUser(res.data.user);
          } catch (error) {
            console.log(error);
          }
        };
        if(user) fetchRole();
    },[user]);
  return (
    <AuthContext.Provider value={[authUser, setAuthUser]} >
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
