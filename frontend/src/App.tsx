import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
    <Router>
      <Layout>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/crew" element={<CrewPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/aircrafts/:air_id/maintenance" element={<MaintenancePage />} />
          <Route path="/balance" element={<BalanceSheetPage />} />
          <Route path="/aircrafts" element={<AircraftsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
