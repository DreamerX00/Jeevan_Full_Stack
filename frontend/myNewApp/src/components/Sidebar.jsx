import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaPrescriptionBottleAlt,
  FaUserMd,
  FaShoppingCart,
  FaFileAlt,
  FaCog,
  FaQuestionCircle,
  FaPhoneAlt,
  FaBars
} from 'react-icons/fa';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: FaHome, label: 'Home', path: '/' },
    { icon: FaCalendarAlt, label: 'Appointments', path: '/appointments' },
    { icon: FaPrescriptionBottleAlt, label: 'Prescriptions', path: '/prescriptions' },
    { icon: FaUserMd, label: 'Doctors', path: '/doctors' },
    { icon: FaShoppingCart, label: 'Medical Shop', path: '/shop' },
    { icon: FaFileAlt, label: 'Medical Records', path: '/records' },
    { icon: FaPhoneAlt, label: 'Emergency Contacts', path: '/emergency-contacts' },
  ];

  const bottomMenuItems = [
    { icon: FaCog, label: 'Settings', path: '/settings' },
    { icon: FaQuestionCircle, label: 'Help', path: '/help' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 text-white"
      >
        <FaBars className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transform transition-transform duration-200 ease-in-out fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 md:top-16`}>
        <div className="flex flex-col h-full">
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="px-4 space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-3 font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-200 py-4 px-4">
            {bottomMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 