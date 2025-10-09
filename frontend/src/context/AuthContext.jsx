import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Vérifier le token au chargement
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/auth/verify');
                setUser(response.data.user);
            } catch (error) {
                console.error('Token invalide:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                navigate('/admin/dashboard');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Erreur de connexion';
            const passwordExpired = error.response?.data?.passwordExpired || false;
            return { success: false, message, passwordExpired };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/admin');
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            const response = await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
            return { success: false, message };
        }
    };

    const value = {
        user,
        token,
        login,
        logout,
        changePassword,
        isAuthenticated: !!token,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};