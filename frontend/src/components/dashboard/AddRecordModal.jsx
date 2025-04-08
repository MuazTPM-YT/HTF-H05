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
import { Loader2, Calendar } from 'lucide-react';

const AddRecordModal = ({ isOpen, onClose, onSuccess }) => {
    const [recordName, setRecordName] = useState('');
    const [recordType, setRecordType] = useState('');
    const [recordProvider, setRecordProvider] = useState('');
    const [recordDate, setRecordDate] = useState('');
    const [recordFile, setRecordFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Reset form when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setRecordName('');
            setRecordType('');
            setRecordProvider('');
            setRecordDate(new Date().toISOString().split('T')[0]); // Default to today
            setRecordFile(null);
        }
    }, [isOpen]);

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
            await healthRecordService.addRecord({
                name: recordName,
                type: getRecordTypeLabel(recordType),
                provider: recordProvider,
                date: recordDate,
                file: recordFile
            });

            toast({
                title: "Record added",
                description: "Health record has been added successfully"
            });

            // Reset form
            setRecordName('');
            setRecordType('');
            setRecordProvider('');
            setRecordDate('');
            setRecordFile(null);

            // Close modal and notify parent
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (error) {
            console.error('Error adding record:', error);
            toast({
                title: "Error",
                description: "Failed to add health record",
                variant: "destructive"
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[475px]">
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
                            onChange={(e) => setRecordFile(e.target.files[0])}
                        />
                        <p className="text-xs text-gray-500">
                            Supported formats: PDF, JPG, PNG (max 10MB)
                        </p>
                    </div>

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
    );
};

export default AddRecordModal; 