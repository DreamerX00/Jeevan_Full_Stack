import React, { useState, useEffect } from 'react';
import { 
  FaPhone, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaAmbulance, 
  FaHospital, 
  FaUserMd, 
  FaExclamationTriangle,
  FaHeartbeat,
  FaShieldAlt,
  FaUserShield
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const EmergencyContacts = () => {
  const { darkMode } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    isPrimary: false
  });

  // Emergency services data with enhanced icons and animations
  const emergencyServices = [
    {
      id: 1,
      name: 'Emergency Ambulance',
      number: '108',
      icon: <FaAmbulance className="h-6 w-6 animate-pulse-slow" />,
      description: '24/7 emergency ambulance service',
      color: 'red'
    },
    {
      id: 2,
      name: 'Police Control Room',
      number: '100',
      icon: <FaShieldAlt className="h-6 w-6 animate-pulse-slow" />,
      description: 'Emergency police assistance',
      color: 'blue'
    },
    {
      id: 3,
      name: 'Fire Department',
      number: '101',
      icon: <FaExclamationTriangle className="h-6 w-6 animate-pulse-slow" />,
      description: 'Fire and rescue services',
      color: 'orange'
    }
  ];

  useEffect(() => {
    // Load contacts from localStorage
    const savedContacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
    setContacts(savedContacts);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newContact = {
      id: editingContact?.id || Date.now(),
      ...formData
    };

    let updatedContacts;
    if (editingContact) {
      updatedContacts = contacts.map(contact => 
        contact.id === editingContact.id ? newContact : contact
      );
    } else {
      updatedContacts = [...contacts, newContact];
    }

    // If this is set as primary, unset any other primary contacts
    if (newContact.isPrimary) {
      updatedContacts = updatedContacts.map(contact => ({
        ...contact,
        isPrimary: contact.id === newContact.id ? true : false
      }));
    }

    setContacts(updatedContacts);
    localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
    setShowAddModal(false);
    setEditingContact(null);
    setFormData({ name: '', relationship: '', phone: '', isPrimary: false });
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData(contact);
    setShowAddModal(true);
  };

  const handleDelete = (contactId) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    setContacts(updatedContacts);
    localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
  };

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                Emergency Contacts
              </h1>
              <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                Quick access to emergency services and your personal emergency contacts
              </p>
            </div>

            {/* Emergency Services Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                  Emergency Services
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {emergencyServices.map(service => (
                  <div
                    key={service.id}
                    className={`p-6 rounded-xl border ${
                      darkMode ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
                    } shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-full ${
                        darkMode 
                          ? `bg-${service.color}-900/20 text-${service.color}-400` 
                          : `bg-${service.color}-100 text-${service.color}-600`
                      } transition-colors duration-200`}>
                        {service.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {service.name}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCall(service.number)}
                      className={`w-full py-3 px-4 rounded-lg flex items-center justify-center ${
                        darkMode
                          ? `bg-${service.color}-600 hover:bg-${service.color}-700 text-white`
                          : `bg-${service.color}-500 hover:bg-${service.color}-600 text-white`
                      } transition-colors duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98]`}
                    >
                      <FaPhone className="mr-2 animate-pulse" />
                      Call {service.number}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Emergency Contacts Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                    Personal Emergency Contacts
                  </h2>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                    Manage your emergency contacts and set a primary contact
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingContact(null);
                    setFormData({ name: '', relationship: '', phone: '', isPrimary: false });
                    setShowAddModal(true);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-colors duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <FaPlus className="mr-2" />
                  Add Contact
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contacts.map(contact => (
                  <div
                    key={contact.id}
                    className={`p-6 rounded-xl border ${
                      darkMode ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
                    } shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {contact.name}
                          </h3>
                          {contact.isPrimary && (
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800'
                            }`}>
                              Primary
                            </span>
                          )}
                        </div>
                        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {contact.relationship}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleCall(contact.phone)}
                          className={`p-2 rounded-lg ${
                            darkMode
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          } transition-colors duration-200 transform hover:scale-110 active:scale-95`}
                          title="Call Contact"
                        >
                          <FaPhone className="animate-pulse" />
                        </button>
                        <button
                          onClick={() => handleEdit(contact)}
                          className={`p-2 rounded-lg ${
                            darkMode
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          } transition-colors duration-200 transform hover:scale-110 active:scale-95`}
                          title="Edit Contact"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className={`p-2 rounded-lg ${
                            darkMode
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          } transition-colors duration-200 transform hover:scale-110 active:scale-95`}
                          title="Delete Contact"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl p-8 w-full max-w-md mx-4 transform transition-all duration-200 scale-100`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Relationship
                </label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter relationship"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPrimary"
                  checked={formData.isPrimary}
                  onChange={handleInputChange}
                  className={`h-5 w-5 rounded ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                  } transition-colors duration-200`}
                />
                <label className={`ml-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Set as primary contact
                </label>
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingContact(null);
                    setFormData({ name: '', relationship: '', phone: '', isPrimary: false });
                  }}
                  className={`px-6 py-3 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } transition-colors duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98]`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-lg ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-colors duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {editingContact ? 'Save Changes' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts; 