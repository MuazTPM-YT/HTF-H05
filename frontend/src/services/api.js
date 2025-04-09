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

        // Handle token refresh for 401 errors
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
        const response = await api.post('/api/user/register/', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error('Registration failed. Please try again.');
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/api/token/', credentials);
        const { access, refresh } = response.data;
        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        } else if (error.response?.status === 401) {
            throw new Error('Invalid email or password');
        } else if (error.response?.status === 500) {
            throw new Error('Server error. Please try again later.');
        } else if (error.request) {
            throw new Error('Network error. Please check your connection.');
        }
        throw new Error('Login failed. Please check your credentials and try again.');
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
    try {
        const response = await api.get('/api/user/profile/');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to local storage if API fails
        return {
            username: localStorage.getItem('username') || 'User',
            fullName: localStorage.getItem('fullName'),
            email: localStorage.getItem('email'),
            role: localStorage.getItem('role') || 'patient',
            phoneNumber: localStorage.getItem('phoneNumber'),
        };
    }
};

// Export the api instance and auth functions
export default {
    api,
    register,
    login,
    logout,
    getUserProfile,
    get: api.get,
    post: api.post,
    put: api.put,
    delete: api.delete
}; 