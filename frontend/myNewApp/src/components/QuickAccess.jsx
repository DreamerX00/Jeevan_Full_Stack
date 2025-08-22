import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUserMd, 
  FaClock, 
  FaVideo, 
  FaPhone, 
  FaTimes,
  FaChevronRight
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const QuickAccess = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('in-person');

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

  const specialties = [
    'General Physician',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Neurology'
  ];

  const handleAppointmentClick = (e, path) => {
    if (path === '/appointment') {
      e.preventDefault();
      setShowAppointmentModal(true);
    }
  };

  const handleBookAppointment = () => {
    // Create appointment object
    const appointment = {
      id: Date.now(),
      doctor: availableDoctors.find(doc => doc.specialty === selectedSpecialty),
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
      status: 'scheduled'
    };

    // Get existing appointments from localStorage
    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Add new appointment
    const updatedAppointments = [...existingAppointments, appointment];
    
    // Save to localStorage
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Close modal and navigate to appointments page
    setShowAppointmentModal(false);
    navigate('/appointments');
  };

  const quickAccessItems = [
    {
      image: '/symptoms.png',
      title: 'Symptoms',
      description: 'Check your symptoms',
      path: '/symptoms',
      bgColor: darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
    },
    {
      image: '/vaccination.png',
      title: 'Vaccination',
      description: 'Book your vaccination',
      path: '/vaccination',
      bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-50'
    },
    {
      image: '/appointment.png',
      title: 'Appointment',
      description: 'Schedule an appointment',
      path: '/appointment',
      bgColor: darkMode ? 'bg-purple-900/20' : 'bg-purple-50'
    },
    {
      image: '/diagnose.png',
      title: 'Diagnose',
      description: 'Get a quick diagnosis',
      path: '/diagnose',
      bgColor: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
    },
    {
      image: '/shop.png',
      title: 'Shop',
      description: 'Medical supplies shop',
      path: '/shop',
      bgColor: darkMode ? 'bg-red-900/20' : 'bg-red-50'
    },
    {
      image: '/medical_kit.png',
      title: 'Kit',
      description: 'Manage your medical kit',
      path: '/kit',
      bgColor: darkMode ? 'bg-orange-900/20' : 'bg-orange-50'
    }
  ];

  const nearbyItems = [
    {
      image: '/hospital_icon.png',
      title: 'Hospitals',
      description: 'Find nearby hospitals',
      path: '/nearby-hospitals',
      bgColor: darkMode ? 'bg-gray-800' : 'bg-blue-50'
    },
    {
      image: '/pharamcy_icon.png',
      title: 'Pharmacy',
      description: 'Locate nearby pharmacies',
      path: '/nearby-pharmacies',
      bgColor: darkMode ? 'bg-gray-800' : 'bg-green-50'
    }
  ];

  return (
    <div className={`py-12 ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Specialties Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
              Our Specialties
            </h2>
            <Link 
              to="/services" 
              className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium flex items-center transition-colors duration-200 transform hover:scale-105`}
            >
              See All
              <FaChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={(e) => handleAppointmentClick(e, item.path)}
                className={`p-6 rounded-xl border ${
                  darkMode ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
                } shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] group`}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${item.bgColor} transition-colors duration-200 group-hover:scale-110`}>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Nearby Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
              Nearby
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`p-6 rounded-xl border ${
                  darkMode ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
                } shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] group`}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${item.bgColor} transition-colors duration-200 group-hover:scale-110`}>
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl p-8 w-full max-w-md mx-4 transform transition-all duration-200 scale-100`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Book an Appointment
              </h2>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors duration-200`}
              >
                <FaTimes className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                >
                  <option value="">Select a specialty</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Consultation Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedType('in-person')}
                    className={`p-4 rounded-lg border flex items-center justify-center ${
                      selectedType === 'in-person'
                        ? darkMode
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-blue-50 border-blue-500 text-blue-600'
                        : darkMode
                          ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <FaUserMd className="mr-2" />
                    In-person
                  </button>
                  <button
                    onClick={() => setSelectedType('video')}
                    className={`p-4 rounded-lg border flex items-center justify-center ${
                      selectedType === 'video'
                        ? darkMode
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-blue-50 border-blue-500 text-blue-600'
                        : darkMode
                          ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <FaVideo className="mr-2" />
                    Video
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                >
                  <option value="">Select a time slot</option>
                  {selectedDate && availableDoctors
                    .find(doc => doc.specialty === selectedSpecialty)
                    ?.availability.find(avail => avail.date === selectedDate)
                    ?.slots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                </select>
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={!selectedSpecialty || !selectedDate || !selectedTime}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center ${
                  !selectedSpecialty || !selectedDate || !selectedTime
                    ? darkMode
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                } transition-colors duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                <FaCalendarAlt className="mr-2" />
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAccess; 