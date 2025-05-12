import { 
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, 
  FaIdCard, FaSpinner, FaExclamationCircle, FaCamera, 
  FaWeight, FaRulerVertical, FaTint, FaStethoscope, FaPills, FaUserMd 
} from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import userProfileService from '../services/userProfileService';
import authService from '../services/authService';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const { darkMode } = useTheme();
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
          
          // Set profile photo if it exists
          if (profileData.photoUrl) {
            setPreviewUrl(profileData.photoUrl);
          }
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
  
  // Profile photo handling
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      
      // Store the file
      setProfilePhoto(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': []
    },
    maxSize: 5 * 1024 * 1024, // 5MB max size
    maxFiles: 1
  });
  
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
      
      // Add profile photo if it exists
      if (profilePhoto) {
        profileData.photo = profilePhoto;
      }
      
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
      <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} flex items-center justify-center transition-colors duration-200`}>
        <div className="text-center">
          <FaSpinner className={`animate-spin h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mx-auto`} />
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading your profile...</p>
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Profile header with photo and intro */}
            <div className={`relative p-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-medical-navy to-dark-accent shadow-medical-dark' : 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-md'} mb-8 mt-4 transition-all duration-300 transform hover:scale-[1.01] transition-transform`}>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                {/* Profile photo */}
                <div 
                  {...getRootProps()} 
                  className={`relative group cursor-pointer w-32 h-32 rounded-full overflow-hidden border-4 ${darkMode ? 'border-dark-accent' : 'border-white'} shadow-lg transition-all duration-200`}
                  style={{ 
                    pointerEvents: isEditing ? 'auto' : 'none'
                  }}
                >
                  {isEditing && <input {...getInputProps()} />}
                  
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-blue-100'}`}>
                      <FaUser className={`h-16 w-16 ${darkMode ? 'text-gray-400' : 'text-blue-400'}`} />
                    </div>
                  )}
                  
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaCamera className="h-8 w-8 text-white" />
                      <span className="absolute bottom-1 text-xs text-white font-medium">
                        {isDragActive ? 'Drop Here' : 'Upload Photo'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* User info */}
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {userData.firstName && userData.lastName 
                      ? `${userData.firstName} ${userData.lastName}` 
                      : 'Your Profile'}
                  </h1>
                  <p className="text-blue-100 mt-1">
                    {userData.email}
                  </p>
                  {!isEditing && userData.bloodGroup && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                      <FaTint className="mr-1" />
                      Blood Group: {userData.bloodGroup}
                    </div>
                  )}
                </div>
                
                {/* Edit button - positioned right on larger screens */}
                <div className="md:ml-auto">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${darkMode 
                        ? 'text-dark-bg bg-blue-400 hover:bg-blue-500' 
                        : 'text-white bg-blue-700 hover:bg-blue-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${darkMode 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        form="profileForm"
                        disabled={saving}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${darkMode 
                          ? 'text-dark-bg bg-blue-400 hover:bg-blue-500' 
                          : 'text-white bg-blue-700 hover:bg-blue-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                      >
                        {saving ? (
                          <>
                            <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Saving...
                          </>
                        ) : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Decorative wave pattern at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
                <svg className="absolute bottom-0 w-full h-16 text-white dark:text-dark-bg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path
                    d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                    className={`${darkMode ? 'fill-dark-bg' : 'fill-white'} opacity-25`}
                  ></path>
                  <path
                    d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                    className={`${darkMode ? 'fill-dark-bg' : 'fill-white'} opacity-50`}
                  ></path>
                  <path
                    d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                    className={`${darkMode ? 'fill-dark-bg' : 'fill-white'} opacity-75`}
                  ></path>
                </svg>
              </div>
            </div>

            {error && (
              <div className={`mb-6 ${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-500'} border-l-4 p-4 rounded transition-colors duration-200`}>
                <div className="flex">
                  <FaExclamationCircle className={`h-5 w-5 ${darkMode ? 'text-red-500' : 'text-red-500'}`} />
                  <div className="ml-3">
                    <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Profile form */}
            <form id="profileForm" onSubmit={handleSubmit}>
              <div className={`${darkMode ? 'bg-dark-card text-gray-200' : 'bg-white text-gray-900'} rounded-xl shadow-sm overflow-hidden transition-colors duration-200`}>
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                  <div className="flex items-center">
                    <div className={`${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'} p-3 rounded-full transition-colors duration-200`}>
                      <FaUser className="h-6 w-6" />
                    </div>
                    <h2 className={`ml-3 text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Personal Information</h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="group">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 flex items-center`}>
                        <FaUser className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleChange}
                          className={`block w-full sm:text-sm rounded-md ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.firstName || 'Not set'}
                        </p>
                      )}
                    </div>
                    
                    {/* Last Name */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 flex items-center`}>
                        <FaUser className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleChange}
                          className={`block w-full sm:text-sm rounded-md ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.lastName || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 flex items-center`}>
                        <FaEnvelope className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Email
                      </label>
                      <p className={`${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-900 bg-gray-50'} p-2 rounded`}>
                        {userData.email}
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 flex items-center`}>
                        <FaPhone className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={userData.phone}
                          onChange={handleChange}
                          className={`block w-full sm:text-sm rounded-md ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.phone || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 flex items-center`}>
                        <FaCalendarAlt className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={userData.dateOfBirth}
                          onChange={handleChange}
                          className={`block w-full sm:text-sm rounded-md ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.dateOfBirth || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 flex items-center`}>
                        <FaUser className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Gender
                      </label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={userData.gender}
                          onChange={handleChange}
                          className={`block w-full sm:text-sm rounded-md ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.gender || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 flex items-center`}>
                        <FaMapMarkerAlt className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={userData.address}
                          onChange={handleChange}
                          rows={3}
                          className={`block w-full sm:text-sm rounded-md ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.address || 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Medical Information Section */}
                <div className={`pt-2 px-6 pb-6 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'} transition-colors duration-200`}>
                  <div className="flex items-center mb-4">
                    <div className={`${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'} p-2 rounded-full transition-colors duration-200`}>
                      <FaStethoscope className="h-5 w-5" />
                    </div>
                    <h3 className={`ml-3 text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      Medical Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Blood Group */}
                    <div className="group transform transition-all duration-200 hover:scale-105">
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-blue-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-2">
                          <FaTint className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                          <label className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Blood Group
                          </label>
                        </div>
                        {isEditing ? (
                          <select
                            name="bloodGroup"
                            value={userData.bloodGroup}
                            onChange={handleChange}
                            className={`mt-1 block w-full sm:text-sm rounded-md ${darkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
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
                          <div className={`mt-1 text-2xl font-bold text-center ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                            {userData.bloodGroup || 'Not set'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Height */}
                    <div className="group transform transition-all duration-200 hover:scale-105">
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-green-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-2">
                          <FaRulerVertical className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                          <label className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Height (cm)
                          </label>
                        </div>
                        {isEditing ? (
                          <input
                            type="number"
                            name="height"
                            value={userData.height}
                            onChange={handleChange}
                            className={`mt-1 block w-full sm:text-sm rounded-md ${darkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                          />
                        ) : (
                          <div className={`mt-1 text-2xl font-bold text-center ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {userData.height ? `${userData.height} cm` : 'Not set'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="group transform transition-all duration-200 hover:scale-105">
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-purple-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-2">
                          <FaWeight className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                          <label className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Weight (kg)
                          </label>
                        </div>
                        {isEditing ? (
                          <input
                            type="number"
                            name="weight"
                            value={userData.weight}
                            onChange={handleChange}
                            className={`mt-1 block w-full sm:text-sm rounded-md ${darkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                          />
                        ) : (
                          <div className={`mt-1 text-2xl font-bold text-center ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                            {userData.weight ? `${userData.weight} kg` : 'Not set'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="md:col-span-3">
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-red-50 border border-red-100'} transition-colors duration-200`}>
                        <div className="flex items-center mb-2">
                          <FaPhone className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                          <label className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Emergency Contact
                          </label>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="emergencyContact"
                            value={userData.emergencyContact}
                            onChange={handleChange}
                            placeholder="Name and phone number of emergency contact"
                            className={`mt-1 block w-full sm:text-sm rounded-md ${darkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                          />
                        ) : (
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {userData.emergencyContact || 'Not set'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Medical Cards - Single Row with 3 cards */}
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Allergies Card */}
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-yellow-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-2">
                          <div className={`rounded-full p-2 ${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
                            <FaExclamationCircle className={`h-4 w-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                          </div>
                          <label className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Allergies
                          </label>
                        </div>
                        {isEditing ? (
                          <textarea
                            name="allergies"
                            value={userData.allergies}
                            onChange={handleChange}
                            placeholder="Separate multiple allergies with commas"
                            rows={3}
                            className={`mt-1 block w-full sm:text-sm rounded-md ${darkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                          />
                        ) : (
                          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} mt-1`}>
                            {userData.allergies ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {userData.allergies.split(',').map((item, idx) => (
                                  <li key={idx}>{item.trim()}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-center italic">None</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Medical Conditions Card */}
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-2">
                          <div className={`rounded-full p-2 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                            <FaUserMd className={`h-4 w-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                          </div>
                          <label className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Medical Conditions
                          </label>
                        </div>
                        {isEditing ? (
                          <textarea
                            name="medicalConditions"
                            value={userData.medicalConditions}
                            onChange={handleChange}
                            placeholder="Separate multiple conditions with commas"
                            rows={3}
                            className={`mt-1 block w-full sm:text-sm rounded-md ${darkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                          />
                        ) : (
                          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} mt-1`}>
                            {userData.medicalConditions ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {userData.medicalConditions.split(',').map((item, idx) => (
                                  <li key={idx}>{item.trim()}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-center italic">None</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Medications Card */}
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-blue-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-2">
                          <div className={`rounded-full p-2 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                            <FaPills className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                          </div>
                          <label className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Current Medications
                          </label>
                        </div>
                        {isEditing ? (
                          <textarea
                            name="medications"
                            value={userData.medications}
                            onChange={handleChange}
                            placeholder="Separate multiple medications with commas"
                            rows={3}
                            className={`mt-1 block w-full sm:text-sm rounded-md ${darkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                          />
                        ) : (
                          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} mt-1`}>
                            {userData.medications ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {userData.medications.split(',').map((item, idx) => (
                                  <li key={idx}>{item.trim()}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-center italic">None</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile; 