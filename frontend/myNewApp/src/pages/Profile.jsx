import { 
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, 
  FaIdCard, FaSpinner, FaExclamationCircle, FaCamera, 
  FaWeight, FaRulerVertical, FaTint, FaStethoscope, FaPills, FaUserMd, FaExclamationTriangle, FaSave, FaTimes, FaCheck,
  FaHeartbeat, FaNotesMedical, FaHospital, FaUserNurse
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
  const [editMode, setEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const { darkMode, themeColors, setGender } = useTheme();
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
    emergencyContact: '',
    aadhaarNumber: '',
    panNumber: '',
    abhaNumber: ''
  });

  // Track changes in form data
  useEffect(() => {
    if (editMode && originalData) {
      const hasFormChanges = Object.keys(userData).some(key => userData[key] !== originalData[key]);
      setHasChanges(hasFormChanges);
    }
  }, [userData, editMode, originalData]);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (!editMode) {
      setOriginalData({...userData});
      setEditMode(true);
    } else {
      // Reset form data if canceling
      setUserData({...originalData});
      setEditMode(false);
      setHasChanges(false);
    }
  };

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
  
  // Load user identification data
  useEffect(() => {
    const loadUserIdentification = async () => {
      try {
        const identificationData = await userProfileService.getUserIdentification();
        setUserData(prev => ({
          ...prev,
          aadhaarNumber: identificationData.aadhaarNumber || '',
          panNumber: identificationData.panNumber || '',
          abhaNumber: identificationData.abhaNumber || ''
        }));
      } catch (err) {
        console.error('Error loading identification:', err);
      }
    };

    if (!loading) {
      loadUserIdentification();
    }
  }, [loading]);
  
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

  // Handle gender change
  const handleGenderChange = (e) => {
    const newGender = e.target.value;
    setGender(newGender); // Update theme based on gender
    setUserData(prev => ({
      ...prev,
      gender: newGender
    }));
  };

  // Handle form submission
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
      
      setEditMode(false);
      setHasChanges(false);
      setOriginalData(null);
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
            <div className={`relative overflow-hidden rounded-2xl shadow-xl mb-8 bg-gradient-to-r ${themeColors.primary}`}>
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse"></div>
                <div className="absolute top-20 -right-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-10 left-1/4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>

              {/* Floating medical icons */}
              <div className="absolute inset-0">
                <FaHeartbeat className="absolute top-10 left-10 text-white opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }} />
                <FaNotesMedical className="absolute top-20 right-20 text-white opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
                <FaHospital className="absolute bottom-10 left-20 text-white opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }} />
                <FaUserNurse className="absolute bottom-20 right-10 text-white opacity-20 animate-bounce" style={{ animationDelay: '2s' }} />
              </div>

              <div className="relative p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile photo section */}
                <div 
                  {...getRootProps()} 
                  className={`relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group transform transition-all duration-300 hover:scale-105 ${editMode ? 'ring-4 ring-white ring-opacity-50' : ''}`}
                >
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-blue-100'}`}>
                      <FaUser className={`h-20 w-20 ${themeColors.accent} transition-transform duration-300 group-hover:scale-110`} />
                    </div>
                  )}
                  
                  {editMode && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center">
                        <FaCamera className="h-10 w-10 text-white mx-auto mb-2 animate-bounce" />
                        <span className="text-sm text-white font-medium">
                          {isDragActive ? 'Drop Here' : 'Upload Photo'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User info with enhanced styling */}
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 transform transition-all duration-300 hover:scale-105">
                    {userData.firstName && userData.lastName 
                      ? `${userData.firstName} ${userData.lastName}` 
                      : 'Your Profile'}
                  </h1>
                  <p className="text-blue-100 text-lg mb-4 transform transition-all duration-300 hover:scale-105">
                    {userData.email}
                  </p>
                  {!editMode && userData.bloodGroup && (
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
                      <FaTint className="mr-2 animate-pulse" />
                      Blood Group: {userData.bloodGroup}
                    </div>
                  )}
                </div>
                
                {/* Edit button with enhanced styling */}
                <div className="md:ml-auto">
                  {!editMode ? (
                    <button
                      onClick={handleEditToggle}
                      className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg ${darkMode 
                        ? 'text-dark-bg bg-blue-400 hover:bg-blue-500' 
                        : 'text-white bg-blue-700 hover:bg-blue-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 hover:rotate-1`}
                    >
                      <FaUser className="mr-2 animate-bounce" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${darkMode 
                          ? 'text-dark-bg bg-gray-400 hover:bg-gray-500' 
                          : 'text-white bg-gray-600 hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105`}
                      >
                        <FaTimes className="mr-2" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        form="profileForm"
                        disabled={saving || !hasChanges}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${darkMode 
                          ? 'text-dark-bg bg-blue-400 hover:bg-blue-500' 
                          : 'text-white bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 ${(!hasChanges || saving) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {saving ? (
                          <FaSpinner className="mr-2 animate-spin" />
                        ) : (
                          <FaSave className="mr-2" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

           

           
            {error && (
              <div className={`mb-6 ${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-500'} border-l-4 p-4 rounded-lg transition-colors duration-200`}>
                <div className="flex">
                  <FaExclamationCircle className={`h-5 w-5 ${darkMode ? 'text-red-500' : 'text-red-500'}`} />
                  <div className="ml-3">
                    <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {editMode && hasChanges && (
              <div className={`mb-6 ${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-500'} border-l-4 p-4 rounded-lg transition-colors duration-200`}>
                <div className="flex items-center">
                  <FaCheck className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  <div className="ml-3">
                    <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                      You have unsaved changes. Click "Save Changes" to update your profile.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Profile form with enhanced card styling */}
            <form id="profileForm" onSubmit={handleSubmit}>
              <div className={`${darkMode ? 'bg-dark-card text-gray-200' : 'bg-white text-gray-900'} rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}>
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                  <div className="flex items-center">
                    <div className={`${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'} p-3 rounded-full transition-colors duration-200`}>
                      <FaUser className="h-6 w-6" />
                    </div>
                    <h2 className={`ml-3 text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Personal Information</h2>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* First Name */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <FaUser className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        First Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.firstName || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <FaUser className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Last Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.lastName || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <FaEnvelope className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Email
                      </label>
                      <p className={`${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-900 bg-gray-50'} p-3 rounded-lg`}>
                        {userData.email}
                      </p>
                    </div>

                    {/* Phone Number */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <FaPhone className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Phone
                      </label>
                      {editMode ? (
                        <input
                          type="tel"
                          name="phone"
                          value={userData.phone}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.phone || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Gender Selection */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <FaUser className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Gender
                      </label>
                      {editMode ? (
                        <select
                          name="gender"
                          value={userData.gender}
                          onChange={handleGenderChange}
                          className={`block w-full px-4 py-3 rounded-lg ${darkMode 
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
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.gender || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <FaCalendarAlt className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Date of Birth
                      </label>
                      {editMode ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={userData.dateOfBirth}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.dateOfBirth || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Address with enhanced styling */}
                    <div className="md:col-span-2 group transform transition-all duration-200 hover:scale-[1.02]">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <FaMapMarkerAlt className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Address
                      </label>
                      {editMode ? (
                        <textarea
                          name="address"
                          value={userData.address}
                          onChange={handleChange}
                          rows={3}
                          className={`block w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.address || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Aadhaar Number */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <FaIdCard className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        Aadhaar Number
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="aadhaarNumber"
                          value={userData.aadhaarNumber}
                          onChange={handleChange}
                          pattern="[0-9]{12}"
                          maxLength="12"
                          className={`block w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                          placeholder="Enter 12-digit Aadhaar number"
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.aadhaarNumber || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* PAN Number */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <FaIdCard className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        PAN Number
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="panNumber"
                          value={userData.panNumber}
                          onChange={handleChange}
                          pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                          maxLength="10"
                          className={`block w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                          placeholder="Enter PAN number"
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.panNumber || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* ABHA Number */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <FaIdCard className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ABHA Number
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="abhaNumber"
                          value={userData.abhaNumber}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} transition-colors duration-200`}
                          placeholder="Enter ABHA number"
                        />
                      ) : (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-900'} p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {userData.abhaNumber || 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Medical Information Section with enhanced styling */}
                <div className={`p-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center mb-6">
                    <div className={`${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'} p-3 rounded-full transition-colors duration-200`}>
                      <FaStethoscope className="h-6 w-6" />
                    </div>
                    <h2 className={`ml-3 text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Medical Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Blood Group with enhanced styling */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-red-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-3">
                          <div className={`rounded-full p-2 ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                          <FaTint className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                          </div>
                          <label className={`ml-3 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Blood Group
                          </label>
                        </div>
                        {editMode ? (
                          <select
                            name="bloodGroup"
                            value={userData.bloodGroup}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-3 rounded-lg ${darkMode 
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

                    {/* Height with enhanced styling */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-green-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-3">
                          <div className={`rounded-full p-2 ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                          <FaRulerVertical className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                          </div>
                          <label className={`ml-3 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Height (cm)
                          </label>
                        </div>
                        {editMode ? (
                          <input
                            type="number"
                            name="height"
                            value={userData.height}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-3 rounded-lg ${darkMode 
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

                    {/* Weight with enhanced styling */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-purple-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-3">
                          <div className={`rounded-full p-2 ${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                          <FaWeight className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                          </div>
                          <label className={`ml-3 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Weight (kg)
                          </label>
                        </div>
                        {editMode ? (
                          <input
                            type="number"
                            name="weight"
                            value={userData.weight}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-3 rounded-lg ${darkMode 
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

                    {/* Allergies with enhanced styling */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-yellow-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-3">
                          <div className={`rounded-full p-2 ${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
                            <FaExclamationTriangle className={`h-5 w-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                          </div>
                          <label className={`ml-3 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Allergies
                          </label>
                        </div>
                        {editMode ? (
                          <textarea
                            name="allergies"
                            value={userData.allergies}
                            onChange={handleChange}
                            placeholder="Separate multiple allergies with commas"
                            rows={3}
                            className={`mt-1 block w-full px-4 py-3 rounded-lg ${darkMode 
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
                    </div>
                    
                    {/* Medical Conditions with enhanced styling */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-3">
                          <div className={`rounded-full p-2 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                            <FaUserMd className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                          </div>
                          <label className={`ml-3 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Medical Conditions
                          </label>
                        </div>
                        {editMode ? (
                          <textarea
                            name="medicalConditions"
                            value={userData.medicalConditions}
                            onChange={handleChange}
                            placeholder="Separate multiple conditions with commas"
                            rows={3}
                            className={`mt-1 block w-full px-4 py-3 rounded-lg ${darkMode 
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
                    </div>
                    
                    {/* Medications with enhanced styling */}
                    <div className="group transform transition-all duration-200 hover:scale-[1.02]">
                      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-blue-50'} transition-colors duration-200`}>
                        <div className="flex items-center mb-3">
                          <div className={`rounded-full p-2 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                            <FaPills className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                          </div>
                          <label className={`ml-3 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Current Medications
                          </label>
                        </div>
                        {editMode ? (
                          <textarea
                            name="medications"
                            value={userData.medications}
                            onChange={handleChange}
                            placeholder="Separate multiple medications with commas"
                            rows={3}
                            className={`mt-1 block w-full px-4 py-3 rounded-lg ${darkMode 
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