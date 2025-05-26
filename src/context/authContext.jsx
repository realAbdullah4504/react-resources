import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/protected', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                console.error('Error checking authentication:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);


    const login = async (username, password) => {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setUser(data.user);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <authContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </authContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}