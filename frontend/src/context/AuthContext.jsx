import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../shared/api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateTheme = (color) => {
        if (color) {
            document.documentElement.style.setProperty('--primary', color);
            // Also generate a muted version for backgrounds if needed
            document.documentElement.style.setProperty('--primary-muted', `${color}15`);
            
            // Convert Hex to RGB for rgba() usage in CSS/Tailwind
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
        }
    };

    useEffect(() => {
        const fetchAuthData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            
            try {
                const response = await api.get('/users/me/');
                const { user, tenant } = response.data;
                
                setUser(user);
                setTenant(tenant);
                
                // Keep tenantCode persistent even on refresh
                if (tenant && tenant.subdomain) {
                    localStorage.setItem('tenantCode', tenant.subdomain);
                }
                
                // Set initial theme from tenant branding
                if (tenant && tenant.brand_color) {
                    updateTheme(tenant.brand_color);
                }
            } catch (err) {
                console.error("Auth initialization failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthData();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/users/login/', credentials);
            const { token, user, tenant } = response.data;
            
            if (token) {
                localStorage.setItem('token', token);
            }
            if (tenant && tenant.subdomain) {
                localStorage.setItem('tenantCode', tenant.subdomain);
            }
            
            setUser(user);
            setTenant(tenant);
            if (tenant && tenant.brand_color) updateTheme(tenant.brand_color);
            return { success: true };
        } catch (err) {
            console.error("Login failed:", err);
            return { 
                success: false, 
                error: err.response?.data?.error || "Invalid username or password" 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tenantCode');
        setUser(null);
        setTenant(null);
    };

    const setTenantData = (data) => {
        setTenant(data);
        if (data.brand_color) updateTheme(data.brand_color);
    };

    const checkPermission = (moduleId, action = 'view') => {
        if (!user) return false;
        
        // 1. Temple Admin or "all" permission always allowed
        if (user.role === 'temple_admin' || user.module_permissions?.all) return true;
        
        // 2. Check Plan allowed apps
        const allowedApps = user.allowed_apps || [];
        if (!allowedApps.includes(moduleId)) return false;

        // 3. Check User specific permission (view/edit/delete)
        const userPerms = user.module_permissions?.[moduleId] || [];
        return userPerms.includes(action);
    };

    return (
        <AuthContext.Provider value={{ user, tenant, loading, login, logout, setTenantData, updateTheme, checkPermission, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
