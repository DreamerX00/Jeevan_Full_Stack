import { MedicalRecordService } from '../context/ApiService';

// Helper function to validate medical record data
const validateMedicalRecordData = (recordData) => {
  const errors = [];
  
  if (!recordData) {
    errors.push('Medical record data is required');
    return errors;
  }
  
  if (!recordData.title || recordData.title.trim() === '') {
    errors.push('Record title is required');
  }
  
  if (!recordData.category || recordData.category.trim() === '') {
    errors.push('Record category is required');
  }
  
  if (!recordData.description || recordData.description.trim() === '') {
    errors.push('Record description is required');
  }
  
  if (recordData.date && new Date(recordData.date) > new Date()) {
    errors.push('Record date cannot be in the future');
  }
  
  return errors;
};

// Helper function to validate file upload
const validateFileUpload = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']) => {
  const errors = [];
  
  if (!file) {
    errors.push('File is required');
    return errors;
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    errors.push('File size too large. Maximum size is 10MB');
  }
  
  return errors;
};

// Helper function to handle API errors
const handleApiError = (error, operation) => {
  const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
  console.error(`Error ${operation}:`, errorMessage);
  
  // Create a standardized error object
  const standardizedError = {
    message: errorMessage,
    status: error.response?.status,
    operation,
    timestamp: new Date().toISOString()
  };
  
  throw standardizedError;
};

