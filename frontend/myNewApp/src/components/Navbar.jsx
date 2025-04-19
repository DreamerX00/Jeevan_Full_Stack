import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBell, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <div className="bg-white p-2 rounded-full shadow-md">
              <img 
                src="/heart_logo.png" 
                alt="Jeevan Logo" 
                className="h-9 w-9 transform scale-110"
              />
            </div>
            <Link to="/" className="text-2xl font-bold ml-3">Jeevan</Link>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center px-4">
            <div className="max-w-lg w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for doctors, symptoms, treatments..."
                  className="w-full bg-white text-gray-900 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="hidden md:block hover:bg-blue-700 px-3 py-2 rounded">Login</Link>
            <Link to="/signup" className="hidden md:block bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-full font-medium">Sign Up</Link>
            
            <button className="hover:bg-blue-700 p-2 rounded-full relative">
              <FaBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hover:bg-blue-700 p-2 rounded-full"
              >
                <FaUser className="h-6 w-6" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                  <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white text-gray-900 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 