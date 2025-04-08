import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_URL}/api/token/refresh/`, {
                    refresh: refreshToken
                });

                const { access } = response.data;
                localStorage.setItem(ACCESS_TOKEN, access);
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API functions
export const register = async (userData) => {
    try {
        // Try to connect to the backend first
        try {
            const response = await api.post('/api/user/register/', userData);
            return response.data;
        } catch (apiError) {
            // If backend is not available, use local authentication
<<<<<<< HEAD
            console.log('Backend not available, using local authentication');
=======
            console.log('Backend registration failed, using local storage');
>>>>>>> muaz

            // Store user data in localStorage
            localStorage.setItem('username', userData.email);
            localStorage.setItem('fullName', userData.first_name + ' ' + userData.last_name);
            localStorage.setItem('email', userData.email);
<<<<<<< HEAD
=======
            localStorage.setItem('password', userData.password); // Store password for local auth
>>>>>>> muaz
            localStorage.setItem('phone_number', userData.phone_number);
            localStorage.setItem('role', userData.role);
            localStorage.setItem('accountCreated', 'true');

            // Store dummy tokens
            localStorage.setItem(ACCESS_TOKEN, 'dummy-access-token');
            localStorage.setItem(REFRESH_TOKEN, 'dummy-refresh-token');

<<<<<<< HEAD
=======
            console.log('Local registration successful:', {
                email: userData.email,
                role: userData.role
            });

>>>>>>> muaz
            return { success: true };
        }
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error('Registration failed. Please try again.');
    }
};

export const login = async (credentials) => {
    try {
        // Try to connect to the backend first
        try {
            const response = await api.post('/api/token/', credentials);
            const { access, refresh } = response.data;
            localStorage.setItem(ACCESS_TOKEN, access);
            localStorage.setItem(REFRESH_TOKEN, refresh);
            return response.data;
        } catch (apiError) {
            // If backend is not available or returns 401, use local authentication
            console.log('Backend authentication failed, trying local authentication');

            // Check if user exists in localStorage
            const storedEmail = localStorage.getItem('email');
            const storedPassword = localStorage.getItem('password');

            console.log('Stored credentials:', { storedEmail, storedPassword });
            console.log('Login attempt with:', credentials);

            if (storedEmail && storedPassword &&
                storedEmail === credentials.username &&
                storedPassword === credentials.password) {
                console.log('Local authentication successful');

                // Store dummy tokens
                localStorage.setItem(ACCESS_TOKEN, 'dummy-access-token');
                localStorage.setItem(REFRESH_TOKEN, 'dummy-refresh-token');

                // Return success response
                return {
                    access: 'dummy-access-token',
                    refresh: 'dummy-refresh-token',
                    user: {
                        email: storedEmail,
                        role: localStorage.getItem('role'),
                        fullName: localStorage.getItem('fullName')
                    }
                };
            } else {
                console.log('Local authentication failed');
                // If no stored credentials or they don't match
                if (!storedEmail || !storedPassword) {
                    throw new Error('No account found. Please register first.');
                } else {
                    throw new Error('Invalid credentials');
                }
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Login failed. Please check your credentials and try again.');
    }
};

export const logout = async () => {
    try {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        return { success: true };
    } catch (error) {
        throw new Error('Logout failed');
    }
};

export const getUserProfile = async () => {
    // This is just a placeholder since there's no user profile endpoint in the backend
    return { username: localStorage.getItem('username') || 'User' };
};

export default {
    register,
    login,
    logout,
    getUserProfile
}; 