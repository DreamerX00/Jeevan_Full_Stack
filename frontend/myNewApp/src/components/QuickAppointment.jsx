import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaVideo, 
  FaPhone,
  FaSearch
} from 'react-icons/fa';

const QuickAppointment = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
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
      availability: [
        { date: '2024-03-20', slots: ['09:00', '10:00', '11:00'] },
        { date: '2024-03-21', slots: ['14:00', '15:00', '16:00'] }
      ],
      image: '/doctors/doctor1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      experience: '12 years',
      rating: 4.9,
      availability: [
        { date: '2024-03-20', slots: ['13:00', '14:00', '15:00'] },
        { date: '2024-03-21', slots: ['09:00', '10:00', '11:00'] }
      ],
      image: '/doctors/doctor2.jpg'
    }
  ];

  const specialties = [
    'General Physician',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics'
  ];

  const handleBookAppointment = (doctor) => {
    // Here you would typically make an API call to book the appointment
    const appointment = {
      doctor: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
      status: 'Pending',
      location: selectedType === 'video' ? 'Online' : 'City Health Center'
    };

    // Store the appointment in localStorage for now (in a real app, this would be in a database)
    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    existingAppointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(existingAppointments));

    // Navigate to appointments page
    navigate('/appointments');
  };

  return (
    <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm p-6 transition-colors duration-200`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
          Quick Appointment
        </h2>
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className={`px-4 py-2 rounded-lg ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors duration-200`}
        >
          {showBookingForm ? 'Cancel' : 'Book Now'}
        </button>
      </div>

      {showBookingForm && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
            >
              <option value="">Select Specialty</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
            >
              <option value="in-person">In-person Consultation</option>
              <option value="video">Video Consultation</option>
            </select>
          </div>

          {selectedSpecialty && (
            <div className="space-y-4">
              <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Available Doctors
              </h3>
              <div className="space-y-4">
                {availableDoctors
                  .filter(doctor => doctor.specialty === selectedSpecialty)
                  .map(doctor => (
                    <div
                      key={doctor.id}
                      className={`p-4 rounded-lg border ${
                        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                      } transition-colors duration-200`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {doctor.name}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {doctor.experience} • Rating: {doctor.rating}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className={`px-4 py-2 rounded-lg border ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                        >
                          <option value="">Select Date</option>
                          {doctor.availability.map((slot) => (
                            <option key={slot.date} value={slot.date}>
                              {slot.date}
                            </option>
                          ))}
                        </select>

                        {selectedDate && (
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${
                              darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                          >
                            <option value="">Select Time</option>
                            {doctor.availability
                              .find(slot => slot.date === selectedDate)
                              ?.slots.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>

                      {selectedDate && selectedTime && (
                        <button
                          onClick={() => handleBookAppointment(doctor)}
                          className={`w-full mt-4 px-4 py-2 rounded-lg ${
                            darkMode
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white transition-colors duration-200`}
                        >
                          Book Appointment
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!showBookingForm && (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <p>Click "Book Now" to schedule your appointment</p>
        </div>
      )}
    </div>
  );
};

export default QuickAppointment; 