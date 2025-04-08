import React from 'react';
import { Key, ShieldCheck, History, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-gray-500">Manage your encryption keys and security preferences</p>
      </div>

      {/* Blockchain Security */}
      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="text-xl font-semibold">Blockchain Security</h2>
        <p className="text-gray-500">Manage your encryption keys and security settings</p>
        
        <div className="border rounded-lg p-5 mt-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Key className="h-5 w-5" />
                Encryption Keys
              </h3>
              <p className="text-gray-500 text-sm">Your private key is used to encrypt and decrypt your health records</p>
            </div>
            <Button variant="outline">Generate New Keys</Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Public Key (Ethereum Address)</label>
              <div className="flex">
                <input 
                  type="text" 
                  value="0x71c7656EC7ab88b098dFb751B8b65d8b6E8926F" 
                  readOnly
                  className="py-2 px-3 border rounded-md w-full bg-gray-50"
                />
                <Button variant="ghost" className="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Private Key</label>
              <div className="flex">
                <input 
                  type="password" 
                  value="••••••••••••••••••••••••••••••••••••••••••••••••••••" 
                  readOnly
                  className="py-2 px-3 border rounded-md w-full bg-gray-50"
                />
                <Button variant="ghost" className="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </Button>
              </div>
              <p className="text-sm mt-1 text-gray-500">Never share your private key with anyone. It gives full access to your health records.</p>
            </div>
            
            <Button variant="outline" className="mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Backup Keys
            </Button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
            <p className="text-gray-500">Require a verification code when logging in</p>
          </div>
          <div className="relative inline-block w-12 h-6">
            <input type="checkbox" id="toggle-2fa" className="opacity-0 w-0 h-0" />
            <label htmlFor="toggle-2fa" className="block absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all checked:before:translate-x-6 checked:bg-blue-600"></label>
          </div>
        </div>

        <div className="ml-6 border-l-2 border-gray-200 pl-4 py-2">
          <div className="flex items-start gap-3">
            <div className="w-7 h-12 bg-gray-100 rounded flex items-center justify-center border">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12" y2="18"></line>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Mobile Authentication App</h3>
              <p className="text-sm text-gray-500">Use an authentication app like Google Authenticator or Authy</p>
              <Button variant="outline" size="sm" className="mt-2">Setup</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notifications */}
      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Security Notifications</h2>
            <p className="text-gray-500">Get notified about important security events</p>
          </div>
          <div className="relative inline-block w-12 h-6">
            <input type="checkbox" id="toggle-notifications" className="opacity-0 w-0 h-0" defaultChecked />
            <label htmlFor="toggle-notifications" className="block absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-blue-600 rounded-full before:absolute before:h-4 before:w-4 before:left-[calc(100%-20px)] before:bottom-1 before:bg-white before:rounded-full before:transition-all"></label>
          </div>
        </div>
      </div>

      {/* Recent Access Logs */}
      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Access Logs
            </h2>
            <p className="text-gray-500">Review recent access to your health records</p>
          </div>
          <Button variant="outline">View Full Access History</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-sm text-gray-700">
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date & Time</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">IP Address</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-3 px-4">10/15/2023, 2:30:00 PM</td>
                <td className="py-3 px-4">Record Access</td>
                <td className="py-3 px-4">Dr. Sarah Johnson</td>
                <td className="py-3 px-4">192.168.1.1</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Authorized</span></td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">10/14/2023, 9:15:00 AM</td>
                <td className="py-3 px-4">Login</td>
                <td className="py-3 px-4">You</td>
                <td className="py-3 px-4">192.168.1.100</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Authorized</span></td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">10/10/2023, 4:45:00 PM</td>
                <td className="py-3 px-4">Record Update</td>
                <td className="py-3 px-4">Central Hospital</td>
                <td className="py-3 px-4">192.168.2.50</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Authorized</span></td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">10/5/2023, 11:20:00 AM</td>
                <td className="py-3 px-4">Login Attempt</td>
                <td className="py-3 px-4">Unknown</td>
                <td className="py-3 px-4">203.0.113.42</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Blocked</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="border rounded-lg p-5 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">Security Best Practices</h2>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-yellow-800">
              <li>Never share your private key with anyone</li>
              <li>Enable two-factor authentication for additional security</li>
              <li>Regularly review access logs for unauthorized activity</li>
              <li>Backup your encryption keys in a secure location</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 