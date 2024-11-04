import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CrewPage from './pages/CrewPage';
import SchedulePage from './pages/SchedulePage';
import MaintenancePage from './pages/MaintenancePage';
import BalanceSheetPage from './pages/BalanceSheetPage';
import AircraftsPage from './pages/AircraftsPage';
import LoginPage from './pages/LoginPage';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/crew" element={<CrewPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/aircrafts/:air_id/maintenance" element={<MaintenancePage />} />
            <Route path="/balance" element={<BalanceSheetPage />} />
            <Route path="/aircrafts" element={<AircraftsPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
