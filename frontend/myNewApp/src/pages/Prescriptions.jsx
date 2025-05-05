import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  FaPrescriptionBottleAlt, 
  FaFileMedical,
  FaPills, 
  FaCalendarAlt,
  FaUserMd,
  FaDownload,
  FaShoppingCart,
  FaExclamationTriangle,
  FaCheck,
  FaSearch
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Prescriptions = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for current medications
  const currentMedications = [
    {
      id: 1,
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: 'Once daily',
      timing: 'Morning, after breakfast',
      prescribedDate: '15 May 2023',
      endDate: '15 Nov 2023',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      reason: 'Hypertension',
      instructions: 'Take with water. Avoid grapefruit juice.',
      refillsRemaining: 2,
      status: 'Active',
      quantity: '30 tablets',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      timing: 'Morning and evening, with meals',
      prescribedDate: '22 Apr 2023',
      endDate: '22 Oct 2023',
      doctor: 'Dr. James Wilson',
      specialty: 'Endocrinology',
      reason: 'Type 2 Diabetes',
      instructions: 'Take with food to minimize GI side effects.',
      refillsRemaining: 3,
      status: 'Active',
      quantity: '60 tablets',
      image: 'https://images.unsplash.com/photo-1626716046238-0e09595e5764?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Hydrocortisone Cream',
      dosage: '1%',
      frequency: 'Twice daily',
      timing: 'Morning and evening',
      prescribedDate: '22 Mar 2023',
      endDate: '22 Jun 2023',
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      reason: 'Contact dermatitis',
      instructions: 'Apply thin layer to affected areas. Do not use on face unless directed.',
      refillsRemaining: 1,
      status: 'Active',
      quantity: '1 tube (30g)',
      image: 'https://images.unsplash.com/photo-1576602976016-d14c313e3293?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];
  
  // Mock data for past medications
  const pastMedications = [
    {
      id: 4,
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      timing: 'Every 8 hours',
      prescribedDate: '10 Jan 2023',
      endDate: '17 Jan 2023',
      doctor: 'Dr. Emily Wilson',
      specialty: 'General Medicine',
      reason: 'Bacterial infection',
      instructions: 'Complete entire course even if symptoms improve.',
      status: 'Completed',
      quantity: '21 capsules',
      image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      name: 'Ibuprofen',
      dosage: '400mg',
      frequency: 'As needed',
      timing: 'Every 6 hours as needed for pain',
      prescribedDate: '05 Dec 2022',
      endDate: '19 Dec 2022',
      doctor: 'Dr. Robert Adams',
      specialty: 'Orthopedics',
      reason: 'Knee sprain',
      instructions: 'Take with food. Do not exceed 1200mg in 24 hours.',
      status: 'Completed',
      quantity: '20 tablets',
      image: 'https://images.unsplash.com/photo-1550572017-49960de90618?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      name: 'Loratadine',
      dosage: '10mg',
      frequency: 'Once daily',
      timing: 'Morning',
      prescribedDate: '15 Oct 2022',
      endDate: '15 Nov 2022',
      doctor: 'Dr. Lisa Patel',
      specialty: 'Allergy & Immunology',
      reason: 'Seasonal allergies',
      instructions: 'Can be taken with or without food.',
      status: 'Completed',
      quantity: '30 tablets',
      image: 'https://images.unsplash.com/photo-1626716098239-6c062d134d18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];
  
  // Filter medications based on search term
  const filteredCurrent = currentMedications.filter(medication => 
    medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPast = pastMedications.filter(medication => 
    medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
                <p className="mt-2 text-lg text-gray-600">Manage and track your medications</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <FaFileMedical className="mr-2" />
                Upload Prescription
              </button>
            </div>
            
            {/* Search and Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-wrap items-center justify-between">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search medications, conditions, doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('current')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'current'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaPills className="inline-block mr-2" />
                    Current Medications
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'past'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaPrescriptionBottleAlt className="inline-block mr-2" />
                    Past Medications
                  </button>
                </div>
              </div>
            </div>
            
            {/* Current Medications */}
            {activeTab === 'current' && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Medications</h2>
                {filteredCurrent.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCurrent.map((medication) => (
                      <div key={medication.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                        <div className="p-4">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-blue-100">
                              <img 
                                src={medication.image} 
                                alt={medication.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                              <p className="text-sm text-gray-500">{medication.dosage}, {medication.frequency}</p>
                            </div>
                            <div className="ml-auto">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                {medication.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500">Prescribed By</p>
                                <p className="text-sm font-medium text-gray-900">{medication.doctor}</p>
                                <p className="text-xs text-gray-500">{medication.specialty}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Date Prescribed</p>
                                <p className="text-sm font-medium text-gray-900">{medication.prescribedDate}</p>
                                <p className="text-xs text-gray-500">Until {medication.endDate}</p>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-xs text-gray-500">For Condition</p>
                              <p className="text-sm font-medium text-gray-900">{medication.reason}</p>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-xs text-gray-500">Instructions</p>
                              <p className="text-sm text-gray-700">{medication.instructions}</p>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-xs text-gray-500">Refills Remaining</p>
                                <p className="text-sm font-medium text-gray-900">{medication.refillsRemaining}</p>
                              </div>
                              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                <FaShoppingCart className="mr-1" />
                                Refill Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <FaPills className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No current medications</h3>
                    <p className="mt-1 text-sm text-gray-500">You don't have any active prescriptions at the moment.</p>
                  </div>
                )}
                
                {/* Medication Reminders */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Medication Reminders</h3>
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FaExclamationTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                        <p className="text-sm font-medium text-gray-900">Important Medication Information</p>
                      </div>
                    </div>
                    <ul className="space-y-4">
                      <li className="border-b border-gray-200 pb-4">
                        <div className="flex">
                          <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Take medications at the same time each day</p>
                            <p className="text-xs text-gray-500">Keeping a consistent schedule helps maintain proper medication levels in your body.</p>
                          </div>
                        </div>
                      </li>
                      <li className="border-b border-gray-200 pb-4">
                        <div className="flex">
                          <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Don't skip doses</p>
                            <p className="text-xs text-gray-500">Even if you feel better, continue taking your medication as prescribed until completed.</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="flex">
                          <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Refill prescriptions before they run out</p>
                            <p className="text-xs text-gray-500">Request refills at least 3-5 days before your medication runs out.</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
            
            {/* Past Medications */}
            {activeTab === 'past' && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Medications</h2>
                {filteredPast.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {filteredPast.map((medication) => (
                        <li key={medication.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                              <img 
                                src={medication.image} 
                                alt={medication.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                                  <p className="text-sm text-gray-500">{medication.dosage}, {medication.frequency}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">{medication.prescribedDate}</p>
                                  <p className="text-xs text-gray-500">to {medication.endDate}</p>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">For:</span> {medication.reason}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Doctor:</span> {medication.doctor}
                                  </p>
                                </div>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                  {medication.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between">
                            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                              <FaDownload className="mr-1 h-4 w-4" />
                              Download Prescription
                            </button>
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                              View Details
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <FaPrescriptionBottleAlt className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No past medications</h3>
                    <p className="mt-1 text-sm text-gray-500">Your medication history will appear here.</p>
                  </div>
                )}
                
                {/* Medication History Summary */}
                {filteredPast.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Medication History Summary</h3>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Total Prescriptions</p>
                          <p className="text-3xl font-bold text-blue-600">{pastMedications.length}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Completed Courses</p>
                          <p className="text-3xl font-bold text-green-600">{pastMedications.filter(m => m.status === 'Completed').length}</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Conditions Treated</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {new Set(pastMedications.map(m => m.reason)).size}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Most Recent Doctors</h4>
                        <div className="space-y-2">
                          {Array.from(new Set(pastMedications.map(m => m.doctor)))
                            .slice(0, 3)
                            .map((doctor, index) => {
                              const medication = pastMedications.find(m => m.doctor === doctor);
                              return (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <FaUserMd className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700">{doctor}</span>
                                    <span className="ml-2 text-xs text-gray-500">({medication.specialty})</span>
                                  </div>
                                  <span className="text-xs text-gray-500">{medication.prescribedDate}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Prescriptions; 