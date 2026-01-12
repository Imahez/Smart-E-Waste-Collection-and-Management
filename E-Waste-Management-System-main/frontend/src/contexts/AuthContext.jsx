import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const { accessToken, token, user: userData } = response.data;
            const finalToken = token || accessToken;

            if (finalToken) {
                localStorage.setItem('token', finalToken);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return { success: true, user: userData };
            }
            throw new Error('No token received from server');
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Invalid credentials or server error'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/api/auth/register', userData);
            return { success: true, user: response.data };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    const checkAuth = () => {
        return !!localStorage.getItem('token');
    };

    const normalizeRole = (role) => {
        if (!role) return '';
        return role.startsWith('ROLE_') ? role : `ROLE_${role}`;
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register,
        checkAuth,
        isAdmin: normalizeRole(user?.role) === 'ROLE_ADMIN',
        isPickupPerson: normalizeRole(user?.role) === 'ROLE_PICKUP_PERSON',
        isUser: normalizeRole(user?.role) === 'ROLE_USER'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
