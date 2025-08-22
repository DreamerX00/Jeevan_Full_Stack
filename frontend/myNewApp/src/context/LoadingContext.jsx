import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import MedicalLoading from '../components/MedicalLoading';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = useCallback((message = '') => {
    setLoadingMessage(message);
    setLoadingCount(prev => prev + 1);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount(prev => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsLoading(false);
        setLoadingMessage('');
      }
      return newCount;
    });
  }, []);

  const updateLoadingMessage = useCallback((message) => {
    setLoadingMessage(message);
  }, []);

  // Memoized context value for better performance
  const contextValue = useMemo(() => ({
    isLoading,
    loadingMessage,
    loadingCount,
    showLoading,
    hideLoading,
    updateLoadingMessage
  }), [isLoading, loadingMessage, loadingCount, showLoading, hideLoading, updateLoadingMessage]);

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {isLoading && <MedicalLoading message={loadingMessage} />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}; 