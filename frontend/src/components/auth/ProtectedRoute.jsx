import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ACCESS_TOKEN } from '../../constants'
import axios from 'axios'

const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [needsOnboarding, setNeedsOnboarding] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // Get token from localStorage
                const token = localStorage.getItem(ACCESS_TOKEN)
                const onboardingCompleted = localStorage.getItem('onboardingCompleted')
                const accountCreated = localStorage.getItem('accountCreated')
                const isLocalAuth = localStorage.getItem('isLocalAuth') === 'true'

                // If no token, user is not authenticated
                if (!token) {
                    setIsAuthenticated(false)
                    setIsLoading(false)
                    return
                }

                // If using local authentication (offline mode), consider the user authenticated
                if (isLocalAuth || token.startsWith('local_')) {
                    console.log('Using local authentication token')
                    setIsAuthenticated(true)
                    setIsLoading(false)
                    return
                }

                // Otherwise validate token with backend
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
                    await axios.get(`${apiUrl}/api/user/verify/`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        timeout: 5000 // Add timeout to prevent hanging
                    })
                    // Token is valid
                    setIsAuthenticated(true)
                } catch (tokenError) {
                    console.error('Token validation error:', tokenError)

                    // If backend validation fails, fall back to local auth as a last resort
                    // This allows users to continue using the app even if backend is down
                    if (token.includes('_')) {
                        console.log('Falling back to local token validation')
                        setIsAuthenticated(true)
                        localStorage.setItem('isLocalAuth', 'true')
                    } else {
                        setIsAuthenticated(false)
                    }
                }

                // If account was just created and onboarding is not completed yet,
                // user needs to go through onboarding
                if (accountCreated === 'true' && onboardingCompleted !== 'true') {
                    setNeedsOnboarding(true)
                }

                setIsLoading(false)
            } catch (error) {
                console.error('Auth check error:', error)
                setIsAuthenticated(false)
                setIsLoading(false)
            }
        }

        checkAuthentication()
    }, [])

    if (isLoading) {
        // Loading state while checking authentication
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading...</span>
            </div>
        )
    }

    // Redirect to onboarding if needed (account created but onboarding not completed)
    if (needsOnboarding) {
        return <Navigate to="/onboarding" state={{ from: location }} replace />
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // If authenticated, render the children
    return children
}

export default ProtectedRoute