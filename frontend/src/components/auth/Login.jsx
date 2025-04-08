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
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'
import axios from "axios"

function Login() {
    const [role, setRole] = useState('patient')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [_dateOfBirth, _setDateOfBirth] = useState("")
    const [_gender, _setGender] = useState("")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [specialization, setSpecialization] = useState("")
    const [_hospitalName, _setHospitalName] = useState("")
    const [_location, _setLocation] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState({})
    const [showOnboardingSuccess, setShowOnboardingSuccess] = useState(false)
    const { toast } = useToast()
    const navigate = useNavigate()

    // Check if user was redirected from onboarding
    React.useEffect(() => {
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');
        if (onboardingCompleted === 'true') {
            // Only show the message if they just completed onboarding (not on subsequent visits)
            const savedEmail = localStorage.getItem('email');
            if (savedEmail) {
                setEmail(savedEmail);
                setShowOnboardingSuccess(true);
                // Show a toast notification
                toast({
                    title: "Profile setup complete",
                    description: "Your account has been created successfully. Please log in.",
                });
            }
        }
    }, [toast]);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)
    }

    const validateForm = () => {
        const newErrors = {}
        console.log("Validating form with values:", {
            email,
            password
        });

        // For login, we only strictly need username (email) and password to match backend requirements
        if (!email) {
            newErrors.email = "Email is required";
            console.log("Validation failed: missing email");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Invalid email format";
            console.log("Validation failed: invalid email format");
        }

        if (!password) {
            newErrors.password = "Password is required";
            console.log("Validation failed: missing password");
        } else if (password.length < 3) { // Relaxed password requirement for testing
            newErrors.password = "Password is too short";
            console.log("Validation failed: password too short");
        }

        // Other fields are NOT required for login in our simplified version
        // This makes testing easier while connecting to the backend

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        console.log("Form validation result:", isValid ? "PASSED" : "FAILED", newErrors);
        return isValid;
    }

    const handleSubmit = async () => {
        // No parameter needed since e.preventDefault() is now called in the form's onSubmit handler

        console.log('Handle submit function called');

        // Double-check form validation
        if (!validateForm()) {
            console.log('Form validation failed');
            setIsLoading(false); // Make sure to set loading to false if validation fails
            return;
        }

        console.log('Form validation passed, proceeding with login');

        try {
            // IMPORTANT: Only send username and password to the token endpoint
            const credentials = {
                username: email,
                password: password
            };

            console.log('Sending login request with credentials:', credentials);

            // Make the API call with just username/password
            // Use axios directly if needed to debug
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/token/`, credentials, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                console.log('Login API response:', response.status, response.data);

                // Extract tokens
                const { access, refresh } = response.data;

                // Store tokens
                localStorage.setItem(ACCESS_TOKEN, access);
                localStorage.setItem(REFRESH_TOKEN, refresh);

                // Store fullName and other fields even if they're not required for validation
                localStorage.setItem('username', email);
                if (fullName) localStorage.setItem('fullName', fullName);
                if (phoneNumber) localStorage.setItem('phoneNumber', phoneNumber);
                localStorage.setItem('role', role);

                if (role === 'doctor' && licenseNumber && specialization) {
                    localStorage.setItem('licenseNumber', licenseNumber);
                    localStorage.setItem('specialization', specialization);
                }

                console.log('Login successful, showing toast notification');

                toast({
                    title: "Login successful",
                    description: "Welcome back!",
                });

                console.log('Navigating to dashboard in 1 second');

                // Use setTimeout to ensure toast is shown before navigation
                setTimeout(() => {
                    console.log('Executing navigation to /dashboard');
                    navigate('/dashboard');
                }, 1000);

            } catch (apiError) {
                console.error('API call error:', apiError);

                if (apiError.response) {
                    console.error('Error response:', apiError.response.status, apiError.response.data);
                    throw new Error(apiError.response.data?.detail || 'Login failed');
                } else if (apiError.request) {
                    console.error('No response received');

                    // For testing purposes, you can uncomment this to bypass backend
                    /*
                    console.log('Bypassing backend for testing - storing dummy tokens');
                    localStorage.setItem(ACCESS_TOKEN, 'dummy-token');
                    localStorage.setItem(REFRESH_TOKEN, 'dummy-refresh');
                    localStorage.setItem('username', email);
                    if (fullName) localStorage.setItem('fullName', fullName);
                    
                    toast({
                        title: "Login successful (test mode)",
                        description: "Welcome back!",
                    });
                    
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1000);
                    
                    return;
                    */

                    throw new Error('No response from server. Check your network connection.');
                } else {
                    throw apiError;
                }
            }

        } catch (error) {
            console.error('Login error:', error.message);
            toast({
                title: "Login failed",
                description: error.message || "Invalid email or password",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

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

                {showOnboardingSuccess && (
                    <Alert className="mb-4 border-green-200 bg-green-50">
                        <AlertCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Profile Setup Complete</AlertTitle>
                        <AlertDescription className="text-green-700">
                            Your account has been created successfully. Please log in with your credentials.
                        </AlertDescription>
                    </Alert>
                )}

                <Card className="border-gray-200 shadow-md">
                    <form
                        onSubmit={(e) => {
                            console.log('Form submitted');
                            e.preventDefault(); // Explicitly prevent default form behavior

                            // Set loading state immediately for visual feedback
                            setIsLoading(true);

                            try {
                                handleSubmit();
                            } catch (err) {
                                console.error('Form submission error:', err);
                                setIsLoading(false);
                                toast({
                                    title: "Error",
                                    description: "Something went wrong with form submission. Please try again.",
                                    variant: "destructive",
                                });
                            }
                        }}
                    >
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
