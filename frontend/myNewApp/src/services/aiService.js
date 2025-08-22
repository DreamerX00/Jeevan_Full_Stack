import axios from 'axios';
import config from '../config/config';

// Local database of symptoms and their relationships with diseases
const symptomDiseaseMap = {
  // Fever related
  'fever': {
    diseases: ['Common Cold', 'Flu', 'COVID-19', 'Malaria', 'Typhoid'],
    severity: 'Medium',
    description: 'Elevated body temperature above normal range',
    recommendations: ['Rest', 'Stay hydrated', 'Monitor temperature']
  },
  'high_fever': {
    diseases: ['Severe Infection', 'Dengue', 'Malaria', 'COVID-19'],
    severity: 'High',
    description: 'Very high body temperature (above 103°F)',
    recommendations: ['Seek immediate medical attention', 'Stay hydrated', 'Take fever reducers']
  },

  // Respiratory symptoms
  'cough': {
    diseases: ['Common Cold', 'Bronchitis', 'Pneumonia', 'COVID-19', 'Asthma'],
    severity: 'Medium',
    description: 'Sudden expulsion of air from the lungs',
    recommendations: ['Stay hydrated', 'Use cough suppressants', 'Avoid irritants']
  },
  'shortness_of_breath': {
    diseases: ['Asthma', 'Pneumonia', 'COVID-19', 'Heart Failure'],
    severity: 'High',
    description: 'Difficulty breathing or feeling breathless',
    recommendations: ['Seek immediate medical attention', 'Stay calm', 'Sit upright']
  },

  // Digestive symptoms
  'nausea': {
    diseases: ['Food Poisoning', 'Gastritis', 'Migraine', 'Pregnancy'],
    severity: 'Medium',
    description: 'Feeling of sickness with urge to vomit',
    recommendations: ['Stay hydrated', 'Eat light foods', 'Rest']
  },
  'abdominal_pain': {
    diseases: ['Appendicitis', 'Gastritis', 'Food Poisoning', 'Irritable Bowel Syndrome'],
    severity: 'Medium',
    description: 'Pain in the stomach or abdominal area',
    recommendations: ['Monitor pain location and intensity', 'Stay hydrated', 'Avoid heavy foods']
  },

  // Neurological symptoms
  'headache': {
    diseases: ['Migraine', 'Tension Headache', 'Sinusitis', 'Hypertension'],
    severity: 'Medium',
    description: 'Pain in the head or upper neck',
    recommendations: ['Rest in a dark room', 'Stay hydrated', 'Take pain relievers']
  },
  'dizziness': {
    diseases: ['Vertigo', 'Low Blood Pressure', 'Anemia', 'Inner Ear Problems'],
    severity: 'Medium',
    description: 'Feeling of spinning or lightheadedness',
    recommendations: ['Sit or lie down', 'Stay hydrated', 'Avoid sudden movements']
  },

  // Skin symptoms
  'rash': {
    diseases: ['Allergic Reaction', 'Eczema', 'Psoriasis', 'Chickenpox'],
    severity: 'Medium',
    description: 'Change in skin color or texture',
    recommendations: ['Avoid scratching', 'Keep area clean', 'Use mild soap']
  },
  'itching': {
    diseases: ['Allergic Reaction', 'Eczema', 'Fungal Infection', 'Liver Disease'],
    severity: 'Low',
    description: 'Uncomfortable sensation that triggers scratching',
    recommendations: ['Avoid scratching', 'Use moisturizer', 'Take antihistamines']
  }
};

// Disease information database
const diseaseInfo = {
  'Common Cold': {
    description: 'Viral infection of the upper respiratory tract',
    symptoms: ['fever', 'cough', 'sore_throat', 'runny_nose'],
    severity: 'Low',
    treatment: ['Rest', 'Stay hydrated', 'Over-the-counter cold medicine'],
    prevention: ['Wash hands frequently', 'Avoid close contact with sick people']
  },
  'COVID-19': {
    description: 'Respiratory illness caused by SARS-CoV-2 virus',
    symptoms: ['fever', 'cough', 'shortness_of_breath', 'fatigue'],
    severity: 'High',
    treatment: ['Rest', 'Isolation', 'Medical care if severe'],
    prevention: ['Vaccination', 'Mask wearing', 'Social distancing']
  },
  'Asthma': {
    description: 'Chronic respiratory condition causing airway inflammation',
    symptoms: ['shortness_of_breath', 'wheezing', 'chest_tightness'],
    severity: 'Medium',
    treatment: ['Inhalers', 'Avoid triggers', 'Regular check-ups'],
    prevention: ['Avoid triggers', 'Regular medication', 'Monitor symptoms']
  }
};

