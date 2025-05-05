import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaMapMarkerAlt, FaArrowLeft, FaHospital, FaDirections, FaPhone, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NearbyHospitals = () => {
  const [hospitals, setHospitals] = useState([
    {
      id: 1,
      name: "Sehgal Neo Hospital",
      distance: "1.2 km",
      address: "B-362 363, 364, Outer Ring Rd, near to ICICI Bank, Block B, Meera Bagh, Paschim Vihar, New Delhi, Delhi, 110063",
      phone: "+91 9099658497",
      specialties: ["Emergency", "Cardiology", "Pediatrics"],
      rating: 4.4
    },
    {
      id: 2,
      name: "Balaji hospital",
      distance: "2.5 km",
      address: "B-1/17A, Vir Chakra Captain Kumud Kumar Marg, A 4 Block, B 1 Block, Paschim Vihar, Delhi, 110063",
      phone: "+91 11 4556 5656",
      specialties: ["Orthopedics", "Neurology", "Oncology"],
      rating: 3.5
    },
    {
      id: 3,
      name: "B K Memorial Hospital",
      distance: "3.8 km",
      address: "A-4/22 Paschim Vihar, New Delhi, Delhi 110063",
      phone: "+91 11 4545 2222",
      specialties: ["Cardiology", "Surgery", "Gynecology"],
      rating: 4.5
    }
  ]);

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapUrl, setMapUrl] = useState("https://www.openstreetmap.org/export/embed.html?bbox=77.00857344474787%2C28.532975584650035%2C77.24958601799007%2C28.62583466936243&amp;layer=mapnik");

  // Update map when a hospital is selected
  useEffect(() => {
    if (selectedHospital) {
      // In a real app, you would use the hospital's coordinates
      // This is just a placeholder to demonstrate the concept
      const newMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=77.00857344474787%2C28.532975584650035%2C77.24958601799007%2C28.62583466936243&amp;layer=mapnik&amp;marker=${selectedHospital.id === 1 ? '28.5794,77.1291' : selectedHospital.id === 2 ? '28.5834,77.1551' : '28.5694,77.1891'}`;
      setMapUrl(newMapUrl);
    }
  }, [selectedHospital]);

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
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
            
            <div className="flex items-center mb-8">
              <FaMapMarkerAlt className="text-red-500 h-6 w-6 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">Nearby Hospitals</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hospital List - 1/3 of the width on large screens */}
              <div className="lg:col-span-1">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Hospitals Near You</h2>
                  <div className="space-y-4">
                    {hospitals.map((hospital) => (
                      <div 
                        key={hospital.id}
                        onClick={() => handleHospitalClick(hospital)}
                        className={`p-4 border rounded-lg cursor-pointer transition ${
                          selectedHospital && selectedHospital.id === hospital.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <FaHospital className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3 flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{hospital.name}</h3>
                            <p className="text-sm text-gray-500">{hospital.distance} away</p>
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Map - 2/3 of the width on large screens */}
              <div className="lg:col-span-2">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Location Map</h2>
                    <p className="text-sm text-gray-500">
                      {selectedHospital 
                        ? `Showing location for ${selectedHospital.name}` 
                        : "Select a hospital to view its location"}
                    </p>
                  </div>
                  
                  {/* OpenStreetMap iframe */}
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-200">
                    <iframe 
                      width="100%" 
                      height="450" 
                      src={mapUrl} 
                      style={{border: "1px solid #ccc", borderRadius: "8px"}} 
                      allowFullScreen 
                      aria-hidden="false" 
                      tabIndex="0"
                      title="Map of Nearby Hospitals"
                    ></iframe>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <a 
                      href="https://www.openstreetmap.org/?#map=12/28.5794/77.1291" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Larger Map
                    </a>
                  </div>
                </div>
                
                {/* Hospital Details (shown when a hospital is selected) */}
                {selectedHospital && (
                  <div className="bg-white p-4 rounded-xl shadow-sm mt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Hospital Details</h2>
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
                          <p className="text-base text-gray-900">{selectedHospital.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaPhone className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                          <p className="text-base text-gray-900">{selectedHospital.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaDirections className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">Distance</h3>
                          <p className="text-base text-gray-900">{selectedHospital.distance} from your location</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedHospital.specialties.map((specialty, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4 flex justify-between">
                        <a 
                          href={`tel:${selectedHospital.phone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          <FaPhone className="mr-2" />
                          Call
                        </a>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedHospital.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <FaDirections className="mr-2" />
                          Directions
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NearbyHospitals; 