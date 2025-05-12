import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { Switch } from '@headlessui/react';

const ThemeToggle = ({ className = '', minimal = false }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  if (minimal) {
    return (
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-full ${darkMode 
          ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'} 
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Switch
        checked={darkMode}
        onChange={toggleDarkMode}
        className={`${
          darkMode ? 'bg-blue-600' : 'bg-gray-300'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span className="sr-only">
          {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        </span>
        <span
          className={`${
            darkMode ? 'translate-x-6 bg-gray-800' : 'translate-x-1 bg-white'
          } inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ease-in-out`}
        />
      </Switch>
      <span className={`ml-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {darkMode ? (
          <div className="flex items-center">
            <FaSun className="mr-1 text-yellow-300" />
            Light
          </div>
        ) : (
          <div className="flex items-center">
            <FaMoon className="mr-1 text-blue-800" />
            Dark
          </div>
        )}
      </span>
    </div>
  );
};

export default ThemeToggle; 