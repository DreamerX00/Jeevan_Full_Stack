const config = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  aiServiceUrl: import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:5000/api/ai',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  enableAIFeatures: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
  enableMapsFeatures: import.meta.env.VITE_ENABLE_MAPS_FEATURES === 'true',
  appName: import.meta.env.VITE_APP_NAME || 'Jeevan Medical App',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0'
};

export default config; 