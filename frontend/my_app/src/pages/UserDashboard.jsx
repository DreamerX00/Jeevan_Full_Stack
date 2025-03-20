import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaCalendar, FaPills, FaFileAlt, FaHeartbeat } from 'react-icons/fa';

const UserDashboard = () => {
  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2024-03-15',
      time: '10:00 AM',
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      date: '2024-03-20',
      time: '2:30 PM',
    },
  ];

  const recentPrescriptions = [
    {
      id: 1,
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Twice daily',
      prescribed: '2024-03-01',
    },
    {
      id: 2,
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribed: '2024-02-28',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 px-8">
          <div className="py-8">
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Welcome, John Doe</h1>
                <p className="text-gray-600">Here's your health overview</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3">
                      <FaCalendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Upcoming Appointments</p>
                      <p className="text-xl font-semibold text-gray-900">2</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-3">
                      <FaPills className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Active Prescriptions</p>
                      <p className="text-xl font-semibold text-gray-900">3</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 rounded-full p-3">
                      <FaFileAlt className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Medical Records</p>
                      <p className="text-xl font-semibold text-gray-900">8</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-red-100 rounded-full p-3">
                      <FaHeartbeat className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Health Score</p>
                      <p className="text-xl font-semibold text-gray-900">85%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointments and Prescriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{appointment.doctor}</p>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Prescriptions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Prescriptions</h2>
                  <div className="space-y-4">
                    {recentPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{prescription.medication}</p>
                            <p className="text-sm text-gray-600">{prescription.dosage} - {prescription.frequency}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Prescribed on</p>
                            <p className="text-sm font-medium text-gray-900">{prescription.prescribed}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard; 