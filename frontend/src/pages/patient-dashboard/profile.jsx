import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Camera, Fingerprint, Shield, Lock, Bell, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const Profile = () => {
  const [faceIDEnabled, setFaceIDEnabled] = useState(true);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: '',
    dateOfBirth: '',
    gender: '',
    memberSince: 'October 2022',
    location: '',
  });

  const [healthData, setHealthData] = useState({
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
  });

  useEffect(() => {
    // Load user data from localStorage
    const loadedUserData = {
      fullName: localStorage.getItem('fullName') || '',
      email: localStorage.getItem('username') || '',
      phoneNumber: localStorage.getItem('phoneNumber') || localStorage.getItem('phone_number') || '',
      role: localStorage.getItem('role') || 'patient',
      dateOfBirth: localStorage.getItem('dateOfBirth') || '',
      gender: localStorage.getItem('gender') || '',
      location: localStorage.getItem('location') || 'Mumbai, Maharashtra',
    };

    // Load health-related data
    const loadedHealthData = {
      emergencyContactName: localStorage.getItem('emergencyContactName') || '',
      emergencyContactRelation: localStorage.getItem('emergencyContactRelation') || '',
      emergencyContactPhone: localStorage.getItem('emergencyContactPhone') || '',
    };

    setUserData(loadedUserData);
    setHealthData(loadedHealthData);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500">Manage your personal information and preferences</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center relative overflow-hidden">
              <User size={36} className="text-blue-600" />
              {/* This would be an actual image in a real app */}
              {/* <img src="/avatar.jpg" alt="Profile" className="w-full h-full object-cover" /> */}
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition-colors">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">{userData.fullName || 'User'}</h2>
              <Button variant="outline" className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-600">
                <Edit size={16} />
                Edit Profile
              </Button>
            </div>
            <p className="text-gray-500 mt-1">Member since {userData.memberSince}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-500" />
                <span>{userData.phoneNumber || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span>{userData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Authentication */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Security & Authentication</h3>
          <p className="text-sm text-gray-500">Manage your account security settings</p>
        </div>

        <div className="divide-y">
          {/* Face ID Authentication */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-full mt-0.5">
                  <Fingerprint size={20} />
                </div>
                <div>
                  <h4 className="font-medium">Face ID Authentication</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Use Face ID to quickly and securely access your health records
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={faceIDEnabled}
                  onChange={() => setFaceIDEnabled(!faceIDEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {faceIDEnabled && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
                <div className="font-medium text-blue-700 mb-1">Face ID is enabled</div>
                <p className="text-blue-600">Your device will use facial recognition to verify your identity when accessing sensitive information.</p>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button className="text-sm px-3 py-2 bg-white border border-blue-200 text-blue-600 rounded-md hover:bg-blue-50">
                    Re-configure Face ID
                  </button>
                  <button className="text-sm px-3 py-2 bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50">
                    Reset Face ID Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-full mt-0.5">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  Last changed 30 days ago
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-sm">Change Password</Button>
          </div>

          {/* Two-factor authentication */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-full mt-0.5">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="font-medium">Two-factor authentication</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  Enabled via SMS to {userData.phoneNumber ? userData.phoneNumber.substring(0, userData.phoneNumber.length - 4) + '****' : '+91 98765 4****'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-sm">Configure</Button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <Button variant="outline" size="sm">Edit</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Full Name</label>
            <p className="font-medium">{userData.fullName || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
            <p className="font-medium">{userData.dateOfBirth || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Gender</label>
            <p className="font-medium">{userData.gender || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Language</label>
            <p className="font-medium">English</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Address</label>
            <p className="font-medium">123 Main Street, Andheri East</p>
            <p className="font-medium">{userData.location}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Emergency Contact</label>
            <p className="font-medium">{healthData.emergencyContactName ? `${healthData.emergencyContactName} (${healthData.emergencyContactRelation})` : 'Not set'}</p>
            <p className="font-medium">{healthData.emergencyContactPhone || 'No phone number'}</p>
          </div>
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Communication Preferences</h3>
          <p className="text-sm text-gray-500">Manage your notification preferences</p>
        </div>

        <div className="divide-y">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-full mt-0.5">
                <Bell size={20} />
              </div>
              <div>
                <h4 className="font-medium">Email Updates</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  Receive updates about your health records
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-full mt-0.5">
                <Bell size={20} />
              </div>
              <div>
                <h4 className="font-medium">Appointment Reminders</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  Receive reminders about upcoming appointments
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-full mt-0.5">
                <Bell size={20} />
              </div>
              <div>
                <h4 className="font-medium">Sharing Notifications</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  Be notified when your records are accessed
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-full mt-0.5">
                <Bell size={20} />
              </div>
              <div>
                <h4 className="font-medium">Marketing Communications</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  Receive product updates and health tips
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Session & Device Management */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Session & Device Management</h3>
          <p className="text-sm text-gray-500">Manage active sessions and devices</p>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="18" x2="12" y2="18.01" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Current Device</p>
                <p className="text-sm text-gray-500">
                  {userData.location || 'Mumbai, IN'} • Active now • This device
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <button className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium">
              <LogOut size={16} />
              <span>Sign Out From All Other Devices</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 