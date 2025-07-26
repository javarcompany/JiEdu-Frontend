import React, {createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);

    const login = (userData) => {
        setUser(userData.user);
        setRoles(userData.roles);
    };

    const logout = () => {
        setUser(null);
        setRoles([]);
    };

    return (
        <AuthContext.Provider value= {{ user, roles, login, logout }}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);