// Medical Records service
const medicalRecordService = {
  // Get all medical records for the current user
  getMedicalRecords: async () => {
    try {
      const records = await MedicalRecordService.getMedicalRecords();
      
      // Validate and transform the response
      if (!Array.isArray(records)) {
        throw new Error('Invalid medical records data received from server');
      }
      
      return records.map(record => ({
        ...record,
        date: record.date ? new Date(record.date) : null,
        createdAt: record.createdAt ? new Date(record.createdAt) : null,
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : null
      }));
    } catch (error) {
      handleApiError(error, 'fetching medical records');
    }
  },
  
  // Get a specific medical record by ID
  getMedicalRecord: async (id) => {
    try {
      if (!id || typeof id !== 'string' && typeof id !== 'number') {
        throw new Error('Valid medical record ID is required');
      }
      
      const record = await MedicalRecordService.getMedicalRecord(id);
      
      // Validate the response
      if (!record || !record.id) {
        throw new Error('Invalid medical record data received from server');
      }
      
      return {
        ...record,
        date: record.date ? new Date(record.date) : null,
        createdAt: record.createdAt ? new Date(record.createdAt) : null,
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : null
      };
    } catch (error) {
      handleApiError(error, `fetching medical record ${id}`);
    }
  },
  
  // Get records by category
  getMedicalRecordsByCategory: async (category) => {
    try {
      if (!category || typeof category !== 'string') {
        throw new Error('Valid category is required');
      }
      
      const records = await MedicalRecordService.getMedicalRecords();
      
      // Filter by category
      const filteredRecords = records.filter(record => 
        record.category?.toLowerCase() === category.toLowerCase()
      );
      
      return filteredRecords.map(record => ({
        ...record,
        date: record.date ? new Date(record.date) : null,
        createdAt: record.createdAt ? new Date(record.createdAt) : null,
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : null
      }));
    } catch (error) {
      handleApiError(error, `fetching medical records for category ${category}`);
    }
  },
  
  // Create a new medical record
  createMedicalRecord: async (recordData) => {
    try {
      // Validate record data
      const validationErrors = validateMedicalRecordData(recordData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Sanitize the data
      const sanitizedData = {
        title: recordData.title.trim(),
        category: recordData.category.trim(),
        description: recordData.description.trim(),
        date: recordData.date || new Date().toISOString(),
        doctorName: recordData.doctorName?.trim() || '',
        hospitalName: recordData.hospitalName?.trim() || '',
        notes: recordData.notes?.trim() || ''
      };
      
      const record = await MedicalRecordService.createMedicalRecord(sanitizedData);
      
      // Validate the response
      if (!record || !record.id) {
        throw new Error('Invalid medical record data received from server');
      }
      
      return {
        ...record,
        date: record.date ? new Date(record.date) : null,
        createdAt: record.createdAt ? new Date(record.createdAt) : null,
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : null
      };
    } catch (error) {
      handleApiError(error, 'creating medical record');
    }
  },
  
  // Update an existing medical record
  updateMedicalRecord: async (id, recordData) => {
    try {
      if (!id || typeof id !== 'string' && typeof id !== 'number') {
        throw new Error('Valid medical record ID is required');
      }
      
      // Validate record data
      const validationErrors = validateMedicalRecordData(recordData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Sanitize the data
      const sanitizedData = {
        title: recordData.title.trim(),
        category: recordData.category.trim(),
        description: recordData.description.trim(),
        date: recordData.date || new Date().toISOString(),
        doctorName: recordData.doctorName?.trim() || '',
        hospitalName: recordData.hospitalName?.trim() || '',
        notes: recordData.notes?.trim() || ''
      };
      
      const record = await MedicalRecordService.updateMedicalRecord(id, sanitizedData);
      
      // Validate the response
      if (!record || !record.id) {
        throw new Error('Invalid medical record data received from server');
      }
      
      return {
        ...record,
        date: record.date ? new Date(record.date) : null,
        createdAt: record.createdAt ? new Date(record.createdAt) : null,
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : null
      };
    } catch (error) {
      handleApiError(error, `updating medical record ${id}`);
    }
  },
  
  // Delete a medical record
  deleteMedicalRecord: async (id) => {
    try {
      if (!id || typeof id !== 'string' && typeof id !== 'number') {
        throw new Error('Valid medical record ID is required');
      }
      
      const result = await MedicalRecordService.deleteMedicalRecord(id);
      
      // Validate the response
      if (!result) {
        throw new Error('Failed to delete medical record');
      }
      
      return result;
    } catch (error) {
      handleApiError(error, `deleting medical record ${id}`);
    }
  },
  
  // Upload a document for a medical record
  uploadMedicalDocument: async (recordId, file, documentType) => {
    try {
      if (!recordId || typeof recordId !== 'string' && typeof recordId !== 'number') {
        throw new Error('Valid record ID is required');
      }
      
      if (!documentType || typeof documentType !== 'string') {
        throw new Error('Valid document type is required');
      }
      
      // Validate file
      const fileValidationErrors = validateFileUpload(file);
      if (fileValidationErrors.length > 0) {
        throw new Error(`File validation failed: ${fileValidationErrors.join(', ')}`);
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      
      // Use the centralized API service for file upload
      const { api } = await import('../context/ApiService');
      const response = await api.post(`/web/medicalrecords/${recordId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      handleApiError(error, 'uploading medical document');
    }
  },
  
  // Get all documents for a specific medical record
  getMedicalDocuments: async (recordId) => {
    try {
      if (!recordId || typeof recordId !== 'string' && typeof recordId !== 'number') {
        throw new Error('Valid record ID is required');
      }
      
      // Use the centralized API service
      const { api } = await import('../context/ApiService');
      const response = await api.get(`/web/medicalrecords/${recordId}/documents`);
      
      const documents = response.data;
      
      // Validate the response
      if (!Array.isArray(documents)) {
        throw new Error('Invalid documents data received from server');
      }
      
      return documents.map(doc => ({
        ...doc,
        uploadedAt: doc.uploadedAt ? new Date(doc.uploadedAt) : null
      }));
    } catch (error) {
      handleApiError(error, `fetching documents for record ${recordId}`);
    }
  },
  
  // Delete a document from a medical record
  deleteMedicalDocument: async (recordId, documentId) => {
    try {
      if (!recordId || typeof recordId !== 'string' && typeof recordId !== 'number') {
        throw new Error('Valid record ID is required');
      }
      
      if (!documentId || typeof documentId !== 'string' && typeof documentId !== 'number') {
        throw new Error('Valid document ID is required');
      }
      
      // Use the centralized API service
      const { api } = await import('../context/ApiService');
      const response = await api.delete(`/web/medicalrecords/${recordId}/documents/${documentId}`);
      
      return response.data;
    } catch (error) {
      handleApiError(error, `deleting document ${documentId}`);
    }
  }
};

export default medicalRecordService; 