"use client"
import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [startTime, setStartTime] = useState(new Date());

  return (
    <GlobalContext.Provider value={{ startTime, setStartTime }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const UseGlobal = () => useContext(GlobalContext)
