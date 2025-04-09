import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, FileText, Download, Share2, Trash2, ChevronDown, Check, Mail, ShieldAlert, AlertTriangle, AlertCircle, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import healthRecordService from '../../services/health-record-service';
import { useToast } from '../../hooks/use-toast';
import AddRecordModal from '../../components/dashboard/AddRecordModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Loader2 } from "lucide-react";

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    lab: false,
    imaging: false,
    prescription: false,
    vaccination: false,
    visit: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [fraudAnalysisData, setFraudAnalysisData] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const { toast } = useToast();

  // Load records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  // Filter records when search term or filters change
  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, activeFilters]);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const fetchedRecords = await healthRecordService.getRecords();

      // Format records for display
      const formattedRecords = fetchedRecords.map((record, index) => ({
        id: record.id || `record-${index + 1}`,
        name: record.name || `Health Record ${index + 1}`,
        date: record.date ? new Date(record.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : "March 15, 2024",
        provider: record.provider || ["Dr. Sarah Smith", "Dr. Michael Johnson", "Dr. Emily Brown", "Dr. Robert Wilson"][index % 4],
        type: record.type || ["Lab Test", "Imaging", "Prescription", "Vaccination", "Visit Summary"][index % 5],
        status: record.status || "Complete",
        fraud_analysis: record.fraud_analysis || null
      }));

      setRecords(formattedRecords);
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

  const filterRecords = () => {
    let filtered = [...records];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.name.toLowerCase().includes(term) ||
        record.provider.toLowerCase().includes(term) ||
        record.type.toLowerCase().includes(term)
      );
    }

    // Filter by record type
    const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
    if (activeFilterCount > 0) {
      filtered = filtered.filter(record => {
        const type = record.type.toLowerCase();
        return (
          (activeFilters.lab && type.includes("lab")) ||
          (activeFilters.imaging && type.includes("imaging")) ||
          (activeFilters.prescription && type.includes("prescription")) ||
          (activeFilters.vaccination && type.includes("vaccination")) ||
          (activeFilters.visit && type.includes("visit"))
        );
      });
    }

    setFilteredRecords(filtered);
  };

  const handleRecordAdded = async () => {
    await fetchRecords();
    toast({
      title: 'Success',
      description: 'Your health record has been added successfully'
    });
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

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

  const handleShare = (recordId) => {
    setSelectedRecordId(recordId);
    setShareEmail('');
    setIsShareModalOpen(true);
  };

  const handleSubmitShare = async (e) => {
    e.preventDefault();

    if (!shareEmail || !shareEmail.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    setIsSharing(true);
    try {
      await healthRecordService.shareRecord(selectedRecordId, shareEmail);
      toast({
        title: 'Record Shared',
        description: `Health record has been shared with ${shareEmail}`
      });
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Error sharing record:', error);
      toast({
        title: 'Error',
        description: 'Failed to share health record',
        variant: 'destructive'
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleViewFraudAnalysis = async (recordId) => {
    setIsLoadingAnalysis(true);
    setSelectedRecordId(recordId);

    try {
      const analysisData = await healthRecordService.getFraudAnalysis(recordId);
      setFraudAnalysisData(analysisData);
      setIsAnalysisModalOpen(true);
    } catch (error) {
      console.error('Error getting fraud analysis:', error);
      toast({
        title: 'Error',
        description: 'Failed to load fraud analysis',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleDownload = async (recordId) => {
    try {
      await healthRecordService.downloadRecord(recordId);
      toast({
        title: 'Download Started',
        description: 'Your record is being downloaded'
      });
    } catch (error) {
      console.error('Error downloading record:', error);
      toast({
        title: 'Error',
        description: 'Failed to download health record',
        variant: 'destructive'
      });
    }
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Get fraud badge display based on analysis status
  const getFraudBadge = (record) => {
    // No analysis available
    if (!record.fraud_analysis) return null;

    // Analysis is pending
    if (record.fraud_analysis.status === 'pending') {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <AlertCircle className="w-3 h-3" />
          <span>Analyzing</span>
        </div>
      );
    }

    // Analysis is complete - check for fraud
    if (record.fraud_analysis.is_fraud) {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); handleViewFraudAnalysis(record.id); }}>
          <AlertTriangle className="w-3 h-3" />
          <span>Suspicious</span>
        </div>
      );
    }

    // Risk assessment - for completed non-fraud cases
    const riskLevel = record.fraud_analysis.risk_level;
    if (riskLevel === 'medium') {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); handleViewFraudAnalysis(record.id); }}>
          <ShieldAlert className="w-3 h-3" />
          <span>Medium Risk</span>
        </div>
      );
    }

    // Low risk or verified
    return (
      <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-pointer"
        onClick={(e) => { e.stopPropagation(); handleViewFraudAnalysis(record.id); }}>
        <Shield className="w-3 h-3" />
        <span>Verified</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health Records</h1>
          <p className="text-muted-foreground">
            View and manage all your medical records in one place
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Add New Record
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {Object.values(activeFilters).filter(Boolean).length > 0 && (
                <span className="ml-1 rounded-full bg-primary w-2 h-2" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuCheckboxItem
              checked={activeFilters.lab}
              onCheckedChange={() => toggleFilter('lab')}
            >
              Lab Tests
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.imaging}
              onCheckedChange={() => toggleFilter('imaging')}
            >
              Imaging
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.prescription}
              onCheckedChange={() => toggleFilter('prescription')}
            >
              Prescriptions
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.vaccination}
              onCheckedChange={() => toggleFilter('vaccination')}
            >
              Vaccinations
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.visit}
              onCheckedChange={() => toggleFilter('visit')}
            >
              Visit Summaries
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No records found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || Object.values(activeFilters).some(Boolean)
              ? 'Try adjusting your search or filters'
              : 'Add your first health record to get started'}
          </p>
          {!searchTerm && !Object.values(activeFilters).some(Boolean) && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4"
            >
              Add Record
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Security</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.provider}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {record.status === 'Complete' ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          <span>Complete</span>
                        </>
                      ) : record.status === 'Processing' ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          <span>Processing</span>
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-gray-300" />
                          <span>Pending</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getFraudBadge(record)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(record.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(record.id)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        {record.fraud_analysis && (
                          <DropdownMenuItem onClick={() => handleViewFraudAnalysis(record.id)}>
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            View Analysis
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Record Modal */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleRecordAdded}
      />

      {/* Share Record Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Health Record</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to share this record with
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitShare}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Recipient Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="doctor@hospital.com"
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsShareModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSharing}>
                {isSharing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  "Share Record"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Fraud Analysis Modal */}
      <Dialog open={isAnalysisModalOpen} onOpenChange={setIsAnalysisModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5" />
              Fraud Detection Analysis
            </DialogTitle>
            <DialogDescription>
              AI-powered analysis of this health record
            </DialogDescription>
          </DialogHeader>

          {isLoadingAnalysis ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : fraudAnalysisData ? (
            <div className="space-y-6 py-4">
              {/* Risk Assessment */}
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Risk Assessment</h3>
                <div className={`p-4 rounded-md ${fraudAnalysisData.fraud_analysis?.is_fraud
                  ? 'bg-red-50 border border-red-200'
                  : fraudAnalysisData.fraud_analysis?.risk_level === 'medium'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-green-50 border border-green-200'
                  }`}>
                  <div className="flex items-center mb-2">
                    {fraudAnalysisData.fraud_analysis?.is_fraud ? (
                      <>
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                        <span className="font-semibold text-red-700">Suspicious Activity Detected</span>
                      </>
                    ) : fraudAnalysisData.fraud_analysis?.risk_level === 'medium' ? (
                      <>
                        <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                        <span className="font-semibold text-amber-700">Medium Risk Detected</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-700">Low Risk - Verified</span>
                      </>
                    )}
                  </div>
                  <p className={`text-sm ${fraudAnalysisData.fraud_analysis?.is_fraud
                    ? 'text-red-600'
                    : fraudAnalysisData.fraud_analysis?.risk_level === 'medium'
                      ? 'text-amber-600'
                      : 'text-green-600'
                    }`}>
                    {fraudAnalysisData.fraud_analysis?.is_fraud
                      ? 'Our AI model has detected unusual patterns in this record that may indicate fraudulent activity. Please verify the information.'
                      : fraudAnalysisData.fraud_analysis?.risk_level === 'medium'
                        ? 'Some aspects of this record show minor irregularities. Exercise caution when using this information.'
                        : 'This record appears normal with no suspicious patterns detected.'
                    }
                  </p>

                  {/* Show anomaly reasons if they exist */}
                  {fraudAnalysisData.fraud_analysis?.reasons && fraudAnalysisData.fraud_analysis.reasons.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <h4 className="text-sm font-medium mb-1 text-gray-700">Detected Issues:</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {fraudAnalysisData.fraud_analysis.reasons.map((reason, index) => (
                          <li key={index} className={fraudAnalysisData.fraud_analysis?.is_fraud ? 'text-red-600' : 'text-amber-600'}>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Risk Score:</span>
                      <span className="font-medium">
                        {fraudAnalysisData.fraud_analysis?.anomaly_score
                          ? fraudAnalysisData.fraud_analysis.anomaly_score.toFixed(3)
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600">Analysis Date:</span>
                      <span className="font-medium">
                        {fraudAnalysisData.fraud_analysis?.timestamp
                          ? new Date(fraudAnalysisData.fraud_analysis.timestamp).toLocaleString()
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted Data */}
              {fraudAnalysisData.extracted_data && (
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Data Used for Analysis</h3>
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(fraudAnalysisData.extracted_data)
                        .filter(([key, value]) => value !== null && value !== undefined)
                        .map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-sm text-gray-500">{key}</span>
                            <span className={`font-medium ${
                              // Highlight suspicious fields if fraud detected
                              fraudAnalysisData.fraud_analysis?.is_fraud &&
                                ((key === 'Amount Billed' && value > 5000) ||
                                  (key === 'Length of Stay' && value > 10) ||
                                  (key === 'Diagnosis' && value === 'General Check-up' &&
                                    fraudAnalysisData.extracted_data['Amount Billed'] > 1000))
                                ? 'text-red-600' : ''
                              }`}>
                              {key.includes('Amount') ? `$${value.toLocaleString()}` :
                                key.includes('Date') ? new Date(value).toLocaleDateString() :
                                  value.toString()}
                            </span>
                          </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">
                      These values were extracted from the uploaded document and used for fraud detection.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p>No analysis data available</p>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsAnalysisModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthRecords; 