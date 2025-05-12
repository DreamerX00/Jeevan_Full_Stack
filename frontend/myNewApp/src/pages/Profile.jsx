import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaIdCard, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import userProfileService from '../services/userProfileService';
import authService from '../services/authService';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // User data state
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    bloodGroup: '',
    height: '',
    weight: '',
    allergies: '',
    medicalConditions: '',
    medications: '',
    emergencyContact: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    // Check if user is logged in
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }

    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get user details from local storage
        const user = authService.getCurrentUser();
        if (user) {
          setUserData(prev => ({
            ...prev,
            email: user.email
          }));
        }
        
        // Fetch profile data from API
        const profileData = await userProfileService.getUserProfile();
        if (profileData) {
          // Format profile data for form
          const formattedData = {
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            email: user?.email || profileData.email || '',
            phone: profileData.phone || '',
            dateOfBirth: profileData.dateOfBirth || '',
            gender: profileData.gender || '',
            address: profileData.address || '',
            bloodGroup: profileData.bloodGroup || '',
            height: profileData.height?.toString() || '',
            weight: profileData.weight?.toString() || '',
            allergies: Array.isArray(profileData.allergies) ? profileData.allergies.join(', ') : profileData.allergies || '',
            medicalConditions: Array.isArray(profileData.medicalConditions) ? profileData.medicalConditions.join(', ') : profileData.medicalConditions || '',
            medications: Array.isArray(profileData.medications) ? profileData.medications.join(', ') : profileData.medications || '',
            emergencyContact: profileData.emergencyContact || ''
          };
          
          setUserData(formattedData);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile. ' + (err.error || err.message || ''));
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      
      // Format data for API
      const profileData = userProfileService.formatProfileData(userData);
      
      // Send data to API
      await userProfileService.updateUserProfile(profileData);
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. ' + (err.error || err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

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

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <FaExclamationCircle className="h-5 w-5 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

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
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaUser className="mr-2 h-4 w-4 text-gray-500" />
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.firstName || 'Not set'}</p>
                      )}
                    </div>
                    
                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaUser className="mr-2 h-4 w-4 text-gray-500" />
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.lastName || 'Not set'}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaEnvelope className="mr-2 h-4 w-4 text-gray-500" />
                        Email
                      </label>
                      <p className="text-gray-900">{userData.email}</p>
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
                        <p className="text-gray-900">{userData.phone || 'Not set'}</p>
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
                          type="date"
                          name="dateOfBirth"
                          value={userData.dateOfBirth}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.dateOfBirth || 'Not set'}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaUser className="mr-2 h-4 w-4 text-gray-500" />
                        Gender
                      </label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={userData.gender}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{userData.gender || 'Not set'}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaMapMarkerAlt className="mr-2 h-4 w-4 text-gray-500" />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={userData.address}
                          onChange={handleChange}
                          rows={3}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.address || 'Not set'}</p>
                      )}
                    </div>
                    
                    {/* Emergency Contact */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaPhone className="mr-2 h-4 w-4 text-gray-500" />
                        Emergency Contact
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="emergencyContact"
                          value={userData.emergencyContact}
                          onChange={handleChange}
                          placeholder="Name and phone number of emergency contact"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.emergencyContact || 'Not set'}</p>
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
                            <option value="">Select Blood Group</option>
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
                          <p className="text-gray-900">{userData.bloodGroup || 'Not set'}</p>
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
                          <p className="text-gray-900">{userData.height ? `${userData.height} cm` : 'Not set'}</p>
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
                          <p className="text-gray-900">{userData.weight ? `${userData.weight} kg` : 'Not set'}</p>
                        )}
                      </div>

                      {/* Allergies */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Allergies
                        </label>
                        {isEditing ? (
                          <textarea
                            name="allergies"
                            value={userData.allergies}
                            onChange={handleChange}
                            placeholder="Separate multiple allergies with commas"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="text-gray-900">{userData.allergies || 'None'}</p>
                        )}
                      </div>

                      {/* Medical Conditions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medical Conditions
                        </label>
                        {isEditing ? (
                          <textarea
                            name="medicalConditions"
                            value={userData.medicalConditions}
                            onChange={handleChange}
                            placeholder="Separate multiple conditions with commas"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="text-gray-900">{userData.medicalConditions || 'None'}</p>
                        )}
                      </div>

                      {/* Medications */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Medications
                        </label>
                        {isEditing ? (
                          <textarea
                            name="medications"
                            value={userData.medications}
                            onChange={handleChange}
                            placeholder="Separate multiple medications with commas"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="text-gray-900">{userData.medications || 'None'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
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