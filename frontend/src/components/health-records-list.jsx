import { useEffect, useState } from "react";
import { FileText, Download, Share2, Trash2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/card";
import healthRecordService from "../services/health-record-service";
import { useToast } from "../hooks/use-toast";
import AddRecordModal from "./dashboard/AddRecordModal";

export function HealthRecordsList() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const fetchedRecords = await healthRecordService.getRecords();

      // Format records for display - limit to 4 most recent
      const recentRecords = fetchedRecords.slice(0, 4).map((record, index) => ({
        id: record.id || index + 1,
        title: record.name || `Health Record ${index + 1}`,
        date: record.date ? new Date(record.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : "March 15, 2024",
        doctor: record.provider || ["Dr. Sarah Smith", "Dr. Michael Johnson", "Dr. Emily Brown", "Dr. Robert Wilson"][index % 4],
        type: record.type || ["General Checkup", "Laboratory", "Immunization", "Dental"][index % 4],
        status: "Complete"
      }));

      setRecords(recentRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast({
        title: 'Error',
        description: 'Failed to load health records',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await healthRecordService.deleteRecord(id);
      await fetchRecords();
      toast({
        title: 'Record Deleted',
        description: 'Health record has been deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete health record',
        variant: 'destructive'
      });
    }
  };

  const handleRecordAdded = async () => {
    await fetchRecords();
    toast({
      title: 'Record Added',
      description: 'Your health record has been added successfully'
    });
  };

  const handleShare = () => {
    // In a real app, this would open a sharing dialog
    toast({
      title: 'Share Feature',
      description: 'Sharing functionality would be implemented here'
    });
  };

  const handleDownload = () => {
    // In a real app, this would download the record
    toast({
      title: 'Download Started',
      description: 'Your record is being prepared for download'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Recent Records</h2>
          <p className="text-sm text-gray-500">View and manage your health records</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <FileText className="w-4 h-4 mr-2" />
          Add New Record
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading records...</span>
        </div>
      ) : records.length > 0 ? (
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-medium">No records found</h3>
          <p className="mt-1 text-gray-500">Add your first health record to get started</p>
          <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
            Add New Record
          </Button>
        </div>
      )}

      {/* View all records link - only show if there are records */}
      {records.length > 0 && (
        <div className="text-center pt-2">
          <Button variant="outline" onClick={() => window.location.href = '/health-records'}>
            View All Records
          </Button>
        </div>
      )}

      {/* Add Record Modal */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleRecordAdded}
      />
    </div>
  );
} 