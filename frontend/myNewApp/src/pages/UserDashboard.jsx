import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import { 
  FaCalendarCheck, 
  FaHeartbeat, 
  FaPills, 
  FaUserMd, 
  FaFileMedical,
  FaPhone
} from 'react-icons/fa';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const { darkMode } = useTheme();

  // Handle tab routing from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    
    if (tab) {
      // Map the tab parameter to the corresponding tab
      switch(tab.toLowerCase()) {
        case 'records':
          setActiveTab('records');
          break;
        case 'appointments':
          setActiveTab('appointments');
          break;
        case 'medications':
        case 'prescriptions':
          setActiveTab('prescriptions');
          break;
        case 'tracker':
        case 'health':
          setActiveTab('health');
          break;
        case 'doctors':
          setActiveTab('doctors');
          break;
        default:
          // Default to overview if tab not recognized
          setActiveTab('overview');
      }
    }
  }, [location.search]);

  // Mock data
  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sunil Pratap Singh', specialty: 'HOD', date: '15 May 2023', time: '10:00 AM' },
    { id: 2, doctor: 'Dr. Rakhee Sharma', specialty: 'Mentor1', date: '22 May 2023', time: '2:30 PM' },
  ];

  const recentPrescriptions = [
    { id: 1, medication: 'Paracetamol', dosage: '5mg', frequency: 'Once daily', prescribed: '01 May 2023' },
    { id: 2, medication: 'Crocin', dosage: '500mg', frequency: 'Twice daily', prescribed: '28 Apr 2023' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Dashboard</h1>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>View and manage your health information</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm p-6 transition-colors duration-200`}>
                <div className="flex items-center">
                  <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-3 rounded-full transition-colors duration-200`}>
                    <FaCalendarCheck className={`h-6 w-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'} transition-colors duration-200`} />
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Appointments</h3>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1 transition-colors duration-200`}>2</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Upcoming</p>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm p-6 transition-colors duration-200`}>
                <div className="flex items-center">
                  <div className={`${darkMode ? 'bg-green-900' : 'bg-green-100'} p-3 rounded-full transition-colors duration-200`}>
                    <FaHeartbeat className={`h-6 w-6 ${darkMode ? 'text-green-300' : 'text-green-600'} transition-colors duration-200`} />
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Health Status</h3>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1 transition-colors duration-200`}>Good</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Last checkup: 2 weeks ago</p>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm p-6 transition-colors duration-200`}>
                <div className="flex items-center">
                  <div className={`${darkMode ? 'bg-purple-900' : 'bg-purple-100'} p-3 rounded-full transition-colors duration-200`}>
                    <FaPills className={`h-6 w-6 ${darkMode ? 'text-purple-300' : 'text-purple-600'} transition-colors duration-200`} />
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Prescriptions</h3>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1 transition-colors duration-200`}>2</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Active medications</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6 transition-colors duration-200`}>
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-gray-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } transition-colors duration-200`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'appointments'
                      ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-gray-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } transition-colors duration-200`}
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('prescriptions')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'prescriptions'
                      ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-gray-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } transition-colors duration-200`}
                >
                  Prescriptions
                </button>
                <button
                  onClick={() => setActiveTab('health')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'health'
                      ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-gray-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } transition-colors duration-200`}
                >
                  Health Tracker
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'doctors'
                      ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-gray-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } transition-colors duration-200`}
                >
                  My Doctors
                </button>
                <button
                  onClick={() => setActiveTab('records')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'records'
                      ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-gray-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } transition-colors duration-200`}
                >
                  Medical Records
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upcoming Appointments */}
                  <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm overflow-hidden transition-colors duration-200`}>
                    <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center transition-colors duration-200`}>
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Upcoming Appointments</h3>
                      <Link to="/appointments" className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors duration-200`}>View All</Link>
                    </div>
                    <div className="px-6 py-4">
                      {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingAppointments.map(appointment => (
                            <div key={appointment.id} className={`flex items-start p-3 border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'} rounded-lg transition-colors duration-200`}>
                              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-full transition-colors duration-200`}>
                                <FaUserMd className={`h-5 w-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'} transition-colors duration-200`} />
                              </div>
                              <div className="ml-3">
                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{appointment.doctor}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{appointment.specialty}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-1 transition-colors duration-200`}>{appointment.date} at {appointment.time}</p>
                              </div>
                              <button className={`ml-auto inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${darkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} transition-colors duration-200`}>
                                <FaPhone className="mr-1" />
                                Contact
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>No upcoming appointments</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Prescriptions */}
                  <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm overflow-hidden transition-colors duration-200`}>
                    <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center transition-colors duration-200`}>
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Recent Prescriptions</h3>
                      <Link to="/prescriptions" className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors duration-200`}>View All</Link>
                    </div>
                    <div className="px-6 py-4">
                      {recentPrescriptions.length > 0 ? (
                        <div className="space-y-4">
                          {recentPrescriptions.map(prescription => (
                            <div key={prescription.id} className={`flex items-start p-3 border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'} rounded-lg transition-colors duration-200`}>
                              <div className={`${darkMode ? 'bg-purple-900' : 'bg-purple-100'} p-2 rounded-full transition-colors duration-200`}>
                                <FaPills className={`h-5 w-5 ${darkMode ? 'text-purple-300' : 'text-purple-600'} transition-colors duration-200`} />
                              </div>
                              <div className="ml-3">
                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{prescription.medication}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{prescription.dosage}, {prescription.frequency}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-1 transition-colors duration-200`}>Prescribed: {prescription.prescribed}</p>
                              </div>
                              <button className={`ml-auto inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${darkMode ? 'bg-purple-900 text-purple-300 hover:bg-purple-800' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} transition-colors duration-200`}>
                                <FaFileMedical className="mr-1" />
                                Details
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>No recent prescriptions</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== 'overview' && (
                <div className="bg-white rounded-xl shadow-sm p-6 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                    <p className="text-gray-500">This section is under development.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard; 