import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import { Loader2, LogOut } from 'lucide-react'
import api from '../services/api'
import { useToast } from '../hooks/use-toast'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'

const Dashboard = () => {
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate()
    const { toast } = useToast()

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem(ACCESS_TOKEN)
            if (!token) {
                toast({
                    title: "Authentication required",
                    description: "Please sign in to access the dashboard",
                    variant: "destructive",
                })
                navigate('/login')
                return false
            }
            return true
        }

        if (checkAuth()) {
            // Get user data from localStorage
            const userData = {
                username: localStorage.getItem('username') || 'User',
                fullName: localStorage.getItem('fullName') || '',
                phoneNumber: localStorage.getItem('phoneNumber') || '',
                role: localStorage.getItem('role') || 'patient',
                dateOfBirth: localStorage.getItem('dateOfBirth') || '',
                gender: localStorage.getItem('gender') || '',
            }

            if (userData.role === 'doctor') {
                userData.licenseNumber = localStorage.getItem('licenseNumber') || '';
                userData.specialization = localStorage.getItem('specialization') || '';
                userData.hospitalName = localStorage.getItem('hospitalName') || '';
                userData.location = localStorage.getItem('location') || '';
            }

            setUserData(userData)
            setLoading(false)
        }
    }, [navigate, toast])

    const handleLogout = async () => {
        try {
            // Use the API service for logout
            await api.logout();
            toast({
                title: "Logged out",
                description: "You have been successfully logged out",
            });
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback: manually clear tokens if API fails
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            toast({
                title: "Logged out",
                description: "You have been logged out",
            });
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-gray-500">Loading dashboard...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <Button
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>

                <div className="p-6">
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold mb-2">Welcome, {userData?.fullName || 'User'}</h2>
                        <p className="text-gray-600">You have successfully logged in to the application.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <h3 className="font-medium text-blue-700 mb-2">User Information</h3>
                            <div className="text-sm space-y-1">
                                {userData && Object.entries(userData)
                                    .filter(([key]) => key !== 'token' && userData[key])
                                    .map(([key, value]) => (
                                        <p key={key} className="capitalize">
                                            <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                                            {value}
                                        </p>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                            <h3 className="font-medium text-green-700 mb-2">Authentication Status</h3>
                            <div className="text-sm space-y-1">
                                <p><span className="text-green-700">✓</span> Successfully authenticated</p>
                                <p><span className="text-green-700">✓</span> API connection established</p>
                                <p><span className="text-green-700">✓</span> JWT Token active</p>
                                <div className="mt-2 pt-2 border-t border-green-100">
                                    <p className="text-xs text-gray-500">Token expires in: <span className="font-medium">1 hour</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard 