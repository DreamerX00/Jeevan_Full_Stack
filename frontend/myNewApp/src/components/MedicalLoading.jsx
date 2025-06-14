import React from 'react';
import { useTheme } from '../context/ThemeContext';

const MedicalLoading = () => {
  const { darkMode } = useTheme();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative">
        {/* Outer pulse circle */}
        <div className={`absolute inset-0 rounded-full animate-ping ${darkMode ? 'bg-red-400' : 'bg-red-500'} opacity-75`}></div>
        
        {/* Middle pulse circle */}
        <div className={`absolute inset-2 rounded-full animate-ping ${darkMode ? 'bg-red-500' : 'bg-red-600'} opacity-50`}></div>
        
        {/* Inner pulse circle */}
        <div className={`absolute inset-4 rounded-full animate-ping ${darkMode ? 'bg-red-600' : 'bg-red-700'} opacity-25`}></div>
        
        {/* Heart icon */}
        <div className={`relative w-16 h-16 flex items-center justify-center ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
          <svg
            className="w-12 h-12 animate-pulse"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </div>
        
        {/* Loading text */}
        <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
          Loading...
        </div>
      </div>
    </div>
  );
};

export default MedicalLoading; 