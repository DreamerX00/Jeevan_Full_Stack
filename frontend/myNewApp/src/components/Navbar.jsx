import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBell, FaUser, FaTimes, FaSpinner, FaMoon, FaSun, FaComments } from 'react-icons/fa';
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';
import SearchResultItem from './SearchResultItem';
import ThemeToggle from './ThemeToggle';
import ChatNotifications from './Chat/ChatNotifications';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResults, 
    isSearching, 
    showResults, 
    setShowResults
  } = useSearch();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const searchRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowResults]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  // Group results by type for better display
  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {});

  return (
    <nav className={`${darkMode ? 'bg-dark-card text-white' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'} shadow-lg fixed w-full z-50 transition-colors duration-200`}>
      <div className="w-full px-0 sm:px-2 md:px-4">
        <div className="flex items-center h-16">
          {}
          <div className="flex-shrink-0 flex items-center pl-2">
            <div className={`${darkMode ? 'bg-white' : 'bg-white'} p-2 rounded-full shadow-md transition-colors duration-200 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <img 
                src="/heart_logo.png" 
                alt="Jeevan Logo" 
                className="h-9 w-9 transform scale-110"
              />
            </div>
            <Link to="/" className={`text-2xl font-bold ml-3 ${darkMode ? 'text-medical-light-blue' : 'text-white'}`}>Jeevan</Link>
            <div className="ml-4 h-7 w-[1px] bg-blue-400 opacity-50 hidden md:block"></div>
            <span className="hidden md:block ml-4 text-sm font-light opacity-90">Healthcare Management</span>
          </div>
          
          {/* Search Bar - centered */}
          <div className="hidden md:flex flex-1 items-center justify-center px-4">
            <div className="max-w-lg w-full" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search for doctors, symptoms, treatments..."
                  className={`w-full ${darkMode ? 'bg-white text-gray-900 border-gray-300' : 'bg-white text-gray-900 border-gray-300'} rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  {isSearching ? (
                    <FaSpinner className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'} animate-spin`} />
                  ) : (
                    <FaSearch className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  )}
                </div>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:${darkMode ? 'text-gray-200' : 'text-gray-600'}`}
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {showResults && searchTerm && searchResults.length > 0 && (
                <div className={`absolute mt-1 w-full ${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-md shadow-lg z-50 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-200`}>
                  <div className="py-2">
                    {/* Pages */}
                    {groupedResults.page && (
                      <div className="mb-2">
                        <h3 className={`text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} px-3 pb-1`}>Pages</h3>
                        <ul>
                          {groupedResults.page.map((result, index) => (
                            <li key={`page-${index}`}>
                              <SearchResultItem result={result} isDarkMode={darkMode} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Products */}
                    {groupedResults.product && (
                      <div className="mb-2">
                        <h3 className={`text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} px-3 pb-1`}>Products</h3>
                        <ul>
                          {groupedResults.product.map((result, index) => (
                            <li key={`product-${index}`}>
                              <SearchResultItem result={result} isDarkMode={darkMode} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Features */}
                    {groupedResults.feature && (
                      <div className="mb-2">
                        <h3 className={`text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} px-3 pb-1`}>Features</h3>
                        <ul>
                          {groupedResults.feature.map((result, index) => (
                            <li key={`feature-${index}`}>
                              <SearchResultItem result={result} isDarkMode={darkMode} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* No Results Message */}
              {showResults && searchTerm && searchResults.length === 0 && !isSearching && (
                <div className={`absolute mt-1 w-full ${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-md shadow-lg z-50 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No results found for "{searchTerm}"
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right side items */}
          <div className="ml-auto flex items-center pr-2">
            {/* Dark mode toggle */}
            <ThemeToggle minimal={true} className="mr-2" />
            
            {/* Chat Notifications */}
            <div className="ml-2">
              {(() => {
                try {
                  return <ChatNotifications />;
                } catch (error) {
                  return (
                    <button title="Chat notification failed to load" className="ml-2 p-2 rounded-full bg-red-100 text-red-600 cursor-not-allowed">
                      <FaComments className="h-5 w-5" />
                    </button>
                  );
                }
              })()}
            </div>

            {/* User Menu */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className={`h-9 w-9 rounded-full ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-white text-blue-600'} flex items-center justify-center shadow-md transition-colors duration-200`}>
                    <FaUser className="h-5 w-5" />
                  </div>
                </button>
              </div>
              
              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div 
                  className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${darkMode ? 'bg-dark-card ring-gray-700' : 'bg-white ring-black ring-opacity-5'} ring-1 transition-colors duration-200`}
                >
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <Link
                      to="/login"
                      className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search bar - only shown on small screens */}
      <div className={`md:hidden border-t ${darkMode ? 'border-gray-700' : 'border-blue-500'} transition-colors duration-200`}>
        <div className="px-2 py-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              {isSearching ? (
                <FaSpinner className="h-5 w-5 text-gray-400 animate-spin" />
              ) : (
                <FaSearch className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className={`w-full ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200`}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:${darkMode ? 'text-gray-200' : 'text-gray-600'}`}
              >
                <FaTimes className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 