import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Lock, 
  Globe, 
  PencilLine, 
  Download, 
  Trash2, 
  LogOut, 
  Moon, 
  Sun, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  Smartphone,
  Save,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  // State management for settings
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    marketing: false
  });
  
  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: true,
    sessionTimeout: '30',
    loginNotifications: true
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'contacts',
    dataSharing: true,
    anonymousAnalytics: true
  });
  
  const [appearance, setAppearance] = useState({
    theme: 'light',
    reducedMotion: false
  });

  const [dataManagement, setDataManagement] = useState({
    autoBackup: true,
    backupFrequency: 'weekly'
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
    showNew: false
  });

  // Handle notification toggle
  const handleNotificationToggle = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type]
    });
    
    // Simulate saving to backend
    setTimeout(() => {
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${!notifications[type] ? 'enabled' : 'disabled'}`);
    }, 300);
  };

  // Handle security settings toggle
  const handleSecurityToggle = (type) => {
    setSecurity({
      ...security,
      [type]: !security[type]
    });
    
    // Show confirmation for security settings
    setTimeout(() => {
      alert(`${type === 'twoFactor' ? 'Two-factor authentication' : type === 'biometric' ? 'Biometric authentication' : 'Login notifications'} ${!security[type] ? 'enabled' : 'disabled'}`);
    }, 300);
  };

  // Handle timeout selection
  const handleSessionTimeoutChange = (e) => {
    setSecurity({
      ...security,
      sessionTimeout: e.target.value
    });
  };

  // Handle privacy settings toggle
  const handlePrivacyToggle = (type) => {
    setPrivacy({
      ...privacy,
      [type]: !privacy[type]
    });
  };

  // Handle profile visibility change
  const handleVisibilityChange = (value) => {
    setPrivacy({
      ...privacy,
      profileVisibility: value
    });
  };

  // Handle appearance settings
  const handleAppearanceChange = (setting, value) => {
    setAppearance({
      ...appearance,
      [setting]: value
    });
    
    if (setting === 'theme') {
      // Would actually change the app theme here
      document.documentElement.classList.toggle('dark', value === 'dark');
    }
  };

  // Handle data management settings
  const handleDataSettingChange = (setting, value) => {
    setDataManagement({
      ...dataManagement,
      [setting]: typeof value === 'boolean' ? value : value.target.value
    });
  };

  // Handle password change
  const handlePasswordChange = (field, value) => {
    setPassword({
      ...password,
      [field]: value
    });
  };

  // Submit password change
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!password.current) {
      alert('Please enter your current password');
      return;
    }
    
    if (password.new !== password.confirm) {
      alert('New passwords do not match');
      return;
    }
    
    if (password.new.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    
    // Simulated password change
    alert('Password changed successfully!');
    
    // Clear form
    setPassword({
      current: '',
      new: '',
      confirm: '',
      showNew: false
    });
  };

  // Handle account deletion request
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.'
    );
    
    if (confirmDelete) {
      alert('Account deletion request submitted. You will receive a confirmation email.');
    }
  };

  // Handle data export
  const handleExportData = () => {
    alert('Your data export has been initiated. You will receive a download link via email when ready.');
  };

  // Handle logout
  const handleLogout = () => {
    alert('You have been logged out successfully.');
    // In a real app, this would redirect to login page
    // window.location.href = '/login';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and settings</p>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive updates and alerts via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notifications.email}
                onChange={() => handleNotificationToggle('email')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SMS Notifications</h3>
              <p className="text-sm text-gray-500">Receive updates and alerts via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notifications.sms}
                onChange={() => handleNotificationToggle('sms')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Push Notifications</h3>
              <p className="text-sm text-gray-500">Receive updates and alerts via mobile push</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notifications.push}
                onChange={() => handleNotificationToggle('push')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing Communications</h3>
              <p className="text-sm text-gray-500">Receive product updates and health tips</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notifications.marketing}
                onChange={() => handleNotificationToggle('marketing')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={security.twoFactor}
                onChange={() => handleSecurityToggle('twoFactor')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Biometric Authentication</h3>
              <p className="text-sm text-gray-500">Use Face ID or fingerprint to secure your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={security.biometric}
                onChange={() => handleSecurityToggle('biometric')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Session Timeout</h3>
              <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
            </div>
            <select 
              value={security.sessionTimeout}
              onChange={handleSessionTimeoutChange}
              className="rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="never">Never</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Login Notifications</h3>
              <p className="text-sm text-gray-500">Get notified of new device logins</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={security.loginNotifications}
                onChange={() => handleSecurityToggle('loginNotifications')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {/* Password Change Form */}
          <div className="border-t pt-4 mt-6">
            <h3 className="font-medium mb-3">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={password.current}
                  onChange={(e) => handlePasswordChange('current', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input 
                    type={password.showNew ? "text" : "password"} 
                    value={password.new}
                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md pr-10"
                    placeholder="Enter new password"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => handlePasswordChange('showNew', !password.showNew)}
                  >
                    {password.showNew ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={password.confirm}
                  onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Confirm new password"
                />
              </div>
              
              <div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold">Privacy</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Profile Visibility</h3>
            <p className="text-sm text-gray-500 mb-3">Control who can see your profile information</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="visibility-public" 
                  name="visibility"
                  checked={privacy.profileVisibility === 'public'}
                  onChange={() => handleVisibilityChange('public')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="visibility-public" className="ml-2 text-sm font-medium text-gray-700">
                  Public (Anyone can view)
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="visibility-contacts" 
                  name="visibility"
                  checked={privacy.profileVisibility === 'contacts'}
                  onChange={() => handleVisibilityChange('contacts')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="visibility-contacts" className="ml-2 text-sm font-medium text-gray-700">
                  Contacts Only (Only shared providers can view)
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="visibility-private" 
                  name="visibility"
                  checked={privacy.profileVisibility === 'private'}
                  onChange={() => handleVisibilityChange('private')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="visibility-private" className="ml-2 text-sm font-medium text-gray-700">
                  Private (Only you can view)
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Data Sharing</h3>
              <p className="text-sm text-gray-500">Allow sharing of aggregated health data for research</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={privacy.dataSharing}
                onChange={() => handlePrivacyToggle('dataSharing')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Anonymous Analytics</h3>
              <p className="text-sm text-gray-500">Help improve our service with anonymous usage data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={privacy.anonymousAnalytics}
                onChange={() => handlePrivacyToggle('anonymousAnalytics')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <PencilLine className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-medium mb-3">Theme</h3>
            <div className="flex gap-4">
              <label className={`relative flex flex-col items-center gap-2 cursor-pointer p-3 rounded-lg border ${appearance.theme === 'light' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                <input 
                  type="radio" 
                  name="theme" 
                  className="sr-only" 
                  value="light"
                  checked={appearance.theme === 'light'}
                  onChange={() => handleAppearanceChange('theme', 'light')}
                />
                <div className="w-12 h-12 rounded-full bg-white border flex items-center justify-center">
                  <Sun className="h-6 w-6 text-amber-500" />
                </div>
                <span className="text-sm font-medium">Light</span>
                {appearance.theme === 'light' && (
                  <div className="absolute top-2 right-2 text-blue-500">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </label>
              
              <label className={`relative flex flex-col items-center gap-2 cursor-pointer p-3 rounded-lg border ${appearance.theme === 'dark' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                <input 
                  type="radio" 
                  name="theme" 
                  className="sr-only" 
                  value="dark"
                  checked={appearance.theme === 'dark'}
                  onChange={() => handleAppearanceChange('theme', 'dark')}
                />
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                  <Moon className="h-6 w-6 text-amber-300" />
                </div>
                <span className="text-sm font-medium">Dark</span>
                {appearance.theme === 'dark' && (
                  <div className="absolute top-2 right-2 text-blue-500">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Reduced Motion</h3>
              <p className="text-sm text-gray-500">Minimize animations and transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={appearance.reducedMotion}
                onChange={() => handleAppearanceChange('reducedMotion', !appearance.reducedMotion)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold">Data Management</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Automatic Backup</h3>
              <p className="text-sm text-gray-500">Regularly back up your health data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={dataManagement.autoBackup}
                onChange={() => handleDataSettingChange('autoBackup', !dataManagement.autoBackup)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {dataManagement.autoBackup && (
            <div className="flex items-center justify-between pl-6">
              <div>
                <h3 className="font-medium">Backup Frequency</h3>
                <p className="text-sm text-gray-500">How often to back up your data</p>
              </div>
              <select 
                value={dataManagement.backupFrequency}
                onChange={(e) => handleDataSettingChange('backupFrequency', e)}
                className="rounded-md border border-gray-300 p-2 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t space-y-3">
            <button 
              onClick={handleExportData}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Download size={16} />
              <span>Export All Health Data</span>
            </button>
            
            {/* Danger Zone */}
            <div className="rounded-lg border border-red-100 bg-red-50 p-4 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-red-700">Danger Zone</h3>
              </div>
              <p className="text-sm text-red-600 mb-4">
                The following actions are irreversible. Please proceed with caution.
              </p>
              <button 
                onClick={handleDeleteAccount}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
              >
                <Trash2 size={16} />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="flex justify-between mt-8">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
        
        <button 
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => {
            alert('Settings saved successfully!');
          }}
        >
          <Save size={16} />
          <span>Save All Changes</span>
        </button>
      </div>
    </div>
  );
};

export default Settings; 