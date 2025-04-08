import React, { useState } from 'react';
import { Calendar, Clock, Filter, Plus, MapPin, Video, Phone, MoreVertical, Star, User, Mail, ChevronDown, Check, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Appointments = () => {
  const [filterStatus, setFilterStatus] = useState('upcoming');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('card');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCardMenu, setShowCardMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctor: '',
    specialty: '',
    type: 'Check-up',
    date: '',
    time: '',
    location: '',
    address: '',
    phone: '',
    isVirtual: false,
    notes: ''
  });

  // Sample data for appointments with Indian phone numbers
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      type: 'Check-up',
      date: 'Tomorrow',
      time: '10:00 AM',
      location: 'Heart Care Center',
      address: '123 Medical Way, Suite 200',
      phone: '+91 98765 43210',
      isVirtual: false,
      status: 'confirmed',
      notes: 'Bring previous test results',
      rating: 4.8,
      image: null
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      type: 'Consultation',
      date: 'June 15, 2023',
      time: '2:30 PM',
      location: 'Video Call',
      phone: '+91 87654 32109',
      isVirtual: true,
      status: 'confirmed',
      notes: 'Have photos of affected areas ready',
      rating: 4.5,
      image: null
    },
    {
      id: 3,
      doctor: 'Dr. Emily Rodriguez',
      specialty: 'Neurologist',
      type: 'Follow-up',
      date: 'June 22, 2023',
      time: '9:15 AM',
      location: 'Neurology Associates',
      address: '789 Research Drive',
      phone: '+91 76543 21098',
      isVirtual: false,
      status: 'pending',
      notes: 'MRI results will be discussed',
      rating: 4.9,
      image: null
    },
    {
      id: 4,
      doctor: 'Dr. James Wilson',
      specialty: 'Orthopedist',
      type: 'Physical Therapy',
      date: 'June 30, 2023',
      time: '11:45 AM',
      location: 'Sports Medicine Clinic',
      address: '321 Wellness Road',
      phone: '+91 65432 10987',
      isVirtual: false,
      status: 'confirmed',
      notes: 'Wear comfortable clothing',
      rating: 4.7,
      image: null
    },
    {
      id: 5,
      doctor: 'Dr. Priya Sharma',
      specialty: 'General Physician',
      type: 'Annual Check-up',
      date: 'July 5, 2023',
      time: '10:30 AM',
      location: 'City Hospital',
      address: '456 Health Avenue',
      phone: '+91 90123 45678',
      isVirtual: false,
      status: 'confirmed',
      notes: 'Fast for 8 hours before appointment',
      rating: 4.6,
      image: null
    }
  ]);

  // Filter appointments based on status
  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'confirmed') return appointment.status === 'confirmed';
    if (filterStatus === 'pending') return appointment.status === 'pending';
    if (filterStatus === 'upcoming') return true; // For demonstration, all are considered upcoming
    return true;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      // Simple string comparison for demonstration
      return a.date.localeCompare(b.date);
    } else if (sortBy === 'doctor') {
      return a.doctor.localeCompare(b.doctor);
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  // Handle sort change
  const handleSortChange = (option) => {
    setSortBy(option);
    setIsDropdownOpen(false);
  };

  // Handle reschedule appointment
  const handleReschedule = (id) => {
    // Implement reschedule logic
    console.log('Rescheduling appointment', id);
    alert('Appointment reschedule request sent.');
    setShowCardMenu(null);
  };

  // Handle cancel appointment
  const handleCancel = (id) => {
    // Implement cancel logic
    console.log('Cancelling appointment', id);
    alert('Appointment has been cancelled.');
    setShowCardMenu(null);
  };

  // Handle confirm appointment
  const handleConfirm = (id) => {
    // Implement confirm logic
    console.log('Confirming appointment', id);
    alert('Appointment has been confirmed.');
  };

  // Toggle card menu visibility
  const toggleCardMenu = (id) => {
    setShowCardMenu(showCardMenu === id ? null : id);
  };

  // Close menus when clicking outside
  const closeMenus = () => {
    setIsDropdownOpen(false);
    setShowCardMenu(null);
  };

  // Handle input change for new appointment form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAppointment({
      ...newAppointment,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission for new appointment
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new appointment object
    const newAppointmentObj = {
      id: appointments.length + 1,
      ...newAppointment,
      status: 'pending',
      rating: 0
    };

    // Add the new appointment to the list
    setAppointments([...appointments, newAppointmentObj]);

    // Close the modal and reset the form
    setIsModalOpen(false);
    setNewAppointment({
      doctor: '',
      specialty: '',
      type: 'Check-up',
      date: '',
      time: '',
      location: '',
      address: '',
      phone: '',
      isVirtual: false,
      notes: ''
    });

    // Show success message
    alert('Appointment has been scheduled successfully!');
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8" onClick={closeMenus}>
      {/* Page Header */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Appointments</h1>
            <p className="mt-2 text-gray-500">Manage and track your upcoming medical appointments</p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Appointment</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">{appointments.filter(a => a.status === 'confirmed').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{appointments.filter(a => a.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Virtual Visits</p>
                <p className="text-2xl font-semibold text-gray-900">{appointments.filter(a => a.isVirtual).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="p-4 flex flex-wrap items-center justify-between gap-4">
              {/* Status Filter */}
              <div className="flex bg-gray-50/80 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
                {['upcoming', 'confirmed', 'pending', 'all'].map((status) => (
                  <button
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterStatus(status);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${filterStatus === status
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Controls - Sort & View */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                    className="flex items-center gap-2 text-sm border rounded-lg px-4 py-2 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700">Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        {['date', 'doctor', 'rating'].map((option) => (
                          <button
                            key={option}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSortChange(option);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${sortBy === option
                              ? 'bg-gray-50 text-gray-900'
                              : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center rounded-lg border overflow-hidden bg-gray-50/80">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewMode('card');
                    }}
                    className={`p-2 transition-colors ${viewMode === 'card'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewMode('list');
                    }}
                    className={`p-2 transition-colors ${viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-y md:divide-y-0 border-b">
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">Total Appointments</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{appointments.length}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{appointments.filter(a => a.status === 'confirmed').length}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">Pending Confirmation</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{appointments.filter(a => a.status === 'pending').length}</p>
            </div>
          </div>

          {/* Appointments List */}
          <div className="p-6">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-50/80 inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">There are no appointments matching your current filters.</p>
                <button className="mt-6 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium">
                  Schedule New Appointment
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredAppointments.map((appointment) => (
                  viewMode === 'card' ? (
                    <div key={appointment.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                      {/* Status Indicator */}
                      <div className={`h-1 ${appointment.status === 'confirmed'
                        ? 'bg-green-500'
                        : appointment.status === 'pending'
                          ? 'bg-yellow-500'
                          : 'bg-gray-300'
                        }`} />

                      <div className="p-6 group-hover:p-7 transition-all duration-200">
                        {/* Doctor Info */}
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium flex-shrink-0">
                            {appointment.image ? (
                              <img src={appointment.image} alt={appointment.doctor} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              appointment.doctor.split(' ')[1][0] + appointment.doctor.split(' ')[0][0]
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900 truncate">{appointment.doctor}</h3>
                                <p className="text-sm text-gray-600 truncate">{appointment.specialty}</p>
                              </div>
                              <div className="flex items-center text-amber-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-xs ml-1 text-gray-600">{appointment.rating}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${appointment.status === 'confirmed'
                                ? 'bg-green-50 text-green-700'
                                : appointment.status === 'pending'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                                }`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                {appointment.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                              <p className="text-xs text-gray-500">{appointment.time}</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            {appointment.isVirtual ? (
                              <>
                                <Video className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">Virtual Appointment</p>
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                                      Video Call
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">{appointment.location}</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">{appointment.location}</p>
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                      In Person
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5 truncate">{appointment.address}</p>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <p className="text-sm text-gray-900 truncate">{appointment.phone}</p>
                          </div>

                          {appointment.notes && (
                            <div className="flex items-start bg-gray-50 p-3 rounded-lg">
                              <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                              <p className="text-sm text-gray-600 line-clamp-2">{appointment.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-6">
                          {appointment.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleConfirm(appointment.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                              >
                                <Check className="h-4 w-4" />
                                <span>Confirm</span>
                              </button>
                              <button
                                onClick={() => handleCancel(appointment.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                              >
                                <X className="h-4 w-4" />
                                <span>Decline</span>
                              </button>
                            </>
                          ) : appointment.isVirtual ? (
                            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                              <Video className="h-4 w-4" />
                              <span>Join Call</span>
                            </button>
                          ) : (
                            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                              <MapPin className="h-4 w-4" />
                              <span>Get Directions</span>
                            </button>
                          )}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCardMenu(appointment.id);
                              }}
                              className="px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors h-full"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {showCardMenu === appointment.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReschedule(appointment.id);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Reschedule Appointment
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancel(appointment.id);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Cancel Appointment
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={appointment.id} className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Provider Info */}
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium mr-3 flex-shrink-0">
                            {appointment.image ? (
                              <img src={appointment.image} alt={appointment.doctor} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              appointment.doctor.split(' ')[1][0] + appointment.doctor.split(' ')[0][0]
                            )}
                          </div>
                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                              <h3 className="font-medium text-gray-900">{appointment.doctor}</h3>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${appointment.status === 'confirmed'
                                ? 'bg-green-50 text-green-700'
                                : appointment.status === 'pending'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                                }`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                {appointment.isVirtual ? 'Video Call' : 'In Person'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">{appointment.specialty} • {appointment.type}</p>
                          </div>
                        </div>

                        {/* Date/Time & Location */}
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{appointment.date}, {appointment.time}</span>
                          </div>

                          <div className="flex items-center">
                            {appointment.isVirtual ? (
                              <>
                                <Video className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{appointment.location}</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{appointment.location}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {appointment.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleConfirm(appointment.id)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                              >
                                <Check className="h-4 w-4" />
                                <span>Confirm</span>
                              </button>
                              <button
                                onClick={() => handleCancel(appointment.id)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                              >
                                <X className="h-4 w-4" />
                                <span>Decline</span>
                              </button>
                            </>
                          ) : appointment.isVirtual ? (
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                              <Video className="h-4 w-4" />
                              <span>Join Call</span>
                            </button>
                          ) : (
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                              <MapPin className="h-4 w-4" />
                              <span>Directions</span>
                            </button>
                          )}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCardMenu(appointment.id);
                              }}
                              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {showCardMenu === appointment.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReschedule(appointment.id);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Reschedule Appointment
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancel(appointment.id);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Cancel Appointment
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Schedule New Appointment</h3>
                  <p className="mt-1 text-sm text-gray-500">Fill in the details to book your appointment</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Doctor Name</label>
                      <input
                        type="text"
                        id="doctor"
                        name="doctor"
                        value={newAppointment.doctor}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
                      <input
                        type="text"
                        id="specialty"
                        name="specialty"
                        value={newAppointment.specialty}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">Appointment Type</label>
                      <select
                        id="type"
                        name="type"
                        value={newAppointment.type}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      >
                        <option value="Check-up">Check-up</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Physical Therapy">Physical Therapy</option>
                        <option value="Annual Check-up">Annual Check-up</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={newAppointment.date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={newAppointment.time}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isVirtual"
                        name="isVirtual"
                        checked={newAppointment.isVirtual}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="isVirtual" className="ml-2 block text-sm text-gray-700">Virtual Appointment</label>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        {newAppointment.isVirtual ? 'Platform' : 'Hospital/Clinic Name'}
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={newAppointment.location}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder={newAppointment.isVirtual ? 'e.g. Zoom, Google Meet' : ''}
                        required
                      />
                    </div>

                    {!newAppointment.isVirtual && (
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={newAppointment.address}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={newAppointment.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 98765 43210"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={newAppointment.notes}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Any special requirements or information"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                    >
                      Schedule Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments; 