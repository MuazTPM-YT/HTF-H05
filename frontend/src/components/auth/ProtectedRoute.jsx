import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ACCESS_TOKEN } from '../../constants'

const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [needsOnboarding, setNeedsOnboarding] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // Simulate checking token validity
                const token = localStorage.getItem(ACCESS_TOKEN)
                const onboardingCompleted = localStorage.getItem('onboardingCompleted')
                const accountCreated = localStorage.getItem('accountCreated')

                // Check authentication
                const authenticated = !!token
                setIsAuthenticated(authenticated)

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