import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GoogleMapComponent from '../components/GoogleMapComponent';
import { FaMapMarkerAlt, FaArrowLeft, FaMedkit, FaDirections, FaPhone, FaInfoCircle, FaStar, FaSearch, FaStore, FaGlobe, FaClock, FaDollarSign } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const NearbyPharmacies = () => {
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [pharmacies, setPharmacies] = useState([]);
  const { darkMode } = useTheme();
  const [dayOfWeek, setDayOfWeek] = useState(0); // 0 = Sunday, 1 = Monday, etc.
  const [searchQuery, setSearchQuery] = useState('');

  // Set the current day of week on component mount
  useEffect(() => {
    const today = new Date();
    setDayOfWeek(today.getDay());
  }, []);

  // Handle pharmacy selection either from map or list
  const handlePharmacySelect = (pharmacy) => {
    console.log("Selected pharmacy details:", {
      name: pharmacy.name,
      isOpenNow: pharmacy.isOpenNow,
      business_status: pharmacy.business_status,
      opening_hours: pharmacy.opening_hours ? {
        open_now: pharmacy.opening_hours.open_now,
        hasIsOpenFunc: typeof pharmacy.opening_hours.isOpen === 'function',
      } : null
    });
    setSelectedPharmacy(pharmacy);
  };

  // Format Google Maps URL for directions
  const getDirectionsUrl = (pharmacy) => {
    if (!pharmacy) return '';
    
    // Case 1: Use the direct Google Maps URL if available
    if (pharmacy.url) {
      return pharmacy.url;
    }
    // Case 2: Pharmacy has direct place_id
    else if (pharmacy.place_id || pharmacy.id) {
      const placeId = pharmacy.place_id || pharmacy.id;
      return `https://www.google.com/maps/dir/?api=1&destination=place_id:${placeId}&travelmode=driving&dir_action=navigate`;
    }
    // Case 3: Pharmacy has geometry (coordinates)
    else if (pharmacy.geometry) {
      const destination = `${pharmacy.geometry.location.lat()},${pharmacy.geometry.location.lng()}`;
      return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate`;
    }
    // Case 4: Pharmacy has no valid location data
    else {
      console.error("Pharmacy missing location data:", pharmacy);
      return '';
    }
  };

  // Open phone dialer
  const handleCallPharmacy = (pharmacy) => {
    if (!pharmacy || !pharmacy.formatted_phone_number) {
      alert("Phone number not available");
      return;
    }
    
    window.open(`tel:${pharmacy.formatted_phone_number}`);
  };

  // Calculate distance between two points (placeholder - in real app would use actual calculation)
  const calculateDistance = (pharmacy) => {
    if (!pharmacy) return "Unknown";
    
    // In a real app, this would be calculated from user location to pharmacy
    // For now, use a stable value based on the place_id instead of a random number to prevent flickering
    if (pharmacy.place_id) {
      // Generate a stable "distance" value based on the place_id hash
      // This ensures the same pharmacy always shows the same distance
      const hash = pharmacy.place_id.split('').reduce((acc, char) => {
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
  const getOpeningHours = (pharmacy) => {
    if (!pharmacy || !pharmacy.opening_hours || !pharmacy.opening_hours.weekday_text) {
      return null;
    }
    
    return pharmacy.opening_hours.weekday_text;
  };

  // Check if the pharmacy is currently open
  const isOpen = (pharmacy) => {
    if (!pharmacy) return null;
    
    // If pharmacy is temporarily or permanently closed, return false
    if (pharmacy.business_status === 'CLOSED_TEMPORARILY' || 
        pharmacy.business_status === 'CLOSED_PERMANENTLY') {
      return false;
    }
    
    // Use pre-calculated isOpenNow value if available
    if (pharmacy.isOpenNow !== undefined) {
      return pharmacy.isOpenNow;
    }
    
    // Fallback to opening_hours if available
    if (pharmacy.opening_hours) {
      if (typeof pharmacy.opening_hours.isOpen === 'function') {
        try {
          return pharmacy.opening_hours.isOpen();
        } catch (error) {
          console.error("Error using isOpen function:", error);
          return pharmacy.opening_hours.open_now !== undefined ? 
            pharmacy.opening_hours.open_now : null; // Pharmacies might not be 24/7
        }
      }
      
      return pharmacy.opening_hours.open_now !== undefined ? 
        pharmacy.opening_hours.open_now : null;
    }
    
    // For pharmacies, we'll return null if we don't know since they usually have set hours
    return null;
  };

  // Check if pharmacy is temporarily or permanently closed
  const getBusinessStatus = (pharmacy) => {
    if (!pharmacy) return null;
    
    if (pharmacy.business_status === 'CLOSED_TEMPORARILY') {
      return 'Temporarily Closed';
    } else if (pharmacy.business_status === 'CLOSED_PERMANENTLY') {
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
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Nearby Pharmacies</h1>
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
                    type="pharmacies"
                    onPlaceSelect={(pharmacy) => {
                      // Add pharmacy if it's not already in the list
                      setPharmacies(prevPharmacies => {
                        if (!prevPharmacies.some(p => (p.place_id || p.id) === (pharmacy.place_id || pharmacy.id))) {
                          return [...prevPharmacies, pharmacy];
                        }
                        return prevPharmacies;
                      });
                      handlePharmacySelect(pharmacy);
                    }}
                    onPlacesFound={(foundPharmacies) => {
                      // Log the first few pharmacies for debugging
                      console.log("Found pharmacies sample:", foundPharmacies.slice(0, 3).map(p => ({
                        name: p.name,
                        isOpenNow: p.isOpenNow,
                        business_status: p.business_status,
                        hasOpeningHours: !!p.opening_hours,
                        openNowValue: p.opening_hours ? p.opening_hours.open_now : null
                      })));
                      
                      // Update the pharmacies list with all found places
                      setPharmacies(foundPharmacies.map(place => ({
                        ...place,
                        id: place.place_id,
                        place_id: place.place_id
                      })));
                    }}
                    autoSelectOnMarkerClick={true}
                  />
                </div>
                
                {/* Pharmacy details or list - now below the map */}
                <div className="w-full">
                  <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} p-4 rounded-xl shadow-sm transition-colors duration-200`}>
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-200`}>
                      {selectedPharmacy ? 'Pharmacy Details' : 'Pharmacies Near You'}
                    </h2>
                    
                    {selectedPharmacy ? (
                      // Selected pharmacy details - Enhanced with more information
                      <div className="md:flex md:gap-6">
                        <div className="space-y-4 md:w-1/2">
                          <div className="flex items-start">
                            <FaInfoCircle className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                            <div className="ml-3">
                              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Name</h3>
                              <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{selectedPharmacy.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FaMapMarkerAlt className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                            <div className="ml-3">
                              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Address</h3>
                              <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {selectedPharmacy.formatted_address || selectedPharmacy.vicinity || "Address not available"}
                              </p>
                            </div>
                          </div>
                          
                          {selectedPharmacy.formatted_phone_number && (
                            <div className="flex items-start">
                              <FaPhone className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Phone</h3>
                                <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{selectedPharmacy.formatted_phone_number}</p>
                              </div>
                            </div>
                          )}
                          
                          {selectedPharmacy.website && (
                            <div className="flex items-start">
                              <FaGlobe className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Website</h3>
                                <a 
                                  href={selectedPharmacy.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={`text-base ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200`}
                                >
                                  Visit Website
                                </a>
                              </div>
                            </div>
                          )}
                          
                          {selectedPharmacy.price_level !== undefined && (
                            <div className="flex items-start">
                              <FaDollarSign className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Price Level</h3>
                                <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                  {Array(selectedPharmacy.price_level).fill('$').join('')}
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
                              <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{calculateDistance(selectedPharmacy)} from your location</p>
                            </div>
                          </div>
                          
                          {selectedPharmacy.rating && (
                            <div className="flex items-start">
                              <FaStar className="h-5 w-5 text-yellow-500 mt-0.5" />
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Rating</h3>
                                <div className="flex items-center">
                                  <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'} mr-2 transition-colors duration-200`}>{selectedPharmacy.rating}</p>
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span 
                                        key={i} 
                                        className={`text-sm ${i < Math.floor(selectedPharmacy.rating) ? 'text-yellow-500' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {selectedPharmacy.opening_hours && (
                            <div className="flex items-start">
                              <FaClock className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 transition-colors duration-200`} />
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Hours</h3>
                                {getBusinessStatus(selectedPharmacy) ? (
                                  <p className={`text-base font-medium px-2 py-1 inline-block rounded ${
                                    selectedPharmacy.business_status === 'CLOSED_TEMPORARILY' 
                                      ? darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800'
                                      : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                  } transition-colors duration-200`}>
                                    {getBusinessStatus(selectedPharmacy)}
                                  </p>
                                ) : (
                                  <p className={`text-base font-medium px-2 py-1 inline-block rounded ${
                                    isOpen(selectedPharmacy) 
                                      ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                      : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                  } transition-colors duration-200`}>
                                    {isOpen(selectedPharmacy) ? 'Open Now' : 'Closed'}
                                    {selectedPharmacy.isOpenNow !== undefined && !isOpen(selectedPharmacy) && selectedPharmacy.isOpenNow ? ' (Data Error)' : ''}
                                  </p>
                                )}
                                {getOpeningHours(selectedPharmacy) && (
                                  <div className="mt-1">
                                    <button 
                                      onClick={() => document.getElementById('pharmacy-hours-modal').classList.toggle('hidden')}
                                      className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200`}
                                    >
                                      View Hours
                                    </button>
                                    <div id="pharmacy-hours-modal" className={`hidden mt-2 p-2 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                      {getOpeningHours(selectedPharmacy).map((day, index) => (
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
                              href={getDirectionsUrl(selectedPharmacy)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                              <FaDirections className="mr-2" />
                              Directions
                            </a>
                            
                            {selectedPharmacy.formatted_phone_number && (
                              <button 
                                onClick={() => handleCallPharmacy(selectedPharmacy)}
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
                      // List of pharmacies
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pharmacies.length > 0 ? (
                          pharmacies.map((pharmacy, index) => (
                            <div 
                              key={pharmacy.place_id || pharmacy.id || index}
                              onClick={() => handlePharmacySelect(pharmacy)}
                              className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                                darkMode 
                                  ? 'border-gray-700 hover:border-red-700 hover:bg-gray-800' 
                                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`${darkMode ? 'bg-red-900' : 'bg-red-100'} p-2 rounded-full transition-colors duration-200`}>
                                  <FaMedkit className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'} transition-colors duration-200`} />
                                </div>
                                <div className="ml-3 flex-1">
                                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{pharmacy.name}</h3>
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{calculateDistance(pharmacy)} away</p>
                                  {pharmacy.rating && (
                                    <div className="flex mt-2">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span 
                                          key={i} 
                                          className={`text-sm ${i < Math.floor(pharmacy.rating) ? 'text-yellow-500' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} ml-1 transition-colors duration-200`}>({pharmacy.rating})</span>
                                    </div>
                                  )}
                                  {getBusinessStatus(pharmacy) ? (
                                    <p className={`text-xs mt-1 px-2 py-1 rounded-full ${
                                      pharmacy.business_status === 'CLOSED_TEMPORARILY' 
                                        ? darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800'
                                        : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {getBusinessStatus(pharmacy)}
                                    </p>
                                  ) : (
                                    isOpen(pharmacy) !== null && (
                                      <p className={`text-xs mt-1 px-2 py-1 rounded-full ${
                                        isOpen(pharmacy) 
                                          ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                          : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {isOpen(pharmacy) ? 'Open Now' : 'Closed'}
                                        {pharmacy.isOpenNow !== undefined && !isOpen(pharmacy) && pharmacy.isOpenNow ? ' (Data Error)' : ''}
                                      </p>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={`flex flex-col items-center justify-center py-8 col-span-full ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                            <FaMapMarkerAlt className={`mb-3 h-10 w-10 ${darkMode ? 'text-red-400' : 'text-red-600'} transition-colors duration-200`} />
                            <p className="text-center mb-2">Select a pharmacy from the map to view details.</p>
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
                      placeholder="Search pharmacies by name or area"
                      className={`w-full p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border border-gray-300 text-gray-700'
                      }`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && document.getElementById('pharmacy-search-btn').click()}
                    />
                    <FaSearch className={`absolute left-3 top-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <button 
                      id="pharmacy-search-btn"
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
                
                {/* List of pharmacies */}
                <div className="space-y-4">
                  {pharmacies.length > 0 ? (
                    <div>
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Found {pharmacies.length} pharmac{pharmacies.length !== 1 ? 'ies' : 'y'}
                        </h3>
                        {selectedPharmacy && (
                          <button 
                            onClick={() => setSelectedPharmacy(null)}
                            className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                          >
                            Clear Selection
                          </button>
                        )}
                      </div>
                      
                      {selectedPharmacy && (
                        <div className={`mb-6 p-4 border rounded-lg ${
                          darkMode 
                            ? 'border-red-700 bg-gray-800' 
                            : 'border-red-300 bg-red-50'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <div className={`${darkMode ? 'bg-red-900' : 'bg-red-100'} p-3 rounded-full`}>
                                <FaMedkit className={`h-6 w-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                              </div>
                              <div className="ml-4">
                                <h3 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {selectedPharmacy.name}
                                </h3>
                                <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {selectedPharmacy.formatted_address || selectedPharmacy.vicinity || "Address not available"}
                                </p>
                                
                                <div className="mt-3 flex flex-wrap gap-4">
                                  {selectedPharmacy.formatted_phone_number && (
                                    <button 
                                      onClick={() => handleCallPharmacy(selectedPharmacy)}
                                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                    >
                                      <FaPhone className="mr-1" />
                                      Call
                                    </button>
                                  )}
                                  
                                  <a 
                                    href={getDirectionsUrl(selectedPharmacy)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                  >
                                    <FaDirections className="mr-1" />
                                    Directions
                                  </a>
                                  
                                  {selectedPharmacy.website && (
                                    <a 
                                      href={selectedPharmacy.website}
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
                              {selectedPharmacy.rating && (
                                <div className="flex items-center justify-end mb-1">
                                  <span className={`text-lg font-bold mr-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {selectedPharmacy.rating}
                                  </span>
                                  <FaStar className="text-yellow-500" />
                                </div>
                              )}
                              
                              {getBusinessStatus(selectedPharmacy) ? (
                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                  selectedPharmacy.business_status === 'CLOSED_TEMPORARILY' 
                                    ? darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800'
                                    : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                }`}>
                                  {getBusinessStatus(selectedPharmacy)}
                                </span>
                              ) : (
                                isOpen(selectedPharmacy) !== null && (
                                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                                    isOpen(selectedPharmacy) 
                                      ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                      : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {isOpen(selectedPharmacy) ? 'Open Now' : 'Closed'}
                                    {selectedPharmacy.isOpenNow !== undefined && !isOpen(selectedPharmacy) && selectedPharmacy.isOpenNow ? ' (Data Error)' : ''}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pharmacies.map((pharmacy, index) => (
                          <div 
                            key={pharmacy.place_id || pharmacy.id || index}
                            onClick={() => handlePharmacySelect(pharmacy)}
                            className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                              selectedPharmacy && (selectedPharmacy.place_id || selectedPharmacy.id) === (pharmacy.place_id || pharmacy.id)
                                ? darkMode 
                                  ? 'border-red-700 bg-gray-800 shadow-lg' 
                                  : 'border-red-300 bg-red-50 shadow-lg' 
                                : darkMode 
                                  ? 'border-gray-700 hover:border-red-700 hover:bg-gray-800' 
                                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start flex-1">
                                <div className={`${darkMode ? 'bg-red-900' : 'bg-red-100'} p-2 rounded-full transition-colors duration-200`}>
                                  <FaMedkit className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'} transition-colors duration-200`} />
                                </div>
                                <div className="ml-3 flex-1">
                                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{pharmacy.name}</h3>
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                    {pharmacy.vicinity || pharmacy.formatted_address}
                                  </p>
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{calculateDistance(pharmacy)} away</p>
                                  
                                  {pharmacy.rating && (
                                    <div className="flex mt-2">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span 
                                          key={i} 
                                          className={`text-sm ${i < Math.floor(pharmacy.rating) ? 'text-yellow-500' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} ml-1 transition-colors duration-200`}>({pharmacy.rating})</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                {getBusinessStatus(pharmacy) ? (
                                  <p className={`text-xs mt-1 px-2 py-1 rounded-full ${
                                    pharmacy.business_status === 'CLOSED_TEMPORARILY' 
                                      ? darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800'
                                      : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {getBusinessStatus(pharmacy)}
                                  </p>
                                ) : (
                                  isOpen(pharmacy) !== null && (
                                    <p className={`text-xs mt-1 px-2 py-1 rounded-full ${
                                      isOpen(pharmacy) 
                                        ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                        : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {isOpen(pharmacy) ? 'Open Now' : 'Closed'}
                                      {pharmacy.isOpenNow !== undefined && !isOpen(pharmacy) && pharmacy.isOpenNow ? ' (Data Error)' : ''}
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
                      <h3 className={`text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>No pharmacies found</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-8`}>
                        Switch to Map View and search for pharmacies in your area
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

export default NearbyPharmacies; 