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
import api from "../../services/api"

function Register() {
  const [role, setRole] = useState('patient')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [hospitalName, setHospitalName] = useState("")
  const [location, setLocation] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState({})
  const { toast } = useToast()
  const navigate = useNavigate()

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    setPasswordStrength(strength)
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    checkPasswordStrength(newPassword)
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Very weak"
      case 1:
        return "Weak"
      case 2:
        return "Medium"
      case 3:
        return "Strong"
      case 4:
        return "Very strong"
      default:
        return ""
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500"
      case 1:
        return "bg-orange-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-green-500"
      case 4:
        return "bg-emerald-500"
      default:
        return "bg-gray-200"
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!fullName) newErrors.fullName = "Full name is required"
    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format"

    if (!password) newErrors.password = "Password is required"
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters"

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"

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

    if (!agreeTerms) newErrors.terms = "You must agree to the terms and privacy policy"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const userData = {
        username: email,
        password: password,
        email: email,
        first_name: fullName.split(' ')[0] || '',
        last_name: fullName.split(' ').slice(1).join(' ') || '',
        date_of_birth: dateOfBirth,
        gender: gender,
        role: role,
        phone_number: phoneNumber,
      };

      if (role === 'doctor') {
        userData.license_number = licenseNumber;
        userData.specialization = specialization;
        userData.hospital_name = hospitalName;
        userData.location = location;
      }

      localStorage.setItem('fullName', fullName);
      localStorage.setItem('email', email);
      localStorage.setItem('phone_number', phoneNumber);
      localStorage.setItem('role', role);
      localStorage.setItem('accountCreated', 'true');

      await api.register(userData);

      toast({
        title: "Registration successful",
        description: "Please complete your health profile setup",
      });

      navigate('/onboarding');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
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

              <div className="grid grid-cols-2 gap-3">
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
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-9 pr-9 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-2.5 flex items-center text-gray-400"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-0.5">{errors.confirmPassword}</p>}
                </div>
              </div>

              {password && (
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Password strength:</span>
                    <span
                      className={
                        passwordStrength <= 1
                          ? "text-red-500"
                          : passwordStrength === 2
                            ? "text-yellow-500"
                            : "text-green-500"
                      }
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

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

              {role === 'patient' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="dateOfBirth" className="text-gray-700">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className={`h-9 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                      {errors.dateOfBirth && <p className="text-xs text-red-500 mt-0.5">{errors.dateOfBirth}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="gender" className="text-gray-700">Gender</Label>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className={`h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm ${errors.gender ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      >
                        <option value="" disabled>Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                    </div>
                  </div>
                </>
              )}

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

                  <div className="space-y-1.5">
                    <Label htmlFor="hospitalName" className="text-gray-700">Hospital/Clinic Name (Optional)</Label>
                    <Input
                      id="hospitalName"
                      placeholder="Hospital or Clinic Name"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="text-gray-700">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`h-9 ${errors.location ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.location && <p className="text-xs text-red-500 mt-0.5">{errors.location}</p>}
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-xs font-normal leading-tight text-gray-600">
                  I agree to the{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {errors.terms && <p className="text-xs text-red-500 mt-0.5">{errors.terms}</p>}
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
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <div className="mt-3 text-center text-xs text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

function RegisterPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Join HealthChain to securely manage your health records">
      <Register />
    </AuthLayout>
  )
}

export default RegisterPage
