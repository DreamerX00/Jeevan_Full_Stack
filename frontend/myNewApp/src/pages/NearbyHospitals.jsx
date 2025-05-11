import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GoogleMapComponent from '../components/GoogleMapComponent';
import { FaMapMarkerAlt, FaArrowLeft, FaHospital, FaDirections, FaPhone, FaInfoCircle, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NearbyHospitals = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [hospitals, setHospitals] = useState([]);

  // Handle hospital selection either from map or list
  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
  };

  // Format Google Maps URL for directions
  const getDirectionsUrl = (hospital) => {
    if (!hospital || !hospital.geometry) return '';
    
    const destination = `${hospital.geometry.location.lat()},${hospital.geometry.location.lng()}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
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
    // For now returning a placeholder
    const random = (Math.random() * 5).toFixed(1);
    return `${random} km`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-red-500 h-6 w-6 mr-2" />
                <h1 className="text-3xl font-bold text-gray-900">Nearby Hospitals</h1>
              </div>
              
              {/* View toggle */}
              <div className="bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    viewMode === 'map' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List View
                </button>
              </div>
            </div>
            
            {viewMode === 'map' ? (
              // MAP VIEW
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Google Map - 2/3 of the width on large screens */}
                <div className="lg:col-span-2">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <GoogleMapComponent 
                      type="hospitals"
                      onPlaceSelect={(hospital) => {
                        setHospitals(prevHospitals => {
                          // Add hospital if it's not already in the list
                          if (!prevHospitals.some(h => h.place_id === hospital.place_id)) {
                            return [...prevHospitals, hospital];
                          }
                          return prevHospitals;
                        });
                        handleHospitalSelect(hospital);
                      }}
                    />
                  </div>
                </div>
                
                {/* Hospital details or list - 1/3 of the width on large screens */}
                <div className="lg:col-span-1">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {selectedHospital ? 'Hospital Details' : 'Hospitals Near You'}
                    </h2>
                    
                    {selectedHospital ? (
                      // Selected hospital details
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <FaInfoCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-500">Name</h3>
                            <p className="text-base text-gray-900">{selectedHospital.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-500">Address</h3>
                            <p className="text-base text-gray-900">{selectedHospital.vicinity}</p>
                          </div>
                        </div>
                        
                        {selectedHospital.formatted_phone_number && (
                          <div className="flex items-start">
                            <FaPhone className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                              <p className="text-base text-gray-900">{selectedHospital.formatted_phone_number}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-start">
                          <FaDirections className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-500">Distance</h3>
                            <p className="text-base text-gray-900">{calculateDistance(selectedHospital)} from your location</p>
                          </div>
                        </div>
                        
                        {selectedHospital.rating && (
                          <div className="flex items-start">
                            <FaStar className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                              <div className="flex items-center">
                                <p className="text-base text-gray-900 mr-2">{selectedHospital.rating}</p>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span 
                                      key={i} 
                                      className={`text-sm ${i < Math.floor(selectedHospital.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-4 flex justify-between">
                          <a 
                            href={getDirectionsUrl(selectedHospital)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <FaDirections className="mr-2" />
                            Directions
                          </a>
                          
                          <button 
                            onClick={() => handleCallHospital(selectedHospital)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            <FaPhone className="mr-2" />
                            Call
                          </button>
                        </div>
                      </div>
                    ) : (
                      // List of hospitals
                      <div className="space-y-4">
                        {hospitals.length > 0 ? (
                          hospitals.map((hospital, index) => (
                            <div 
                              key={hospital.place_id || index}
                              onClick={() => handleHospitalSelect(hospital)}
                              className="p-4 border rounded-lg cursor-pointer transition border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            >
                              <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <FaHospital className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-3 flex-1">
                                  <h3 className="text-lg font-medium text-gray-900">{hospital.name}</h3>
                                  <p className="text-sm text-gray-500">{calculateDistance(hospital)} away</p>
                                  {hospital.rating && (
                                    <div className="flex mt-2">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span 
                                          key={i} 
                                          className={`text-sm ${i < Math.floor(hospital.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                      <span className="text-xs text-gray-500 ml-1">({hospital.rating})</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">
                            No hospitals found yet. Click on the map to search in that area.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // LIST VIEW
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search hospitals by name or area"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>
                
                {/* List of hospitals */}
                <div className="space-y-4">
                  {hospitals.length > 0 ? (
                    hospitals.map((hospital, index) => (
                      <div 
                        key={hospital.place_id || index}
                        className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg border-gray-200 hover:border-blue-300 transition"
                      >
                        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-center md:w-24">
                          <FaHospital className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{hospital.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{hospital.vicinity}</p>
                          
                          {hospital.rating && (
                            <div className="flex mt-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`text-sm ${i < Math.floor(hospital.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="text-xs text-gray-500 ml-1">({hospital.rating})</span>
                            </div>
                          )}
                          
                          <div className="mt-3 flex items-center text-sm text-gray-500">
                            <FaMapMarkerAlt className="mr-1 text-red-500" />
                            {calculateDistance(hospital)} away
                            
                            {hospital.opening_hours && (
                              <span className={`ml-4 ${hospital.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                                {hospital.opening_hours.open_now ? '• Open Now' : '• Closed'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex md:flex-col gap-2 justify-end">
                          <a 
                            href={getDirectionsUrl(hospital)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            <FaDirections className="mr-1" />
                            Directions
                          </a>
                          <button 
                            onClick={() => handleCallHospital(hospital)}
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                          >
                            <FaPhone className="mr-1" />
                            Call
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FaMapMarkerAlt className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No hospitals found</h3>
                      <p className="text-gray-500 text-center">
                        Switch to Map View and search for hospitals in your area
                      </p>
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