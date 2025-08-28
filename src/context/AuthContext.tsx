import React, { createContext, useContext, useEffect, useState } from "react";


interface User {
    user_type: string;
    regno: string;
    first_name: string;
    last_name: string;
    email: string;
    user_full_name: string;
    course: string;
    department: string;
    is_rep: string;
    is_tutor: string;
    picture: string;
    branch: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);

    // Load user from localStorage when app starts
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    // Save user to localStorage whenever it changes
    const setUser = (newUser: User | null) => {
        setUserState(newUser);
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }
    };

    const clearUser = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, setUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook for easy usage
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
