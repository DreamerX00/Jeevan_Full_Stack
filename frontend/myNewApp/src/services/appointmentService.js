import { AppointmentService } from '../context/ApiService';

// Helper function to validate appointment data
const validateAppointmentData = (appointmentData) => {
  const errors = [];
  
  if (!appointmentData) {
    errors.push('Appointment data is required');
    return errors;
  }
  
  if (!appointmentData.doctorName || appointmentData.doctorName.trim() === '') {
    errors.push('Doctor name is required');
  }
  
  if (!appointmentData.appointmentDate) {
    errors.push('Appointment date is required');
  } else {
    const appointmentDate = new Date(appointmentData.appointmentDate);
    const now = new Date();
    if (appointmentDate < now) {
      errors.push('Appointment date cannot be in the past');
    }
  }
  
  if (!appointmentData.appointmentTime) {
    errors.push('Appointment time is required');
  }
  
  if (!appointmentData.reason || appointmentData.reason.trim() === '') {
    errors.push('Appointment reason is required');
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

// Appointments service
const appointmentService = {
  // Get all appointments for the current user
  getAppointments: async () => {
    try {
      const appointments = await AppointmentService.getAppointments();
      
      // Validate and transform the response
      if (!Array.isArray(appointments)) {
        throw new Error('Invalid appointments data received from server');
      }
      
      return appointments.map(appointment => ({
        ...appointment,
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate) : null,
        createdAt: appointment.createdAt ? new Date(appointment.createdAt) : null,
        updatedAt: appointment.updatedAt ? new Date(appointment.updatedAt) : null
      }));
    } catch (error) {
      handleApiError(error, 'fetching appointments');
    }
  },
  
  // Get a specific appointment by ID
  getAppointment: async (id) => {
    try {
      if (!id || typeof id !== 'string' && typeof id !== 'number') {
        throw new Error('Valid appointment ID is required');
      }
      
      const appointment = await AppointmentService.getAppointment(id);
      
      // Validate the response
      if (!appointment || !appointment.id) {
        throw new Error('Invalid appointment data received from server');
      }
      
      return {
        ...appointment,
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate) : null,
        createdAt: appointment.createdAt ? new Date(appointment.createdAt) : null,
        updatedAt: appointment.updatedAt ? new Date(appointment.updatedAt) : null
      };
    } catch (error) {
      handleApiError(error, `fetching appointment ${id}`);
    }
  },
  
  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      // Validate appointment data
      const validationErrors = validateAppointmentData(appointmentData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Sanitize the data
      const sanitizedData = {
        doctorName: appointmentData.doctorName.trim(),
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        reason: appointmentData.reason.trim(),
        notes: appointmentData.notes?.trim() || '',
        status: appointmentData.status || 'SCHEDULED'
      };
      
      const appointment = await AppointmentService.createAppointment(sanitizedData);
      
      // Validate the response
      if (!appointment || !appointment.id) {
        throw new Error('Invalid appointment data received from server');
      }
      
      return {
        ...appointment,
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate) : null,
        createdAt: appointment.createdAt ? new Date(appointment.createdAt) : null,
        updatedAt: appointment.updatedAt ? new Date(appointment.updatedAt) : null
      };
    } catch (error) {
      handleApiError(error, 'creating appointment');
    }
  },
  
  // Update an existing appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      if (!id || typeof id !== 'string' && typeof id !== 'number') {
        throw new Error('Valid appointment ID is required');
      }
      
      // Validate appointment data
      const validationErrors = validateAppointmentData(appointmentData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Sanitize the data
      const sanitizedData = {
        doctorName: appointmentData.doctorName.trim(),
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        reason: appointmentData.reason.trim(),
        notes: appointmentData.notes?.trim() || '',
        status: appointmentData.status || 'SCHEDULED'
      };
      
      const appointment = await AppointmentService.updateAppointment(id, sanitizedData);
      
      // Validate the response
      if (!appointment || !appointment.id) {
        throw new Error('Invalid appointment data received from server');
      }
      
      return {
        ...appointment,
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate) : null,
        createdAt: appointment.createdAt ? new Date(appointment.createdAt) : null,
        updatedAt: appointment.updatedAt ? new Date(appointment.updatedAt) : null
      };
    } catch (error) {
      handleApiError(error, `updating appointment ${id}`);
    }
  },
  
  // Delete an appointment
  deleteAppointment: async (id) => {
    try {
      if (!id || typeof id !== 'string' && typeof id !== 'number') {
        throw new Error('Valid appointment ID is required');
      }
      
      const result = await AppointmentService.deleteAppointment(id);
      
      // Validate the response
      if (!result) {
        throw new Error('Failed to delete appointment');
      }
      
      return result;
    } catch (error) {
      handleApiError(error, `deleting appointment ${id}`);
    }
  },
  
  // Get appointments by status
  getAppointmentsByStatus: async (status) => {
    try {
      if (!status || typeof status !== 'string') {
        throw new Error('Valid status is required');
      }
      
      const appointments = await AppointmentService.getAppointments();
      
      // Filter by status
      const filteredAppointments = appointments.filter(appointment => 
        appointment.status?.toUpperCase() === status.toUpperCase()
      );
      
      return filteredAppointments.map(appointment => ({
        ...appointment,
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate) : null,
        createdAt: appointment.createdAt ? new Date(appointment.createdAt) : null,
        updatedAt: appointment.updatedAt ? new Date(appointment.updatedAt) : null
      }));
    } catch (error) {
      handleApiError(error, `fetching appointments by status ${status}`);
    }
  }
};

export default appointmentService; 