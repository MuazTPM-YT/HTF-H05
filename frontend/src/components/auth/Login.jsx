"use client"

import React, { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { Card, CardContent, CardFooter } from "../ui/card"
import { useToast } from "../../hooks/use-toast"
import { Eye, EyeOff, Loader2, AlertCircle, User, UserPlus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import AuthLayout from "../layouts/auth-layout"
import { useNavigate, Link } from "react-router-dom"

function Login() {
    const [role, setRole] = useState('patient')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [gender, setGender] = useState("")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [specialization, setSpecialization] = useState("")
    const [hospitalName, setHospitalName] = useState("")
    const [location, setLocation] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState({})
    const { toast } = useToast()
    const navigate = useNavigate()

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)
    }

    const validateForm = () => {
        const newErrors = {}

        if (!fullName) newErrors.fullName = "Full name is required"
        if (!email) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format"

        if (!password) newErrors.password = "Password is required"
        else if (password.length < 8) newErrors.password = "Password must be at least 8 characters"

        if (!phoneNumber) newErrors.phoneNumber = "Phone number is required"

        if (role === 'patient') {
            if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
            if (!gender) newErrors.gender = "Please select your gender"
        }

        if (role === 'doctor') {
            if (!licenseNumber) newErrors.licenseNumber = "License number is required"
            if (!specialization) newErrors.specialization = "Specialization is required"
            if (!location) newErrors.location = "Location is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))

            console.log('Registration successful', {
                role,
                fullName,
                email,
                password,
                phoneNumber,
                ...(role === 'patient' && {
                    dateOfBirth,
                    gender
                }),
                ...(role === 'doctor' && {
                    licenseNumber,
                    specialization,
                    hospitalName,
                    location
                })
            })

            toast({
                title: "Registration successful",
                description: "Your account has been created",
            })

            // Navigate to dashboard or home page after successful login
            navigate('/dashboard')

        } catch (error) {
            toast({
                title: "Registration failed",
                description: "Please try again later",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const specializations = [
        "Cardiology",
        "Dermatology",
        "Endocrinology",
        "Gastroenterology",
        "Neurology",
        "Obstetrics and Gynecology",
        "Oncology",
        "Ophthalmology",
        "Orthopedics",
        "Pediatrics",
        "Psychiatry",
        "Pulmonology",
        "Radiology",
        "Urology"
    ]

    return (
        <div className="flex items-center justify-center w-full bg-gray-50 py-5 px-4">
            <div className="w-full max-w-[400px]">
                <div className="flex mb-5 gap-4">
                    <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`flex-1 py-2.5 flex items-center justify-center rounded-md border border-gray-300 shadow-sm transition-all ${role === 'patient'
                            ? 'border-primary text-primary border-2 bg-primary/5'
                            : 'text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        <User className="w-4 h-4 mr-2" />
                        Patient
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`flex-1 py-2.5 flex items-center justify-center rounded-md border border-gray-300 shadow-sm transition-all ${role === 'doctor'
                            ? 'border-primary text-primary border-2 bg-primary/5'
                            : 'text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Healthcare Provider
                    </button>
                </div>

                <Card className="border-gray-200 shadow-md">
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4 pt-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className={`h-9 ${errors.fullName ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                />
                                {errors.fullName && <p className="text-xs text-red-500 mt-0.5">{errors.fullName}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-gray-700">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`h-9 ${errors.email ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-gray-700">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={`h-9 pr-9 ${errors.password ? 'border-red-500' : ''}`}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-0 top-0 h-full px-2.5 flex items-center text-gray-400"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className={`h-9 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                />
                                {errors.phoneNumber && <p className="text-xs text-red-500 mt-0.5">{errors.phoneNumber}</p>}
                            </div>

                            {role === 'doctor' && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="licenseNumber" className="text-gray-700">Medical License Number</Label>
                                        <Input
                                            id="licenseNumber"
                                            placeholder="License Number"
                                            value={licenseNumber}
                                            onChange={(e) => setLicenseNumber(e.target.value)}
                                            className={`h-9 ${errors.licenseNumber ? 'border-red-500' : ''}`}
                                            disabled={isLoading}
                                        />
                                        {errors.licenseNumber && <p className="text-xs text-red-500 mt-0.5">{errors.licenseNumber}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="specialization" className="text-gray-700">Specialization</Label>
                                        <select
                                            id="specialization"
                                            value={specialization}
                                            onChange={(e) => setSpecialization(e.target.value)}
                                            className={`h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm ${errors.specialization ? 'border-red-500' : ''}`}
                                            disabled={isLoading}
                                        >
                                            <option value="" disabled>Select specialization</option>
                                            {specializations.map((spec) => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))}
                                        </select>
                                        {errors.specialization && <p className="text-xs text-red-500 mt-0.5">{errors.specialization}</p>}
                                    </div>
                                </>
                            )}

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                                    disabled={isLoading}
                                />
                                <Label htmlFor="remember" className="text-xs font-normal leading-tight text-gray-600">
                                    Remember me for 30 days{" "}
                                </Label>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col border-t border-gray-200 pt-4 pb-5 bg-gray-50">
                            <Button
                                type="submit"
                                className="w-full h-10 font-medium text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>

                            <div className="mt-3 text-center text-xs text-gray-500">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-primary hover:underline font-medium">
                                    Sign Up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}

function LoginPage() {
    return (
        <AuthLayout title="Sign in to your account" subtitle="Enter your credentials to access your secure health records">
            <Login />
        </AuthLayout>
    )
}

export default LoginPage
