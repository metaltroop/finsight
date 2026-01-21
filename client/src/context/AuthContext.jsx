import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in (e.g., check cookie/session via API)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/auth/me', {
                    headers: { 'Content-Type': 'application/json' },
                    // Include credentials to send cookies
                });
                // Note: fetch doesn't send cookies by default cross-origin unless credentials: 'include'
                // But here we are likely proxying or need to enable it.
                // Let's assume proxy or CORS with credentials.
            } catch (err) {
                console.error('Auth check failed', err);
            } finally {
                setLoading(false);
            }
        };
        // For now, fast forward: we need a real check.
        // Let's implement a simple fetch with credentials.
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            // Ensure server CORS allows credentials
            const response = await fetch('http://localhost:3000/api/auth/me', {
                method: 'GET',
                // important for reading the httpOnly cookie
                credentials: 'include'
            });
            const data = await response.json();
            if (data.authenticated) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = () => {
        window.location.href = 'http://localhost:3000/api/auth/google';
    };

    const loginLocal = async (email, password) => {
        const response = await fetch('http://localhost:3000/api/auth/local/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (data.user) setUser(data.user);
        return data;
    };

    const updateProfile = async (data) => {
        const response = await fetch('http://localhost:3000/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.error);
        if (resData.user) setUser(resData.user);
        console.log("Profile updated, new User state:");
        return resData;
    };

    const register = async (name, email, password) => {
        const response = await fetch('http://localhost:3000/api/auth/local/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    };

    const verifyOTP = async (email, otp) => {
        const response = await fetch('http://localhost:3000/api/auth/local/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (data.user) setUser(data.user);
        return data;
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:3000/api/auth/logout', { method: 'GET', credentials: 'include' });
            setUser(null);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, loginLocal, register, verifyOTP, updateProfile, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
