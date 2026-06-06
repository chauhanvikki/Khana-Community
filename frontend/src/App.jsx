import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AccessAccount from './pages/AccessAccount.jsx';
import DonorLogin from './pages/DonorLogin.jsx';
import DonorSignUp from './pages/DonorSignUp.jsx';
import Dashboard from './pages/DonorDashboard.jsx';
import Welcome from './pages/Welcome.jsx';
import VolunteerLogin from './pages/VolunteerLogin.jsx';
import VolunteerSignUp from './pages/VolunteerSignUp.jsx';
import VolunteerDashboard from './pages/VolunteerDashboard.jsx';
import AboutUs from './pages/AboutUs.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import ContactPage from './pages/ContactPage.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<AccessAccount />} />
          <Route path="/auth/login" element={<DonorLogin />} />
          <Route path="/auth/signUp" element={<DonorSignUp />} />
          <Route path="/auth/dashboard" element={<Dashboard />} />
          <Route path="/auth/welcome" element={<Welcome />} />
          <Route path="/volunteer/login" element={<VolunteerLogin />} />
          <Route path="/volunteer/signup" element={<VolunteerSignUp />} />
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
