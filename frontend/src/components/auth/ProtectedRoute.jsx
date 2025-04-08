import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'
import { jwtDecode } from 'jwt-decode'

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const checkTokenValidity = (token) => {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // Check if token is expired
                if (decoded.exp && decoded.exp < currentTime) {
                    console.log('Token expired');
                    return false;
                }

                return true;
            } catch (error) {
                console.error('Token validation error:', error);
                return false;
            }
        };

        const checkAuth = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN)

                if (!token) {
                    setIsAuthenticated(false)
                    setLoading(false)
                    return
                }

                // Validate the token
                const isValid = checkTokenValidity(token)

                if (isValid) {
                    setIsAuthenticated(true)
                } else {
                    // Try to use refresh token
                    const refreshToken = localStorage.getItem(REFRESH_TOKEN)
                    if (refreshToken && checkTokenValidity(refreshToken)) {
                        // In a real app, would call refresh token endpoint here
                        setIsAuthenticated(true)
                    } else {
                        setIsAuthenticated(false)
                    }
                }

                setLoading(false)
            } catch (error) {
                console.error('Auth check error:', error)
                setIsAuthenticated(false)
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-gray-500">Verifying authentication...</p>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute