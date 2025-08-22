import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import { useTheme } from './context/ThemeContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import authService from './services/authService';
import React from 'react';

// Import layout components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Import page components
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import MedicalShop from './pages/MedicalShop';
import Cart from './pages/Cart';
import NearbyHospitals from './pages/NearbyHospitals';
import NearbyPharmacies from './pages/NearbyPharmacies';
import MedicalRecords from './pages/MedicalRecords';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import SymptomChecker from './pages/SymptomChecker';
import Vaccination from './pages/Vaccination';
import Diagnose from './pages/Diagnose';
import Kit from './pages/Kit';
import ApiTest from './pages/ApiTest';
import Doctors from './pages/Doctors';
import EmergencyContacts from './pages/EmergencyContacts';

// Import chat interface
import ChatInterface from './components/Chat/ChatInterface';

// Route Change Handler Component
const RouteChangeHandler = () => {
  const location = useLocation();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    let timeoutId;
    
    const handleRouteChange = () => {
      showLoading();
      timeoutId = setTimeout(() => {
        hideLoading();
      }, 500); // Reduced to 500ms for better UX
    };

    handleRouteChange();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      hideLoading(); // Ensure loading is hidden on cleanup
    };
  }, [location.pathname, showLoading, hideLoading]);

  return null;
};

// Protected Route Component with Layout
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isLoggedIn();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const { darkMode } = useTheme();

  return (
    <LoadingProvider>
      <div className={`${darkMode ? 'dark' : ''} min-h-screen`}>
        <RouteChangeHandler />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/shop" element={
            <ProtectedRoute>
              <MedicalShop />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/nearby-hospitals" element={
            <ProtectedRoute>
              <NearbyHospitals />
            </ProtectedRoute>
          } />
          <Route path="/nearby-pharmacies" element={
            <ProtectedRoute>
              <NearbyPharmacies />
            </ProtectedRoute>
          } />
          <Route path="/records" element={
            <ProtectedRoute>
              <MedicalRecords />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="/prescriptions" element={
            <ProtectedRoute>
              <Prescriptions />
            </ProtectedRoute>
          } />
          <Route path="/symptoms" element={
            <ProtectedRoute>
              <SymptomChecker />
            </ProtectedRoute>
          } />
          <Route path="/vaccination" element={
            <ProtectedRoute>
              <Vaccination />
            </ProtectedRoute>
          } />
          <Route path="/diagnose" element={
            <ProtectedRoute>
              <Diagnose />
            </ProtectedRoute>
          } />
          <Route path="/kit" element={
            <ProtectedRoute>
              <Kit />
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          } />
          <Route path="/emergency-contacts" element={
            <ProtectedRoute>
              <EmergencyContacts />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatInterface />
            </ProtectedRoute>
          } />
          
          {/* Development Routes */}
          <Route path="/api-test" element={<ApiTest />} />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </LoadingProvider>
  );
}

export default App;
