// Import API service for real backend calls in the future
// import api from './api';

const appointmentService = {
    // Get all appointments
    getAppointments: async () => {
        try {
            // In a real application, this would be an API call
            // const response = await api.get('/appointments');
            // return response.data;

            // For now, return mock data
            const sampleAppointments = [
                {
                    id: 1,
                    doctor: 'Dr. Sarah Johnson',
                    specialty: 'Cardiologist',
                    type: 'Check-up',
                    date: 'Tomorrow',
                    time: '10:00 AM',
                    location: 'Heart Care Center',
                    isVirtual: false,
                    status: 'confirmed'
                },
                {
                    id: 2,
                    doctor: 'Dr. Michael Chen',
                    specialty: 'Dermatologist',
                    type: 'Consultation',
                    date: 'June 15, 2023',
                    time: '2:30 PM',
                    location: 'Video Call',
                    isVirtual: true,
                    status: 'confirmed'
                },
                {
                    id: 3,
                    doctor: 'Dr. Emily Rodriguez',
                    specialty: 'Neurologist',
                    type: 'Follow-up',
                    date: 'June 22, 2023',
                    time: '9:15 AM',
                    location: 'Neurology Associates',
                    isVirtual: false,
                    status: 'pending'
                }
            ];

            const appointmentCount = parseInt(localStorage.getItem('appointmentCount') || '0');
            return sampleAppointments.slice(0, appointmentCount || 3);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    // Create a new appointment
    createAppointment: async (appointmentData) => {
        try {
            // In a real application, this would be an API call
            // const response = await api.post('/appointments', appointmentData);
            // return response.data;

            // For now, update localStorage count
            const appointmentCount = parseInt(localStorage.getItem('appointmentCount') || '0');
            localStorage.setItem('appointmentCount', (appointmentCount + 1).toString());

            return {
                id: appointmentCount + 1,
                doctor: appointmentData.doctor || 'Dr. New Doctor',
                specialty: appointmentData.specialty || 'General Practice',
                type: appointmentData.type || 'Consultation',
                date: appointmentData.date || 'Upcoming',
                time: appointmentData.time || '12:00 PM',
                location: appointmentData.location || 'Medical Center',
                isVirtual: appointmentData.isVirtual || false,
                status: 'pending'
            };
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    // Update an appointment
    updateAppointment: async (appointmentId, appointmentData) => {
        try {
            // In a real application, this would be an API call
            // const response = await api.put(`/appointments/${appointmentId}`, appointmentData);
            // return response.data;

            // No localStorage update needed for this mock implementation
            return {
                id: appointmentId,
                ...appointmentData,
                status: appointmentData.status || 'confirmed'
            };
        } catch (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }
    },

    // Cancel an appointment
    cancelAppointment: async (appointmentId) => {
        try {
            // In a real application, this would be an API call
            // await api.delete(`/appointments/${appointmentId}`);

            // For now, update localStorage count
            const appointmentCount = parseInt(localStorage.getItem('appointmentCount') || '0');
            if (appointmentCount > 0) {
                localStorage.setItem('appointmentCount', (appointmentCount - 1).toString());
            }

            return true;
        } catch (error) {
            console.error('Error canceling appointment:', error);
            throw error;
        }
    }
};

export default appointmentService; 