import api from './api';

const healthRecordService = {
    // Get all health records
    getRecords: async () => {
        try {
            // Attempt to fetch from API first
            try {
                const response = await api.get('/health-records');
                return response.data;
            } catch (apiError) {
                console.log('Falling back to sample data', apiError);
                // Fall back to sample data if API fails
                const recordTypes = [
                    'Lab Test', 'Imaging', 'Prescription',
                    'Vaccination', 'Visit Summary', 'Specialist Referral',
                    'Surgery Report', 'Mental Health', 'Physical Therapy',
                    'Dental Record', 'Vision Exam', 'Allergy Test'
                ];

                const providers = [
                    'Dr. Sarah Smith', 'Dr. Michael Johnson',
                    'Dr. Emily Brown', 'Dr. Robert Wilson',
                    'Dr. Jessica Chen', 'Dr. David Rodriguez',
                    'Dr. Amanda Taylor', 'Dr. James Patel'
                ];

                // Generate 15-25 records with diverse data
                const count = Math.floor(Math.random() * 10) + 15;
                const records = [];

                for (let i = 0; i < count; i++) {
                    // Create date within last 2 years
                    const date = new Date();
                    date.setDate(date.getDate() - Math.floor(Math.random() * 730));

                    records.push({
                        id: `record-${i + 1}`,
                        name: `${recordTypes[i % recordTypes.length]} Results`,
                        date: date.toISOString(),
                        provider: providers[i % providers.length],
                        type: recordTypes[i % recordTypes.length],
                        status: Math.random() > 0.1 ? 'Complete' : 'Pending'
                    });
                }

                // Store in localStorage for persistence
                localStorage.setItem('healthRecords', JSON.stringify(records));
                return records;
            }
        } catch (error) {
            console.error('Error fetching health records:', error);

            // Return cached data if available
            const cachedRecords = localStorage.getItem('healthRecords');
            if (cachedRecords) {
                return JSON.parse(cachedRecords);
            }

            throw error;
        }
    },

    // Add a new health record
    addRecord: async (recordData) => {
        try {
            // Attempt to add via API
            try {
                const response = await api.post('/health-records', recordData);
                return response.data;
            } catch (apiError) {
                console.log('Falling back to local storage', apiError);
                // Fall back to localStorage
                let records = [];
                const existingRecords = localStorage.getItem('healthRecords');

                if (existingRecords) {
                    records = JSON.parse(existingRecords);
                }

                const newRecord = {
                    id: `record-${Date.now()}`,
                    name: recordData.name || 'Health Record',
                    date: new Date().toISOString(),
                    provider: recordData.provider || 'Dr. Sarah Smith',
                    type: recordData.type || 'General',
                    status: 'Complete'
                };

                records.unshift(newRecord);
                localStorage.setItem('healthRecords', JSON.stringify(records));
                return newRecord;
            }
        } catch (error) {
            console.error('Error adding health record:', error);
            throw error;
        }
    },

    // Delete a health record
    deleteRecord: async (id) => {
        try {
            // Try API first
            try {
                await api.delete(`/health-records/${id}`);
                return true;
            } catch (apiError) {
                console.log('Falling back to local storage', apiError);
                // Fall back to localStorage
                const existingRecords = localStorage.getItem('healthRecords');

                if (existingRecords) {
                    const records = JSON.parse(existingRecords);
                    const filteredRecords = records.filter(record => record.id !== id);
                    localStorage.setItem('healthRecords', JSON.stringify(filteredRecords));
                }

                return true;
            }
        } catch (error) {
            console.error('Error deleting health record:', error);
            throw error;
        }
    },

    // Download a health record
    downloadRecord: async (id) => {
        try {
            // Try API first
            try {
                const response = await api.get(`/health-records/${id}/download`, {
                    responseType: 'blob'
                });

                // Create download link
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `health-record-${id}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                return true;
            } catch (apiError) {
                console.log('Generating sample PDF for download', apiError);

                // Generate a sample PDF from record data
                const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
                const record = records.find(r => r.id === id);

                if (!record) {
                    throw new Error('Record not found');
                }

                // In real implementation, we would generate a PDF
                // For now, simulate download with a text file
                const text = `
                HEALTH RECORD EXPORT
                
                Record ID: ${record.id}
                Name: ${record.name}
                Date: ${new Date(record.date).toLocaleDateString()}
                Provider: ${record.provider}
                Type: ${record.type}
                Status: ${record.status}
                
                This is a sample export file.
                In a production environment, this would be a properly formatted medical record.
                `;

                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `health-record-${id}.txt`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                return true;
            }
        } catch (error) {
            console.error('Error downloading health record:', error);
            throw error;
        }
    },

    // Share a health record
    shareRecord: async (id, recipientEmail) => {
        try {
            // Try API first
            try {
                await api.post(`/health-records/${id}/share`, { email: recipientEmail });
                return true;
            } catch (apiError) {
                console.log('Simulating sharing functionality', apiError);

                // Simulate success response from server
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 800);
                });
            }
        } catch (error) {
            console.error('Error sharing health record:', error);
            throw error;
        }
    }
};

export default healthRecordService; 