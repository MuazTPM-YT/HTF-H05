import React from 'react';
import { AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/switch';

const EmergencyAccess = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Emergency Access</h1>
        <p className="text-gray-500">Configure emergency access settings for critical situations</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-50 border border-red-100 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Emergency Access Configuration</h3>
            <p className="text-sm text-red-700">
              These settings determine how your health data can be accessed in emergency situations. Configure carefully as this could be life-saving in critical situations.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Access Settings */}
      <div className="space-y-6">
        {/* Emergency Access Override */}
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <h4 className="font-medium">Emergency Access Override</h4>
            <p className="text-sm text-gray-500">Allow emergency personnel to access critical health information</p>
          </div>
          <Switch defaultChecked />
        </div>

        {/* Emergency PIN Setup Card */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-medium">Emergency PIN Setup</h3>
          </div>
          <p className="text-sm text-gray-500">Create a PIN that emergency responders can use to access your critical health information</p>
          
          {/* Emergency PIN Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Emergency Access PIN</label>
            <input 
              type="password" 
              placeholder="•••" 
              className="px-3 py-2 border rounded-md w-48 text-sm"
            />
            <p className="text-xs text-gray-500">This PIN should be shared with emergency contacts or stored in your emergency information</p>
          </div>

          {/* Access Time Limit */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Access Time Limit (minutes)</label>
            <input 
              type="number" 
              defaultValue="60" 
              className="px-3 py-2 border rounded-md w-48 text-sm"
            />
            <p className="text-xs text-gray-500">Emergency access will automatically expire after this time period</p>
          </div>

          {/* Save Button */}
          <Button className="mt-4 w-full bg-black text-white hover:bg-gray-800">
            Save Emergency Settings
          </Button>
        </div>

        {/* Critical Health Information Card */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-medium">Critical Health Information</h3>
          </div>
          <p className="text-sm text-gray-500">Specify critical health information that should be available during emergencies</p>
          
          {/* Allergies & Reactions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Allergies & Reactions</label>
            <textarea 
              placeholder="List any allergies and reactions..." 
              className="px-3 py-2 border rounded-md w-full text-sm min-h-[100px]"
            />
          </div>

          {/* Current Medications */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Medications</label>
            <textarea 
              placeholder="List current medications and dosages..." 
              className="px-3 py-2 border rounded-md w-full text-sm min-h-[100px]"
            />
          </div>

          {/* Chronic Conditions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Chronic Conditions</label>
            <textarea 
              placeholder="List any chronic conditions..." 
              className="px-3 py-2 border rounded-md w-full text-sm min-h-[100px]"
            />
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">
              Emergency access is logged and you will be notified when your records are accessed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAccess; 