import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaMapMarkerAlt, FaArrowLeft, FaPrescriptionBottleAlt, FaDirections, FaPhone, FaInfoCircle, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NearbyPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([
    {
      id: 1,
      name: "City Pharmacy",
      distance: "0.8 km",
      address: "234 Market Street, Delhi",
      phone: "+91 11 4567 8901",
      hours: "8:00 AM - 10:00 PM",
      isOpen: true,
      services: ["Prescription Refills", "Home Delivery", "Vaccinations"],
      rating: 4.3
    },
    {
      id: 2,
      name: "MedPlus Pharmacy",
      distance: "1.7 km",
      address: "567 Gandhi Road, Delhi",
      phone: "+91 11 7890 1234",
      hours: "24 Hours",
      isOpen: true,
      services: ["Online Orders", "Medical Supplies", "Health Consultations"],
      rating: 4.1
    },
    {
      id: 3,
      name: "HealthCare Pharmacy",
      distance: "2.9 km",
      address: "890 Pharmacy Lane, Delhi",
      phone: "+91 11 2345 6789",
      hours: "9:00 AM - 9:00 PM",
      isOpen: true,
      services: ["Ayurvedic Medicines", "Beauty Products", "Baby Care"],
      rating: 4.5
    }
  ]);

  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [mapUrl, setMapUrl] = useState("https://www.openstreetmap.org/export/embed.html?bbox=77.00857344474787%2C28.532975584650035%2C77.24958601799007%2C28.62583466936243&amp;layer=mapnik");

  // Update map when a pharmacy is selected
  useEffect(() => {
    if (selectedPharmacy) {
      // In a real app, you would use the pharmacy's coordinates
      // This is just a placeholder to demonstrate the concept
      const newMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=77.00857344474787%2C28.532975584650035%2C77.24958601799007%2C28.62583466936243&amp;layer=mapnik&amp;marker=${selectedPharmacy.id === 1 ? '28.5794,77.1291' : selectedPharmacy.id === 2 ? '28.5834,77.1551' : '28.5694,77.1891'}`;
      setMapUrl(newMapUrl);
    }
  }, [selectedPharmacy]);

  const handlePharmacyClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
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
              <h1 className="text-3xl font-bold text-gray-900">Nearby Pharmacies</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pharmacy List - 1/3 of the width on large screens */}
              <div className="lg:col-span-1">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Pharmacies Near You</h2>
                  <div className="space-y-4">
                    {pharmacies.map((pharmacy) => (
                      <div 
                        key={pharmacy.id}
                        onClick={() => handlePharmacyClick(pharmacy)}
                        className={`p-4 border rounded-lg cursor-pointer transition ${
                          selectedPharmacy && selectedPharmacy.id === pharmacy.id 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="bg-green-100 p-2 rounded-full">
                            <FaPrescriptionBottleAlt className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-medium text-gray-900">{pharmacy.name}</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${pharmacy.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {pharmacy.isOpen ? 'Open' : 'Closed'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{pharmacy.distance} away</p>
                            <div className="flex mt-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`text-sm ${i < Math.floor(pharmacy.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="text-xs text-gray-500 ml-1">({pharmacy.rating})</span>
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
                      {selectedPharmacy 
                        ? `Showing location for ${selectedPharmacy.name}` 
                        : "Select a pharmacy to view its location"}
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
                      title="Map of Nearby Pharmacies"
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
                
                {/* Pharmacy Details (shown when a pharmacy is selected) */}
                {selectedPharmacy && (
                  <div className="bg-white p-4 rounded-xl shadow-sm mt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Pharmacy Details</h2>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FaInfoCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">Name</h3>
                          <p className="text-base text-gray-900">{selectedPharmacy.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">Address</h3>
                          <p className="text-base text-gray-900">{selectedPharmacy.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaPhone className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                          <p className="text-base text-gray-900">{selectedPharmacy.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaClock className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">Hours</h3>
                          <p className="text-base text-gray-900">{selectedPharmacy.hours}</p>
                          <p className={`text-sm ${selectedPharmacy.isOpen ? 'text-green-600' : 'text-red-600'} font-medium`}>
                            {selectedPharmacy.isOpen ? 'Currently Open' : 'Currently Closed'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaDirections className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">Distance</h3>
                          <p className="text-base text-gray-900">{selectedPharmacy.distance} from your location</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Services</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPharmacy.services.map((service, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4 flex justify-between">
                        <a 
                          href={`tel:${selectedPharmacy.phone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          <FaPhone className="mr-2" />
                          Call
                        </a>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedPharmacy.address)}`}
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

export default NearbyPharmacies; 