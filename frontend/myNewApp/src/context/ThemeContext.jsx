import { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';

// Safe storage utilities to handle localStorage errors
const safeStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check localStorage or system preference for initial theme value
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = safeStorage.get('jeevan-theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Fallback to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.error('Error initializing theme:', error);
      return false; // Default to light mode
    }
  });

  // Get user gender from localStorage
  const [userGender, setUserGender] = useState(() => {
    return safeStorage.get('jeevan-user-gender', null);
  });

  // Update the class on the html element when darkMode changes
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        safeStorage.set('jeevan-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        safeStorage.set('jeevan-theme', 'light');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }, [darkMode]);

  // Update gender in localStorage when it changes
  useEffect(() => {
    try {
      if (userGender) {
        safeStorage.set('jeevan-user-gender', userGender);
      } else {
        safeStorage.remove('jeevan-user-gender');
      }
    } catch (error) {
      console.error('Error updating user gender:', error);
    }
  }, [userGender]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  // Set user gender
  const setGender = useCallback((gender) => {
    if (gender && typeof gender === 'string') {
      setUserGender(gender.toLowerCase());
    } else {
      setUserGender(null);
    }
  }, []);

  // Memoized theme colors for better performance
  const themeColors = useMemo(() => {
    const isMale = userGender?.toLowerCase() === 'male';
    const isFemale = userGender?.toLowerCase() === 'female';
    
    if (!userGender || isMale) {
      // Default/Male theme (blue-based)
      return {
        primary: darkMode ? 'from-blue-900 via-blue-800 to-blue-900' : 'from-blue-600 via-blue-500 to-blue-600',
        secondary: darkMode ? 'bg-blue-800' : 'bg-blue-500',
        accent: darkMode ? 'text-blue-400' : 'text-blue-600',
        hover: darkMode ? 'hover:bg-blue-700' : 'hover:bg-blue-600',
        card: darkMode ? 'bg-gray-800' : 'bg-white',
        text: darkMode ? 'text-gray-200' : 'text-gray-900',
        textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600'
      };
    } else if (isFemale) {
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
    
    // Fallback to default theme
    return {
      primary: darkMode ? 'from-blue-900 via-blue-800 to-blue-900' : 'from-blue-600 via-blue-500 to-blue-600',
      secondary: darkMode ? 'bg-blue-800' : 'bg-blue-500',
      accent: darkMode ? 'text-blue-400' : 'text-blue-600',
      hover: darkMode ? 'hover:bg-blue-700' : 'hover:bg-blue-600',
      card: darkMode ? 'bg-gray-800' : 'bg-white',
      text: darkMode ? 'text-gray-200' : 'text-gray-900',
      textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600'
    };
  }, [darkMode, userGender]);

  // Memoized context value for better performance
  const contextValue = useMemo(() => ({
    darkMode,
    toggleDarkMode,
    userGender,
    setGender,
    themeColors
  }), [darkMode, toggleDarkMode, userGender, setGender, themeColors]);

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