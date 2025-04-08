import React, { useState } from 'react';
import { FileText, Share2, Shield, AlertTriangle, Check, Clock, Heart, Calendar, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Sample upcoming appointments
    const upcomingAppointments = [
        {
            id: 1,
            doctor: 'Dr. Sarah Johnson',
            specialty: 'Cardiologist',
            date: '10/20/2023',
            time: '10:00 AM',
            location: 'Central Hospital',
            type: 'In Person'
        },
        {
            id: 2,
            doctor: 'Dr. Michael Chen',
            specialty: 'Dermatologist',
            date: '10/25/2023',
            time: '2:30 PM',
            location: 'Virtual',
            type: 'Video Call'
        },
        {
            id: 3,
            doctor: 'Dr. Emily Rodriguez',
            specialty: 'General Practitioner',
            date: '11/5/2023',
            time: '9:15 AM',
            location: 'Community Clinic',
            type: 'In Person'
        }
    ];

    // Sample activity records
    const recentActivity = [
        {
            id: 1,
            type: 'view',
            actor: 'Dr. Sarah Johnson',
            action: 'viewed your medical history',
            date: '10/15/2023',
            time: '2:30:00 PM',
            authorized: true
        },
        {
            id: 2,
            type: 'login',
            actor: 'You',
            action: 'logged in from a new device',
            date: '10/14/2023',
            time: '9:15:00 AM',
            authorized: true
        },
        {
            id: 3,
            type: 'upload',
            actor: 'Central Hospital',
            action: 'uploaded new lab results',
            date: '10/10/2023',
            time: '4:40:00 PM',
            authorized: true
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-500">Welcome back to your secure health records</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Health Records Card */}
                <div className="border rounded-lg bg-white p-4">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium">Health Records</h3>
                        <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold mb-1">24</p>
                    <p className="text-sm text-gray-500">+3 added this month</p>
                    <div className="mt-4">
                        <Link to="/health-records" className="inline-flex items-center">
                            <button className="text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-md">
                                Add Record
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Active Sharing Card */}
                <div className="border rounded-lg bg-white p-4">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium">Active Sharing</h3>
                        <Share2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold mb-1">3</p>
                    <p className="text-sm text-gray-500">2 healthcare providers, 1 organization</p>
                    <div className="mt-4">
                        <Link to="/sharing" className="inline-flex items-center">
                            <button className="text-sm font-medium flex items-center gap-1 py-1 px-2 text-gray-700 hover:text-gray-900">
                                Manage Sharing <span className="text-xs">→</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Security Status Card */}
                <div className="border rounded-lg bg-white p-4">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium">Security Status</h3>
                        <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-xl font-bold">Secure</p>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-md font-medium">Protected</span>
                    </div>
                    <p className="text-sm text-gray-500">Last verified 2 hours ago</p>
                    <div className="mt-4">
                        <Link to="/security" className="inline-flex items-center">
                            <button className="text-sm font-medium flex items-center gap-1 py-1 px-2 text-gray-700 hover:text-gray-900">
                                Security Settings <span className="text-xs">→</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Emergency Access Card */}
                <div className="border rounded-lg bg-white p-4">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium">Emergency Access</h3>
                        <AlertTriangle className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-xl font-bold">Ready</p>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-md font-medium">Enabled</span>
                    </div>
                    <p className="text-sm text-gray-500">PIN **** (Last updated 30 days ago)</p>
                    <div className="mt-4">
                        <Link to="/emergency" className="inline-flex items-center">
                            <button className="text-sm font-medium flex items-center gap-1 py-1 px-2 text-gray-700 hover:text-gray-900">
                                Update Emergency Info <span className="text-xs">→</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="border-b">
                <div className="flex space-x-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-2 px-1 -mb-px font-medium text-sm ${activeTab === 'overview'
                            ? 'border-b-2 border-gray-800 text-gray-800'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`py-2 px-1 -mb-px font-medium text-sm ${activeTab === 'activity'
                            ? 'border-b-2 border-gray-800 text-gray-800'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Recent Activity
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`py-2 px-1 -mb-px font-medium text-sm ${activeTab === 'appointments'
                            ? 'border-b-2 border-gray-800 text-gray-800'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Appointments
                    </button>
                </div>
            </div>

            {/* Health Summary Section */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="border rounded-lg bg-white">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-bold">Health Summary</h2>
                            <p className="text-sm text-gray-500">Your key health metrics and information</p>
                        </div>

                        <div className="border-b">
                            <div className="grid grid-cols-1 sm:grid-cols-3 divide-x">
                                <button className="p-3 text-center text-sm font-medium bg-gray-50">Overview</button>
                                <button className="p-3 text-center text-sm font-medium">Medications</button>
                                <button className="p-3 text-center text-sm font-medium">Allergies</button>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm text-gray-500 mb-1">Blood Type</h3>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                            <span className="text-red-800 text-xs">A</span>
                                        </div>
                                        <span className="text-xl font-bold">A+</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm text-gray-500 mb-1">Height & Weight</h3>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                            <span className="text-blue-800 text-xs">H</span>
                                        </div>
                                        <span className="text-xl font-bold">175 cm, 72 kg</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm text-gray-500 mb-1">Vital Signs</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div className="border rounded-md p-3">
                                        <div className="flex items-start">
                                            <Heart className="h-5 w-5 text-red-500 mr-2 mt-1" />
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-medium">Blood Pressure</p>
                                                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-sm">Normal</span>
                                                </div>
                                                <p className="text-2xl font-bold">120/80</p>
                                                <p className="text-xs text-gray-500 mt-1">Last updated: 2 days ago</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border rounded-md p-3">
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-blue-500 mr-2 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                                                <path d="M3.5 12h6"></path>
                                                <path d="M14.5 12h6"></path>
                                            </svg>
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-medium">Heart Rate</p>
                                                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-sm">Normal</span>
                                                </div>
                                                <p className="text-2xl font-bold">72 bpm</p>
                                                <p className="text-xs text-gray-500 mt-1">Last updated: 2 days ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm text-gray-500 mb-1">Chronic Conditions</h3>
                                <div className="border rounded-md p-3 mt-2">
                                    <div className="flex items-start">
                                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M8.7 4.2A4 4 0 0 1 12 2a4 4 0 0 1 3.3 2.2"></path>
                                            <path d="M18.7 9.3a4 4 0 0 1-.9 4.2"></path>
                                            <path d="m9 15 6-6"></path>
                                            <path d="M6.3 10A4 4 0 0 0 6 12a4 4 0 0 0 2.2 3.3"></path>
                                            <path d="M12 19a4 4 0 0 0 3.3-2.2"></path>
                                            <path d="M19 12"></path>
                                        </svg>
                                        <div>
                                            <p className="font-medium">Asthma (Mild)</p>
                                            <p className="text-sm text-gray-500">Diagnosed: Jan 2018</p>
                                            <p className="text-sm text-gray-500 mt-1">Managed with: Albuterol inhaler as needed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Upcoming Appointments */}
                        <div className="border rounded-lg bg-white">
                            <div className="p-4 border-b flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Upcoming Appointments</h2>
                                    <p className="text-sm text-gray-500">Your scheduled healthcare visits</p>
                                </div>
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>

                            <div className="divide-y">
                                {upcomingAppointments.map(appointment => (
                                    <div key={appointment.id} className="p-4">
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                                                <span className="text-gray-700 text-xs">DR</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center flex-wrap gap-2">
                                                    <div>
                                                        <p className="font-medium truncate">{appointment.doctor}</p>
                                                        <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                                    </div>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 flex-shrink-0">
                                                        {appointment.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-1 flex-shrink-0" /> {appointment.date}
                                                    <Clock className="h-4 w-4 ml-3 mr-1 flex-shrink-0" /> {appointment.time}
                                                </div>
                                                <div className="mt-1 text-sm text-gray-500 flex items-center">
                                                    <svg className="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                        <circle cx="12" cy="10" r="3"></circle>
                                                    </svg>
                                                    <span className="truncate">{appointment.location}</span>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 border-t text-center">
                                <Link to="/appointments" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Manage Appointments
                                </Link>
                            </div>
                        </div>

                        {/* Health Trends */}
                        <div className="border rounded-lg bg-white">
                            <div className="p-4 border-b flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Health Trends</h2>
                                    <p className="text-sm text-gray-500">Tracking your key health metrics</p>
                                </div>
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 3v18h18"></path>
                                    <path d="m19 9-5 5-4-4-3 3"></path>
                                </svg>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium">Blood Pressure</p>
                                        <span className="text-sm font-bold">120/80</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Last reading: 2 days ago</p>
                                    <p className="text-xs text-right mt-1">Normal</p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium">Blood Glucose</p>
                                        <span className="text-sm font-bold">95 mg/dL</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Last reading: 1 week ago</p>
                                    <p className="text-xs text-right mt-1">Normal</p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium">Weight</p>
                                        <span className="text-sm font-bold">72 kg</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Last reading: 3 days ago</p>
                                    <p className="text-xs text-right mt-1">Stable</p>
                                </div>
                            </div>

                            <div className="p-3 border-t text-center">
                                <Link to="/analytics" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    View Health Analytics
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity Tab */}
            {activeTab === 'activity' && (
                <div className="border rounded-lg bg-white">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-bold">Recent Activity</h2>
                        <p className="text-sm text-gray-500">Recent actions on your health records</p>
                    </div>

                    <div className="divide-y">
                        {recentActivity.map(activity => (
                            <div key={activity.id} className="p-4 flex items-start">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${activity.type === 'view' ? 'bg-blue-100' :
                                    activity.type === 'login' ? 'bg-purple-100' : 'bg-green-100'
                                    }`}>
                                    <svg className={`h-4 w-4 ${activity.type === 'view' ? 'text-blue-600' :
                                        activity.type === 'login' ? 'text-purple-600' : 'text-green-600'
                                        }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {activity.type === 'view' ? (
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        ) : activity.type === 'login' ? (
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                        ) : (
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        )}
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="font-medium">{activity.actor} {activity.action}</p>
                                            <p className="text-sm text-gray-500">By: {activity.actor}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${activity.authorized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {activity.authorized ? 'Authorized' : 'Unauthorized'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{activity.date}, {activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t text-center">
                        <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                            View All Activity
                        </button>
                    </div>
                </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
                <div className="border rounded-lg bg-white">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-bold">Appointments</h2>
                        <p className="text-sm text-gray-500">Manage your healthcare appointments</p>
                    </div>

                    <div className="divide-y">
                        {upcomingAppointments.map(appointment => (
                            <div key={appointment.id} className="p-4">
                                <div className="flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                                        <span className="text-gray-700 text-xs">DR</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center flex-wrap gap-2">
                                            <div>
                                                <p className="font-medium truncate">{appointment.doctor}</p>
                                                <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                            </div>
                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 flex-shrink-0">
                                                {appointment.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center mt-2 text-sm text-gray-500">
                                            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" /> {appointment.date}
                                            <Clock className="h-4 w-4 ml-3 mr-1 flex-shrink-0" /> {appointment.time}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500 flex items-center">
                                            <svg className="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                            <span className="truncate">{appointment.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-2">
                                        <button className="px-3 py-1 text-xs font-medium rounded bg-gray-900 text-white hover:bg-gray-800 flex-shrink-0">
                                            Details
                                        </button>
                                        <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t text-center">
                        <Link to="/appointments" className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                            Schedule New Appointment
                        </Link>
                    </div>
                </div>
            )}

            {/* Notifications Section */}
            <div className="border rounded-lg bg-white">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold">Notifications</h2>
                    <p className="text-sm text-gray-500">Recent alerts and updates</p>
                </div>

                <div className="divide-y">
                    <div className="p-4 flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium">Appointment Reminder</p>
                            <p className="text-sm text-gray-600">You have an appointment with Dr. Johnson tomorrow at 10:00 AM.</p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                        </div>
                    </div>

                    <div className="p-4 flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium">Lab Results Available</p>
                            <p className="text-sm text-gray-600">Your recent lab results have been uploaded to your records.</p>
                            <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                        </div>
                    </div>

                    <div className="p-4 flex items-start">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                            <svg className="h-4 w-4 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium">Sharing Request</p>
                            <p className="text-sm text-gray-600">Central Hospital has requested access to your medical history.</p>
                            <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                        </div>
                    </div>

                    <div className="p-4 flex items-start">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                            <svg className="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium">Access Expired</p>
                            <p className="text-sm text-gray-600">Dr. Chen's access to your records has expired.</p>
                            <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                        </div>
                    </div>
                </div>

                <div className="p-3 border-t text-center">
                    <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                        View All Notifications
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 