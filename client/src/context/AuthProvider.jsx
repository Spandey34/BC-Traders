import React, { createContext, useState, useContext } from 'react'
import Cookies from 'js-cookie'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const initialUserState = Cookies.get("BC-Traders") || localStorage.getItem("BC-Traders");
    const initialRoleState = Cookies.get("role");

    const [authUser, setAuthUser] = useState(initialUserState ? initialUserState : undefined);
    const[role, setRole] = useState(initialRoleState);
  return (
    <AuthContext.Provider value={[authUser, setAuthUser, role, setRole]} >
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
