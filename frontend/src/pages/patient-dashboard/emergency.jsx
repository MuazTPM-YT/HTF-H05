import React, { useState } from 'react';
import { AlertTriangle, Shield, Clock, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const EmergencyAccess = () => {
  const [pin, setPin] = useState('1234');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Emergency Access</h1>
        <p className="text-gray-500">Configure emergency access to your critical health information</p>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-red-800">Emergency Access Settings</h2>
            <p className="text-red-700">
              These settings allow emergency medical personnel to access your critical health information in an emergency situation.
              Configure with caution as this provides access to sensitive information.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency PIN */}
      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Emergency PIN
            </h2>
            <p className="text-gray-500">This PIN allows emergency personnel to access critical information</p>
          </div>
          <Button variant="outline">Reset PIN</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Current PIN</label>
            <div className="flex">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="py-2 px-3 border rounded-md w-full"
                maxLength={4}
              />
              <Button variant="ghost" className="ml-2">
                Show
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">PIN should be 4 digits</p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Last Updated</label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>October 10, 2023 (7 days ago)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Access Time Limit */}
      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="text-xl font-semibold">Access Time Limit</h2>
        <p className="text-gray-500">Set how long emergency access remains active after PIN entry</p>

        <div className="mt-4">
          <label className="block text-sm text-gray-500 mb-1">Time Limit</label>
          <div className="flex items-center gap-2">
            <select className="py-2 px-3 border rounded-md w-full" defaultValue="4">
              <option value="1">1 hour</option>
              <option value="4">4 hours</option>
              <option value="8">8 hours</option>
              <option value="24">24 hours</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">Emergency access will automatically expire after this time period</p>
        </div>
      </div>

      {/* Critical Information */}
      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">Critical Information</h2>
            <p className="text-gray-500">Information that will be accessible in an emergency</p>
          </div>
          <Button variant="outline">Edit Information</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Blood Type</label>
                <input type="text" value="O+" readOnly className="py-2 px-3 border rounded-md w-full bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Weight</label>
                <input type="text" value="165 lbs" readOnly className="py-2 px-3 border rounded-md w-full bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Height</label>
                <input type="text" value={"5'10\""} readOnly className="py-2 px-3 border rounded-md w-full bg-gray-50" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Medical Conditions</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Allergies</label>
                <textarea
                  readOnly
                  className="py-2 px-3 border rounded-md w-full bg-gray-50 h-20"
                  value="Penicillin, Peanuts"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Medications</label>
                <textarea
                  readOnly
                  className="py-2 px-3 border rounded-md w-full bg-gray-50 h-20"
                  value="Atorvastatin 20mg daily, Lisinopril 10mg daily"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">Emergency Contacts</h2>
            <p className="text-gray-500">People who should be contacted in an emergency</p>
          </div>
          <Button variant="outline">Add Contact</Button>
        </div>

        <div className="space-y-4 mt-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">Sarah Johnson</h3>
                <p className="text-sm text-gray-500">Relationship: Spouse</p>
                <p className="text-sm text-gray-500">Phone: (555) 123-4567</p>
                <p className="text-sm text-gray-500">Email: sarah.johnson@example.com</p>
              </div>
              <Button variant="ghost">
                More
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">Dr. Michael Chen</h3>
                <p className="text-sm text-gray-500">Relationship: Primary Doctor</p>
                <p className="text-sm text-gray-500">Phone: (555) 987-6543</p>
                <p className="text-sm text-gray-500">Email: dr.chen@medical.example.com</p>
              </div>
              <Button variant="ghost">
                More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Access Instructions */}
      <div className="border rounded-lg p-5 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-blue-800">How Emergency Access Works</h2>
            <ol className="list-decimal ml-5 mt-2 space-y-1 text-blue-800">
              <li>Medical personnel enters your emergency PIN</li>
              <li>They gain time-limited access to critical health information</li>
              <li>The system logs all access for your review later</li>
              <li>You receive a notification when emergency access is used</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
      </div>
    </div>
  );
};

export default EmergencyAccess; 