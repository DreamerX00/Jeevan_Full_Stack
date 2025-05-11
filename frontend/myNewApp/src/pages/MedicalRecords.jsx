import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  FaFileAlt, 
  FaCalendarCheck, 
  FaFileMedical, 
  FaChartLine, 
  FaFilter, 
  FaDownload, 
  FaPlus, 
  FaSearch, 
  FaHeartbeat, 
  FaWeight, 
  FaTint, 
  FaLungs
} from 'react-icons/fa';

const MedicalRecords = () => {
  const [activeTab, setActiveTab] = useState('health-history');
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Mock data for health history
  const healthRecords = [
    {
      id: 1,
      date: '15 May 2023',
      title: 'Annual Physical Examination',
      doctor: 'Dr. Sarah Johnson',
      category: 'General',
      summary: 'Regular annual checkup. All vitals normal, blood work shows good cholesterol levels.',
      documents: ['physical_exam_report.pdf', 'blood_work_results.pdf']
    },
    {
      id: 2,
      date: '22 Mar 2023',
      title: 'Dental Checkup',
      doctor: 'Dr. Michael Chen',
      category: 'Dental',
      summary: 'Routine dental examination. One cavity found and filled. Recommended improved flossing.',
      documents: ['dental_report.pdf']
    },
    {
      id: 3,
      date: '10 Jan 2023',
      title: 'COVID-19 Vaccination',
      doctor: 'Dr. Emily Wilson',
      category: 'Immunization',
      summary: 'Administered second booster dose. No immediate adverse reactions.',
      documents: ['vaccination_certificate.pdf']
    },
    {
      id: 4,
      date: '05 Dec 2022',
      title: 'Dermatology Consultation',
      doctor: 'Dr. Robert Adams',
      category: 'Dermatology',
      summary: 'Examination of skin rash on right arm. Diagnosed as contact dermatitis. Prescribed hydrocortisone cream.',
      documents: ['dermatology_report.pdf', 'prescription.pdf']
    }
  ];
  
  // Mock data for previous appointments
  const appointments = [
    {
      id: 1,
      date: '15 May 2023',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      reason: 'Annual Heart Checkup',
      status: 'Completed',
      notes: 'Heart function normal. Blood pressure slightly elevated. Recommended diet changes and follow-up in 6 months.'
    },
    {
      id: 2,
      date: '22 Mar 2023',
      time: '2:30 PM',
      doctor: 'Dr. Michael Chen',
      specialty: 'Dentistry',
      reason: 'Regular Dental Checkup',
      status: 'Completed',
      notes: 'One cavity filled. Dental hygiene generally good. Recommended new flossing technique.'
    },
    {
      id: 3,
      date: '10 Jan 2023',
      time: '9:15 AM',
      doctor: 'Dr. Emily Wilson',
      specialty: 'Immunology',
      reason: 'COVID-19 Vaccination',
      status: 'Completed',
      notes: 'Booster shot administered. Patient monitored for 15 minutes post-vaccination with no adverse reactions.'
    },
    {
      id: 4,
      date: '05 Dec 2022',
      time: '3:45 PM',
      doctor: 'Dr. Robert Adams',
      specialty: 'Dermatology',
      reason: 'Skin Rash Consultation',
      status: 'Completed',
      notes: 'Contact dermatitis diagnosed. Hydrocortisone cream prescribed. Advised to avoid known allergens.'
    }
  ];
  
  // Mock data for medical reports
  const medicalReports = [
    {
      id: 1,
      date: '15 May 2023',
      title: 'Blood Work Analysis',
      category: 'Laboratory',
      doctor: 'Dr. Sarah Johnson',
      summary: 'Complete blood count, lipid panel, and metabolic panel. All results within normal ranges except slightly elevated LDL cholesterol.',
      file: 'blood_work_may_2023.pdf',
      size: '1.2 MB'
    },
    {
      id: 2,
      date: '16 May 2023',
      title: 'Chest X-Ray',
      category: 'Radiology',
      doctor: 'Dr. James Wilson',
      summary: 'Standard chest X-ray showing normal heart size and clear lung fields. No abnormalities detected.',
      file: 'chest_xray_may_2023.pdf',
      size: '8.5 MB'
    },
    {
      id: 3,
      date: '22 Mar 2023',
      title: 'Dental X-Rays',
      category: 'Dental',
      doctor: 'Dr. Michael Chen',
      summary: 'Full mouth series showing one small cavity in lower right molar. Overall dental health good.',
      file: 'dental_xrays_mar_2023.pdf',
      size: '5.7 MB'
    },
    {
      id: 4,
      date: '10 Dec 2022',
      title: 'Allergy Test Results',
      category: 'Immunology',
      doctor: 'Dr. Lisa Patel',
      summary: 'Skin prick test for common allergens. Positive reactions to dust mites and cat dander.',
      file: 'allergy_test_dec_2022.pdf',
      size: '2.1 MB'
    }
  ];
  
  // Mock data for health tracking
  const weightData = [
    { date: 'Jan 2023', value: 68.5 },
    { date: 'Feb 2023', value: 69.2 },
    { date: 'Mar 2023', value: 67.8 },
    { date: 'Apr 2023', value: 67.2 },
    { date: 'May 2023', value: 66.5 }
  ];
  
  const bpData = [
    { date: 'Jan 2023', systolic: 125, diastolic: 82 },
    { date: 'Feb 2023', systolic: 128, diastolic: 84 },
    { date: 'Mar 2023', systolic: 122, diastolic: 80 },
    { date: 'Apr 2023', systolic: 120, diastolic: 78 },
    { date: 'May 2023', systolic: 118, diastolic: 76 }
  ];
  
  const glucoseData = [
    { date: 'Jan 2023', value: 95 },
    { date: 'Feb 2023', value: 98 },
    { date: 'Mar 2023', value: 92 },
    { date: 'Apr 2023', value: 90 },
    { date: 'May 2023', value: 89 }
  ];
  
  const cholesterolData = [
    { date: 'Jan 2023', total: 195, hdl: 55, ldl: 120 },
    { date: 'May 2023', total: 180, hdl: 60, ldl: 110 }
  ];
  
  const filterByTime = (items) => {
    if (timeFilter === 'all') return items;
    
    const now = new Date();
    let cutoffDate;
    
    switch (timeFilter) {
      case '3-months':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6-months':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1-year':
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return items;
    }
    
    return items.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
              <p className="mt-2 text-lg text-gray-600">View and manage your complete health information</p>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('health-history')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'health-history'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FaFileAlt className="inline-block mr-2" />
                  Health History
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'appointments'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FaCalendarCheck className="inline-block mr-2" />
                  Previous Appointments
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reports'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FaFileMedical className="inline-block mr-2" />
                  Medical Reports
                </button>
                <button
                  onClick={() => setActiveTab('health-tracking')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'health-tracking'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FaChartLine className="inline-block mr-2" />
                  Health Tracking
                </button>
              </nav>
            </div>
            
            {/* Time filter */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center">
                  <FaFilter className="text-gray-400 mr-2" />
                  <label htmlFor="time-filter" className="text-sm text-gray-500 mr-2">
                    Time Period:
                  </label>
                  <select
                    id="time-filter"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="3-months">Last 3 Months</option>
                    <option value="6-months">Last 6 Months</option>
                    <option value="1-year">Last Year</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search records..."
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FaDownload className="mr-2" />
                  Export
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <FaPlus className="mr-2" />
                  Add Record
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'health-history' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filterByTime(healthRecords).map((record) => (
                    <li key={record.id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaFileAlt className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{record.title}</p>
                              <p className="text-sm text-gray-500">{record.date} • {record.doctor}</p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {record.category}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="text-sm text-gray-500">{record.summary}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="mr-2">Documents:</span>
                          {record.documents.map((doc, index) => (
                            <Link 
                              key={index}
                              to="#" 
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              {doc}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'appointments' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filterByTime(appointments).map((appointment) => (
                    <li key={appointment.id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <FaCalendarCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{appointment.reason}</p>
                              <p className="text-sm text-gray-500">
                                {appointment.date} • {appointment.time} • {appointment.doctor}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500"><span className="font-medium">Specialty:</span> {appointment.specialty}</p>
                          <p className="mt-1 text-sm text-gray-500"><span className="font-medium">Notes:</span> {appointment.notes}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'reports' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filterByTime(medicalReports).map((report) => (
                    <li key={report.id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <FaFileMedical className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{report.title}</p>
                              <p className="text-sm text-gray-500">
                                {report.date} • {report.doctor}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              {report.category}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{report.summary}</p>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <span>File size: {report.size}</span>
                          </div>
                          <Link 
                            to="#" 
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <FaDownload className="mr-1" />
                            Download {report.file}
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'health-tracking' && (
              <div className="space-y-6">
                {/* Weight Tracking */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FaWeight className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Weight Tracking</h3>
                    </div>
                    <Link to="#" className="text-sm text-blue-600 hover:text-blue-800">View Detailed Chart</Link>
                  </div>
                  
                  <div className="relative">
                    <div className="h-64 bg-gray-50 rounded-lg p-4">
                      {/* Simple chart representation */}
                      <div className="h-full flex items-end space-x-6">
                        {weightData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="w-12 bg-blue-500 rounded-t-md" 
                              style={{ height: `${(data.value - 60) * 8}px` }}
                            ></div>
                            <span className="mt-2 text-xs text-gray-500">{data.date}</span>
                            <span className="text-xs font-medium">{data.value} kg</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Current Weight</p>
                        <p className="text-xl font-bold text-blue-700">{weightData[weightData.length - 1].value} kg</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Weight Change</p>
                        <p className="text-xl font-bold text-green-700">
                          {(weightData[weightData.length - 1].value - weightData[0].value).toFixed(1)} kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Blood Pressure Tracking */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <FaHeartbeat className="h-5 w-5 text-red-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Blood Pressure</h3>
                    </div>
                    <Link to="#" className="text-sm text-blue-600 hover:text-blue-800">View Detailed Chart</Link>
                  </div>
                  
                  <div className="relative">
                    <div className="h-64 bg-gray-50 rounded-lg p-4">
                      {/* Simple chart representation */}
                      <div className="h-full flex items-end space-x-6">
                        {bpData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center space-y-1">
                            <div className="flex flex-col items-center">
                              <div 
                                className="w-8 bg-red-500 rounded-t-md" 
                                style={{ height: `${data.systolic * 0.8}px` }}
                              ></div>
                              <span className="mt-1 text-xs text-gray-500">{data.systolic}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div 
                                className="w-8 bg-blue-500 rounded-t-md" 
                                style={{ height: `${data.diastolic * 0.8}px` }}
                              ></div>
                              <span className="mt-1 text-xs text-gray-500">{data.diastolic}</span>
                            </div>
                            <span className="mt-1 text-xs text-gray-500">{data.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Latest Reading</p>
                        <p className="text-xl font-bold text-red-700">
                          {bpData[bpData.length - 1].systolic}/{bpData[bpData.length - 1].diastolic} mmHg
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-xl font-bold text-green-700">Normal</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Blood Glucose Tracking */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <FaTint className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Blood Glucose</h3>
                    </div>
                    <Link to="#" className="text-sm text-blue-600 hover:text-blue-800">View Detailed Chart</Link>
                  </div>
                  
                  <div className="relative">
                    <div className="h-64 bg-gray-50 rounded-lg p-4">
                      {/* Simple chart representation */}
                      <div className="h-full flex items-end space-x-6">
                        {glucoseData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="w-12 bg-purple-500 rounded-t-md" 
                              style={{ height: `${data.value * 0.8}px` }}
                            ></div>
                            <span className="mt-2 text-xs text-gray-500">{data.date}</span>
                            <span className="text-xs font-medium">{data.value} mg/dL</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Latest Reading</p>
                        <p className="text-xl font-bold text-purple-700">
                          {glucoseData[glucoseData.length - 1].value} mg/dL
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-xl font-bold text-green-700">Normal</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Cholesterol Tracking */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                        <FaLungs className="h-5 w-5 text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Cholesterol Levels</h3>
                    </div>
                    <Link to="#" className="text-sm text-blue-600 hover:text-blue-800">View Detailed Chart</Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">Latest Readings (May 2023)</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-yellow-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Total Cholesterol</p>
                          <p className="text-xl font-bold text-yellow-700">
                            {cholesterolData[cholesterolData.length - 1].total} mg/dL
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-xs text-gray-500">HDL (Good)</p>
                          <p className="text-xl font-bold text-green-700">
                            {cholesterolData[cholesterolData.length - 1].hdl} mg/dL
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicalRecords; 