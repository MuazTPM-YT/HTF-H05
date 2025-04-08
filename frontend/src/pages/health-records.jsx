import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, FileText, Download, Share2, Trash2, ChevronDown, Check, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import healthRecordService from '../services/health-record-service';
import { useToast } from '../hooks/use-toast';
import AddRecordModal from '../components/dashboard/AddRecordModal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "../components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "../components/ui/dialog";

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
    const [isDownloading, setIsDownloading] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [shareEmail, setShareEmail] = useState('');
    const [isSharing, setIsSharing] = useState(false);
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
                status: record.status || "Complete"
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

    const handleDownload = async (recordId) => {
        setIsDownloading(true);
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
        } finally {
            setIsDownloading(false);
        }
    };

    const toggleFilter = (filter) => {
        setActiveFilters(prev => ({
            ...prev,
            [filter]: !prev[filter]
        }));
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
                                <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                                    {Object.values(activeFilters).filter(Boolean).length}
                                </span>
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
                <div className="flex justify-center items-center h-60">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3">Loading records...</span>
                </div>
            ) : filteredRecords.length > 0 ? (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Record Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">{record.name}</TableCell>
                                    <TableCell>{record.date}</TableCell>
                                    <TableCell>{record.provider}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                            {record.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                            {record.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDownload(record.id)}
                                                disabled={isDownloading}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleShare(record.id)}
                                            >
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDeleteRecord(record.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-60 border rounded-lg">
                    <FileText className="h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">No records found</h3>
                    <p className="text-muted-foreground mt-1">
                        {searchTerm || Object.values(activeFilters).some(Boolean)
                            ? "Try adjusting your search or filters"
                            : "Add your first health record to get started"}
                    </p>
                    {(!searchTerm && !Object.values(activeFilters).some(Boolean)) && (
                        <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
                            Add New Record
                        </Button>
                    )}
                </div>
            )}

            <AddRecordModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleRecordAdded}
            />

            {/* Share Record Modal */}
            <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share Health Record</DialogTitle>
                        <DialogDescription>
                            Enter the email address of the person you want to share this record with.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitShare}>
                        <div className="space-y-4 py-2">
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Email address"
                                    className="pl-8"
                                    type="email"
                                    value={shareEmail}
                                    onChange={(e) => setShareEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsShareModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSharing}>
                                    {isSharing ? 'Sharing...' : 'Share Record'}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HealthRecords; 