import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import { 
  FaCalendarAlt, 
  FaCalendarCheck, 
  FaCalendarPlus, 
  FaUserMd, 
  FaClock, 
  FaMapMarkerAlt, 
  FaFileMedical, 
  FaFilter, 
  FaPhone, 
  FaVideo,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
  FaExclamationCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import authService from '../services/authService';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [appointments, setAppointments] = useState([]);
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

    // Fetch appointments from the backend
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await appointmentService.getAppointments();
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. ' + (err.error || err.message || ''));
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);
  
  // Split appointments into upcoming and previous based on the date
  const today = new Date();
  
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= today;
  });
  
  const previousAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate < today;
  });
  
  // Filter appointments by specialty
  const filteredUpcoming = filterSpecialty === 'all' 
    ? upcomingAppointments 
    : upcomingAppointments.filter(apt => apt.specialty === filterSpecialty);
    
  const filteredPrevious = filterSpecialty === 'all'
    ? previousAppointments
    : previousAppointments.filter(apt => apt.specialty === filterSpecialty);
  
  // Get list of all specialties for the filter
  const allSpecialties = [...new Set([
    ...upcomingAppointments.map(apt => apt.specialty),
    ...previousAppointments.map(apt => apt.specialty)
  ])].filter(specialty => specialty); // Filter out undefined/null values
  
  // Toggle appointment details expansion
  const toggleExpand = (id) => {
    if (expandedAppointment === id) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(id);
    }
  };

  // Handle booking a new appointment
  const handleNewAppointment = () => {
    // Redirect to new appointment booking form
    // This will be implemented with a proper form later
    alert('Booking appointment functionality will be implemented soon');
  };

  // Handle canceling an appointment
  const handleCancelAppointment = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      await appointmentService.deleteAppointment(id);
      // Remove the appointment from the state
      setAppointments(appointments.filter(apt => apt.id !== id));
    } catch (err) {
      alert('Failed to cancel appointment: ' + (err.error || err.message || ''));
    }
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
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Appointments</h1>
                <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>Manage all your medical appointments</p>
              </div>
              <button 
                onClick={handleNewAppointment}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-200`}
              >
                <FaCalendarPlus className="mr-2" />
                Book New Appointment
              </button>
            </div>
            
            {error && (
              <div className={`mb-6 ${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-500'} border-l-4 p-4 rounded transition-colors duration-200`}>
                <div className="flex">
                  <FaExclamationCircle className="h-5 w-5 text-red-500" />
                  <div className="ml-3">
                    <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'} transition-colors duration-200`}>{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Filter Section */}
            <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} p-4 rounded-lg shadow-sm mb-6 transition-colors duration-200`}>
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <FaFilter className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} mr-2`} />
                  <label htmlFor="specialty-filter" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mr-2 transition-colors duration-200`}>
                    Filter by Specialty:
                  </label>
                  <select
                    id="specialty-filter"
                    value={filterSpecialty}
                    onChange={(e) => setFilterSpecialty(e.target.value)}
                    className={`border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'border-gray-300 text-gray-900'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200`}
                  >
                    <option value="all">All Specialties</option>
                    {allSpecialties.map((specialty, index) => (
                      <option key={index} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      activeTab === 'upcoming'
                        ? darkMode 
                          ? 'bg-blue-900 text-blue-300' 
                          : 'bg-blue-100 text-blue-700'
                        : darkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaCalendarAlt className="inline-block mr-2" />
                    Upcoming
                  </button>
                  <button
                    onClick={() => setActiveTab('previous')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      activeTab === 'previous'
                        ? darkMode 
                          ? 'bg-blue-900 text-blue-300' 
                          : 'bg-blue-100 text-blue-700'
                        : darkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaCalendarCheck className="inline-block mr-2" />
                    Previous
                  </button>
                </div>
              </div>
            </div>
            
            {/* Appointments List */}
            {activeTab === 'upcoming' ? (
              filteredUpcoming.length > 0 ? (
                <div className="space-y-4">
                  {filteredUpcoming.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-lg shadow-sm overflow-hidden transition-colors duration-200`}
                    >
                      <div 
                        className={`px-4 py-5 sm:px-6 cursor-pointer ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors duration-200`}
                        onClick={() => toggleExpand(appointment.id)}
                      >
                        <div className="flex flex-wrap justify-between items-center">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-12 w-12 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center transition-colors duration-200`}>
                              <FaUserMd className={`h-6 w-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'} transition-colors duration-200`} />
                            </div>
                            <div className="ml-4">
                              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {appointment.doctor}
                              </h3>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                {appointment.specialty}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row mt-4 sm:mt-0 items-start sm:items-center">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              appointment.method === 'In-person' 
                                ? darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                                : darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                            } transition-colors duration-200`}>
                              {appointment.method === 'In-person' ? <FaMapMarkerAlt className="mr-1" /> : <FaVideo className="mr-1" />}
                              {appointment.method}
                            </div>
                            <div className={`flex-shrink-0 ml-0 sm:ml-4 mt-2 sm:mt-0 ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
                              {expandedAppointment === appointment.id ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {expandedAppointment === appointment.id && (
                        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 py-5 sm:px-6 transition-colors duration-200`}>
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                              <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                <FaCalendarAlt className="inline-block mr-2" />
                                Date
                              </dt>
                              <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {appointment.date}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                <FaClock className="inline-block mr-2" />
                                Time
                              </dt>
                              <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {appointment.time}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                <FaMapMarkerAlt className="inline-block mr-2" />
                                Location
                              </dt>
                              <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {appointment.location || 'Online Consultation'}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                <FaFileMedical className="inline-block mr-2" />
                                Reason
                              </dt>
                              <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {appointment.reason}
                              </dd>
                            </div>
                            {/* Additional Information */}
                            <div className="sm:col-span-2">
                              <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                Additional Information
                              </dt>
                              <dd className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
                                {appointment.notes || 'No additional information provided.'}
                              </dd>
                            </div>
                            <div className="sm:col-span-2 flex justify-between items-center pt-4">
                              <div className="flex space-x-3">
                                <button 
                                  className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                                    darkMode 
                                      ? 'border-blue-500 text-blue-400 hover:bg-blue-900 hover:bg-opacity-30' 
                                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                                  } transition-colors duration-200`}
                                >
                                  <FaCalendarAlt className="mr-2" />
                                  Reschedule
                                </button>
                                <button 
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                                    darkMode 
                                      ? 'border-red-500 text-red-400 hover:bg-red-900 hover:bg-opacity-30' 
                                      : 'border-red-600 text-red-600 hover:bg-red-50'
                                  } transition-colors duration-200`}
                                >
                                  Cancel
                                </button>
                              </div>
                              <button 
                                className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                                  darkMode 
                                    ? 'border-green-500 text-green-400 hover:bg-green-900 hover:bg-opacity-30' 
                                    : 'border-green-600 text-green-600 hover:bg-green-50'
                                } transition-colors duration-200`}
                              >
                                <FaPhone className="mr-2" />
                                Contact
                              </button>
                            </div>
                          </dl>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-lg shadow-sm p-6 text-center transition-colors duration-200`}>
                  <FaCalendarAlt className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-200`} />
                  <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>No upcoming appointments</h3>
                  <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Book a new appointment to see a doctor</p>
                  <button 
                    onClick={handleNewAppointment}
                    className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                  >
                    <FaCalendarPlus className="mr-2" />
                    Book Appointment
                  </button>
                </div>
              )
            ) : (
              filteredPrevious.length > 0 ? (
                <div className="space-y-4">
                  {filteredPrevious.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-lg shadow-sm overflow-hidden transition-colors duration-200`}
                    >
                      <div 
                        className={`px-4 py-5 sm:px-6 cursor-pointer ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors duration-200`}
                        onClick={() => toggleExpand(appointment.id)}
                      >
                        <div className="flex flex-wrap justify-between items-center">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-12 w-12 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center transition-colors duration-200`}>
                              <FaUserMd className={`h-6 w-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'} transition-colors duration-200`} />
                            </div>
                            <div className="ml-4">
                              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {appointment.doctor}
                              </h3>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                {appointment.specialty}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row mt-4 sm:mt-0 items-start sm:items-center">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              appointment.method === 'In-person' 
                                ? darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                                : darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                            } transition-colors duration-200`}>
                              {appointment.method === 'In-person' ? <FaMapMarkerAlt className="mr-1" /> : <FaVideo className="mr-1" />}
                              {appointment.method}
                            </div>
                            <div className={`flex-shrink-0 ml-0 sm:ml-4 mt-2 sm:mt-0 ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
                              {expandedAppointment === appointment.id ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {expandedAppointment === appointment.id && (
                        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 py-5 sm:px-6 transition-colors duration-200`}>
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                              <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                <FaCalendarAlt className="inline-block mr-2" />
                                Date
                              </dt>
                              <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {appointment.date}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                <FaClock className="inline-block mr-2" />
                                Time
                              </dt>
                              <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {appointment.time}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                <FaMapMarkerAlt className="inline-block mr-2" />
                                Location
                              </dt>
                              <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {appointment.location || 'Online Consultation'}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                <FaFileMedical className="inline-block mr-2" />
                                Reason
                              </dt>
                              <dd className={`mt-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                {appointment.reason}
                              </dd>
                            </div>
                            {/* Additional Information */}
                            <div className="sm:col-span-2">
                              <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                Additional Information
                              </dt>
                              <dd className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
                                {appointment.notes || 'No additional information provided.'}
                              </dd>
                            </div>
                            <div className="sm:col-span-2 flex justify-between items-center pt-4">
                              <div className="flex space-x-3">
                                <button 
                                  className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                                    darkMode 
                                      ? 'border-blue-500 text-blue-400 hover:bg-blue-900 hover:bg-opacity-30' 
                                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                                  } transition-colors duration-200`}
                                >
                                  <FaCalendarAlt className="mr-2" />
                                  Reschedule
                                </button>
                                <button 
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                                    darkMode 
                                      ? 'border-red-500 text-red-400 hover:bg-red-900 hover:bg-opacity-30' 
                                      : 'border-red-600 text-red-600 hover:bg-red-50'
                                  } transition-colors duration-200`}
                                >
                                  Cancel
                                </button>
                              </div>
                              <button 
                                className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                                  darkMode 
                                    ? 'border-green-500 text-green-400 hover:bg-green-900 hover:bg-opacity-30' 
                                    : 'border-green-600 text-green-600 hover:bg-green-50'
                                } transition-colors duration-200`}
                              >
                                <FaPhone className="mr-2" />
                                Contact
                              </button>
                            </div>
                          </dl>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-lg shadow-sm p-6 text-center transition-colors duration-200`}>
                  <FaCalendarCheck className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-200`} />
                  <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>No previous appointments</h3>
                  <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Your past appointments will appear here</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Appointments; 