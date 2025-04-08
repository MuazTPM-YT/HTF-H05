import React from 'react';
import { Search, Filter, MoreVertical, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';

const HealthRecords = () => {
  // Sample data for health records
  const records = [
    {
      id: 1,
      type: 'Lab Results',
      provider: 'City Hospital',
      date: '10/15/2023',
      category: 'Blood Work',
      status: 'Verified'
    },
    {
      id: 2,
      type: 'Prescription',
      provider: 'Dr. Smith',
      date: '9/22/2023',
      category: 'Medication',
      status: 'Active'
    },
    {
      id: 3,
      type: 'Imaging',
      provider: 'Medical Imaging Center',
      date: '8/5/2023',
      category: 'X-Ray',
      status: 'Verified'
    },
    {
      id: 4,
      type: 'Visit Summary',
      provider: 'Urgent Care',
      date: '7/12/2023',
      category: 'Consultation',
      status: 'Verified'
    },
    {
      id: 5,
      type: 'Vaccination',
      provider: 'Community Clinic',
      date: '6/30/2023',
      category: 'Immunization',
      status: 'Verified'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Health Records</h1>
        <p className="text-gray-500">View and manage your complete health history</p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search records..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Records Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="py-3 px-4 text-left font-medium">Type</th>
              <th className="py-3 px-4 text-left font-medium">Provider</th>
              <th className="py-3 px-4 text-left font-medium">Date</th>
              <th className="py-3 px-4 text-left font-medium">Category</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>{record.type}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{record.provider}</td>
                <td className="py-3 px-4">{record.date}</td>
                <td className="py-3 px-4">{record.category}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.status === 'Verified' 
                      ? 'bg-green-100 text-green-800' 
                      : record.status === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HealthRecords; 