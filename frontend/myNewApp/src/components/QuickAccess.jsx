import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const QuickAccess = () => {
  const { darkMode } = useTheme();
  
  const quickAccessItems = [
    {
      image: '/symptoms.png',
      title: 'Symptoms',
      description: 'Check your symptoms',
      path: '/symptoms'
    },
    {
      image: '/vaccination.png',
      title: 'Vaccination',
      description: 'Book your vaccines',
      path: '/vaccination'
    },
    {
      image: '/appointment.png',
      title: 'Appointment',
      description: 'Schedule a visit',
      path: '/appointment'
    },
    {
      image: '/diagnose.png',
      title: 'Diagnose',
      description: 'Online diagnosis',
      path: '/diagnose'
    },
    {
      image: '/shop.png',
      title: 'Shop',
      description: 'Medical supplies',
      path: '/shop'
    },
    {
      image: '/medical_kit.png',
      title: 'Kit',
      description: 'First aid essentials',
      path: '/kit'
    }
  ];

  const nearbyItems = [
    {
      image: '/hospital_icon.png',
      title: 'Hospitals',
      description: 'Find nearby hospitals',
      path: '/nearby-hospitals',
      bgColor: darkMode ? 'bg-gray-800' : 'bg-blue-50'
    },
    {
      image: '/pharamcy_icon.png',
      title: 'Pharmacy',
      description: 'Locate nearby pharmacies',
      path: '/nearby-pharmacies',
      bgColor: darkMode ? 'bg-gray-800' : 'bg-green-50'
    }
  ];

  return (
    <div className={`py-12 ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Specialties Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Our Specialties</h2>
            <Link 
              to="/services" 
              className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium flex items-center transition-colors duration-200`}
            >
              See All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {quickAccessItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`${darkMode ? 'bg-dark-card hover:bg-gray-800' : 'bg-white hover:shadow-md'} p-6 rounded-xl shadow-sm transition-all duration-200 flex flex-col items-center text-center group`}
              >
                <div className="w-16 h-16 mb-4 transform group-hover:scale-110 transition-transform duration-200">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{item.title}</h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Nearby Section */}
        <div>
          <div className="flex items-center mb-8">
            <FaMapMarkerAlt className="text-red-500 h-6 w-6 mr-2" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Nearby</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`${darkMode ? 'bg-dark-card hover:bg-gray-800' : 'bg-white hover:shadow-md'} p-6 rounded-xl shadow-sm transition-all duration-200 group`}
              >
                <div className="flex items-center">
                  <div className={`${item.bgColor} p-4 rounded-full group-hover:scale-110 transition-transform duration-200`}>
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{item.title}</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{item.description}</p>
                  </div>
                  <div className="ml-auto">
                    <svg className={`w-6 h-6 ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'} transition-colors duration-200`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAccess; 