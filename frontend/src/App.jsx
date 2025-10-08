import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AccessAccount from '../pages/AccessAccount.jsx';
import DonorLogin from '../pages/DonorLogin.jsx';
import DonorSignUp from '../pages/DonorSignUp.jsx';
import Dashboard from '../pages/DonorDashboard.jsx';
import Welcome from '../pages/Welcome.jsx';
import VolunteerLogin from '../pages/VolunteerLogin.jsx';
import VolunteerSignUp from '../pages/VolunteerSignUp.jsx';
import VolunteerDashboard from '../pages/VolunteerDashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AccessAccount />} />
        <Route path="/auth/login" element={<DonorLogin />} />
        <Route path="/auth/signUp" element={<DonorSignUp />} />
        <Route path="/auth/dashboard" element={<Dashboard />} />
        <Route path="/auth/welcome" element={<Welcome />} />
        <Route path="/volunteer/login" element={<VolunteerLogin />} />
        <Route path="/volunteer/signup" element={<VolunteerSignUp />} />
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
