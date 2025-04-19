import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  FaCalendarCheck, 
  FaHeartbeat, 
  FaPills, 
  FaUserMd, 
  FaFileMedical,
  FaPhone
} from 'react-icons/fa';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: '15 May 2023', time: '10:00 AM' },
    { id: 2, doctor: 'Dr. Robert Williams', specialty: 'Dermatologist', date: '22 May 2023', time: '2:30 PM' },
  ];

  const recentPrescriptions = [
    { id: 1, medication: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', prescribed: '01 May 2023' },
    { id: 2, medication: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribed: '28 Apr 2023' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">View and manage your health information</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaCalendarCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Appointments</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">2</p>
                    <p className="text-sm text-gray-500">Upcoming</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaHeartbeat className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Health Status</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">Good</p>
                    <p className="text-sm text-gray-500">Last checkup: 2 weeks ago</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaPills className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Prescriptions</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">2</p>
                    <p className="text-sm text-gray-500">Active medications</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'appointments'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('prescriptions')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'prescriptions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Prescriptions
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'doctors'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Doctors
                </button>
                <button
                  onClick={() => setActiveTab('records')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'records'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Medical Records
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upcoming Appointments */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
                      <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-500">View All</Link>
                    </div>
                    <div className="px-6 py-4">
                      {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingAppointments.map(appointment => (
                            <div key={appointment.id} className="flex items-start p-3 border border-gray-200 rounded-lg">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <FaUserMd className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{appointment.doctor}</p>
                                <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                <p className="text-xs text-gray-500 mt-1">{appointment.date} • {appointment.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No upcoming appointments</p>
                      )}
                    </div>
                  </div>

                  {/* Recent Prescriptions */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Recent Prescriptions</h3>
                      <Link to="/prescriptions" className="text-sm text-blue-600 hover:text-blue-500">View All</Link>
                    </div>
                    <div className="px-6 py-4">
                      {recentPrescriptions.length > 0 ? (
                        <div className="space-y-4">
                          {recentPrescriptions.map(prescription => (
                            <div key={prescription.id} className="flex items-start p-3 border border-gray-200 rounded-lg">
                              <div className="bg-purple-100 p-2 rounded-full">
                                <FaPills className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{prescription.medication} {prescription.dosage}</p>
                                <p className="text-sm text-gray-500">{prescription.frequency}</p>
                                <p className="text-xs text-gray-500 mt-1">Prescribed: {prescription.prescribed}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No recent prescriptions</p>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Emergency Contacts</h3>
                      <Link to="/emergency-contacts" className="text-sm text-blue-600 hover:text-blue-500">Manage</Link>
                    </div>
                    <div className="px-6 py-4">
                      <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                        <div className="bg-red-100 p-2 rounded-full">
                          <FaPhone className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Emergency Helpline</p>
                          <p className="text-sm text-gray-500">108</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== 'overview' && (
                <div className="bg-white rounded-xl shadow-sm p-6 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                    <p className="text-gray-500">This section is under development.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard; 