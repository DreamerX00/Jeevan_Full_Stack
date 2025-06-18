import { createContext, useState, useEffect, useContext } from 'react';

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check localStorage or system preference for initial theme value
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('jeevan-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Get user gender from localStorage
  const [userGender, setUserGender] = useState(() => {
    return localStorage.getItem('jeevan-user-gender') || null;
  });

  // Update the class on the html element when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jeevan-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jeevan-theme', 'light');
    }
  }, [darkMode]);

  // Update gender in localStorage when it changes
  useEffect(() => {
    if (userGender) {
      localStorage.setItem('jeevan-user-gender', userGender);
    } else {
      localStorage.removeItem('jeevan-user-gender');
    }
  }, [userGender]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Set user gender
  const setGender = (gender) => {
    setUserGender(gender);
  };

  // Get theme colors based on gender and dark mode
  const getThemeColors = () => {
    if (!userGender) {
      // Default theme (blue-based)
      return {
        primary: darkMode ? 'from-blue-900 via-blue-800 to-blue-900' : 'from-blue-600 via-blue-500 to-blue-600',
        secondary: darkMode ? 'bg-blue-800' : 'bg-blue-500',
        accent: darkMode ? 'text-blue-400' : 'text-blue-600',
        hover: darkMode ? 'hover:bg-blue-700' : 'hover:bg-blue-600',
        card: darkMode ? 'bg-gray-800' : 'bg-white',
        text: darkMode ? 'text-gray-200' : 'text-gray-900',
        textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600'
      };
    }

    if (userGender.toLowerCase() === 'male') {
      // Male theme (blue-based)
      return {
        primary: darkMode ? 'from-blue-900 via-blue-800 to-blue-900' : 'from-blue-600 via-blue-500 to-blue-600',
        secondary: darkMode ? 'bg-blue-800' : 'bg-blue-500',
        accent: darkMode ? 'text-blue-400' : 'text-blue-600',
        hover: darkMode ? 'hover:bg-blue-700' : 'hover:bg-blue-600',
        card: darkMode ? 'bg-gray-800' : 'bg-white',
        text: darkMode ? 'text-gray-200' : 'text-gray-900',
        textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600'
      };
    } else {
      // Female theme (purple/pink-based)
      return {
        primary: darkMode ? 'from-purple-900 via-pink-800 to-purple-900' : 'from-purple-600 via-pink-500 to-purple-600',
        secondary: darkMode ? 'bg-purple-800' : 'bg-purple-500',
        accent: darkMode ? 'text-pink-400' : 'text-pink-600',
        hover: darkMode ? 'hover:bg-purple-700' : 'hover:bg-purple-600',
        card: darkMode ? 'bg-gray-800' : 'bg-white',
        text: darkMode ? 'text-gray-200' : 'text-gray-900',
        textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600'
      };
    }
  };

  // Context value
  const contextValue = {
    darkMode,
    toggleDarkMode,
    userGender,
    setGender,
    themeColors: getThemeColors()
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 