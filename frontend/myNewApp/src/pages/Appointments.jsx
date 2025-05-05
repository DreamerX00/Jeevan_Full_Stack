import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  FaCalendarAlt, 
  FaCalendarCheck, 
  FaCalendarPlus, 
  FaUserMd, 
  FaClock, 
  FaMapMarkerAlt, 
  FaFileMedical, 
  FaFilter, 
  FaPhone, 
  FaVideo,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  
  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      date: '15 Jun 2023',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      location: 'City Hospital, Block A',
      address: '123 Medical Center Blvd, Delhi',
      type: 'In-person',
      reason: 'Annual Heart Checkup',
      notes: 'Bring previous ECG reports',
      status: 'Confirmed',
      phoneNumber: '+91 98765 43210'
    },
    {
      id: 2,
      date: '22 Jun 2023',
      time: '3:30 PM',
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      location: 'DermaCare Clinic',
      address: '456 Health Street, Delhi',
      type: 'Video',
      reason: 'Skin Rash Follow-up',
      notes: 'Take clear photos of affected area before consultation',
      status: 'Pending',
      videoLink: 'https://meet.example.com/dr-chen-123'
    },
    {
      id: 3,
      date: '05 Jul 2023',
      time: '9:15 AM',
      doctor: 'Dr. Emily Wilson',
      specialty: 'General Medicine',
      location: 'Family Health Center',
      address: '789 Hospital Road, Delhi',
      type: 'In-person',
      reason: 'Regular Health Checkup',
      notes: 'Fasting required for blood tests',
      status: 'Confirmed',
      phoneNumber: '+91 87654 32109'
    }
  ];
  
  // Mock data for previous appointments
  const previousAppointments = [
    {
      id: 4,
      date: '15 May 2023',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      location: 'City Hospital, Block A',
      type: 'In-person',
      reason: 'Annual Heart Checkup',
      diagnosis: 'Mild hypertension',
      prescription: 'Amlodipine 5mg daily',
      followUp: 'In 3 months',
      documents: ['heart_report_may_2023.pdf', 'ecg_may_2023.pdf']
    },
    {
      id: 5,
      date: '22 Mar 2023',
      time: '2:30 PM',
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      location: 'DermaCare Clinic',
      type: 'In-person',
      reason: 'Skin Rash Consultation',
      diagnosis: 'Contact dermatitis',
      prescription: 'Hydrocortisone cream 1%, apply twice daily',
      followUp: 'As needed',
      documents: ['dermatology_report_mar_2023.pdf']
    },
    {
      id: 6,
      date: '10 Jan 2023',
      time: '9:15 AM',
      doctor: 'Dr. Emily Wilson',
      specialty: 'Immunology',
      location: 'Family Health Center',
      type: 'In-person',
      reason: 'COVID-19 Vaccination',
      notes: 'Second booster dose administered',
      followUp: 'None required',
      documents: ['vaccination_certificate_jan_2023.pdf']
    },
    {
      id: 7,
      date: '05 Dec 2022',
      time: '3:45 PM',
      doctor: 'Dr. Robert Adams',
      specialty: 'Orthopedics',
      location: 'Joint Care Center',
      type: 'Video',
      reason: 'Knee Pain Consultation',
      diagnosis: 'Minor knee sprain',
      prescription: 'Ibuprofen 400mg as needed, knee brace',
      followUp: 'In 2 weeks if not improved',
      documents: ['orthopedic_assessment_dec_2022.pdf']
    }
  ];
  
  // Filter appointments by specialty
  const filteredUpcoming = filterSpecialty === 'all' 
    ? upcomingAppointments 
    : upcomingAppointments.filter(apt => apt.specialty === filterSpecialty);
    
  const filteredPrevious = filterSpecialty === 'all'
    ? previousAppointments
    : previousAppointments.filter(apt => apt.specialty === filterSpecialty);
  
  // Get list of all specialties for the filter
  const allSpecialties = [...new Set([
    ...upcomingAppointments.map(apt => apt.specialty),
    ...previousAppointments.map(apt => apt.specialty)
  ])];
  
  // Toggle appointment details expansion
  const toggleExpand = (id) => {
    if (expandedAppointment === id) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(id);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                <p className="mt-2 text-lg text-gray-600">Manage all your medical appointments</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <FaCalendarPlus className="mr-2" />
                Book New Appointment
              </button>
            </div>
            
            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <FaFilter className="text-gray-400 mr-2" />
                  <label htmlFor="specialty-filter" className="text-sm text-gray-500 mr-2">
                    Filter by Specialty:
                  </label>
                  <select
                    id="specialty-filter"
                    value={filterSpecialty}
                    onChange={(e) => setFilterSpecialty(e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="all">All Specialties</option>
                    {allSpecialties.map((specialty, index) => (
                      <option key={index} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'upcoming'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaCalendarAlt className="inline-block mr-2" />
                    Upcoming
                  </button>
                  <button
                    onClick={() => setActiveTab('previous')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'previous'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaCalendarCheck className="inline-block mr-2" />
                    Previous
                  </button>
                </div>
              </div>
            </div>
            
            {/* Upcoming Appointments */}
            {activeTab === 'upcoming' && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
                {filteredUpcoming.length > 0 ? (
                  <div className="space-y-4">
                    {filteredUpcoming.map((appointment) => (
                      <div key={appointment.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                        {/* Appointment header - always visible */}
                        <div 
                          className="p-4 flex flex-wrap items-center justify-between cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleExpand(appointment.id)}
                        >
                          <div className="flex items-center">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                              appointment.status === 'Confirmed' ? 'bg-green-100' : 'bg-yellow-100'
                            }`}>
                              {appointment.type === 'Video' ? (
                                <FaVideo className={`h-6 w-6 ${
                                  appointment.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'
                                }`} />
                              ) : (
                                <FaUserMd className={`h-6 w-6 ${
                                  appointment.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'
                                }`} />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <h3 className="text-lg font-medium text-gray-900">{appointment.doctor}</h3>
                                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                  appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {appointment.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            </div>
                          </div>
                          <div className="flex items-center mt-4 sm:mt-0">
                            <div className="text-center mr-6">
                              <div className="text-sm font-medium text-gray-900">{appointment.date}</div>
                              <div className="text-sm text-gray-500">{appointment.time}</div>
                            </div>
                            {expandedAppointment === appointment.id ? (
                              <FaChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <FaChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        {/* Expanded details */}
                        {expandedAppointment === appointment.id && (
                          <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Appointment Details</h4>
                                <div className="space-y-3">
                                  <div className="flex items-start">
                                    <FaClock className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="ml-3">
                                      <p className="text-sm text-gray-500">Date & Time</p>
                                      <p className="text-sm font-medium text-gray-900">{appointment.date}, {appointment.time}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="ml-3">
                                      <p className="text-sm text-gray-500">Location</p>
                                      <p className="text-sm font-medium text-gray-900">{appointment.location}</p>
                                      {appointment.address && (
                                        <p className="text-sm text-gray-600">{appointment.address}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <FaFileMedical className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="ml-3">
                                      <p className="text-sm text-gray-500">Reason for Visit</p>
                                      <p className="text-sm font-medium text-gray-900">{appointment.reason}</p>
                                    </div>
                                  </div>
                                  {appointment.notes && (
                                    <div className="flex items-start">
                                      <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      <div className="ml-3">
                                        <p className="text-sm text-gray-500">Notes</p>
                                        <p className="text-sm font-medium text-gray-900">{appointment.notes}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                                <div className="space-y-3">
                                  {appointment.type === 'Video' ? (
                                    <a
                                      href={appointment.videoLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                                    >
                                      <FaVideo className="mr-2" />
                                      Join Video Consultation
                                    </a>
                                  ) : (
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.address)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                      <FaMapMarkerAlt className="mr-2" />
                                      Get Directions
                                    </a>
                                  )}
                                  <a
                                    href={`tel:${appointment.phoneNumber}`}
                                    className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                  >
                                    <FaPhone className="mr-2" />
                                    Call Clinic
                                  </a>
                                  <button
                                    className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                                  >
                                    Reschedule Appointment
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">Book an appointment with a doctor to get started.</p>
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        <FaCalendarPlus className="mr-2" />
                        Book New Appointment
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Previous Appointments */}
            {activeTab === 'previous' && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Appointments</h2>
                {filteredPrevious.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPrevious.map((appointment) => (
                      <div key={appointment.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                        {/* Appointment header - always visible */}
                        <div 
                          className="p-4 flex flex-wrap items-center justify-between cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleExpand(appointment.id)}
                        >
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                              {appointment.type === 'Video' ? (
                                <FaVideo className="h-6 w-6 text-gray-600" />
                              ) : (
                                <FaUserMd className="h-6 w-6 text-gray-600" />
                              )}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900">{appointment.doctor}</h3>
                              <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            </div>
                          </div>
                          <div className="flex items-center mt-4 sm:mt-0">
                            <div className="text-center mr-6">
                              <div className="text-sm font-medium text-gray-900">{appointment.date}</div>
                              <div className="text-sm text-gray-500">{appointment.time}</div>
                            </div>
                            {expandedAppointment === appointment.id ? (
                              <FaChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <FaChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        {/* Expanded details */}
                        {expandedAppointment === appointment.id && (
                          <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Appointment Summary</h4>
                                <div className="space-y-3">
                                  <div className="flex items-start">
                                    <FaClock className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="ml-3">
                                      <p className="text-sm text-gray-500">Date & Time</p>
                                      <p className="text-sm font-medium text-gray-900">{appointment.date}, {appointment.time}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="ml-3">
                                      <p className="text-sm text-gray-500">Location</p>
                                      <p className="text-sm font-medium text-gray-900">{appointment.location}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <FaFileMedical className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="ml-3">
                                      <p className="text-sm text-gray-500">Reason for Visit</p>
                                      <p className="text-sm font-medium text-gray-900">{appointment.reason}</p>
                                    </div>
                                  </div>
                                  {appointment.diagnosis && (
                                    <div className="flex items-start">
                                      <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <div className="ml-3">
                                        <p className="text-sm text-gray-500">Diagnosis</p>
                                        <p className="text-sm font-medium text-gray-900">{appointment.diagnosis}</p>
                                      </div>
                                    </div>
                                  )}
                                  {appointment.prescription && (
                                    <div className="flex items-start">
                                      <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                      </svg>
                                      <div className="ml-3">
                                        <p className="text-sm text-gray-500">Prescription</p>
                                        <p className="text-sm font-medium text-gray-900">{appointment.prescription}</p>
                                      </div>
                                    </div>
                                  )}
                                  {appointment.followUp && (
                                    <div className="flex items-start">
                                      <FaCalendarCheck className="h-5 w-5 text-gray-400 mt-0.5" />
                                      <div className="ml-3">
                                        <p className="text-sm text-gray-500">Follow-up</p>
                                        <p className="text-sm font-medium text-gray-900">{appointment.followUp}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Documents & Actions</h4>
                                {appointment.documents && appointment.documents.length > 0 ? (
                                  <div className="space-y-2 mb-4">
                                    {appointment.documents.map((doc, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                        <span className="text-sm text-gray-700">{doc}</span>
                                        <button className="text-blue-600 hover:text-blue-800">
                                          Download
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 mb-4">No documents available</p>
                                )}
                                <div className="space-y-3">
                                  <Link
                                    to="/prescriptions"
                                    className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                  >
                                    View Prescriptions
                                  </Link>
                                  <button
                                    className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                                  >
                                    <FaCalendarPlus className="mr-2" />
                                    Book Follow-up
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <FaCalendarCheck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No previous appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">Your appointment history will appear here.</p>
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

export default Appointments; 