import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import page components
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import MedicalShop from './pages/MedicalShop';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/emergency-contacts" element={<UserDashboard />} />
      <Route path="/shop" element={<MedicalShop />} />
    </Routes>
  );
}

export default App;
