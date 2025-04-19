import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+91 9876543210',
    dateOfBirth: '15/04/1985',
    address: '123 Main Street, Bangalore, Karnataka',
    bloodGroup: 'B+',
    height: '175',
    weight: '70',
    allergies: 'Peanuts, Penicillin',
    medicalConditions: 'Hypertension',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically send the updated data to a server
    console.log('Updated user data:', userData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your personal information</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaUser className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="ml-3 text-lg font-medium text-gray-900">Personal Information</h2>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaUser className="mr-2 h-4 w-4 text-gray-500" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={userData.fullName}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaEnvelope className="mr-2 h-4 w-4 text-gray-500" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaPhone className="mr-2 h-4 w-4 text-gray-500" />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={userData.phone}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.phone}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaCalendarAlt className="mr-2 h-4 w-4 text-gray-500" />
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="dateOfBirth"
                          value={userData.dateOfBirth}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.dateOfBirth}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaMapMarkerAlt className="mr-2 h-4 w-4 text-gray-500" />
                        Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={userData.address}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <FaIdCard className="mr-2 h-5 w-5 text-blue-600" />
                      Medical Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Blood Group */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Blood Group
                        </label>
                        {isEditing ? (
                          <select
                            name="bloodGroup"
                            value={userData.bloodGroup}
                            onChange={handleChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        ) : (
                          <p className="text-gray-900">{userData.bloodGroup}</p>
                        )}
                      </div>

                      {/* Height */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Height (cm)
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="height"
                            value={userData.height}
                            onChange={handleChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="text-gray-900">{userData.height} cm</p>
                        )}
                      </div>

                      {/* Weight */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg)
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="weight"
                            value={userData.weight}
                            onChange={handleChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="text-gray-900">{userData.weight} kg</p>
                        )}
                      </div>

                      {/* Allergies */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Allergies
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="allergies"
                            value={userData.allergies}
                            onChange={handleChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="text-gray-900">{userData.allergies}</p>
                        )}
                      </div>

                      {/* Medical Conditions */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medical Conditions
                        </label>
                        {isEditing ? (
                          <textarea
                            name="medicalConditions"
                            value={userData.medicalConditions}
                            onChange={handleChange}
                            rows={3}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="text-gray-900">{userData.medicalConditions}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile; 