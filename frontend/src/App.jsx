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
import CompanyPractice from './pages/CompanyPractice';
import ExamPractice from './pages/ExamPractice';
import SoftSkills from './pages/SoftSkills';
import Profile from './pages/Profile';
import InstituteRoomView from './pages/InstituteRoomView';
import InstituteTestRooms from './pages/InstituteTestRooms';
import InstituteCompetitions from './pages/InstituteCompetitions';
import StudentRoomView from './pages/StudentRoomView';
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
                  <Route path="/student/room/:roomId" element={<StudentRoomView />} />
                  <Route path="/performance" element={<Navigate to="/profile" state={{ activeTab: 'performance' }} replace />} />
                  <Route path="/planner" element={<Navigate to="/profile" state={{ activeTab: 'planner' }} replace />} />
                  <Route path="/analytics" element={<Navigate to="/profile" state={{ activeTab: 'performance' }} replace />} />

                  {/* Institute Routes - Role check needed later */}
                  <Route path="/institute-dashboard" element={<InstituteDashboard />} />
                  <Route path="/institute/room/:roomId" element={<InstituteRoomView />} />
                  <Route path="/institute/test-rooms" element={<InstituteTestRooms />} />
                  <Route path="/institute/competitions" element={<InstituteCompetitions />} />
                  <Route path="/create-test" element={<CreateTest />} />

                  {/* Specialized Practice Sections (Inside Layout) */}
                  <Route path="/company-practice" element={<CompanyPractice />} />
                  <Route path="/exam-practice" element={<ExamPractice />} />
                  <Route path="/soft-skills" element={<SoftSkills />} />

                  {/* New Profile Menu Routes */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/ai-mentor" element={<div>AI Mentor (Coming Soon)</div>} />
                  <Route path="/activity" element={<div>Recent Activity (Coming Soon)</div>} />
                </Route>

                {/* Final Test Session (Outside Layout for Focus) */}
                <Route path="/test/:testId" element={<TestRunner />} />
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
