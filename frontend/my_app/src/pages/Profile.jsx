import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaUserMd } from 'react-icons/fa';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Healthcare St, Medical City, MC 12345',
    dateOfBirth: '1990-01-01',
    bloodGroup: 'O+',
    allergies: 'None',
    emergencyContact: 'Jane Doe (+1 234 567 8901)',
    primaryDoctor: 'Dr. Sarah Johnson'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Handle profile update logic here
    console.log('Profile updated:', profileData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64 pt-16 px-4 md:px-8">
          <div className="py-8">
            <div className="max-w-3xl mx-auto">
              {/* Profile Header */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">{profileData.fullName}</h1>
                    <p className="text-gray-600">Patient ID: JD123456</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              </div>

              {/* Profile Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FaUser className="w-4 h-4 mr-2" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="w-4 h-4 mr-2" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FaPhone className="w-4 h-4 mr-2" />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.phone}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                        Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.address}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FaCalendar className="w-4 h-4 mr-2" />
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profileData.dateOfBirth}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.dateOfBirth}</p>
                      )}
                    </div>

                    {/* Blood Group */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        Blood Group
                      </label>
                      {isEditing ? (
                        <select
                          name="bloodGroup"
                          value={profileData.bloodGroup}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profileData.bloodGroup}</p>
                      )}
                    </div>

                    {/* Primary Doctor */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FaUserMd className="w-4 h-4 mr-2" />
                        Primary Doctor
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="primaryDoctor"
                          value={profileData.primaryDoctor}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.primaryDoctor}</p>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div className="md:col-span-2">
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FaPhone className="w-4 h-4 mr-2" />
                        Emergency Contact
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="emergencyContact"
                          value={profileData.emergencyContact}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.emergencyContact}</p>
                      )}
                    </div>

                    {/* Allergies */}
                    <div className="md:col-span-2">
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        Allergies
                      </label>
                      {isEditing ? (
                        <textarea
                          name="allergies"
                          value={profileData.allergies}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.allergies}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile; 