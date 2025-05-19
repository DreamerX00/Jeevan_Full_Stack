import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useTheme } from './context/ThemeContext';

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
import ApiTest from './pages/ApiTest';

function App() {
  const { darkMode } = useTheme();

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen`}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/emergency-contacts" element={<UserDashboard />} />
        <Route path="/shop" element={<MedicalShop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
        <Route path="/nearby-pharmacies" element={<NearbyPharmacies />} />
        <Route path="/records" element={<MedicalRecords />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/api-test" element={<ApiTest />} />
      </Routes>
    </div>
  );
}

export default App;
