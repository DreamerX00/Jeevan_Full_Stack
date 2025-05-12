import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaExclamationCircle } from 'react-icons/fa';
import authService from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Validate form
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('Please fill in all required fields.');
      }
      
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }
      
      if (!formData.agreeToTerms) {
        throw new Error('You must agree to the terms and conditions.');
      }
      
      // Call register API
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        // The backend doesn't handle fullName and phone yet, but we can include them for future use
      });
      
      // If registration is successful, redirect to dashboard
      if (response.token) {
        navigate('/dashboard');
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message || err.error || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode 
      ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
      : 'bg-gradient-to-br from-blue-50 to-blue-100'} 
      py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-200`}>
      {/* Theme Toggle in top-right corner */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className={`max-w-md w-full space-y-8 ${darkMode ? 'bg-dark-card' : 'bg-white'} p-8 rounded-xl shadow-lg transition-colors duration-200`}>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
            Create an Account
          </h2>
          <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
            Join our medical platform for better healthcare
          </p>
        </div>
        
        {error && (
          <div className={`${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-500'} border-l-4 p-4 rounded transition-colors duration-200`} role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationCircle className={`h-5 w-5 ${darkMode ? 'text-red-300' : 'text-red-500'} transition-colors duration-200`} />
              </div>
              <div className="ml-3">
                <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'} transition-colors duration-200`}>{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="fullName" className="sr-only">
                Full Name
              </label>
              <FaUser className={`absolute top-3 left-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-200`} />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className={`appearance-none rounded-lg relative block w-full px-10 py-2 border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 placeholder-gray-500 text-gray-100' 
                    : 'border-gray-300 placeholder-gray-500 text-gray-900'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <FaEnvelope className={`absolute top-3 left-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-200`} />
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none rounded-lg relative block w-full px-10 py-2 border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 placeholder-gray-500 text-gray-100' 
                    : 'border-gray-300 placeholder-gray-500 text-gray-900'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <FaPhone className={`absolute top-3 left-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-200`} />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={`appearance-none rounded-lg relative block w-full px-10 py-2 border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 placeholder-gray-500 text-gray-100' 
                    : 'border-gray-300 placeholder-gray-500 text-gray-900'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <FaLock className={`absolute top-3 left-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-200`} />
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-lg relative block w-full px-10 py-2 border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 placeholder-gray-500 text-gray-100' 
                    : 'border-gray-300 placeholder-gray-500 text-gray-900'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <FaLock className={`absolute top-3 left-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-200`} />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`appearance-none rounded-lg relative block w-full px-10 py-2 border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 placeholder-gray-500 text-gray-100' 
                    : 'border-gray-300 placeholder-gray-500 text-gray-900'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agreeToTerms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label htmlFor="agree-terms" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} transition-colors duration-200`}>
              I agree to the{' '}
              <Link to="/terms" className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors duration-200`}>
                Terms and Conditions
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Account...' : 'Sign up'}
            </button>
          </div>
          
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>
              Already have an account?{' '}
              <Link to="/login" className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors duration-200`}>
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 