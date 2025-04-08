import React, { useState, useEffect } from 'react';
import { AlertTriangle, FileText, CheckCircle, Loader2, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/switch';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

const EmergencyAccess = () => {
  const [pin, setPin] = useState('');
  const [accessDuration, setAccessDuration] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('BOTH');
  const [pinStatus, setPinStatus] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [emergencyEnabled, setEmergencyEnabled] = useState(true);
  const [criticalInfo, setCriticalInfo] = useState({
    bloodType: '',
    weight: '',
    height: '',
    allergies: '',
    medications: '',
    conditions: ''
  });
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPinStatus();
    fetchCriticalInfo();
    fetchEmergencyContacts();
  }, []);

  const fetchPinStatus = async () => {
    try {
      const response = await axios.get(`/api/emergency-pin/status/${localStorage.getItem('userId')}/`);
      setPinStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch PIN status:', error);
    }
  };

  const fetchCriticalInfo = async () => {
    try {
      const { data } = await axios.get(`/api/critical-health-info/${localStorage.getItem('userId')}/`);
      setCriticalInfo(data.info);
    } catch (error) {
      console.error('Failed to fetch critical info:', error);
    }
  };

  const fetchEmergencyContacts = async () => {
    try {
      const response = await axios.get(`/api/emergency-contacts/${localStorage.getItem('userId')}/`);
      setContacts(response.data.contacts);
    } catch (error) {
      console.error('Failed to fetch emergency contacts:', error);
    }
  };

  const generatePin = async () => {
    setIsGenerating(true);
    try {
      await axios.post('/api/emergency-pin/generate/', {
        user_id: localStorage.getItem('userId'),
        delivery_method: deliveryMethod,
        access_duration: accessDuration
      });

      toast({
        title: "Success",
        description: "Emergency PIN has been generated and sent",
      });

      await fetchPinStatus();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to generate PIN",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const verifyPin = async () => {
    try {
      const response = await axios.post('/api/emergency-pin/verify/', {
        pin,
        user_id: localStorage.getItem('userId')
      });

      toast({
        title: "Success",
        description: `Access granted for ${response.data.access_duration} minutes`,
      });

      localStorage.setItem('emergencyAccessExpires', response.data.access_expires_at);
      await fetchPinStatus();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Invalid PIN",
        variant: "destructive"
      });
    }
  };

  const resetPin = async () => {
    try {
      await axios.post('/api/emergency-pin/revoke/', {
        user_id: localStorage.getItem('userId'),
        reason: 'User requested reset'
      });

      toast({
        title: "Success",
        description: "Emergency PIN has been reset",
      });

      await fetchPinStatus();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to reset PIN",
        variant: "destructive"
      });
    }
  };

  const saveChanges = async () => {
    try {
      await axios.post('/api/critical-health-info/update/', {
        user_id: localStorage.getItem('userId'),
        ...criticalInfo
      });

      toast({
        title: "Success",
        description: "Critical health information updated successfully",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to save changes",
        variant: "destructive"
      });
    }
  };

  const addContact = async (contact) => {
    try {
      const updatedContacts = [...contacts, contact];
      await axios.post('/api/emergency-contacts/update/', {
        user_id: localStorage.getItem('userId'),
        contacts: updatedContacts
      });

      setContacts(updatedContacts);
      toast({
        title: "Success",
        description: "Emergency contact added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to add contact",
        variant: "destructive"
      });
    }
  };

  const handleEmergencyToggle = async (enabled) => {
    try {
      await axios.post('/api/emergency-access/toggle/', {
        user_id: localStorage.getItem('userId'),
        enabled
      });

      setEmergencyEnabled(enabled);
      toast({
        title: "Success",
        description: `Emergency access ${enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update settings",
        variant: "destructive"
      });
    }
  };

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
          <Switch checked={emergencyEnabled} onCheckedChange={handleEmergencyToggle} />
        </div>

        {/* Emergency PIN Setup Card */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-medium">Emergency PIN Setup</h3>
          </div>
          <p className="text-sm text-gray-500">Create a PIN that emergency responders can use to access your critical health information</p>

          {/* Delivery Method Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Method</label>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="px-3 py-2 border rounded-md w-48 text-sm"
            >
              <option value="SMS">SMS</option>
              <option value="EMAIL">Email</option>
              <option value="BOTH">Both</option>
            </select>
          </div>

          {/* Access Time Limit */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Access Time Limit (minutes)</label>
            <input
              type="number"
              value={accessDuration}
              onChange={(e) => setAccessDuration(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-md w-48 text-sm"
            />
            <p className="text-xs text-gray-500">Emergency access will automatically expire after this time period</p>
          </div>

          {/* Generate PIN Button */}
          <Button
            onClick={generatePin}
            disabled={isGenerating}
            className="mt-4 w-full bg-black text-white hover:bg-gray-800"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating PIN...
              </>
            ) : (
              'Generate New Emergency PIN'
            )}
          </Button>

          {/* PIN Status */}
          {pinStatus && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">Current PIN Status</h4>
              <p className="text-sm">
                {pinStatus.is_valid ? (
                  <span className="text-green-600">Active until {new Date(pinStatus.expires_at).toLocaleString()}</span>
                ) : (
                  <span className="text-red-600">No active PIN</span>
                )}
              </p>
              {pinStatus.delivery_status && (
                <p className="text-sm text-gray-500 mt-1">
                  Delivery Status: {pinStatus.delivery_status}
                </p>
              )}
            </div>
          )}

          {/* PIN Verification */}
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium">Verify Emergency PIN</label>
            <div className="flex gap-2">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                className="px-3 py-2 border rounded-md w-48 text-sm"
              />
              <Button onClick={() => setShowPin(!showPin)} variant="outline">
                {showPin ? 'Hide' : 'Show'}
              </Button>
              <Button onClick={verifyPin}>Verify</Button>
            </div>
          </div>

          {/* Reset PIN Button */}
          <Button onClick={resetPin} variant="outline" className="mt-4">
            Reset PIN
          </Button>
        </div>

        {/* Critical Health Information Card */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-medium">Critical Health Information</h3>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Information'}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Blood Type</label>
                  <input
                    type="text"
                    value={criticalInfo.bloodType}
                    onChange={(e) => setCriticalInfo({ ...criticalInfo, bloodType: e.target.value })}
                    className="py-2 px-3 border rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Weight</label>
                  <input
                    type="text"
                    value={criticalInfo.weight}
                    onChange={(e) => setCriticalInfo({ ...criticalInfo, weight: e.target.value })}
                    className="py-2 px-3 border rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Height</label>
                  <input
                    type="text"
                    value={criticalInfo.height}
                    onChange={(e) => setCriticalInfo({ ...criticalInfo, height: e.target.value })}
                    className="py-2 px-3 border rounded-md w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Allergies</label>
                  <textarea
                    value={criticalInfo.allergies}
                    onChange={(e) => setCriticalInfo({ ...criticalInfo, allergies: e.target.value })}
                    className="py-2 px-3 border rounded-md w-full h-20"
                    placeholder="List any allergies..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Current Medications</label>
                  <textarea
                    value={criticalInfo.medications}
                    onChange={(e) => setCriticalInfo({ ...criticalInfo, medications: e.target.value })}
                    className="py-2 px-3 border rounded-md w-full h-20"
                    placeholder="List current medications and dosages..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Chronic Conditions</label>
                  <textarea
                    value={criticalInfo.conditions}
                    onChange={(e) => setCriticalInfo({ ...criticalInfo, conditions: e.target.value })}
                    className="py-2 px-3 border rounded-md w-full h-20"
                    placeholder="List any chronic conditions..."
                  />
                </div>
              </div>

              <Button onClick={saveChanges} className="w-full">Save Changes</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-500">Blood Type:</span> {criticalInfo.bloodType || 'Not specified'}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Weight:</span> {criticalInfo.weight || 'Not specified'}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Height:</span> {criticalInfo.height || 'Not specified'}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Medical Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-500">Allergies:</span> {criticalInfo.allergies || 'None listed'}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Medications:</span> {criticalInfo.medications || 'None listed'}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Conditions:</span> {criticalInfo.conditions || 'None listed'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="border rounded-lg p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">Emergency Contacts</h2>
              <p className="text-gray-500">People who should be contacted in an emergency</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                addContact({
                  name: '',
                  relationship: '',
                  phone: '',
                  email: ''
                });
              }}
            >
              Add Contact
            </Button>
          </div>

          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-gray-500">Relationship: {contact.relationship}</p>
                    <p className="text-sm text-gray-500">Phone: {contact.phone}</p>
                    <p className="text-sm text-gray-500">Email: {contact.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const newContacts = [...contacts];
                      newContacts.splice(index, 1);
                      setContacts(newContacts);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
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
      </div>
    </div>
  );
};

export default EmergencyAccess; 