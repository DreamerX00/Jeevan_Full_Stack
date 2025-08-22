import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaClock, 
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaVideo,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

const Appointments = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('book');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data for available doctors
  const availableDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Physician',
      experience: '15 years',
      rating: 4.8,
      reviews: 245,
      availability: [
        { date: '2024-03-20', slots: ['09:00', '10:00', '11:00'] },
        { date: '2024-03-21', slots: ['14:00', '15:00', '16:00'] }
      ],
      consultationFee: 150,
      image: '/doctors/doctor1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      experience: '12 years',
      rating: 4.9,
      reviews: 189,
      availability: [
        { date: '2024-03-20', slots: ['13:00', '14:00', '15:00'] },
        { date: '2024-03-21', slots: ['09:00', '10:00', '11:00'] }
      ],
      consultationFee: 200,
      image: '/doctors/doctor2.jpg'
    }
  ];

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'General Physician',
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'In-person',
      status: 'Confirmed',
      location: 'City Health Center, Room 302'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      date: '2024-03-21',
      time: '02:30 PM',
      type: 'Video Consultation',
      status: 'Pending',
      location: 'Online'
    }
  ];

  // Mock data for past appointments
  const pastAppointments = [
    {
      id: 1,
      doctor: 'Dr. Emily Wilson',
      specialty: 'Dermatologist',
      date: '2024-02-15',
      time: '11:00 AM',
      type: 'In-person',
      status: 'Completed',
      location: 'Skin Care Clinic',
      notes: 'Prescribed medication for skin condition'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm p-6 transition-colors duration-200`}>
              <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                Appointments
              </h1>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {['book', 'upcoming', 'past'].map((tab) => (
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

              {/* Search and Filter */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search doctors or specialties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    className={`px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  >
                    <option value="">All Specialties</option>
                    <option value="general">General Physician</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="dermatology">Dermatology</option>
                  </select>
                  <select
                    className={`px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  >
                    <option value="">Consultation Type</option>
                    <option value="in-person">In-person</option>
                    <option value="video">Video Consultation</option>
                  </select>
                </div>
              </div>

              {/* Content based on active tab */}
              <div className="mt-6">
                {activeTab === 'book' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className={`${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm p-6 border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        } transition-colors duration-200`}
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                              {doctor.name}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                              {doctor.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Experience</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{doctor.experience}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Rating</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{doctor.rating} ({doctor.reviews} reviews)</span>
                          </div>
                        </div>
                        <button
                          className={`w-full px-4 py-2 rounded-lg ${
                            darkMode
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white transition-colors duration-200`}
                        >
                          Book Appointment
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'upcoming' && (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm p-6 border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        } transition-colors duration-200`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                              {appointment.doctor}
                            </h3>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                              {appointment.date} at {appointment.time} • {appointment.location}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              appointment.status === 'Confirmed'
                                ? darkMode
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-green-100 text-green-800'
                                : darkMode
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-800'
                            } transition-colors duration-200`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'past' && (
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm p-6 border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        } transition-colors duration-200`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                              {appointment.doctor}
                            </h3>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                              {appointment.date} at {appointment.time} • {appointment.location}
                            </p>
                            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                              {appointment.notes}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              appointment.status === 'Completed'
                                ? darkMode
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-green-100 text-green-800'
                                : darkMode
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-800'
                            } transition-colors duration-200`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
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

export default Appointments; 