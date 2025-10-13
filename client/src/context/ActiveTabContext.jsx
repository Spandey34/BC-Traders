import { useUser } from '@clerk/clerk-react';
import React, { createContext, useState, useContext, useEffect, act } from 'react'
import {useAuth} from "../redux/ReduxProvider"

export const TabContext = createContext();

export const TabProvider = ({children}) => {

    const [activeTab, setActiveTab] = useState("orders");
    const [authUser, setAuthUser] = useAuth();

    const {user, isLoaded} = useUser();

    useEffect(() => {
      if(authUser)
      {
        if(authUser.role === "user")
        {
          setActiveTab("home");
        }
      }
      
    },[ user])
  return (
    <TabContext.Provider value={[activeTab, setActiveTab]} >
        {children}
    </TabContext.Provider>
  )
}

export const useTab = () => useContext(TabContext);
