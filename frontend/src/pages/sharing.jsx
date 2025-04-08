import React, { useState } from 'react';
import { Search, UserPlus, Clock, ShieldCheck, MoreVertical, Filter, X, CheckCircle, AlertCircle, AlertTriangle, Calendar } from 'lucide-react';

const SharingControls = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  const sharedUsers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      type: 'Doctor',
      specialty: 'Cardiologist',
      hospital: 'City Hospital',
      date: '15 May 2023',
      status: 'active',
      expiresIn: '30 days',
      accessLevel: 'Full access',
      records: ['Medical History', 'Prescriptions', 'Lab Results', 'Vital Records']
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      type: 'Doctor',
      specialty: 'Dermatologist',
      hospital: 'Skin Care Clinic',
      date: '10 April 2023',
      status: 'active',
      expiresIn: '15 days',
      accessLevel: 'Limited access',
      records: ['Medical History', 'Dermatology Records']
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      type: 'Doctor',
      specialty: 'Neurologist',
      hospital: 'Neurology Associates',
      date: '22 March 2023',
      status: 'active',
      expiresIn: '5 days',
      accessLevel: 'Full access',
      records: ['Medical History', 'Prescriptions', 'Lab Results', 'MRI Scans']
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      type: 'Doctor',
      specialty: 'Orthopedist',
      hospital: 'Sports Medicine Clinic',
      date: '5 June 2023',
      status: 'pending',
      expiresIn: null,
      accessLevel: 'Limited access',
      records: ['X-Rays', 'Physical Therapy Notes']
    },
    {
      id: 5,
      name: 'Westside Medical Group',
      type: 'Organization',
      specialty: 'General Practice',
      hospital: null,
      date: '18 January 2023',
      status: 'expired',
      expiresIn: null,
      accessLevel: 'Limited access',
      records: ['Medical History', 'Prescriptions']
    },
    {
      id: 6,
      name: 'Dr. Priya Sharma',
      type: 'Doctor',
      specialty: 'General Physician',
      hospital: 'Family Health Center',
      date: '20 February 2023',
      status: 'pending',
      expiresIn: null,
      accessLevel: 'Full access',
      records: ['Medical History', 'Prescriptions', 'Lab Results', 'Vital Records']
    },
    {
      id: 7,
      name: 'National Research Hospital',
      type: 'Organization',
      specialty: 'Research',
      hospital: null,
      date: '12 December 2022',
      status: 'expired',
      expiresIn: null,
      accessLevel: 'Limited access',
      records: ['Anonymized Medical History']
    }
  ];

  // Filter based on active tab and search term
  const filteredUsers = sharedUsers.filter(user => {
    const matchesTab =
      (activeTab === 'active' && user.status === 'active') ||
      (activeTab === 'pending' && user.status === 'pending') ||
      (activeTab === 'expired' && user.status === 'expired') ||
      activeTab === 'all';

    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Handle sharing approval/denial
  const handleApprove = (id) => {
    alert(`Approved sharing request with ID: ${id}`);
    // Would update the user status to 'active' in a real app
  };

  const handleDeny = (id) => {
    alert(`Denied sharing request with ID: ${id}`);
    // Would remove the pending request in a real app
  };

  // Handle revoking access
  const handleRevokeAccess = (id) => {
    const confirmed = window.confirm("Are you sure you want to revoke access? This action cannot be undone.");
    if (confirmed) {
      alert(`Access revoked for ID: ${id}`);
      // Would update the user status to 'expired' in a real app
    }
  };

  // Handle extending access
  const handleExtendAccess = (id) => {
    alert(`Extended access for ID: ${id} by 30 days`);
    // Would update the expiry date in a real app
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'expired':
        return <X className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sharing Controls</h1>
          <p className="text-gray-500">Manage who can access your health records</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors">
          <UserPlus className="h-4 w-4" />
          <span>Share Records</span>
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="border-b p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Tab navigation */}
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {['active', 'pending', 'expired', 'all'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            {/* Search bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, type, or specialty..."
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter dropdown would go here in a real app */}
            <button className="flex items-center gap-1 text-gray-700 px-3 py-2 border rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Sharing list */}
        <div className="p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-gray-50 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No records shared</h3>
              <p className="text-gray-500 mt-1">
                {activeTab === 'pending'
                  ? "You don't have any pending share requests."
                  : activeTab === 'expired'
                    ? "You don't have any expired shares."
                    : "You haven't shared your records with anyone yet."}
              </p>
              {activeTab !== 'pending' && activeTab !== 'expired' && (
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Share Your Records
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* User info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getStatusBadge(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                        <span>{user.type}</span>
                        {user.specialty && <span>• {user.specialty}</span>}
                        {user.hospital && <span>• {user.hospital}</span>}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.records.map((record, idx) => (
                          <span key={idx} className="inline-block text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-1">
                            {record}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status and actions */}
                    <div className="flex flex-col gap-2 md:items-end md:min-w-[200px]">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Shared: {user.date}</span>
                      </div>

                      {user.status === 'active' && user.expiresIn && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Expires in: {user.expiresIn}</span>
                        </div>
                      )}

                      {user.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleDeny(user.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm flex items-center gap-1"
                          >
                            <X className="h-3 w-3" />
                            <span>Deny</span>
                          </button>
                        </div>
                      )}

                      {user.status === 'active' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleExtendAccess(user.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            Extend
                          </button>
                          <button
                            onClick={() => handleRevokeAccess(user.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                          >
                            Revoke
                          </button>
                        </div>
                      )}

                      {user.status === 'expired' && (
                        <button
                          onClick={() => handleExtendAccess(user.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm mt-2"
                        >
                          Re-Enable Access
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Information About Sharing</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                When you share your health records, you grant access to potentially sensitive information.
                Always verify the recipient before sharing, and regularly review who has access to your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharingControls; 