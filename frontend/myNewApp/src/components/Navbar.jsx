import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBell, FaUser, FaTimes, FaSpinner } from 'react-icons/fa';
import { useSearch } from '../context/SearchContext';
import SearchResultItem from './SearchResultItem';

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
    <nav className="bg-blue-600 text-white shadow-lg fixed w-full z-50">
      <div className="w-full px-0 sm:px-2 md:px-4">
        <div className="flex items-center h-16">
          {}
          <div className="flex-shrink-0 flex items-center pl-2">
            <div className="bg-white p-2 rounded-full shadow-md">
              <img 
                src="/heart_logo.png" 
                alt="Jeevan Logo" 
                className="h-9 w-9 transform scale-110"
              />
            </div>
            <Link to="/" className="text-2xl font-bold ml-3">Jeevan</Link>
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
                  className="w-full bg-white text-gray-900 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  {isSearching ? (
                    <FaSpinner className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : (
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {showResults && searchTerm && searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="py-2">
                    {/* Pages */}
                    {groupedResults.page && (
                      <div className="mb-2">
                        <h3 className="text-xs uppercase font-semibold text-gray-500 px-3 pb-1">Pages</h3>
                        <ul>
                          {groupedResults.page.map((result, index) => (
                            <li key={`page-${index}`}>
                              <SearchResultItem result={result} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Products */}
                    {groupedResults.product && (
                      <div className="mb-2">
                        <h3 className="text-xs uppercase font-semibold text-gray-500 px-3 pb-1">Products</h3>
                        <ul>
                          {groupedResults.product.map((result, index) => (
                            <li key={`product-${index}`}>
                              <SearchResultItem result={result} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Features */}
                    {groupedResults.feature && (
                      <div className="mb-2">
                        <h3 className="text-xs uppercase font-semibold text-gray-500 px-3 pb-1">Features</h3>
                        <ul>
                          {groupedResults.feature.map((result, index) => (
                            <li key={`feature-${index}`}>
                              <SearchResultItem result={result} />
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
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="p-4 text-center text-gray-500">
                    No results found for "{searchTerm}"
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right side user menu */}
          <div className="ml-auto flex items-center pr-2">
            {/* Notifications */}
            <button className="ml-4 p-2 rounded-full hover:bg-blue-700 relative">
              <FaBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-blue-600"></span>
            </button>
            
            {/* User Menu */}
            <div className="ml-4 relative">
              <div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-blue-600">
                    <FaUser className="h-5 w-5" />
                  </div>
                </button>
              </div>
              
              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
      <div className="md:hidden border-t border-blue-500">
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
              className="w-full bg-white text-gray-900 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Search Results */}
        {showResults && searchTerm && (
          <div className="absolute left-0 right-0 bg-white shadow-lg mt-1 mx-4 rounded-md z-50 max-h-96 overflow-y-auto border border-gray-200">
            {searchResults.length > 0 ? (
              <div className="p-2">
                {/* Pages */}
                {groupedResults.page && (
                  <div className="mb-3">
                    <h3 className="text-xs uppercase font-semibold text-gray-500 px-3 pb-1">Pages</h3>
                    <ul>
                      {groupedResults.page.map((result, index) => (
                        <li key={`m-page-${index}`}>
                          <SearchResultItem result={result} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Products */}
                {groupedResults.product && (
                  <div className="mb-3">
                    <h3 className="text-xs uppercase font-semibold text-gray-500 px-3 pb-1">Products</h3>
                    <ul>
                      {groupedResults.product.map((result, index) => (
                        <li key={`m-product-${index}`}>
                          <SearchResultItem result={result} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Features */}
                {groupedResults.feature && (
                  <div className="mb-3">
                    <h3 className="text-xs uppercase font-semibold text-gray-500 px-3 pb-1">Features</h3>
                    <ul>
                      {groupedResults.feature.map((result, index) => (
                        <li key={`m-feature-${index}`}>
                          <SearchResultItem result={result} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : !isSearching ? (
              <div className="p-4 text-center text-gray-500">
                No results found for "{searchTerm}"
              </div>
            ) : (
              <div className="p-4 text-center">
                <FaSpinner className="inline-block h-5 w-5 text-blue-600 animate-spin" />
                <p className="mt-2 text-gray-500">Searching...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 