import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs"

import {
  FileText,
  Share2,
  AlertTriangle,
  Lock,
  Plus,
  Calendar,
  Clock,
  Activity,
  ChevronRight,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  Droplets,
  Dumbbell,
  User,
  LogOut
} from "lucide-react"

import { RecentActivityList } from "./recent-activity-list"
import { UpcomingAppointments } from "./upcoming-appointments"
import HealthSummary from "./health-summary"
import { useToast } from "../../hooks/use-toast"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants"
import api from "../../services/api"
import { Link } from 'react-router-dom';
import healthRecordService from '../../services/health-record-service';
import appointmentService from '../../services/appointment-service';
import AddRecordModal from './AddRecordModal';

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [healthData, setHealthData] = useState({
    bloodType: 'A+',
    height: '175',
    weight: '72',
    bloodPressure: '120/80',
    heartRate: '72',
    chronicConditions: ['Asthma (Mild)'],
    medications: [],
    allergies: []
  })
  const navigate = useNavigate()
  const { toast } = useToast()
  const [healthRecords, setHealthRecords] = useState([]);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  // Safe JSON parsing function
  const safeJsonParse = (jsonString, fallback) => {
    if (!jsonString) return fallback

    try {
      return JSON.parse(jsonString)
    } catch (error) {
      // If it's not JSON, treat as a single item array if it's a non-empty string
      return jsonString.trim() ? [jsonString.trim()] : fallback
    }
  }

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
      // Load user authentication data
      const userData = {
        username: localStorage.getItem('username') || 'User',
        fullName: localStorage.getItem('fullName') || '',
        phoneNumber: localStorage.getItem('phoneNumber') || '',
        role: localStorage.getItem('role') || 'patient',
        dateOfBirth: localStorage.getItem('dateOfBirth') || '',
        gender: localStorage.getItem('gender') || '',
      }

      if (userData.role === 'doctor') {
        userData.licenseNumber = localStorage.getItem('licenseNumber') || ''
        userData.specialization = localStorage.getItem('specialization') || ''
        userData.hospitalName = localStorage.getItem('hospitalName') || ''
        userData.location = localStorage.getItem('location') || ''
      }

      // Load health data from localStorage
      const healthData = {
        bloodType: localStorage.getItem('bloodType') || 'A+',
        height: localStorage.getItem('height') || '175',
        weight: localStorage.getItem('weight') || '72',
        bloodPressure: localStorage.getItem('bloodPressure') || '120/80',
        heartRate: localStorage.getItem('heartRate') || '72',
        // Parse safely with fallbacks
        chronicConditions: safeJsonParse(localStorage.getItem('chronicConditions'), ['Asthma (Mild)']),
        medications: safeJsonParse(localStorage.getItem('medications'), []),
        allergies: safeJsonParse(localStorage.getItem('allergies'), []),
        // Additional health data 
        emergencyContactName: localStorage.getItem('emergencyContactName') || '',
        emergencyContactRelation: localStorage.getItem('emergencyContactRelation') || '',
        emergencyContactPhone: localStorage.getItem('emergencyContactPhone') || '',
      }

      setUserData(userData)
      setHealthData(healthData)
      setLoading(false)

      // Check if onboarding is completed after login
      const onboardingCompleted = localStorage.getItem('onboardingCompleted')
      if (!onboardingCompleted) {
        toast({
          title: "Complete your profile",
          description: "Please complete your health profile setup",
        })
        navigate('/onboarding')
        return
      }
    }
  }, [navigate, toast])

  useEffect(() => {
    // Load health records count
    const fetchHealthRecords = async () => {
      try {
        const records = await healthRecordService.getRecords();
        setHealthRecords(records);
      } catch (error) {
        console.error('Error fetching health records:', error);
      }
    };

    // Load appointment count  
    const fetchAppointments = async () => {
      try {
        const appointments = await appointmentService.getAppointments();
        setAppointmentCount(appointments.length);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchHealthRecords();
    fetchAppointments();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      localStorage.removeItem(ACCESS_TOKEN)
      localStorage.removeItem(REFRESH_TOKEN)
      toast({
        title: "Logged out",
        description: "You have been logged out",
      })
      navigate('/login')
    }
  }

  const handleAddRecord = () => {
    setIsAddingRecord(true);
  };

  const handleManageSharing = () => {
    navigate('/sharing');
  };

  const handleSecuritySettings = () => {
    navigate('/security');
  };

  const handleEmergencyInfo = () => {
    navigate('/emergency');
  };

  const handleManageAppointments = () => {
    navigate('/appointments');
  };

  const handleHealthAnalytics = () => {
    navigate('/analytics');
  };

  const handleAddMedication = () => {
    // Show medication adding modal or navigate to medication add page
    const medication = prompt('Enter new medication:');
    if (medication) {
      const updatedMedications = [...healthData.medications, medication];
      localStorage.setItem('medications', JSON.stringify(updatedMedications));
      setHealthData({
        ...healthData,
        medications: updatedMedications
      });
      toast({
        title: "Medication added",
        description: "Your medication has been added to your profile"
      });
    }
  };

  const handleAddAllergy = () => {
    // Show allergy adding modal or navigate to allergy add page
    const allergy = prompt('Enter new allergy:');
    if (allergy) {
      const updatedAllergies = [...healthData.allergies, allergy];
      localStorage.setItem('allergies', JSON.stringify(updatedAllergies));
      setHealthData({
        ...healthData,
        allergies: updatedAllergies
      });
      toast({
        title: "Allergy added",
        description: "Your allergy has been added to your profile"
      });
    }
  };

  const handleRecordAdded = async () => {
    try {
      const records = await healthRecordService.getRecords();
      setHealthRecords(records);
      toast({
        title: "Record added",
        description: "Your health record has been added successfully"
      });
    } catch (error) {
      console.error('Error refreshing records:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {userData?.fullName || 'User'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Records */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Records</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthRecords.length}</div>
            <p className="text-xs text-gray-500">+3 added this month</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              className="w-full justify-center"
              size="sm"
              onClick={handleAddRecord}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </CardFooter>
        </Card>

        {/* Active Sharing */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Sharing</CardTitle>
            <Share2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentCount}</div>
            <p className="text-xs text-gray-500">
              {appointmentCount > 1 ? `${appointmentCount - 1} healthcare providers, 1 organization` : '1 healthcare provider'}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              className="w-full justify-between"
              size="sm"
              onClick={handleManageSharing}
            >
              Manage Sharing
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Security Status */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <Lock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">Secure</div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Protected</Badge>
            </div>
            <p className="text-xs text-gray-500">Last verified 2 hours ago</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              className="w-full justify-between"
              size="sm"
              onClick={handleSecuritySettings}
            >
              Security Settings
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Emergency Access */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Emergency Access</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">Ready</div>
              <Badge variant="outline" className="border-green-500 text-green-600">
                Enabled
              </Badge>
            </div>
            <p className="text-xs text-gray-500">PIN: **** (Last updated 30 days ago)</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              className="w-full justify-between"
              size="sm"
              onClick={handleEmergencyInfo}
            >
              Update Emergency Info
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview">
        <TabsList className="space-x-2 bg-transparent border-b rounded-none p-0 h-10">
          <TabsTrigger
            value="overview"
            className="rounded data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:shadow-none pb-3"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="recent-activity"
            className="rounded data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:shadow-none pb-3"
          >
            Recent Activity
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="rounded data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:shadow-none pb-3"
          >
            Appointments
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-gray-200">
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
                <CardDescription>Your key health metrics and information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="allergies">Allergies</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-500">Blood Type</div>
                        <div className="flex items-center">
                          <Droplets className="h-5 w-5 mr-2 text-red-500" />
                          <span className="text-2xl font-bold">{healthData.bloodType}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-500">Height & Weight</div>
                        <div className="flex items-center">
                          <Dumbbell className="h-5 w-5 mr-2 text-blue-500" />
                          <span className="text-lg font-medium">{healthData.height} cm, {healthData.weight} kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Vital Signs</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Heart className="h-5 w-5 mr-2 text-red-500" />
                              <span className="font-medium">Blood Pressure</span>
                            </div>
                            <Badge variant="outline" className="text-green-500">Normal</Badge>
                          </div>
                          <div className="mt-2 text-2xl font-bold">{healthData.bloodPressure}</div>
                          <div className="mt-1 text-xs text-gray-500">Last updated: 2 days ago</div>
                        </div>

                        <div className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Activity className="h-5 w-5 mr-2 text-green-500" />
                              <span className="font-medium">Heart Rate</span>
                            </div>
                            <Badge variant="outline" className="text-green-500">Normal</Badge>
                          </div>
                          <div className="mt-2 text-2xl font-bold">{healthData.heartRate} bpm</div>
                          <div className="mt-1 text-xs text-gray-500">Last updated: 2 days ago</div>
                        </div>
                      </div>
                    </div>

                    {healthData.chronicConditions && healthData.chronicConditions.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-500">Chronic Conditions</div>
                        <div className="rounded-lg border p-3">
                          <ul className="space-y-2">
                            {healthData.chronicConditions.map((condition, index) => (
                              <li key={index} className="flex items-start">
                                <AlertCircle className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium">{condition}</p>
                                  <p className="text-xs text-gray-500">Diagnosed: Jan 2018</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Medications Tab */}
                  <TabsContent value="medications">
                    <div className="py-4">
                      {healthData.medications && healthData.medications.length > 0 ? (
                        <div className="space-y-4">
                          {healthData.medications.map((medication, index) => (
                            <div key={index} className="rounded-lg border p-3">
                              <div className="flex items-start">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium">{medication}</p>
                                  <p className="text-sm text-gray-500">Take as prescribed</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No medications recorded</p>
                          <Button
                            className="mt-4"
                            variant="outline"
                            size="sm"
                            onClick={handleAddMedication}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Medication
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Allergies Tab */}
                  <TabsContent value="allergies">
                    <div className="py-4">
                      {healthData.allergies && healthData.allergies.length > 0 ? (
                        <div className="space-y-4">
                          {healthData.allergies.map((allergy, index) => (
                            <div key={index} className="rounded-lg border p-3">
                              <div className="flex items-start">
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                  <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium">{allergy}</p>
                                  <p className="text-sm text-gray-500">Avoid exposure</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No allergies recorded</p>
                          <Button
                            className="mt-4"
                            variant="outline"
                            size="sm"
                            onClick={handleAddAllergy}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Allergy
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="lg:col-span-3 border-gray-200">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent alerts and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1.5 rounded-full bg-blue-100">
                      <Bell className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Appointment Reminder</p>
                      <p className="text-xs text-gray-500">
                        You have an appointment with Dr. Johnson tomorrow at 10:00 AM.
                      </p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1.5 rounded-full bg-green-100">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Lab Results Available</p>
                      <p className="text-xs text-gray-500">
                        Your recent lab results have been uploaded to your records.
                      </p>
                      <p className="text-xs text-gray-400">Yesterday</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1.5 rounded-full bg-amber-100">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Sharing Request</p>
                      <p className="text-xs text-gray-500">
                        Central Hospital has requested access to your medical history.
                      </p>
                      <p className="text-xs text-gray-400">2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1.5 rounded-full bg-red-100">
                      <XCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Access Expired</p>
                      <p className="text-xs text-gray-500">
                        Dr. Chen's access to your records has expired.
                      </p>
                      <p className="text-xs text-gray-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lower Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled healthcare visits</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent><UpcomingAppointments limit={3} /></CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleManageAppointments}
                >
                  Manage Appointments
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Recent actions on your health records</CardDescription>
                </div>
                <Clock className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent><RecentActivityList limit={3} /></CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/activity')}
                >
                  View All Activity
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Health Trends</CardTitle>
                  <CardDescription>Tracking your key health metrics</CardDescription>
                </div>
                <Activity className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Health metric placeholders */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Blood Pressure</span>
                    <span className="text-sm text-green-500">Stable</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Weight</span>
                    <span className="text-sm text-amber-500">Slight increase</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Heart Rate</span>
                    <span className="text-sm text-green-500">Normal</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleHealthAnalytics}
                >
                  View Health Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="recent-activity">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>A detailed log of recent actions on your health records</CardDescription>
            </CardHeader>
            <CardContent><RecentActivityList limit={10} /></CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled healthcare visits</CardDescription>
            </CardHeader>
            <CardContent><UpcomingAppointments limit={10} /></CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => navigate('/appointments/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Schedule New Appointment
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {isAddingRecord && (
        <AddRecordModal
          isOpen={isAddingRecord}
          onClose={() => setIsAddingRecord(false)}
          onSuccess={handleRecordAdded}
        />
      )}
    </div>
  )
}

export default DashboardOverview
