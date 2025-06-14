import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  FaPills, 
  FaSearch, 
  FaPlus, 
  FaBell,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaHistory,
  FaShoppingCart,
  FaInfoCircle,
  FaTrash,
  FaEdit
} from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Kit = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for medications
  const medications = [
    {
      id: 1,
      name: 'Paracetamol',
      type: 'Tablet',
      quantity: 20,
      expiryDate: '2024-12-31',
      dosage: '500mg',
      frequency: 'As needed',
      stock: 'Good',
      category: 'Pain Relief'
    },
    {
      id: 2,
      name: 'Amoxicillin',
      type: 'Capsule',
      quantity: 30,
      expiryDate: '2024-10-15',
      dosage: '250mg',
      frequency: 'Twice daily',
      stock: 'Low',
      category: 'Antibiotic'
    }
  ];

  // Mock data for prescriptions
  const prescriptions = [
    {
      id: 1,
      medication: 'Paracetamol',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-02-15',
      duration: '7 days',
      status: 'Active',
      refills: 2,
      instructions: 'Take 1 tablet every 6 hours as needed for pain'
    },
    {
      id: 2,
      medication: 'Amoxicillin',
      doctor: 'Dr. Michael Chen',
      date: '2024-03-01',
      duration: '10 days',
      status: 'Active',
      refills: 0,
      instructions: 'Take 1 capsule twice daily with meals'
    }
  ];

  // Mock data for reminders
  const reminders = [
    {
      id: 1,
      medication: 'Paracetamol',
      time: '09:00 AM',
      date: '2024-03-20',
      status: 'Pending',
      type: 'Daily'
    },
    {
      id: 2,
      medication: 'Amoxicillin',
      time: '02:00 PM',
      date: '2024-03-20',
      status: 'Pending',
      type: 'Daily'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm p-6 transition-colors duration-200`}>
              <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                Medical Kit
              </h1>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {['inventory', 'reminders', 'info'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${
                        activeTab === tab
                          ? darkMode
                            ? 'border-blue-500 text-blue-400'
                            : 'border-blue-500 text-blue-600'
                          : darkMode
                            ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Search and Filter */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    className={`px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  >
                    <option value="">All Categories</option>
                    <option value="medications">Medications</option>
                    <option value="first-aid">First Aid</option>
                    <option value="supplies">Medical Supplies</option>
                  </select>
                  <select
                    className={`px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  >
                    <option value="">Stock Status</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Content based on active tab */}
              <div className="mt-6">
                {activeTab === 'inventory' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medications.map((medication) => (
                      <div
                        key={medication.id}
                        className={`${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm p-6 border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        } transition-colors duration-200`}
                      >
                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                          {medication.name}
                        </h3>
                        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                          {medication.category}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-200`}>
                            {medication.quantity} remaining
                          </span>
                          <button
                            className={`px-4 py-2 rounded-lg ${
                              darkMode
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } text-white transition-colors duration-200`}
                          >
                            Reorder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reminders' && (
                  <div className="space-y-4">
                    {reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className={`${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm p-6 border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        } transition-colors duration-200`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                              {reminder.medication}
                            </h3>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                              {reminder.dosage} • {reminder.frequency}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              reminder.status === 'Taken'
                                ? darkMode
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-green-100 text-green-800'
                                : darkMode
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-800'
                            } transition-colors duration-200`}
                          >
                            {reminder.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="prose dark:prose-invert max-w-none">
                    <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                      About Your Medical Kit
                    </h2>
                    <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                      <p>
                        Your medical kit is designed to help you manage your medications and medical supplies
                        effectively. Keep track of your inventory and set reminders for your medications.
                      </p>
                      <h3 className={`text-lg font-semibold mt-6 mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                        Essential Items
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Prescription medications</li>
                        <li>First aid supplies</li>
                        <li>Medical devices</li>
                        <li>Emergency contact information</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Kit; 