// AppContext.tsx
import React, { createContext, useState, useContext } from 'react';

// Create a context for the appId and appName
const AppContext = createContext(null);

// Create a provider component
const AppProvider = ({ children }) => {
    const [appId, setAppId] = useState('');
    const [appName, setAppName] = useState('');

    return (
        <AppContext.Provider value={{ appId, setAppId, appName, setAppName }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext
const useAppContext = () => {
    return useContext(AppContext);
};

export { AppProvider, useAppContext };