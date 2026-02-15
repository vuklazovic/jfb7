import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Subscriptions from './pages/Subscriptions';
import Savings from './pages/Savings';
import DebtPayoff from './pages/DebtPayoff';
import Afford from './pages/Afford';
import CashFlow from './pages/CashFlow';
import Profile from './pages/Profile';

function AppRoutes() {
  const navigate = useNavigate();
  const [onboarded, setOnboarded] = useState(() => {
    return localStorage.getItem('jfb-onboarded') === 'true';
  });

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('jfb-onboarded', 'true');
    setOnboarded(true);
    navigate('/');
  }, [navigate]);

  return (
    <>
      <div className="noise-overlay" />
      <Routes>
        <Route
          path="/onboarding"
          element={
            onboarded ? <Navigate to="/" /> : <Onboarding onComplete={completeOnboarding} />
          }
        />
        <Route
          path="/"
          element={onboarded ? <Layout /> : <Navigate to="/onboarding" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="savings" element={<Savings />} />
          <Route path="debt" element={<DebtPayoff />} />
          <Route path="afford" element={<Afford />} />
          <Route path="cashflow" element={<CashFlow />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
