import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import TestRunner from './pages/TestRunner';
import InstituteDashboard from './pages/InstituteDashboard';
import CreateTest from './pages/CreateTest';
import Tests from './pages/Tests';
import Competitions from './pages/Competitions';
import PracticeHub from './pages/PracticeHub';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={
        <>
          <SignedIn>
            <Navigate to="/dashboard" replace />
          </SignedIn>
          <SignedOut>
            <LandingPage />
          </SignedOut>
        </>
      } />

      {/* Auth Pages - Clerk handles redirect if already signed in */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <>
            <SignedIn>
              <Routes>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/study-room" element={<div>Study Room (Coming Soon)</div>} />
                  <Route path="/competitions" element={<Competitions />} />
                  <Route path="/practice" element={<PracticeHub />} />
                  <Route path="/tests" element={<Tests />} />
                  <Route path="/analytics" element={<div>Analytics (Coming Soon)</div>} />
                  <Route path="/test/:testId" element={<TestRunner />} />

                  {/* Institute Routes - Role check needed later */}
                  <Route path="/institute-dashboard" element={<InstituteDashboard />} />
                  <Route path="/create-test" element={<CreateTest />} />
                </Route>
              </Routes>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </Router>
  );
}

export default App;
