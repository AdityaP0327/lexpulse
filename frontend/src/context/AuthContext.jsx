import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async (token) => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const res = await axios.get(`${API_URL}/auth/me`);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (err) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, formData);
            localStorage.setItem('token', res.data.token);
            await loadUser(res.data.token);
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || (typeof err.response?.data === 'string' ? err.response.data : err.message || 'Registration failed') };
        }
    };

    const login = async (formData) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, formData);
            localStorage.setItem('token', res.data.token);
            await loadUser(res.data.token);
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || (typeof err.response?.data === 'string' ? err.response.data : err.message || 'Login failed') };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
