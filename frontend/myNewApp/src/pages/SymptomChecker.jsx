import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaDatabase,
  FaChartLine,
  FaBookMedical,
  FaClipboardList
} from 'react-icons/fa';

// Import services with error handling
let aiService = null;
let diseaseService = null;

try {
  aiService = require('../services/aiService').default;
  diseaseService = require('../services/diseaseService').default;
} catch (error) {
  console.warn('Services not available:', error);
}

const SymptomChecker = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('check');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [diseaseFrequency, setDiseaseFrequency] = useState(null);

  // Mock data for symptoms (fallback when services are not available)
  const mockSymptoms = [
    { id: 1, name: 'Fever', category: 'General' },
    { id: 2, name: 'Cough', category: 'Respiratory' },
    { id: 3, name: 'Headache', category: 'Neurological' },
    { id: 4, name: 'Fatigue', category: 'General' },
    { id: 5, name: 'Sore Throat', category: 'Respiratory' },
    { id: 6, name: 'Nausea', category: 'Digestive' },
    { id: 7, name: 'Shortness of Breath', category: 'Respiratory' },
    { id: 8, name: 'Abdominal Pain', category: 'Digestive' },
    { id: 9, name: 'Dizziness', category: 'Neurological' },
    { id: 10, name: 'Rash', category: 'Skin' },
    { id: 11, name: 'Itching', category: 'Skin' },
    { id: 12, name: 'High Fever', category: 'General' }
  ];

  // Mock data for recent checks
  const mockRecentChecks = [
    {
      id: 1,
      date: '2024-02-20',
      symptoms: ['Fever', 'Cough', 'Fatigue'],
      diagnosis: 'Common Cold',
      severity: 'Mild'
    },
    {
      id: 2,
      date: '2024-02-15',
      symptoms: ['Headache', 'Nausea'],
      diagnosis: 'Migraine',
      severity: 'Moderate'
    }
  ];

  const [symptoms, setSymptoms] = useState(mockSymptoms);
  const [recentChecks, setRecentChecks] = useState(mockRecentChecks);

  useEffect(() => {
    if (diseaseService) {
      fetchSymptoms();
      fetchRecentChecks();
    }
    if (aiService) {
      fetchDiseaseFrequency();
    }
  }, []);

  const fetchSymptoms = async () => {
    try {
      setLoading(true);
      const data = await diseaseService.getAllDiseases();
      setSymptoms(data);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      setError('Failed to load symptoms. Using mock data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentChecks = async () => {
    try {
      setLoading(true);
      const data = await diseaseService.getRecentChecks();
      setRecentChecks(data);
    } catch (error) {
      console.error('Error fetching recent checks:', error);
      setError('Failed to load recent checks. Using mock data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDiseaseFrequency = async () => {
    try {
      const data = await aiService.getDiseaseFrequency();
      setDiseaseFrequency(data);
    } catch (error) {
      console.error('Error fetching disease frequency:', error);
    }
  };

  const handleSymptomSelect = (symptom) => {
    if (selectedSymptoms.includes(symptom.id)) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptom.id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom.id]);
    }
  };

  const handleAnalyze = async () => {
    if (!aiService) {
      setError('AI service is not available. Please try again later.');
      return;
    }

    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom for analysis.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const selectedSymptomNames = selectedSymptoms.map(id => 
        symptoms.find(s => s.id === id)?.name
      ).filter(Boolean);
      
      const result = await aiService.analyzeSymptoms(selectedSymptomNames);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setError('Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

  return (
      <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 border ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      } transition-colors duration-200`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
          Analysis Results
        </h2>

        {/* Overall Severity */}
        <div className="mb-6">
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
            Overall Severity: 
            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
              analysisResult.overallSeverity === 'High'
                ? darkMode
                  ? 'bg-red-900 text-red-300'
                  : 'bg-red-100 text-red-800'
                : analysisResult.overallSeverity === 'Medium'
                ? darkMode
                  ? 'bg-yellow-900 text-yellow-300'
                  : 'bg-yellow-100 text-yellow-800'
                : darkMode
                ? 'bg-green-900 text-green-300'
                : 'bg-green-100 text-green-800'
            }`}>
              {analysisResult.overallSeverity}
            </span>
          </h3>
        </div>

        {/* Possible Diseases */}
        <div className="mb-6">
          <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
            Possible Conditions
          </h3>
          <div className="space-y-4">
            {analysisResult.possibleDiseases.map((disease, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {disease.name}
                    </h4>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Probability: {disease.probability}%
                    </p>
                    {disease.details && (
                      <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {disease.details.description}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    disease.severity === 'High'
                      ? darkMode
                        ? 'bg-red-900 text-red-300'
                        : 'bg-red-100 text-red-800'
                      : disease.severity === 'Medium'
                      ? darkMode
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-yellow-100 text-yellow-800'
                      : darkMode
                        ? 'bg-green-900 text-green-300'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {disease.severity}
                  </span>
                </div>
                {disease.details && (
                  <div className="mt-3">
                    <h5 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Treatment:
                    </h5>
                    <ul className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {disease.details.treatment.map((item, i) => (
                        <li key={i} className="flex items-center mt-1">
                          <FaCheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
            Recommendations
          </h3>
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <ul className="space-y-2">
              {analysisResult.recommendations.map((recommendation, index) => (
                <li key={index} className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FaInfoCircle className="h-5 w-5 mr-2 text-blue-500" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Analysis Summary */}
        <div>
          <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
            Analysis Summary
          </h3>
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Analyzed {analysisResult.analysis.totalSymptoms} symptoms, with{' '}
              {analysisResult.analysis.matchedSymptoms} matching known conditions.
            </p>
          </div>
        </div>
                </div>
    );
  };

  const renderDiseaseFrequency = () => {
    if (!diseaseFrequency) return null;

    return (
      <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 border ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      } transition-colors duration-200`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
          Disease Frequency
        </h2>
        <div className="space-y-4">
          {Object.entries(diseaseFrequency).map(([disease, frequency]) => (
            <div
              key={disease}
              className={`p-4 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {disease}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}>
                  {frequency}%
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${frequency}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm p-6 transition-colors duration-200`}>
              <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                Symptom Checker
              </h1>

              {error && (
                <div className={`mb-6 p-4 rounded-lg ${
                  darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <FaExclamationTriangle className="h-5 w-5" />
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {['check', 'history', 'info'].map((tab) => (
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
              
              {/* Content based on active tab */}
              <div className="mt-6">
                {activeTab === 'check' && (
                  <>
                    {/* Search and Filter */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search symptoms..."
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
                          <option value="general">General</option>
                          <option value="respiratory">Respiratory</option>
                          <option value="neurological">Neurological</option>
                          <option value="digestive">Digestive</option>
                          <option value="skin">Skin</option>
                        </select>
                      </div>
                    </div>

                    {/* Symptoms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {symptoms
                        .filter(symptom =>
                          symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((symptom) => (
                          <div
                            key={symptom.id}
                            className={`${
                              darkMode ? 'bg-gray-800' : 'bg-white'
                            } rounded-lg shadow-sm p-6 border ${
                              darkMode ? 'border-gray-700' : 'border-gray-200'
                            } transition-colors duration-200`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                                  {symptom.name}
                                </h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                  {symptom.category}
                                </p>
                              </div>
                              <button
                                onClick={() => handleSymptomSelect(symptom)}
                                className={`px-4 py-2 rounded-lg ${
                                  selectedSymptoms.includes(symptom.id)
                                    ? darkMode
                                      ? 'bg-blue-600 hover:bg-blue-700'
                                      : 'bg-blue-500 hover:bg-blue-600'
                                    : darkMode
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                } text-white transition-colors duration-200`}
                              >
                                {selectedSymptoms.includes(symptom.id) ? 'Selected' : 'Select'}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Analyze Button */}
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={handleAnalyze}
                        disabled={loading || selectedSymptoms.length === 0}
                        className={`px-6 py-3 rounded-lg font-medium ${
                          loading || selectedSymptoms.length === 0
                            ? darkMode
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : darkMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        } transition-colors duration-200`}
                      >
                        {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                      </button>
                    </div>

                    {/* Analysis Results */}
                    {renderAnalysisResult()}

                    {/* Disease Frequency */}
                    {renderDiseaseFrequency()}
                  </>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    {recentChecks.map((check) => (
                      <div
                        key={check.id}
                        className={`${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm p-6 border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        } transition-colors duration-200`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                              {check.diagnosis}
                            </h3>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                              Date: {check.date}
                            </p>
                            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                              Symptoms: {check.symptoms.join(', ')}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              check.severity === 'Mild'
                                ? darkMode
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-green-100 text-green-800'
                                : darkMode
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-800'
                            } transition-colors duration-200`}
                          >
                            {check.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className={`${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow-sm p-6 border ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  } transition-colors duration-200`}>
                    <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                      About Symptom Checker
                    </h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 transition-colors duration-200`}>
                      Our AI-powered symptom checker helps you identify potential health conditions based on your symptoms.
                      Please note that this is not a substitute for professional medical advice.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <FaInfoCircle className={`h-5 w-5 mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                          Select your symptoms from the list to get started.
                        </p>
              </div>
                      <div className="flex items-start space-x-3">
                        <FaExclamationTriangle className={`h-5 w-5 mt-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                          For severe symptoms, please seek immediate medical attention.
                        </p>
                    </div>
                      <div className="flex items-start space-x-3">
                        <FaChartLine className={`h-5 w-5 mt-1 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                          View disease frequency and trends in your area.
                      </p>
                    </div>
                      <div className="flex items-start space-x-3">
                        <FaBookMedical className={`h-5 w-5 mt-1 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                          Access detailed information about various conditions and their treatments.
                        </p>
                      </div>
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

export default SymptomChecker;