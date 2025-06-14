import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaUserMd, 
  FaPrescriptionBottleAlt, 
  FaFileMedicalAlt, 
  FaShoppingBag, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaHeartbeat,
  FaHospital,
  FaPhoneAlt,
  FaFirstAid
} from 'react-icons/fa';

const Sidebar = () => {
  const { darkMode } = useTheme();
  const location = useLocation();

  const menuItems = [
    {
      icon: <FaHome className="w-5 h-5" />,
      title: 'Home',
      path: '/',
      color: 'text-blue-500'
    },
    {
      icon: <FaCalendarAlt className="w-5 h-5" />,
      title: 'Appointments',
      path: '/appointments',
      color: 'text-purple-500'
    },
    {
      icon: <FaUserMd className="w-5 h-5" />,
      title: 'Doctors',
      path: '/doctors',
      color: 'text-green-500'
    },
    {
      icon: <FaPrescriptionBottleAlt className="w-5 h-5" />,
      title: 'Prescriptions',
      path: '/prescriptions',
      color: 'text-yellow-500'
    },
    {
      icon: <FaFileMedicalAlt className="w-5 h-5" />,
      title: 'Medical Records',
      path: '/medical-records',
      color: 'text-red-500'
    },
    {
      icon: <FaPhoneAlt className="w-5 h-5" />,
      title: 'Emergency Contacts',
      path: '/emergency-contacts',
      color: 'text-red-600'
    }
  ];

  const bottomMenuItems = [
    {
      icon: <FaUser className="w-5 h-5" />,
      title: 'Profile',
      path: '/profile',
      color: 'text-gray-500'
    },
    {
      icon: <FaCog className="w-5 h-5" />,
      title: 'Settings',
      path: '/settings',
      color: 'text-gray-500'
    },
    {
      icon: <FaSignOutAlt className="w-5 h-5" />,
      title: 'Logout',
      path: '/logout',
      color: 'text-gray-500'
    }
  ];

  return (
    <div className={`h-screen w-64 fixed left-0 top-0 ${darkMode ? 'bg-dark-card' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-200 flex flex-col`}>
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
            MediConnect
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                location.pathname === item.path
                  ? darkMode
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-blue-50 text-blue-600'
                  : darkMode
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`${item.color} transition-all duration-200 transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <span className="ml-3 font-medium">{item.title}</span>
              {location.pathname === item.path && (
                <div className={`absolute left-0 top-0 h-full w-1 ${darkMode ? 'bg-blue-400' : 'bg-blue-600'} transition-all duration-300`} />
              )}
            </Link>
          ))}
        </div>
      </nav>

      <div className={`px-4 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} bg-inherit`}>
        <div className="space-y-2">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === item.path
                  ? darkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : darkMode
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`${item.color} transition-all duration-200 transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <span className="ml-3 font-medium">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 