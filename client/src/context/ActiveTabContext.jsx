import React, { createContext, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import { useUser } from '@clerk/clerk-react';

export const TabContext = createContext();

export const TabProvider = ({children}) => {

    const [activeTab, setActiveTab] = useState("home");
  return (
    <TabContext.Provider value={[activeTab, setActiveTab]} >
        {children}
    </TabContext.Provider>
  )
}

export const useTab = () => useContext(TabContext);
