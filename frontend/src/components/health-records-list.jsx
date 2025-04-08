import { FileText, Download, Share2, Trash2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/card";

export function HealthRecordsList() {
  const records = [
    {
      id: 1,
      title: "Annual Physical Examination",
      date: "March 15, 2024",
      doctor: "Dr. Sarah Smith",
      type: "General Checkup",
      status: "Complete"
    },
    {
      id: 2,
      title: "Blood Test Results",
      date: "March 10, 2024",
      doctor: "Dr. Michael Johnson",
      type: "Laboratory",
      status: "Complete"
    },
    {
      id: 3,
      title: "COVID-19 Vaccination",
      date: "January 5, 2024",
      doctor: "Dr. Emily Brown",
      type: "Immunization",
      status: "Complete"
    },
    {
      id: 4,
      title: "Dental Checkup",
      date: "February 20, 2024",
      doctor: "Dr. Robert Wilson",
      type: "Dental",
      status: "Complete"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Recent Records</h2>
          <p className="text-sm text-gray-500">View and manage your health records</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Add New Record
        </Button>
      </div>

      <div className="grid gap-4">
        {records.map((record) => (
          <Card key={record.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{record.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {record.doctor} • {record.date}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {record.type}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {record.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 