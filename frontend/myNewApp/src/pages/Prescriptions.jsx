import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import { 
  FaPrescriptionBottleAlt, 
  FaFileMedical,
  FaPills, 
  FaCalendarAlt,
  FaUserMd,
  FaDownload,
  FaShoppingCart,
  FaExclamationTriangle,
  FaCheck,
  FaSearch,
  FaSpinner,
  FaExclamationCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import prescriptionService from '../services/prescriptionService';
import authService from '../services/authService';

const Prescriptions = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  
  useEffect(() => {
    // Check if user is logged in
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Fetch prescriptions from the backend
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await prescriptionService.getPrescriptions();
        setMedications(data);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError('Failed to load prescriptions. ' + (err.error || err.message || ''));
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [navigate]);
  
  // Split medications into current and past based on the end date
  const today = new Date();
  
  const currentMedications = medications.filter(medication => {
    const endDate = new Date(medication.endDate);
    return endDate >= today || medication.status === 'Active';
  });
  
  const pastMedications = medications.filter(medication => {
    const endDate = new Date(medication.endDate);
    return endDate < today || medication.status === 'Completed';
  });
  
  // Filter medications based on search term
  const filteredCurrent = currentMedications.filter(medication => 
    medication.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.doctor?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPast = pastMedications.filter(medication => 
    medication.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.doctor?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle upload prescription
  const handleUploadPrescription = () => {
    // This will be implemented with a file upload component
    alert('Upload prescription functionality will be implemented soon');
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 pt-16 pb-12">
            <div className="flex items-center justify-center h-full">
              <FaSpinner className={`animate-spin h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-200`} />
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Prescriptions</h1>
                <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>Manage and track your medications</p>
              </div>
              <button 
                onClick={handleUploadPrescription}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-200`}
              >
                <FaFileMedical className="mr-2" />
                Upload Prescription
              </button>
            </div>
            
            {error && (
              <div className={`mb-6 ${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-500'} border-l-4 p-4 rounded transition-colors duration-200`}>
                <div className="flex">
                  <FaExclamationCircle className={`h-5 w-5 ${darkMode ? 'text-red-300' : 'text-red-500'}`} />
                  <div className="ml-3">
                    <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'} transition-colors duration-200`}>{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Search and Filter Section */}
            <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} p-4 rounded-lg shadow-sm mb-6 transition-colors duration-200`}>
              <div className="flex flex-wrap items-center justify-between">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search medications, conditions, doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 pr-4 py-2 border ${
                        darkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-md w-full transition-colors duration-200`}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('current')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      activeTab === 'current'
                        ? darkMode 
                          ? 'bg-blue-900 text-blue-300' 
                          : 'bg-blue-100 text-blue-700'
                        : darkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaPills className="inline-block mr-2" />
                    Current Medications
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      activeTab === 'past'
                        ? darkMode 
                          ? 'bg-blue-900 text-blue-300' 
                          : 'bg-blue-100 text-blue-700'
                        : darkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaPrescriptionBottleAlt className="inline-block mr-2" />
                    Past Medications
                  </button>
                </div>
              </div>
            </div>
            
            {/* Current Medications */}
            {activeTab === 'current' && (
              <>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-200`}>Current Medications</h2>
                {filteredCurrent.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCurrent.map((medication) => (
                      <div key={medication.id} className={`${darkMode ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm overflow-hidden border transition-colors duration-200`}>
                        <div className="p-4">
                          <div className="flex items-center mb-4">
                            <div className={`h-12 w-12 rounded-full overflow-hidden ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} transition-colors duration-200`}>
                              <img 
                                src={medication.image} 
                                alt={medication.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{medication.name}</h3>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{medication.dosage}, {medication.frequency}</p>
                            </div>
                          </div>
                          
                          <div className={`mb-4 p-3 rounded-md ${
                            medication.status === 'Active' 
                              ? darkMode ? 'bg-green-900 bg-opacity-30' : 'bg-green-50'
                              : medication.status === 'Low' 
                                ? darkMode ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50'
                                : darkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-50'
                          } transition-colors duration-200`}>
                            <div className="flex items-center">
                              {medication.status === 'Active' ? (
                                <FaCheck className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} transition-colors duration-200`} />
                              ) : medication.status === 'Low' ? (
                                <FaExclamationTriangle className={`h-5 w-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} transition-colors duration-200`} />
                              ) : (
                                <FaExclamationCircle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-500'} transition-colors duration-200`} />
                              )}
                              <span className={`ml-2 text-sm ${
                                medication.status === 'Active' 
                                  ? darkMode ? 'text-green-300' : 'text-green-700'
                                  : medication.status === 'Low' 
                                    ? darkMode ? 'text-yellow-300' : 'text-yellow-700'
                                    : darkMode ? 'text-red-300' : 'text-red-700'
                              } transition-colors duration-200`}>
                                {medication.status === 'Active' ? 'Sufficient Supply' : medication.status === 'Low' ? 'Running Low' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-start mb-2">
                              <FaCalendarAlt className={`h-4 w-4 mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`} />
                              <div className="ml-2">
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Start - End Date</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'} transition-colors duration-200`}>{medication.startDate} - {medication.endDate}</p>
                              </div>
                            </div>
                            <div className="flex items-start mb-2">
                              <FaUserMd className={`h-4 w-4 mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`} />
                              <div className="ml-2">
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Prescribed By</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'} transition-colors duration-200`}>{medication.doctor}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <FaFileMedical className={`h-4 w-4 mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`} />
                              <div className="ml-2">
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Reason</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'} transition-colors duration-200`}>{medication.reason}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4 border-dashed flex justify-between">
                            <button className={`flex items-center text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200`}>
                              <FaDownload className="mr-1" />
                              Prescription
                            </button>
                            {(medication.status === 'Low' || medication.status === 'Out') && (
                              <Link 
                                to={`/medical-shop?product=${medication.id}`} 
                                className={`flex items-center text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200`}
                              >
                                <FaShoppingCart className="mr-1" />
                                Refill
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-lg shadow-sm p-6 text-center transition-colors duration-200`}>
                    <FaPills className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-200`} />
                    <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>No current medications</h3>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>You don't have any active prescriptions</p>
                  </div>
                )}
              </>
            )}
            
            {/* Past Medications */}
            {activeTab === 'past' && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Medications</h2>
                {filteredPast.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {filteredPast.map((medication) => (
                        <li key={medication.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                              <img 
                                src={medication.image} 
                                alt={medication.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                                  <p className="text-sm text-gray-500">{medication.dosage}, {medication.frequency}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">{medication.prescribedDate}</p>
                                  <p className="text-xs text-gray-500">to {medication.endDate}</p>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">For:</span> {medication.reason}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Doctor:</span> {medication.doctor}
                                  </p>
                                </div>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                  {medication.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between">
                            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                              <FaDownload className="mr-1 h-4 w-4" />
                              Download Prescription
                            </button>
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                              View Details
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <FaPrescriptionBottleAlt className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No past medications</h3>
                    <p className="mt-1 text-sm text-gray-500">Your medication history will appear here.</p>
                  </div>
                )}
                
                {/* Medication History Summary */}
                {filteredPast.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Medication History Summary</h3>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Total Prescriptions</p>
                          <p className="text-3xl font-bold text-blue-600">{pastMedications.length}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Completed Courses</p>
                          <p className="text-3xl font-bold text-green-600">{pastMedications.filter(m => m.status === 'Completed').length}</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Conditions Treated</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {new Set(pastMedications.map(m => m.reason)).size}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Most Recent Doctors</h4>
                        <div className="space-y-2">
                          {Array.from(new Set(pastMedications.map(m => m.doctor)))
                            .slice(0, 3)
                            .map((doctor, index) => {
                              const medication = pastMedications.find(m => m.doctor === doctor);
                              return (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <FaUserMd className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700">{doctor}</span>
                                    <span className="ml-2 text-xs text-gray-500">({medication.specialty})</span>
                                  </div>
                                  <span className="text-xs text-gray-500">{medication.prescribedDate}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Prescriptions; 