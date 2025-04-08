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
        console.log('Registering user with data:', userData);
        const response = await api.post('/api/user/register/', userData);

        // Store additional user data in localStorage
        if (userData.email) localStorage.setItem('username', userData.email);
        if (userData.role) localStorage.setItem('role', userData.role);

        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        // Handle different error formats
        let errorMessage = 'Registration failed';

        if (error.response?.data) {
            const data = error.response.data;
            if (typeof data === 'string') {
                errorMessage = data;
            } else if (data.detail) {
                errorMessage = data.detail;
            } else {
                // Check for field-specific errors
                const fields = ['username', 'password', 'email', 'date_of_birth', 'gender'];
                for (const field of fields) {
                    if (data[field]) {
                        errorMessage = `${field}: ${Array.isArray(data[field]) ? data[field][0] : data[field]}`;
                        break;
                    }
                }
            }
        }

        throw new Error(errorMessage);
    }
};

export const login = async (credentials) => {
    try {
        console.log('Attempting login with:', credentials);

        // Ensure we're sending exactly what the endpoint expects
        if (!credentials.username || !credentials.password) {
            console.error('Missing required login credentials');
            throw new Error('Username and password are required');
        }

        // Make the API call
        console.log('Sending request to:', `${API_URL}/api/token/`);
        const response = await api.post('/api/token/', credentials);
        console.log('Login response:', response.status, response.statusText);

        const { access, refresh } = response.data;

        // Ensure tokens are stored correctly
        if (access && refresh) {
            localStorage.setItem(ACCESS_TOKEN, access);
            localStorage.setItem(REFRESH_TOKEN, refresh);
            console.log('Login successful, tokens stored');
            return response.data;
        } else {
            console.error('Invalid token response:', response.data);
            throw new Error('Invalid token response from server');
        }
    } catch (error) {
        console.error('Login error details:', error);

        if (error.response) {
            console.error('Server error status:', error.response.status);
            console.error('Server response:', error.response.data);

            // Handle various error formats from Django
            if (error.response.data) {
                const data = error.response.data;

                if (data.detail) {
                    throw new Error(data.detail);
                } else if (data.non_field_errors) {
                    throw new Error(Array.isArray(data.non_field_errors)
                        ? data.non_field_errors[0]
                        : data.non_field_errors);
                } else if (data.username) {
                    throw new Error(Array.isArray(data.username) ? data.username[0] : data.username);
                } else if (data.password) {
                    throw new Error(Array.isArray(data.password) ? data.password[0] : data.password);
                }
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from server');
            throw new Error('No response from server. Please check your network connection.');
        }

        // Default error message
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