import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Carousel from '../components/Carousel';
import QuickAccess from '../components/QuickAccess';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <Carousel />
          <QuickAccess />
          
          {/* Additional content can be added here */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Featured Doctors Section */}
              <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} p-6 rounded-xl shadow-sm transition-colors duration-200`}>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-200`}>Featured Doctors</h2>
                {/* Add featured doctors content */}
              </div>
              
              {/* Latest Health Tips Section */}
              <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} p-6 rounded-xl shadow-sm transition-colors duration-200`}>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-200`}>Latest Health Tips</h2>
                {/* Add health tips content */}
              </div>
            </div>
            <div className="mt-4">
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Quick Links</h3>
              <div className="flex space-x-4">
                <Link 
                  to="/records" 
                  className={`px-4 py-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition-colors duration-200`}
                >
                  Medical Records
                </Link>
                <Link 
                  to="/shop" 
                  className={`px-4 py-2 ${darkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md transition-colors duration-200`}
                >
                  Medical Shop
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage; 