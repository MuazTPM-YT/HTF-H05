import React from 'react';
import { AlertTriangle, MoreVertical, RefreshCw, Trash2, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

const SharingControls = () => {
  // Sample data for sharing permissions
  const sharingPermissions = [
    {
      id: 1,
      recipient: 'Dr. Sarah Johnson',
      type: 'Healthcare Provider',
      accessLevel: 'Full Medical History',
      expires: '12/31/2023',
      status: 'Active'
    },
    {
      id: 2,
      recipient: 'Central Hospital',
      type: 'Organization',
      accessLevel: 'Lab Results Only',
      expires: '11/15/2023',
      status: 'Active'
    },
    {
      id: 3,
      recipient: 'Dr. Michael Chen',
      type: 'Specialist',
      accessLevel: 'Cardiology Records',
      expires: '10/30/2023',
      status: 'Expired'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sharing Controls</h1>
        <p className="text-gray-500">Manage who can access your health information and for how long</p>
      </div>

      {/* Active Sharing Permissions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Active Sharing Permissions</h2>
            <p className="text-sm text-gray-500">Manage who has access to your health records</p>
          </div>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Users className="h-4 w-4 mr-2" />
            Grant Access
          </Button>
        </div>

        {/* Sharing Table */}
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700 text-sm">
              <tr>
                <th className="py-3 px-4 text-left font-medium">Recipient</th>
                <th className="py-3 px-4 text-left font-medium">Type</th>
                <th className="py-3 px-4 text-left font-medium">Access Level</th>
                <th className="py-3 px-4 text-left font-medium">Expires</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sharingPermissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{permission.recipient}</td>
                  <td className="py-3 px-4">{permission.type}</td>
                  <td className="py-3 px-4">{permission.accessLevel}</td>
                  <td className="py-3 px-4">{permission.expires}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-2 ${
                        permission.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></span>
                      {permission.status}
                    </div>
                  </td>
                  <td className="py-3 px-4 flex justify-end gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <RefreshCw className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Encryption Notice */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              All data sharing is encrypted end-to-end and requires your private key for decryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharingControls; 