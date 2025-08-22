import axios from 'axios';
import config from '../config/config';

const API_URL = config.apiUrl;

// Local database of diagnostic tests
const diagnosticTests = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    category: 'Blood Tests',
    description: 'Measures red blood cells, white blood cells, and platelets',
    price: 500,
    duration: '1-2 hours',
    preparation: 'Fasting for 8-12 hours',
    commonUses: ['Anemia', 'Infection', 'Blood disorders']
  },
  {
    id: 2,
    name: 'Lipid Profile',
    category: 'Blood Tests',
    description: 'Measures cholesterol and triglycerides',
    price: 800,
    duration: '1-2 hours',
    preparation: 'Fasting for 12-14 hours',
    commonUses: ['Heart disease risk', 'Cholesterol levels']
  },
  {
    id: 3,
    name: 'Blood Glucose Test',
    category: 'Blood Tests',
    description: 'Measures blood sugar levels',
    price: 300,
    duration: '30 minutes',
    preparation: 'Fasting for 8 hours',
    commonUses: ['Diabetes', 'Hypoglycemia']
  },
  {
    id: 4,
    name: 'X-Ray',
    category: 'Imaging',
    description: 'Uses radiation to create images of bones and organs',
    price: 1000,
    duration: '15-30 minutes',
    preparation: 'None',
    commonUses: ['Bone fractures', 'Chest conditions', 'Dental issues']
  },
  {
    id: 5,
    name: 'CT Scan',
    category: 'Imaging',
    description: 'Detailed cross-sectional images of the body',
    price: 5000,
    duration: '30-60 minutes',
    preparation: 'Fasting for 4-6 hours',
    commonUses: ['Tumors', 'Internal injuries', 'Brain conditions']
  },
  {
    id: 6,
    name: 'MRI',
    category: 'Imaging',
    description: 'Uses magnetic fields to create detailed images',
    price: 8000,
    duration: '45-90 minutes',
    preparation: 'None',
    commonUses: ['Brain disorders', 'Spinal conditions', 'Joint problems']
  },
  {
    id: 7,
    name: 'Ultrasound',
    category: 'Imaging',
    description: 'Uses sound waves to create images',
    price: 2000,
    duration: '30-60 minutes',
    preparation: 'Full bladder for some types',
    commonUses: ['Pregnancy', 'Abdominal conditions', 'Heart function']
  },
  {
    id: 8,
    name: 'ECG',
    category: 'Cardiac',
    description: 'Records electrical activity of the heart',
    price: 1500,
    duration: '10-15 minutes',
    preparation: 'None',
    commonUses: ['Heart rhythm', 'Heart attack', 'Heart disease']
  },
  {
    id: 9,
    name: 'Urine Analysis',
    category: 'Urine Tests',
    description: 'Examines urine for various conditions',
    price: 400,
    duration: '1-2 hours',
    preparation: 'Clean catch sample',
    commonUses: ['UTI', 'Kidney disease', 'Diabetes']
  },
  {
    id: 10,
    name: 'Thyroid Function Test',
    category: 'Blood Tests',
    description: 'Measures thyroid hormone levels',
    price: 1200,
    duration: '1-2 hours',
    preparation: 'Fasting for 8 hours',
    commonUses: ['Hypothyroidism', 'Hyperthyroidism']
  },
  {
    id: 11,
    name: 'Liver Function Test',
    category: 'Blood Tests',
    description: 'Measures liver enzymes and proteins',
    price: 1000,
    duration: '1-2 hours',
    preparation: 'Fasting for 8 hours',
    commonUses: ['Liver disease', 'Hepatitis', 'Cirrhosis']
  },
  {
    id: 12,
    name: 'Kidney Function Test',
    category: 'Blood Tests',
    description: 'Measures kidney function markers',
    price: 900,
    duration: '1-2 hours',
    preparation: 'Fasting for 8 hours',
    commonUses: ['Kidney disease', 'Kidney failure']
  },
  {
    id: 13,
    name: 'Endoscopy',
    category: 'Endoscopy',
    description: 'Examines digestive tract using a camera',
    price: 15000,
    duration: '30-60 minutes',
    preparation: 'Fasting for 8 hours',
    commonUses: ['Digestive issues', 'Ulcers', 'Cancer screening']
  },
  {
    id: 14,
    name: 'Colonoscopy',
    category: 'Endoscopy',
    description: 'Examines large intestine',
    price: 20000,
    duration: '30-60 minutes',
    preparation: 'Bowel preparation',
    commonUses: ['Colon cancer', 'Polyps', 'IBD']
  },
  {
    id: 15,
    name: 'Mammogram',
    category: 'Imaging',
    description: 'X-ray of breast tissue',
    price: 3000,
    duration: '20-30 minutes',
    preparation: 'None',
    commonUses: ['Breast cancer screening', 'Breast lumps']
  }
];

// Local database of diagnostic centers
const diagnosticCenters = [
  {
    id: 1,
    name: 'City Health Diagnostics',
    address: '123 Main Street, City Center',
    phone: '+1-234-567-8901',
    email: 'info@cityhealth.com',
    services: [1, 2, 3, 4, 8, 9],
    rating: 4.5,
    workingHours: '8:00 AM - 8:00 PM',
    isOpen: true
  },
  {
    id: 2,
    name: 'Advanced Medical Imaging',
    address: '456 Tech Park, Downtown',
    phone: '+1-234-567-8902',
    email: 'contact@advancedimaging.com',
    services: [4, 5, 6, 7, 15],
    rating: 4.8,
    workingHours: '24/7',
    isOpen: true
  },
  {
    id: 3,
    name: 'Comprehensive Health Center',
    address: '789 Health Avenue, Medical District',
    phone: '+1-234-567-8903',
    email: 'support@comprehensivehealth.com',
    services: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    rating: 4.7,
    workingHours: '7:00 AM - 10:00 PM',
    isOpen: true
  }
];

class DiseaseService {
  async getAllDiseases() {
    try {
      const response = await axios.get(`${API_URL}/diseases`);
      return response.data;
    } catch (error) {
      console.error('Error fetching diseases:', error);
      throw error;
    }
  }

  async getDiseaseById(id) {
    try {
      const response = await axios.get(`${API_URL}/diseases/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching disease:', error);
      throw error;
    }
  }

  async getDiagnosticTests() {
    try {
      // In a real application, this would be an API call
      // For now, return the local database
      return diagnosticTests;
    } catch (error) {
      console.error('Error fetching diagnostic tests:', error);
      throw error;
    }
  }

  async getDiagnosticCenters(location = null) {
    try {
      // In a real application, this would be an API call with location filtering
      // For now, return the local database
      return diagnosticCenters;
    } catch (error) {
      console.error('Error fetching diagnostic centers:', error);
      throw error;
    }
  }

  async getTestPrice(testId, centerId) {
    try {
      const test = diagnosticTests.find(t => t.id === testId);
      if (!test) {
        throw new Error('Test not found');
      }
      return test.price;
    } catch (error) {
      console.error('Error fetching test price:', error);
      throw error;
    }
  }

  async getRecentChecks() {
    try {
      const response = await axios.get(`${API_URL}/checks/recent`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent checks:', error);
      throw error;
    }
  }
}

export default new DiseaseService(); 