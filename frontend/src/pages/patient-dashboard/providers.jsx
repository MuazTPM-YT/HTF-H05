import React, { useState } from 'react';
import { Search, UserPlus, Star, MoreVertical, MapPin, Phone, Mail, ExternalLink, Share2, Heart, Filter, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Providers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  
  // Sample data for providers with Indian phone numbers
  const providers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      hospital: 'Central Hospital',
      address: 'Andheri East, Mumbai 400069',
      phone: '+91 98765 43210',
      email: 'dr.johnson@centralhospital.com',
      rating: 4.8,
      reviews: 127,
      education: 'MBBS, MD - Cardiology',
      experience: '15 years',
      languages: ['English', 'Hindi'],
      availability: 'Mon, Wed, Fri',
      isAcceptingPatients: true,
      isFavorite: true,
      image: null
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      hospital: 'City Medical Center',
      address: 'Bandra West, Mumbai 400050',
      phone: '+91 87654 32109',
      email: 'dr.chen@citymedical.com',
      rating: 4.6,
      reviews: 98,
      education: 'MBBS, MD - Dermatology',
      experience: '10 years',
      languages: ['English', 'Mandarin', 'Hindi'],
      availability: 'Tue, Thu, Sat',
      isAcceptingPatients: true,
      isFavorite: true,
      image: null
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Neurologist',
      hospital: 'University Medical Center',
      address: 'Powai, Mumbai 400076',
      phone: '+91 76543 21098',
      email: 'dr.rodriguez@universitymedical.com',
      rating: 4.9,
      reviews: 156,
      education: 'MBBS, DM - Neurology',
      experience: '12 years',
      languages: ['English', 'Spanish', 'Hindi'],
      availability: 'Mon to Fri',
      isAcceptingPatients: true,
      isFavorite: false,
      image: null
    },
    {
      id: 4,
      name: 'Dr. David Kim',
      specialty: 'Pediatrician',
      hospital: 'Children\'s Hospital',
      address: 'Dadar, Mumbai 400028',
      phone: '+91 65432 10987',
      email: 'dr.kim@childrenshospital.com',
      rating: 4.7,
      reviews: 183,
      education: 'MBBS, MD - Pediatrics',
      experience: '8 years',
      languages: ['English', 'Korean', 'Hindi'],
      availability: 'Mon to Sat',
      isAcceptingPatients: false,
      isFavorite: false,
      image: null
    },
    {
      id: 5,
      name: 'Dr. Priya Sharma',
      specialty: 'General Physician',
      hospital: 'Wellness Clinic',
      address: 'Juhu, Mumbai 400049',
      phone: '+91 54321 09876',
      email: 'dr.sharma@wellnessclinic.com',
      rating: 4.5,
      reviews: 210,
      education: 'MBBS, DNB - Family Medicine',
      experience: '7 years',
      languages: ['English', 'Hindi', 'Marathi'],
      availability: 'Mon to Sat',
      isAcceptingPatients: true,
      isFavorite: false,
      image: null
    }
  ];

  // Filter and search providers
  const filteredProviders = providers.filter(provider => {
    // Filter by search query
    const matchesSearch = searchQuery === '' 
      ? true 
      : provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesFilter = filter === 'all'
      ? true
      : filter === 'favorites' 
        ? provider.isFavorite 
        : filter === 'accepting'
          ? provider.isAcceptingPatients
          : true;
    
    return matchesSearch && matchesFilter;
  });

  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Healthcare Providers</h1>
          <p className="text-gray-500">Find and connect with healthcare professionals</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors shadow-sm">
          <UserPlus className="h-4 w-4" />
          <span>Add Provider</span>
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, hospital..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filter dropdown */}
            <div className="relative">
              <div className="flex items-center gap-1 text-sm border rounded-md px-3 py-2 bg-white hover:bg-gray-50 cursor-pointer">
                <Filter className="h-4 w-4 text-gray-500" />
                <span>Filter: {filter === 'all' ? 'All Providers' : filter === 'favorites' ? 'Favorites' : 'Accepting Patients'}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
              {/* Filter dropdown would go here */}
            </div>
            
            {/* View mode toggle */}
            <div className="flex items-center rounded-md border overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
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

        {/* Provider List */}
        <div className="p-4">
          {filteredProviders.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <UserPlus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No providers found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add New Provider
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {filteredProviders.map((provider) => (
                viewMode === 'grid' ? (
                  <div key={provider.id} className="border rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <div className="p-4">
                      {/* Provider Info */}
                      <div className="flex items-start">
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-3">
                          {provider.image ? (
                            <img src={provider.image} alt={provider.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            getInitials(provider.name)
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                              <p className="text-sm text-gray-600">{provider.specialty}</p>
                              <p className="text-xs text-gray-500">{provider.hospital}</p>
                            </div>
                            <button className={`text-gray-400 hover:text-red-500 ${provider.isFavorite ? 'text-red-500' : ''}`}>
                              <Heart className={`h-5 w-5 ${provider.isFavorite ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          <div className="flex items-center mt-1 text-sm">
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="ml-1 font-medium">{provider.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500 ml-1">({provider.reviews} reviews)</span>
                            {provider.isAcceptingPatients && (
                              <span className="ml-3 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                Accepting Patients
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                          <p className="text-sm text-gray-700">{provider.address}</p>
                        </div>
                        <div className="flex items-start">
                          <Phone className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                          <p className="text-sm text-gray-700">{provider.phone}</p>
                        </div>
                        <div className="flex items-start">
                          <Mail className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                          <p className="text-sm text-blue-600 hover:underline cursor-pointer">{provider.email}</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <ExternalLink className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                          <Share2 className="h-4 w-4" />
                          <span>Share Records</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={provider.id} className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Provider Info */}
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-3">
                          {provider.image ? (
                            <img src={provider.image} alt={provider.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            getInitials(provider.name)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900">{provider.name}</h3>
                            <button className={`ml-2 text-gray-400 hover:text-red-500 ${provider.isFavorite ? 'text-red-500' : ''}`}>
                              <Heart className={`h-4 w-4 ${provider.isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            {provider.isAcceptingPatients && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                Accepting Patients
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-600">{provider.specialty}</p>
                            <span className="mx-2 text-gray-300">•</span>
                            <p className="text-sm text-gray-600">{provider.hospital}</p>
                          </div>
                          <div className="flex items-center text-yellow-500 text-sm">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="ml-1">{provider.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({provider.reviews})</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="flex gap-6">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm">{provider.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm truncate max-w-[200px]">{provider.address}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          <span>Details</span>
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                          <span>Share Records</span>
                        </button>
                        <button className="px-2 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                          <MoreVertical className="h-4 w-4" />
                        </button>
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
  );
};

export default Providers; 