class AIService {
  async analyzeSymptoms(symptoms) {
    try {
      // In a real application, this would call an AI API
      // For now, we'll use our local database for analysis
      const analysis = this.performLocalAnalysis(symptoms);
      return analysis;
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      throw error;
    }
  }

  performLocalAnalysis(symptoms) {
    // Convert symptoms to lowercase for matching
    const normalizedSymptoms = symptoms.map(s => s.toLowerCase().replace(/\s+/g, '_'));
    
    // Find matching diseases for each symptom
    const diseaseMatches = {};
    const severityLevels = [];
    const recommendations = new Set();

    normalizedSymptoms.forEach(symptom => {
      const symptomInfo = symptomDiseaseMap[symptom];
      if (symptomInfo) {
        // Add diseases to matches
        symptomInfo.diseases.forEach(disease => {
          if (!diseaseMatches[disease]) {
            diseaseMatches[disease] = {
              count: 1,
              symptoms: [symptom],
              severity: symptomInfo.severity
            };
          } else {
            diseaseMatches[disease].count++;
            diseaseMatches[disease].symptoms.push(symptom);
          }
        });

        // Add severity level
        severityLevels.push(symptomInfo.severity);

        // Add recommendations
        symptomInfo.recommendations.forEach(rec => recommendations.add(rec));
      }
    });

    // Calculate overall severity
    const overallSeverity = this.calculateOverallSeverity(severityLevels);

    // Get detailed disease information
    const possibleDiseases = Object.entries(diseaseMatches)
      .map(([disease, info]) => ({
        name: disease,
        probability: this.calculateProbability(info.count, normalizedSymptoms.length),
        symptoms: info.symptoms,
        severity: info.severity,
        details: diseaseInfo[disease] || null
      }))
      .sort((a, b) => b.probability - a.probability);

    return {
      possibleDiseases,
      overallSeverity,
      recommendations: Array.from(recommendations),
      analysis: {
        totalSymptoms: normalizedSymptoms.length,
        matchedSymptoms: Object.keys(symptomDiseaseMap).filter(s => 
          normalizedSymptoms.includes(s)
        ).length
      }
    };
  }

  calculateOverallSeverity(severityLevels) {
    if (severityLevels.includes('High')) return 'High';
    if (severityLevels.includes('Medium')) return 'Medium';
    return 'Low';
  }

  calculateProbability(matchCount, totalSymptoms) {
    return Math.min(100, Math.round((matchCount / totalSymptoms) * 100));
  }

  async getDiseaseInfo(diseaseName) {
    try {
      // In a real application, this would call an API
      // For now, return from local database
      return diseaseInfo[diseaseName] || null;
    } catch (error) {
      console.error('Error fetching disease info:', error);
      throw error;
    }
  }

  async getDiseaseFrequency() {
    try {
      // In a real application, this would call an API
      // For now, return mock data
      return {
        'Common Cold': 45,
        'COVID-19': 30,
        'Asthma': 25
      };
    } catch (error) {
      console.error('Error fetching disease frequency:', error);
      throw error;
    }
  }

  async searchDiseases(query) {
    try {
      // In a real application, this would call an API
      // For now, search in local database
      const results = Object.entries(diseaseInfo)
        .filter(([name, info]) => 
          name.toLowerCase().includes(query.toLowerCase()) ||
          info.description.toLowerCase().includes(query.toLowerCase())
        )
        .map(([name, info]) => ({
          name,
          ...info
        }));
      return results;
    } catch (error) {
      console.error('Error searching diseases:', error);
      throw error;
    }
  }
}

export default new AIService(); 