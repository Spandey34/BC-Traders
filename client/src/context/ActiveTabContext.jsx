import { useUser } from '@clerk/clerk-react';
import React, { createContext, useState, useContext, useEffect, act } from 'react'

export const TabContext = createContext();

export const TabProvider = ({children}) => {

    const [activeTab, setActiveTab] = useState("home");

    const {user, isLoaded} = useUser();

    useEffect(() => {
      if(isLoaded&&user)
      {
        if(user?.unsafeMetadata?.role==="admin")
        {
            setActiveTab("orders");
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
