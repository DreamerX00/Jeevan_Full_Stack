import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GoogleMapComponent from '../components/GoogleMapComponent';
import { FaMapMarkerAlt, FaArrowLeft, FaHospital, FaDirections, FaPhone, FaInfoCircle, FaStar, FaSearch, FaGlobe, FaClock, FaDollarSign, FaClipboardList } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const NearbyHospitals = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [hospitals, setHospitals] = useState([]);
  const { darkMode } = useTheme();
  const [dayOfWeek, setDayOfWeek] = useState(0); // 0 = Sunday, 1 = Monday, etc.
  const [searchQuery, setSearchQuery] = useState('');

  // Set the current day of week on component mount
  useEffect(() => {
    const today = new Date();
    setDayOfWeek(today.getDay());
  }, []);

  // Handle hospital selection either from map or list
  const handleHospitalSelect = (hospital) => {
    console.log("Selected hospital details:", {
      name: hospital.name,
      isOpenNow: hospital.isOpenNow,
      business_status: hospital.business_status,
      opening_hours: hospital.opening_hours ? {
        open_now: hospital.opening_hours.open_now,
        hasIsOpenFunc: typeof hospital.opening_hours.isOpen === 'function',
      } : null
    });
    setSelectedHospital(hospital);
  };

  // Format Google Maps URL for directions
  const getDirectionsUrl = (hospital) => {
    if (!hospital) return '';
    
    // Case 1: Use the direct Google Maps URL if available
    if (hospital.url) {
      return hospital.url;
    }
    // Case 2: Hospital has direct place_id
    else if (hospital.place_id || hospital.id) {
      const placeId = hospital.place_id || hospital.id;
      return `https://www.google.com/maps/dir/?api=1&destination=place_id:${placeId}&travelmode=driving&dir_action=navigate`;
    }
    // Case 3: Hospital has geometry (coordinates)
    else if (hospital.geometry) {
      const destination = `${hospital.geometry.location.lat()},${hospital.geometry.location.lng()}`;
      return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate`;
    }
    // Case 4: Hospital has no valid location data
    else {
      console.error("Hospital missing location data:", hospital);
      return '';
    }
  };

  // Open phone dialer
  const handleCallHospital = (hospital) => {
    if (!hospital || !hospital.formatted_phone_number) {
      alert("Phone number not available");
      return;
    }
    
    window.open(`tel:${hospital.formatted_phone_number}`);
  };

  // Calculate distance between two points (placeholder - in real app would use actual calculation)
  const calculateDistance = (hospital) => {
    if (!hospital) return "Unknown";
    
    // In a real app, this would be calculated from user location to hospital
    // For now, use a stable value based on the place_id instead of a random number to prevent flickering
    if (hospital.place_id) {
      // Generate a stable "distance" value based on the place_id hash
      // This ensures the same hospital always shows the same distance
      const hash = hospital.place_id.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);
      
      // Generate a value between 0.5 and 5.0 km
      const distance = (0.5 + (hash % 45) / 10).toFixed(1);
      return `${distance} km`;
    }
    
    // Fallback to a fixed value if no place_id
    return "2.5 km";
  };

  // Format price level
  const formatPriceLevel = (level) => {
    if (level === undefined || level === null) return "Price information not available";
    
    const dollars = Array(level).fill('$').join('');
    return dollars || '$';
  };

  // Format opening hours
  const getOpeningHours = (hospital) => {
    if (!hospital || !hospital.opening_hours || !hospital.opening_hours.weekday_text) {
      return null;
    }
    
    return hospital.opening_hours.weekday_text;
  };

  // Check if the hospital is currently open
  const isOpen = (hospital) => {
    if (!hospital) return null;
    
    // If hospital is temporarily or permanently closed, return false
    if (hospital.business_status === 'CLOSED_TEMPORARILY' || 
        hospital.business_status === 'CLOSED_PERMANENTLY') {
      return false;
    }
    
    // Use pre-calculated isOpenNow value if available
    if (hospital.isOpenNow !== undefined) {
      return hospital.isOpenNow;
    }
    
    // Fallback to opening_hours if available
    if (hospital.opening_hours) {
      if (typeof hospital.opening_hours.isOpen === 'function') {
        try {
          return hospital.opening_hours.isOpen();
        } catch (error) {
          console.error("Error using isOpen function:", error);
          return hospital.opening_hours.open_now !== undefined ? 
            hospital.opening_hours.open_now : true; // Default to open for hospitals
        }
      }
      
      return hospital.opening_hours.open_now !== undefined ? 
        hospital.opening_hours.open_now : true; // Default to open for hospitals
    }
    
    // For hospitals, default to open (many hospitals operate 24/7 especially for emergencies)
    return true;
  };

  // Check if hospital is temporarily or permanently closed
  const getBusinessStatus = (hospital) => {
    if (!hospital) return null;
    
    if (hospital.business_status === 'CLOSED_TEMPORARILY') {
      return 'Temporarily Closed';
    } else if (hospital.business_status === 'CLOSED_PERMANENTLY') {
      return 'Permanently Closed';
    }
    
    return null;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <Link to="/" className={`inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200`}>
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-red-500 h-6 w-6 mr-2" />
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Nearby Hospitals</h1>
              </div>
              
              {/* View toggle */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-1 transition-colors duration-200`}>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    viewMode === 'map' 
                      ? darkMode 
                        ? 'bg-gray-700 text-blue-400' 
                        : 'bg-white shadow-sm text-blue-600' 
                      : darkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? darkMode 
                        ? 'bg-gray-700 text-blue-400' 
                        : 'bg-white shadow-sm text-blue-600' 
                      : darkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List View
                </button>
              </div>
            </div>
            
            {viewMode === 'map' ? (
              // MAP VIEW - Now with map taking full width and details below
              <div className="flex flex-col gap-6">
                {/* Google Map - now full width */}
                <div className="w-full">
                  <GoogleMapComponent 
                    type="hospitals"
                    onPlaceSelect={(hospital) => {
                      // Add hospital if it's not already in the list
                      setHospitals(prevHospitals => {
                        if (!prevHospitals.some(h => (h.place_id || h.id) === (hospital.place_id || hospital.id))) {
                          return [...prevHospitals, hospital];
                        }
                        return prevHospitals;
                      });
                      handleHospitalSelect(hospital);
                    }}
                    onPlacesFound={(foundHospitals) => {
                      // Log the first few hospitals for debugging
                      console.log("Found hospitals sample:", foundHospitals.slice(0, 3).map(h => ({
                        name: h.name,
                        isOpenNow: h.isOpenNow,
                        business_status: h.business_status,
                        hasOpeningHours: !!h.opening_hours,
                        openNowValue: h.opening_hours ? h.opening_hours.open_now : null
                      })));
                      
                      // Update the hospitals list with all found places
                      setHospitals(foundHospitals.map(place => ({
                        ...place,
                        id: place.place_id,
                        place_id: place.place_id
                      })));
                    }}
                    autoSelectOnMarkerClick={true}
                  />
                </div>
                
                {/* Hospital details or list - now below the map */}
                <div className="w-full">
                  <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} p-4 rounded-xl shadow-sm transition-colors duration-200`}>
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-200`}>
                      {selectedHospital ? 'Hospital Details' : 'Hospitals Near You'}
                    </h2>
                    
                    {selectedHospital ? (
                      // Selected hospital details - Enhanced with more information
                      <div className="md:flex md:gap-6">
                        <div className="space-y-4 md:w-1/2">
                          <div className="flex items-start">
                            <FaInfoCircle className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                            <div className="ml-3">
                              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Name</h3>
                              <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{selectedHospital.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FaMapMarkerAlt className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                            <div className="ml-3">
                              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Address</h3>
                              <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {selectedHospital.formatted_address || selectedHospital.vicinity || "Address not available"}
                              </p>
                            </div>
                          </div>
                          
                          {selectedHospital.formatted_phone_number && (
                            <div className="flex items-start">
                              <FaPhone className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Phone</h3>
                                <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{selectedHospital.formatted_phone_number}</p>
                              </div>
                            </div>
                          )}
                          
                          {selectedHospital.website && (
                            <div className="flex items-start">
                              <FaGlobe className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Website</h3>
                                <a 
                                  href={selectedHospital.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={`text-base ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200`}
                                >
                                  Visit Website
                                </a>
                              </div>
                            </div>
                          )}
                          
                          {selectedHospital.price_level !== undefined && (
                            <div className="flex items-start">
                              <FaDollarSign className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Price Level</h3>
                                <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                  {Array(selectedHospital.price_level).fill('$').join('')}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4 md:w-1/2 mt-4 md:mt-0">
                          <div className="flex items-start">
                            <FaDirections className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                            <div className="ml-3">
                              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Distance</h3>
                              <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{calculateDistance(selectedHospital)} from your location</p>
                            </div>
                          </div>
                          
                          {selectedHospital.rating && (
                            <div className="flex items-start">
                              <FaStar className="h-5 w-5 text-yellow-500 mt-0.5" />
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Rating</h3>
                                <div className="flex items-center">
                                  <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} mr-2 transition-colors duration-200`}>{selectedHospital.rating}</p>
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span 
                                        key={i} 
                                        className={`text-sm ${i < Math.floor(selectedHospital.rating) ? 'text-yellow-500' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {selectedHospital.opening_hours && (
                            <div className="flex items-start">
                              <FaClock className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Hours</h3>
                                {getBusinessStatus(selectedHospital) ? (
                                  <p className={`text-base font-medium px-2 py-1 inline-block rounded ${
                                    selectedHospital.business_status === 'CLOSED_TEMPORARILY' 
                                      ? darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800'
                                      : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                  } transition-colors duration-200`}>
                                    {getBusinessStatus(selectedHospital)}
                                  </p>
                                ) : (
                                  <p className={`text-base font-medium px-2 py-1 inline-block rounded ${
                                    isOpen(selectedHospital) 
                                      ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                      : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                  } transition-colors duration-200`}>
                                    {isOpen(selectedHospital) ? 'Open Now' : 'Closed'}
                                    {selectedHospital.isOpenNow !== undefined && !isOpen(selectedHospital) && selectedHospital.isOpenNow ? ' (Data Error)' : ''}
                                  </p>
                                )}
                                {getOpeningHours(selectedHospital) && (
                                  <div className="mt-1">
                                    <button 
                                      onClick={() => document.getElementById('opening-hours-modal').classList.toggle('hidden')}
                                      className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200`}
                                    >
                                      View Hours
                                    </button>
                                    <div id="opening-hours-modal" className={`hidden mt-2 p-2 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                      {getOpeningHours(selectedHospital).map((day, index) => (
                                        <p 
                                          key={index} 
                                          className={`text-xs mb-1 ${index === dayOfWeek ? (darkMode ? 'text-blue-400' : 'text-blue-600 font-medium') : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}
                                        >
                                          {day}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="pt-4 flex justify-end gap-4">
                            <a 
                              href={getDirectionsUrl(selectedHospital)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                              <FaDirections className="mr-2" />
                              Directions
                            </a>
                            
                            {selectedHospital.formatted_phone_number && (
                              <button 
                                onClick={() => handleCallHospital(selectedHospital)}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                              >
                                <FaPhone className="mr-2" />
                                Call
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List of hospitals
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hospitals.length > 0 ? (
                          hospitals.map((hospital, index) => (
                            <div 
                              key={hospital.place_id || hospital.id || index}
                              onClick={() => handleHospitalSelect(hospital)}
                              className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                                darkMode 
                                  ? 'border-gray-700 hover:border-blue-700 hover:bg-gray-800' 
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-full transition-colors duration-200`}>
                                  <FaHospital className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-200`} />
                                </div>
                                <div className="ml-3 flex-1">
                                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{hospital.name}</h3>
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{calculateDistance(hospital)} away</p>
                                  {hospital.rating && (
                                    <div className="flex mt-2">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span 
                                          key={i} 
                                          className={`text-sm ${i < Math.floor(hospital.rating) ? 'text-yellow-500' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} ml-1 transition-colors duration-200`}>({hospital.rating})</span>
                                    </div>
                                  )}
                                  {getBusinessStatus(hospital) ? (
                                    <p className={`text-xs mt-1 px-2 py-1 rounded-full ${
                                      hospital.business_status === 'CLOSED_TEMPORARILY' 
                                        ? darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800'
                                        : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {getBusinessStatus(hospital)}
                                    </p>
                                  ) : (
                                    isOpen(hospital) !== null && (
                                      <p className={`text-xs mt-1 px-2 py-1 rounded-full ${
                                        isOpen(hospital) 
                                          ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                          : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {isOpen(hospital) ? 'Open Now' : 'Closed'}
                                        {hospital.isOpenNow !== undefined && !isOpen(hospital) && hospital.isOpenNow ? ' (Data Error)' : ''}
                                      </p>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={`flex flex-col items-center justify-center py-8 col-span-full ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                            <FaMapMarkerAlt className={`mb-3 h-10 w-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-200`} />
                            <p className="text-center mb-2">Select a hospital from the map to view details.</p>
                            <p className="text-center text-sm">You can click on the map to search in a specific area.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // LIST VIEW
              <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm p-6`}>
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search hospitals by name or area"
                      className={`w-full p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border border-gray-300 text-gray-700'
                      }`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && document.getElementById('search-btn').click()}
                    />
                    <FaSearch className={`absolute left-3 top-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <button 
                      id="search-btn"
                      className="absolute right-3 top-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => {
                        // This search will be handled by the GoogleMapComponent
                        // Just focus on the map view
                        setViewMode('map');
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
                
                {/* List of hospitals */}
                <div className="space-y-4">
                  {hospitals.length > 0 ? (
                    <div>
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Found {hospitals.length} hospital{hospitals.length !== 1 ? 's' : ''}
                        </h3>
                        {selectedHospital && (
                          <button 
                            onClick={() => setSelectedHospital(null)}
                            className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                          >
                            Clear Selection
                          </button>
                        )}
                      </div>
                      
                      {selectedHospital && (
                        <div className={`mb-6 p-4 border rounded-lg ${
                          darkMode 
                            ? 'border-blue-700 bg-gray-800' 
                            : 'border-blue-300 bg-blue-50'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-3 rounded-full`}>
                                <FaHospital className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                              </div>
                              <div className="ml-4">
                                <h3 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {selectedHospital.name}
                                </h3>
                                <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {selectedHospital.formatted_address || selectedHospital.vicinity || "Address not available"}
                                </p>
                                
                                <div className="mt-3 flex flex-wrap gap-4">
                                  {selectedHospital.formatted_phone_number && (
                                    <button 
                                      onClick={() => handleCallHospital(selectedHospital)}
                                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                    >
                                      <FaPhone className="mr-1" />
                                      Call
                                    </button>
                                  )}
                                  
                                  <a 
                                    href={getDirectionsUrl(selectedHospital)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                  >
                                    <FaDirections className="mr-1" />
                                    Directions
                                  </a>
                                  
                                  {selectedHospital.website && (
                                    <a 
                                      href={selectedHospital.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                                    >
                                      <FaGlobe className="mr-1" />
                                      Website
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              {selectedHospital.rating && (
                                <div className="flex items-center justify-end mb-1">
                                  <span className={`text-lg font-bold mr-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {selectedHospital.rating}
                                  </span>
                                  <FaStar className="text-yellow-500" />
                                </div>
                              )}
                              
                              {getBusinessStatus(selectedHospital) ? (
                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                  selectedHospital.business_status === 'CLOSED_TEMPORARILY' 
                                    ? darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800'
                                    : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                }`}>
                                  {getBusinessStatus(selectedHospital)}
                                </span>
                              ) : (
                                isOpen(selectedHospital) !== null && (
                                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                                    isOpen(selectedHospital) 
                                      ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                      : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {isOpen(selectedHospital) ? 'Open Now' : 'Closed'}
                                    {selectedHospital.isOpenNow !== undefined && !isOpen(selectedHospital) && selectedHospital.isOpenNow ? ' (Data Error)' : ''}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hospitals.map((hospital, index) => (
                          <div 
                            key={hospital.place_id || hospital.id || index}
                            onClick={() => handleHospitalSelect(hospital)}
                            className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                              selectedHospital && (selectedHospital.place_id || selectedHospital.id) === (hospital.place_id || hospital.id)
                                ? darkMode 
                                  ? 'border-blue-700 bg-gray-800 shadow-lg' 
                                  : 'border-blue-300 bg-blue-50 shadow-lg' 
                                : darkMode 
                                  ? 'border-gray-700 hover:border-blue-700 hover:bg-gray-800' 
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start flex-1">
                                <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-full transition-colors duration-200`}>
                                  <FaHospital className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-200`} />
                                </div>
                                <div className="ml-3 flex-1">
                                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{hospital.name}</h3>
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                    {hospital.vicinity || hospital.formatted_address}
                                  </p>
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{calculateDistance(hospital)} away</p>
                                  
                                  {hospital.rating && (
                                    <div className="flex mt-2">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span 
                                          key={i} 
                                          className={`text-sm ${i < Math.floor(hospital.rating) ? 'text-yellow-500' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} ml-1 transition-colors duration-200`}>({hospital.rating})</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                {getBusinessStatus(hospital) ? (
                                  <p className={`text-xs mt-1 px-2 py-1 rounded-full ${
                                    hospital.business_status === 'CLOSED_TEMPORARILY' 
                                      ? darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800'
                                      : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {getBusinessStatus(hospital)}
                                  </p>
                                ) : (
                                  isOpen(hospital) !== null && (
                                    <p className={`text-xs mt-1 px-2 py-1 rounded-full ${
                                      isOpen(hospital) 
                                        ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                        : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {isOpen(hospital) ? 'Open Now' : 'Closed'}
                                      {hospital.isOpenNow !== undefined && !isOpen(hospital) && hospital.isOpenNow ? ' (Data Error)' : ''}
                                    </p>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FaMapMarkerAlt className={`h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} />
                      <h3 className={`text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>No hospitals found</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-8`}>
                        Switch to Map View and search for hospitals in your area
                      </p>
                      <button
                        onClick={() => setViewMode('map')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Go to Map View
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NearbyHospitals; 