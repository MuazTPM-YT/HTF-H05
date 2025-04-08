import React from 'react';
import { Key, Shield, Clock, RefreshCw, Eye, EyeOff, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/switch';

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-gray-500">Manage your encryption keys and security preferences</p>
      </div>

      {/* Blockchain Security Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Blockchain Security</h2>
          <p className="text-gray-500 text-sm">Manage your encryption keys and security settings</p>
        </div>

        {/* Encryption Keys Card */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-medium">Encryption Keys</h3>
          </div>
          <p className="text-sm text-gray-500">Your private key is used to encrypt and decrypt your health records</p>

          {/* Public Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Public Key (Ethereum Address)</label>
            <div className="flex">
              <input
                type="text"
                value="0x71c7656EC7ab88b098dfc8f875d6ad8"
                readOnly
                className="flex-1 px-3 py-2 border rounded-l-md text-sm bg-gray-50"
              />
              <button className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md">
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Private Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Private Key</label>
            <div className="flex">
              <input
                type="password"
                value="••••••••••••••••••••••••••••••••••••••••••••••••••••"
                readOnly
                className="flex-1 px-3 py-2 border rounded-l-md text-sm bg-gray-50"
              />
              <button className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md">
                <Eye className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-500">Never share your private key with anyone. It gives full access to your health records.</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="text-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Backup Keys
            </Button>
            <Button className="text-sm bg-blue-600 text-white hover:bg-blue-700">
              <Key className="h-4 w-4 mr-2" />
              Generate New Keys
            </Button>
          </div>
        </div>

        {/* Security Settings Card */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-medium">Security Settings</h3>
          </div>
          <p className="text-sm text-gray-500">Configure additional security measures for your account</p>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Require a verification code when logging in</p>
            </div>
            <Switch />
          </div>

          {/* Mobile Authentication App */}
          <div className="pl-6 py-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 border rounded h-10 w-8 flex items-center justify-center">
                <Phone className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium">Mobile Authentication App</h4>
                <p className="text-sm text-gray-500">Use an authentication app like Google Authenticator or Authy</p>
                <Button variant="outline" className="mt-2 text-xs h-8">Setup</Button>
              </div>
            </div>
          </div>

          {/* Security Notifications */}
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h4 className="font-medium">Security Notifications</h4>
              <p className="text-sm text-gray-500">Get notified about important security events</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        {/* Recent Access Logs */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-medium">Recent Access Logs</h3>
          </div>
          <p className="text-sm text-gray-500">Review recent access to your health records</p>

          {/* Logs Table */}
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Date & Time</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Action</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">User</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">IP Address</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 px-4">10/15/2023, 2:30:00 PM</td>
                  <td className="py-2 px-4">Record Access</td>
                  <td className="py-2 px-4">Dr. Sarah Johnson</td>
                  <td className="py-2 px-4">192.168.1.1</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Authorized
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4">10/14/2023, 9:15:00 AM</td>
                  <td className="py-2 px-4">Login</td>
                  <td className="py-2 px-4">You</td>
                  <td className="py-2 px-4">192.168.1.100</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Authorized
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4">10/10/2023, 4:45:00 PM</td>
                  <td className="py-2 px-4">Record Update</td>
                  <td className="py-2 px-4">Central Hospital</td>
                  <td className="py-2 px-4">192.168.2.50</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Authorized
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4">10/5/2023, 11:20:00 AM</td>
                  <td className="py-2 px-4">Login Attempt</td>
                  <td className="py-2 px-4">Unknown</td>
                  <td className="py-2 px-4">203.0.113.42</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Blocked
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Button variant="outline" className="text-sm w-full">View Full Access History</Button>
        </div>

        {/* Security Best Practices */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-500 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-amber-800">Security Best Practices</h3>
              <ul className="mt-2 space-y-2 text-amber-700 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  Never share your private key with anyone
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  Enable two-factor authentication for additional security
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  Regularly review access logs for unauthorized activity
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  Backup your encryption keys in a secure location
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 