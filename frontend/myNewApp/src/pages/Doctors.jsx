import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  FaUserMd, 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaClock, 
  FaMapMarkerAlt,
  FaVideo,
  FaPhone,
  FaCalendarAlt,
  FaGraduationCap,
  FaHospital
} from 'react-icons/fa';

const Doctors = () => {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');

  // Mock data for doctors
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Physician',
      experience: '15 years',
      rating: 4.8,
      reviews: 245,
      education: 'MD, Harvard Medical School',
      hospital: 'City Health Center',
      location: 'New York, NY',
      availability: [
        { date: '2024-03-20', slots: ['09:00', '10:00', '11:00'] },
        { date: '2024-03-21', slots: ['14:00', '15:00', '16:00'] }
      ],
      consultationFee: 150,
      image: '/doctors/doctor1.jpg',
      videoConsultation: true,
      languages: ['English', 'Spanish'],
      about: 'Specialized in preventive care and chronic disease management.'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      experience: '12 years',
      rating: 4.9,
      reviews: 189,
      education: 'MD, Stanford University',
      hospital: 'Heart Care Institute',
      location: 'San Francisco, CA',
      availability: [
        { date: '2024-03-20', slots: ['13:00', '14:00', '15:00'] },
        { date: '2024-03-21', slots: ['09:00', '10:00', '11:00'] }
      ],
      consultationFee: 200,
      image: '/doctors/doctor2.jpg',
      videoConsultation: true,
      languages: ['English', 'Mandarin'],
      about: 'Expert in cardiovascular diseases and preventive cardiology.'
    }
  ];

  const specialties = [
    'All Specialties',
    'General Physician',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Gynecology',
    'Ophthalmology',
    'ENT'
  ];

  const locations = [
    'All Locations',
    'New York, NY',
    'San Francisco, CA',
    'Los Angeles, CA',
    'Chicago, IL',
    'Boston, MA'
  ];

  const availabilityOptions = [
    'All Times',
    'Morning (9 AM - 12 PM)',
    'Afternoon (12 PM - 5 PM)',
    'Evening (5 PM - 9 PM)',
    'Weekends'
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
                Find a Doctor
              </h1>

              {/* Search and Filter Section */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  />
                </div>

                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                >
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    } rounded-lg shadow-sm p-6 border ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    } transition-colors duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                          {doctor.name}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                          {doctor.specialty}
                        </p>
                        <div className="flex items-center mt-1">
                          <FaStar className="h-4 w-4 text-yellow-400" />
                          <span className={`ml-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {doctor.rating} ({doctor.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <FaGraduationCap className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{doctor.education}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaHospital className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{doctor.hospital}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaMapMarkerAlt className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{doctor.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          ${doctor.consultationFee}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          per consultation
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doctor.videoConsultation && (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            <FaVideo className="inline-block mr-1" />
                            Video
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button
                        className={`flex-1 px-4 py-2 rounded-lg ${
                          darkMode
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors duration-200`}
                      >
                        Book Appointment
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg border ${
                          darkMode
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        } transition-colors duration-200`}
                      >
                        <FaPhone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Doctors; 