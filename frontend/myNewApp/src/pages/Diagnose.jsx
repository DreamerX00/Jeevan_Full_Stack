import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  FaStethoscope, 
  FaSearch, 
  FaHistory, 
  FaRobot,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaFileMedical,
  FaChartLine,
  FaUserMd,
  FaCalendarAlt,
  FaFilter,
  FaHospital,
  FaMoneyBillWave,
  FaDirections,
  FaInfoCircle,
  FaClock,
  FaPhone,
  FaMapMarkerAlt,
  FaStar,
  FaGlobe,
  FaDollarSign,
  FaClipboardList,
  FaChevronDown,
  FaChevronUp,
  FaMap,
  FaList
} from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';
import GoogleMapComponent from '../components/GoogleMapComponent';
import diseaseService from '../services/diseaseService';

const Diagnose = () => {
  const { darkMode, setDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [diagnosticCenters, setDiagnosticCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tests'); // 'tests', 'centers', 'map'
  const [selectedTest, setSelectedTest] = useState(null);
  const [expandedTest, setExpandedTest] = useState(null);
  const [tests, setTests] = useState([
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      category: 'Blood Tests',
      description: 'A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders.',
      preparation: 'Fasting for 8-12 hours before the test',
      duration: '15-20 minutes',
      price: '₹500-₹1000',
      commonUses: ['Anemia', 'Infection', 'Leukemia', 'Inflammation']
    },
    {
      id: 2,
      name: 'MRI Scan',
      category: 'Imaging',
      description: 'Magnetic Resonance Imaging (MRI) uses a powerful magnetic field and radio waves to create detailed images of the body.',
      preparation: 'No food or drink 4 hours before the test',
      duration: '30-60 minutes',
      price: '₹5000-₹15000',
      commonUses: ['Brain disorders', 'Spinal cord injuries', 'Joint problems', 'Tumors']
    },
    {
      id: 3,
      name: 'CT Scan',
      category: 'Imaging',
      description: 'Computed Tomography (CT) scan uses X-rays to create detailed images of the body.',
      preparation: 'Fasting for 4-6 hours before the test',
      duration: '10-30 minutes',
      price: '₹3000-₹8000',
      commonUses: ['Cancer detection', 'Internal injuries', 'Bone fractures', 'Heart disease']
    }
  ]);

  useEffect(() => {
    fetchDiagnosticTests();
    fetchNearbyCenters();
  }, []);

  const fetchDiagnosticTests = async () => {
    try {
      const tests = await diseaseService.getDiagnosticTests();
      // Handle the fetched tests
    } catch (error) {
      console.error('Error fetching diagnostic tests:', error);
    }
  };

  const fetchNearbyCenters = async () => {
    try {
      const centers = await diseaseService.getDiagnosticCenters();
      setDiagnosticCenters(centers);
    } catch (error) {
      console.error('Error fetching nearby centers:', error);
    }
  };

  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
  };

  const getDirectionsUrl = (center) => {
    if (!center || !center.geometry || !center.geometry.location) return null;
    const { lat, lng } = center.geometry.location;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  const handleCallCenter = (center) => {
    if (center.phone) {
      window.location.href = `tel:${center.phone}`;
    }
  };

  const calculateDistance = (center) => {
    // This is a placeholder. In a real app, you would calculate the actual distance
    return '2.5 km';
  };

  const categories = [
    'All',
    'Imaging',
    'Laboratory',
    'Cardiology',
    'Neurology',
    'Orthopedics'
  ];

  const handleTestClick = (test) => {
    if (expandedTest === test.id) {
      setExpandedTest(null);
      setSelectedTest(null);
    } else {
      setExpandedTest(test.id);
      setSelectedTest(test);
      // When a test is selected, switch to map view and search for centers
      setActiveTab('map');
      setSearchQuery(test.name); // Set search query to test name
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm p-6 transition-colors duration-200`}>
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {['tests', 'centers', 'map'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${
                        activeTab === tab
                          ? darkMode
                            ? 'border-blue-500 text-blue-400'
                            : 'border-blue-500 text-blue-600'
                          : darkMode
                            ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content based on active tab */}
              {activeTab === 'tests' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                      Diagnostic Tests
                    </h1>
                    <div className="relative w-96">
                      <input
                        type="text"
                        placeholder="Search tests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border border-gray-300 text-gray-700'
                        }`}
                      />
                      <FaSearch className={`absolute left-3 top-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                  </div>

                  {/* Tests Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                      <div
                        key={test.id}
                        className={`group relative border rounded-xl overflow-hidden transition-all duration-300 ${
                          darkMode 
                            ? 'border-gray-700 hover:border-blue-700 bg-gray-800' 
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        } ${expandedTest === test.id ? 'shadow-lg' : 'hover:shadow-md'}`}
                      >
                        <div
                          className={`p-6 cursor-pointer transition-all duration-300`}
                          onClick={() => handleTestClick(test)}
                        >
                          {/* Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {test.name}
                              </h3>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {test.category}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ml-4 whitespace-nowrap ${
                              darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {test.price}
                            </span>
                          </div>

                          {/* Expandable Content */}
                          <div 
                            className={`overflow-hidden transition-all duration-300 ${
                              expandedTest === test.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                            style={{
                              maxHeight: expandedTest === test.id ? '500px' : '0',
                              opacity: expandedTest === test.id ? 1 : 0
                            }}
                          >
                            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              {/* Description */}
                              <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {test.description}
                                </p>
                              </div>

                              {/* Details */}
                              <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                  <FaClock className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                    Duration: {test.duration}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <FaInfoCircle className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                    Preparation: {test.preparation}
                                  </span>
                                </div>
                              </div>

                              {/* Common Uses */}
                              <div>
                                <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  Common Uses:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {test.commonUses.map((use, index) => (
                                    <span
                                      key={index}
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        darkMode
                                          ? 'bg-gray-700 text-gray-300'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}
                                    >
                                      {use}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Action Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTest(test);
                                  setActiveTab('centers');
                                }}
                                className={`w-full mt-4 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                  darkMode
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                              >
                                Find Centers
                              </button>
                            </div>
                          </div>

                          {/* Expand/Collapse Indicator */}
                          <div className={`absolute bottom-2 right-2 transition-transform duration-300 ${
                            expandedTest === test.id ? 'rotate-180' : ''
                          }`}>
                            <FaChevronDown className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'centers' && (
                <div className="space-y-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search diagnostic centers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border border-gray-300 text-gray-700'
                          }`}
                        />
                        <FaSearch className={`absolute left-3 top-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <select
                        value={selectedCenter?.category || 'All'}
                        onChange={(e) => {
                          // Handle category selection
                        }}
                        className={`px-4 py-2 rounded-lg border ${
                          darkMode
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Selected Test Info */}
                  {selectedTest && (
                    <div className={`p-4 border rounded-lg ${
                      darkMode 
                        ? 'border-blue-700 bg-gray-800' 
                        : 'border-blue-300 bg-blue-50'
                    }`}>
                      <div className="flex items-center">
                        <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-3 rounded-full`}>
                          <FaFileMedical className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div className="ml-4">
                          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedTest.name}
                          </h3>
                          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {selectedTest.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Centers List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {diagnosticCenters.map((center, index) => (
                      <div 
                        key={center.place_id || center.id || index}
                        onClick={() => handleCenterSelect(center)}
                        className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                          selectedCenter && (selectedCenter.place_id || selectedCenter.id) === (center.place_id || center.id)
                            ? darkMode 
                              ? 'border-blue-700 bg-gray-800 shadow-lg' 
                              : 'border-blue-300 bg-blue-50 shadow-lg' 
                            : darkMode 
                              ? 'border-gray-700 hover:border-blue-700 hover:bg-gray-800' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-full transition-colors duration-200`}>
                            <FaHospital className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-200`} />
                          </div>
                          <div className="ml-3 flex-1">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                              {center.name}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                              {center.vicinity || center.formatted_address}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                              {calculateDistance(center)} away
                            </p>
                            {center.rating && (
                              <div className="flex mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-sm ${i < Math.floor(center.rating) ? 'text-yellow-500' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} ml-1 transition-colors duration-200`}>
                                  ({center.rating})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* No Results Message */}
                  {diagnosticCenters.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FaMapMarkerAlt className={`h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} />
                      <h3 className={`text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        No diagnostic centers found
                      </h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-8`}>
                        Try adjusting your search criteria or switch to Map View
                      </p>
                      <button
                        onClick={() => setActiveTab('map')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Go to Map View
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'map' && (
                <div className="space-y-6">
                  {/* Map Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={selectedTest ? `Search for ${selectedTest.name} centers...` : "Search for diagnostic centers..."}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border border-gray-300 text-gray-700'
                          }`}
                        />
                        <FaSearch className={`absolute left-3 top-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-2 rounded-lg border ${
                          viewMode === 'map'
                            ? darkMode
                              ? 'bg-blue-600 text-white border-blue-700'
                              : 'bg-blue-600 text-white border-blue-700'
                            : darkMode
                              ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        } transition-colors duration-200`}
                      >
                        <FaMap className="inline-block mr-2" />
                        Map View
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg border ${
                          viewMode === 'list'
                            ? darkMode
                              ? 'bg-blue-600 text-white border-blue-700'
                              : 'bg-blue-600 text-white border-blue-700'
                            : darkMode
                              ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        } transition-colors duration-200`}
                      >
                        <FaList className="inline-block mr-2" />
                        List View
                      </button>
                    </div>
                  </div>

                  {/* Map View */}
                  {viewMode === 'map' && (
                    <div className="space-y-4">
                      <div className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <GoogleMapComponent
                          type="diagnostic"
                          searchQuery={searchQuery}
                          onPlaceSelect={(center) => {
                            setDiagnosticCenters(prevCenters => {
                              if (!prevCenters.some(c => (c.place_id || c.id) === (center.place_id || center.id))) {
                                return [...prevCenters, center];
                              }
                              return prevCenters;
                            });
                            handleCenterSelect(center);
                          }}
                          onPlacesFound={(foundCenters) => {
                            setDiagnosticCenters(foundCenters.map(place => ({
                              ...place,
                              id: place.place_id,
                              place_id: place.place_id
                            })));
                          }}
                          autoSelectOnMarkerClick={true}
                        />
                      </div>

                      {/* Selected Center Info */}
                      {selectedCenter && (
                        <div className={`p-4 border rounded-lg ${
                          darkMode 
                            ? 'border-blue-700 bg-gray-800' 
                            : 'border-blue-300 bg-blue-50'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-3 rounded-full`}>
                                <FaHospital className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                              </div>
                              <div className="ml-4">
                                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {selectedCenter.name}
                                </h3>
                                <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {selectedCenter.vicinity || selectedCenter.formatted_address}
                                </p>
                                {selectedCenter.rating && (
                                  <div className="flex items-center mt-2">
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span 
                                          key={i} 
                                          className={`text-sm ${i < Math.floor(selectedCenter.rating) ? 'text-yellow-500' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
                                      ({selectedCenter.rating})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const url = getDirectionsUrl(selectedCenter);
                                  if (url) {
                                    window.open(url, '_blank');
                                  }
                                }}
                                className={`px-4 py-2 rounded-lg border ${
                                  darkMode
                                    ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'
                                    : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'
                                } transition-colors duration-200`}
                              >
                                <FaDirections className="inline-block mr-2" />
                                Get Directions
                              </button>
                              {selectedCenter.phone && (
                                <button
                                  onClick={() => handleCallCenter(selectedCenter)}
                                  className={`px-4 py-2 rounded-lg border ${
                                    darkMode
                                      ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                  } transition-colors duration-200`}
                                >
                                  <FaPhone className="inline-block mr-2" />
                                  Call
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* List View */}
                  {viewMode === 'list' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {diagnosticCenters.map((center, index) => (
                        <div 
                          key={center.place_id || center.id || index}
                          onClick={() => handleCenterSelect(center)}
                          className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                            selectedCenter && (selectedCenter.place_id || selectedCenter.id) === (center.place_id || center.id)
                              ? darkMode 
                                ? 'border-blue-700 bg-gray-800 shadow-lg' 
                                : 'border-blue-300 bg-blue-50 shadow-lg' 
                              : darkMode 
                                ? 'border-gray-700 hover:border-blue-700 hover:bg-gray-800' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-full transition-colors duration-200`}>
                              <FaHospital className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-200`} />
                            </div>
                            <div className="ml-3 flex-1">
                              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {center.name}
                              </h3>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                {center.vicinity || center.formatted_address}
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                {calculateDistance(center)} away
                              </p>
                              {center.rating && (
                                <div className="flex mt-2">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span 
                                      key={i} 
                                      className={`text-sm ${i < Math.floor(center.rating) ? 'text-yellow-500' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} ml-1 transition-colors duration-200`}>
                                    ({center.rating})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Results Message */}
                  {diagnosticCenters.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FaMapMarkerAlt className={`h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} />
                      <h3 className={`text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        No diagnostic centers found
                      </h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-8`}>
                        Try adjusting your search criteria or try a different location
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Diagnose; 