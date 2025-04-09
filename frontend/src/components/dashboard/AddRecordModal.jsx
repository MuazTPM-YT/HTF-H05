import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/Button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useToast } from "../../hooks/use-toast";
import healthRecordService from '../../services/health-record-service';
import { Loader2, Calendar, FileText, AlertCircle, AlertTriangle, Shield, X } from 'lucide-react';

// Component to display fraud rejection details
const FraudRejectionModal = ({ isOpen, onClose, fraudData }) => {
    if (!fraudData) return null;

    const { extracted_data, fraud_analysis } = fraudData;
    const fraudLevel = fraud_analysis?.fraud_level || 'high';
    const reasons = fraud_analysis?.reasons || [];

    // Get severity-specific elements
    const getSeverityColor = () => {
        switch (fraudLevel) {
            case 'critical': return 'bg-red-600 text-white';
            case 'high': return 'bg-red-500 text-white';
            default: return 'bg-red-400 text-white';
        }
    };

    const getSeverityText = () => {
        switch (fraudLevel) {
            case 'critical': return 'Critical Fraud Alert';
            case 'high': return 'High Risk Fraud Alert';
            default: return 'Suspicious Activity Alert';
        }
    };

    const getSeverityDescription = () => {
        switch (fraudLevel) {
            case 'critical':
                return 'This record contains patterns that strongly indicate fraudulent activity. Upload has been blocked.';
            case 'high':
                return 'Multiple suspicious patterns have been detected in this record. Upload has been blocked for security reasons.';
            default:
                return 'This record contains unusual patterns that may indicate fraud. Upload has been blocked pending review.';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                {/* Alert header with severity-based styling */}
                <div className={`${getSeverityColor()} p-4`}>
                    <div className="flex items-center">
                        <AlertTriangle className="h-8 w-8 mr-3" />
                        <div>
                            <h2 className="text-xl font-bold">{getSeverityText()}</h2>
                            <p className="opacity-90 mt-1">{getSeverityDescription()}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Fraud Reasons */}
                    <div>
                        <h4 className="text-lg font-medium mb-3 flex items-center text-red-700">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            Issues Detected
                        </h4>
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            {reasons.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-2">
                                    {reasons.map((reason, idx) => (
                                        <li key={idx} className="text-red-700">{reason}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-red-700">
                                    Suspicious patterns were detected in this health record.
                                </p>
                            )}

                            <div className="mt-4 pt-3 border-t border-red-200 flex justify-between text-sm">
                                <div>
                                    <span className="text-gray-600">Fraud Level:</span>
                                    <span className={`ml-2 font-medium ${fraudLevel === 'critical' ? 'text-red-700' :
                                        fraudLevel === 'high' ? 'text-red-600' : 'text-red-500'
                                        }`}>
                                        {fraudLevel.charAt(0).toUpperCase() + fraudLevel.slice(1)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Risk Score:</span>
                                    <span className="ml-2 font-medium">
                                        {fraud_analysis.anomaly_score.toFixed(3)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Extracted Data */}
                    {extracted_data && (
                        <div>
                            <h4 className="text-lg font-medium mb-3 flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                                Flagged Data Fields
                            </h4>
                            <div className="bg-gray-50 p-4 rounded-md border grid grid-cols-2 gap-x-4 gap-y-3">
                                {Object.entries(extracted_data)
                                    .filter(([fieldKey, value]) => value !== null && value !== undefined)
                                    .map(([fieldKey, value]) => {
                                        // Determine if this field triggered a fraud flag
                                        const isHighlighted = reasons.some(reason =>
                                            reason.toLowerCase().includes(fieldKey.toLowerCase()) ||
                                            (fieldKey === 'Amount Billed' && reason.includes('amount')) ||
                                            (fieldKey === 'Length of Stay' && reason.includes('stay')) ||
                                            (fieldKey === 'Treatment' && reason.includes(value)) ||
                                            (fieldKey === 'Diagnosis' && reason.includes(value))
                                        );

                                        return (
                                            <div key={fieldKey} className={`flex flex-col p-2 rounded ${isHighlighted ? 'bg-red-50 border border-red-100' : ''}`}>
                                                <span className="text-sm text-gray-500">{fieldKey}</span>
                                                <span className={`font-medium ${isHighlighted ? 'text-red-600' : ''}`}>
                                                    {fieldKey.includes('Amount') ? `$${value.toLocaleString()}` :
                                                        fieldKey.includes('Date') && value ? new Date(value).toLocaleDateString() :
                                                            value.toString()}
                                                </span>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    )}

                    {/* What To Do Next */}
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                        <h4 className="font-medium mb-2 text-blue-800">What to do next:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1 text-blue-800">
                            <li>Review the flagged data fields for accuracy</li>
                            <li>Make corrections if any information is incorrect</li>
                            <li>Try uploading a clearer document if data extraction errors occurred</li>
                            <li>Contact support if you believe this is a false positive</li>
                        </ul>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-sm text-amber-800 flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <p>
                            Our AI-powered fraud detection system has flagged this document. Healthcare fraud
                            costs the industry billions annually and puts patient safety at risk. Thank you for
                            your understanding as we work to maintain the integrity of medical records.
                        </p>
                    </div>
                </div>

                <DialogFooter className="px-6 pb-6">
                    <Button onClick={onClose} className="w-full">
                        Close and Review Document
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const AddRecordModal = ({ isOpen, onClose, onSuccess }) => {
    const [recordName, setRecordName] = useState('');
    const [recordType, setRecordType] = useState('');
    const [recordProvider, setRecordProvider] = useState('');
    const [recordDate, setRecordDate] = useState('');
    const [recordFile, setRecordFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFileLoading, setIsFileLoading] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const [fraudRejectionData, setFraudRejectionData] = useState(null);
    const [showFraudModal, setShowFraudModal] = useState(false);
    const { toast } = useToast();

    // Reset form when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setRecordName('');
            setRecordType('');
            setRecordProvider('');
            setRecordDate(new Date().toISOString().split('T')[0]); // Default to today
            setRecordFile(null);
            setExtractedData(null);
            setFraudRejectionData(null);
            setShowFraudModal(false);
        }
    }, [isOpen]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setRecordFile(null);
            setExtractedData(null);
            return;
        }

        setRecordFile(file);

        // Only attempt to extract data from PDFs
        if (file.type === 'application/pdf') {
            setIsFileLoading(true);

            // Show toast that extraction is starting
            toast({
                title: "Processing file",
                description: "Extracting and analyzing document data...",
                duration: 2000
            });

            try {
                // Extract data from the PDF
                const data = await healthRecordService.extractFromFile(file);
                setExtractedData(data);

                // Show success toast for extraction
                toast({
                    title: "Data extracted",
                    description: "Document information successfully extracted for fraud analysis.",
                    duration: 3000
                });

                // Automatically set form fields based on extracted data if available
                if (data.Diagnosis && !recordType) {
                    // Try to match diagnosis to a record type
                    const diagnosis = data.Diagnosis.toLowerCase();
                    if (diagnosis.includes('lab') || diagnosis.includes('test') || diagnosis.includes('blood')) {
                        setRecordType('lab-test');
                    } else if (diagnosis.includes('x-ray') || diagnosis.includes('mri') || diagnosis.includes('scan')) {
                        setRecordType('imaging');
                    } else if (diagnosis.includes('prescription') || diagnosis.includes('medication')) {
                        setRecordType('prescription');
                    }
                }

                // Set record name if empty
                if (!recordName && data.Diagnosis) {
                    setRecordName(`${data.Diagnosis} Report`);
                }

            } catch (error) {
                console.error('Error extracting data from file:', error);
                toast({
                    title: "File processing error",
                    description: "Unable to extract data from the PDF. The system will have limited fraud detection capabilities.",
                    variant: "warning",
                    duration: 5000
                });
            } finally {
                setIsFileLoading(false);
            }
        } else {
            setExtractedData(null);
            // Non-PDF file warning
            toast({
                title: "Limited fraud detection",
                description: "PDF files provide the best fraud detection. Other formats have limited analysis capabilities.",
                variant: "warning",
                duration: 5000
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!recordName || !recordType || !recordProvider) {
            toast({
                title: "Missing information",
                description: "Please provide name, type, and provider for the record",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await healthRecordService.addRecord({
                name: recordName,
                type: getRecordTypeLabel(recordType),
                provider: recordProvider,
                date: recordDate,
                file: recordFile,
                extractedData: extractedData // Pass the extracted data to the service
            });

            // Handle different result statuses
            if (result.status === "Rejected") {
                // Fraud was detected - store the data and show detailed modal
                setFraudRejectionData(result);
                setShowFraudModal(true);

                // Show a toast notification with fraud level
                const fraudLevel = result.fraud_analysis?.fraud_level || 'high';
                const fraudTitle = fraudLevel === 'critical' ? 'CRITICAL FRAUD ALERT' :
                    fraudLevel === 'high' ? 'Upload Blocked - Potential Fraud' :
                        'Upload Blocked - Suspicious Activity';

                const reasons = result.fraud_analysis?.reasons || [];
                const primaryReason = reasons.length > 0 ? reasons[0] : 'Suspicious patterns detected';

                toast({
                    title: fraudTitle,
                    description: primaryReason,
                    variant: "destructive",
                    duration: 8000
                });

                // If there are multiple issues, show an additional toast
                if (reasons.length > 1) {
                    setTimeout(() => {
                        toast({
                            title: "Multiple fraud indicators detected",
                            description: `${reasons.length} suspicious patterns identified. See details for more information.`,
                            variant: "destructive",
                            duration: 6000
                        });
                    }, 1000);
                }
            } else if (result.status === "Unverified") {
                // Error in fraud analysis
                toast({
                    title: "Record added but unverified",
                    description: "The fraud detection system encountered an issue. The record was added but has not been fully verified for fraud.",
                    variant: "warning",
                    duration: 5000
                });

                // Notify parent component to refresh records
                if (onSuccess) {
                    onSuccess();
                }
                onClose();
            } else {
                // Record was added successfully
                if (result.fraud_analysis && result.fraud_analysis.risk_level === 'medium') {
                    // Medium risk - added but with warning
                    toast({
                        title: "Record added with caution",
                        description: "The record has been added but shows some unusual patterns. Review the analysis for details.",
                        variant: "warning",
                        duration: 5000
                    });
                } else if (result.fraud_analysis && result.fraud_analysis.risk_level === 'low') {
                    // Low risk - normal success with verification note
                    toast({
                        title: "Record added and verified",
                        description: "Health record has been added successfully and passed fraud detection checks.",
                        variant: "default",
                        duration: 3000
                    });
                } else {
                    // Standard success message
                    toast({
                        title: "Record added",
                        description: "Health record has been added successfully"
                    });
                }

                // Notify parent component to refresh records
                if (onSuccess) {
                    onSuccess();
                }
                onClose();
            }

            // Only reset form if not showing fraud modal
            if (result.status !== "Rejected") {
                setRecordName('');
                setRecordType('');
                setRecordProvider('');
                setRecordDate('');
                setRecordFile(null);
                setExtractedData(null);
            }
        } catch (error) {
            console.error('Error adding record:', error);
            toast({
                title: "Error",
                description: "Failed to add health record. Please try again later.",
                variant: "destructive",
                duration: 4000
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Convert record type value to label
    const getRecordTypeLabel = (value) => {
        const typeMap = {
            'lab-test': 'Lab Test',
            'imaging': 'Imaging',
            'prescription': 'Prescription',
            'vaccination': 'Vaccination',
            'visit-summary': 'Visit Summary',
            'specialist-referral': 'Specialist Referral',
            'surgery-report': 'Surgery Report',
            'mental-health': 'Mental Health',
            'physical-therapy': 'Physical Therapy',
            'dental-record': 'Dental Record',
            'vision-exam': 'Vision Exam',
            'allergy-test': 'Allergy Test',
            'other': 'Other'
        };
        return typeMap[value] || value;
    };

    // Handle fraud modal close
    const handleFraudModalClose = () => {
        setShowFraudModal(false);
        // Don't close the main modal so user can correct the data
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Add Health Record</DialogTitle>
                        <DialogDescription>
                            Upload a new health record to your secure repository
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="record-name">Record Name</Label>
                            <Input
                                id="record-name"
                                placeholder="E.g., Blood Test Results"
                                value={recordName}
                                onChange={(e) => setRecordName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="record-type">Record Type</Label>
                                <Select value={recordType} onValueChange={setRecordType} required>
                                    <SelectTrigger id="record-type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lab-test">Lab Test</SelectItem>
                                        <SelectItem value="imaging">Imaging (X-ray, MRI, etc.)</SelectItem>
                                        <SelectItem value="prescription">Prescription</SelectItem>
                                        <SelectItem value="vaccination">Vaccination</SelectItem>
                                        <SelectItem value="visit-summary">Visit Summary</SelectItem>
                                        <SelectItem value="specialist-referral">Specialist Referral</SelectItem>
                                        <SelectItem value="surgery-report">Surgery Report</SelectItem>
                                        <SelectItem value="mental-health">Mental Health</SelectItem>
                                        <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
                                        <SelectItem value="dental-record">Dental Record</SelectItem>
                                        <SelectItem value="vision-exam">Vision Exam</SelectItem>
                                        <SelectItem value="allergy-test">Allergy Test</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="record-date">Record Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="record-date"
                                        type="date"
                                        value={recordDate}
                                        onChange={(e) => setRecordDate(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="record-provider">Healthcare Provider</Label>
                            <Select value={recordProvider} onValueChange={setRecordProvider} required>
                                <SelectTrigger id="record-provider">
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Dr. Sarah Smith">Dr. Sarah Smith</SelectItem>
                                    <SelectItem value="Dr. Michael Johnson">Dr. Michael Johnson</SelectItem>
                                    <SelectItem value="Dr. Emily Brown">Dr. Emily Brown</SelectItem>
                                    <SelectItem value="Dr. Robert Wilson">Dr. Robert Wilson</SelectItem>
                                    <SelectItem value="Dr. Jessica Chen">Dr. Jessica Chen</SelectItem>
                                    <SelectItem value="Dr. David Rodriguez">Dr. David Rodriguez</SelectItem>
                                    <SelectItem value="Dr. Amanda Taylor">Dr. Amanda Taylor</SelectItem>
                                    <SelectItem value="Dr. James Patel">Dr. James Patel</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="record-file">Upload File (Optional)</Label>
                            <Input
                                id="record-file"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                disabled={isFileLoading}
                            />
                            {isFileLoading && (
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" /> Extracting data from PDF...
                                </div>
                            )}
                            <p className="text-xs text-gray-500">
                                Supported formats: PDF, JPG, PNG (max 10MB)
                            </p>
                            <div className="flex items-center mt-1">
                                <Shield className="h-3 w-3 mr-1 text-green-600" />
                                <p className="text-xs text-gray-700">
                                    Files are automatically scanned with advanced fraud detection
                                </p>
                            </div>
                        </div>

                        {/* Fraud detection information section */}
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mt-2">
                            <div className="flex items-center mb-2">
                                <Shield className="h-4 w-4 mr-1.5 text-blue-600" />
                                <h3 className="text-sm font-medium text-blue-800">Advanced Fraud Detection</h3>
                            </div>
                            <p className="text-xs text-blue-700 mb-2">
                                Our AI-powered system actively protects against healthcare fraud by analyzing:
                            </p>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="flex items-center text-xs text-blue-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                                    Billing anomalies
                                </div>
                                <div className="flex items-center text-xs text-blue-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                                    Suspicious diagnoses
                                </div>
                                <div className="flex items-center text-xs text-blue-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                                    Treatment inconsistencies
                                </div>
                                <div className="flex items-center text-xs text-blue-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                                    Demographic mismatches
                                </div>
                            </div>
                            <p className="text-xs text-blue-700 mt-2">
                                Uploads with suspicious patterns will be blocked to maintain data integrity.
                            </p>
                        </div>

                        {extractedData && (
                            <div className="space-y-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                                <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                    <span className="text-sm font-medium">Data Extracted from PDF</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {Object.entries(extractedData).map(([fieldKey, value]) => (
                                        <div key={fieldKey} className="text-xs">
                                            <span className="text-gray-500">{fieldKey}:</span> {' '}
                                            <span className="font-medium">
                                                {fieldKey.includes('Amount') ? `$${value?.toLocaleString()}` :
                                                    fieldKey.includes('Date') && value ? new Date(value).toLocaleDateString() :
                                                        value?.toString() || 'N/A'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center mt-2 text-xs text-blue-600">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    <span>This data will be used for fraud detection analysis</span>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add Record"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Fraud Rejection Modal */}
            <FraudRejectionModal
                isOpen={showFraudModal}
                onClose={handleFraudModalClose}
                fraudData={fraudRejectionData}
            />
        </>
    );
};

export default AddRecordModal; 