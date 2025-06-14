import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  FaSyringe, 
  FaCalendarAlt, 
  FaHistory, 
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaDownload,
  FaShare,
  FaBell
} from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

const Vaccination = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('book');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for available vaccines
  const availableVaccines = [
    {
      id: 1,
      name: 'COVID-19 Booster',
      manufacturer: 'Pfizer',
      type: 'mRNA',
      recommendedAge: '18+',
      doses: 1,
      interval: '6 months after last dose',
      protection: '95%',
      sideEffects: 'Mild fever, fatigue, injection site pain',
      nextAvailable: '2024-03-20'
    },
    {
      id: 2,
      name: 'Influenza (Flu)',
      manufacturer: 'Multiple',
      type: 'Inactivated',
      recommendedAge: '6 months+',
      doses: 1,
      interval: 'Annual',
      protection: '40-60%',
      sideEffects: 'Mild fever, soreness',
      nextAvailable: '2024-03-15'
    },
    {
      id: 3,
      name: 'Tetanus, Diphtheria, Pertussis (Tdap)',
      manufacturer: 'GSK',
      type: 'Toxoid',
      recommendedAge: '11+',
      doses: 1,
      interval: '10 years',
      protection: '95%',
      sideEffects: 'Pain, redness, swelling at injection site',
      nextAvailable: '2024-03-18'
    }
  ];

  // Mock data for vaccination history
  const vaccinationHistory = [
    {
      id: 1,
      vaccine: 'COVID-19 (Primary Series)',
      date: '2023-01-15',
      location: 'City Health Center',
      batch: 'PF123456',
      status: 'Completed',
      certificate: 'covid_primary_cert.pdf'
    },
    {
      id: 2,
      vaccine: 'Influenza',
      date: '2023-10-20',
      location: 'Local Pharmacy',
      batch: 'FL789012',
      status: 'Completed',
      certificate: 'flu_2023_cert.pdf'
    }
  ];

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      vaccine: 'COVID-19 Booster',
      date: '2024-03-20',
      time: '10:00 AM',
      location: 'City Health Center',
      status: 'Scheduled'
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
                Vaccination Services
              </h1>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {['book', 'history', 'info'].map((tab) => (
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
                    placeholder="Search vaccines..."
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
                    <option value="routine">Routine</option>
                    <option value="travel">Travel</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                  <select
                    className={`px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  >
                    <option value="">All Ages</option>
                    <option value="infant">Infant (0-2 years)</option>
                    <option value="child">Child (2-12 years)</option>
                    <option value="teen">Teen (12-18 years)</option>
                    <option value="adult">Adult (18+ years)</option>
                  </select>
                </div>
              </div>

              {/* Content based on active tab */}
              <div className="mt-6">
                {activeTab === 'book' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableVaccines.map((vaccine) => (
                      <div
                        key={vaccine.id}
                        className={`${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm p-6 border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        } transition-colors duration-200`}
                      >
                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                          {vaccine.name}
                        </h3>
                        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                          {vaccine.manufacturer}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-200`}>
                            {vaccine.recommendedAge}
                          </span>
                          <button
                            className={`px-4 py-2 rounded-lg ${
                              darkMode
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } text-white transition-colors duration-200`}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    {vaccinationHistory.map((record) => (
                      <div
                        key={record.id}
                        className={`${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm p-6 border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        } transition-colors duration-200`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                              {record.vaccine}
                            </h3>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                              {record.date} at {record.location}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              record.status === 'Completed'
                                ? darkMode
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-green-100 text-green-800'
                                : darkMode
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-800'
                            } transition-colors duration-200`}
                          >
                            {record.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="prose dark:prose-invert max-w-none">
                    <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                      Vaccination Information
                    </h2>
                    <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                      <p>
                        Vaccination is one of the most effective ways to prevent diseases. Our vaccination services
                        include routine immunizations, travel vaccines, and seasonal flu shots.
                      </p>
                      <h3 className={`text-lg font-semibold mt-6 mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                        Why Vaccinate?
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Protect yourself and others from preventable diseases</li>
                        <li>Help prevent the spread of infectious diseases</li>
                        <li>Reduce the risk of serious complications</li>
                        <li>Contribute to community immunity</li>
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

export default Vaccination; 