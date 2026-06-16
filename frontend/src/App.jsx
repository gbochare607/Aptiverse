import React, { useEffect } from 'react';
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
import LiveTestHistory from './pages/LiveTestHistory';
import Library from './pages/Library';

// Admin Module Pages & Layout
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminInstitutes from './pages/admin/AdminInstitutes';
import AdminTests from './pages/admin/AdminTests';
import InstitutePending from './pages/InstitutePending';

import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';

function InstituteRoute({ children }) {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return null;

  const role = (user?.publicMetadata?.role || user?.unsafeMetadata?.role || '').toLowerCase();
  const isInstitute = role === 'institute' || localStorage.getItem('userRole') === 'institute';

  if (!isInstitute) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const adminToken = localStorage.getItem('adminToken');
  
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function SmartRedirect() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const role = (
    user?.publicMetadata?.role ||
    user?.unsafeMetadata?.role ||
    localStorage.getItem("requestedRole") ||
    localStorage.getItem("userRole") ||
    ""
  ).toLowerCase();

  if (role === "institute") {
    return <Navigate to="/institute-dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  const { user, isLoaded, isSignedIn } = useUser();
  useEffect(() => {
  if (!isLoaded || !isSignedIn || !user) return;

  const currentRole = (
    user.publicMetadata?.role ||
    user.unsafeMetadata?.role ||
    ""
  ).toLowerCase();

  const requestedRole = (
    localStorage.getItem("requestedRole") || ""
  ).toLowerCase();

  // Save existing role
  if (currentRole) {
    localStorage.setItem("userRole", currentRole);
    return;
  }

  // First login
  if (requestedRole) {
    localStorage.setItem("userRole", requestedRole);

    user
      .update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: requestedRole,
        },
      })
      .then(() => {
        console.log("Role saved:", requestedRole);
      })
      .catch((err) => {
        console.error("Role update failed:", err);
      });
  }
}, [isLoaded, isSignedIn, user]);
  
  

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={
        <>
          <SignedIn>
            <SmartRedirect />
          </SignedIn>
          <SignedOut>
            <LandingPage />
          </SignedOut>
        </>
      } />

      {/* Auth Pages - Clerk handles redirect if already signed in */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Clerk Pending Review Page for Institutes */}
      <Route path="/institute-pending" element={<InstitutePending />} />

      {/* Admin Module Login Page (Clerk-independent) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Module Pages Layout (Clerk-independent) */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/institutes" element={<AdminInstitutes />} />
        <Route path="/admin/tests" element={<AdminTests />} />
      </Route>

      {/* Protected Clerk-based Routes */}
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
                  <Route path="/tests/attempts" element={<LiveTestHistory />} />
                  <Route path="/student/room/:roomId" element={<StudentRoomView />} />
                  <Route path="/performance" element={<Navigate to="/profile" state={{ activeTab: 'performance' }} replace />} />
                  <Route path="/planner" element={<Navigate to="/profile" state={{ activeTab: 'planner' }} replace />} />
                  <Route path="/analytics" element={<Navigate to="/profile" state={{ activeTab: 'performance' }} replace />} />

                  {/* Institute Routes */}
                  <Route path="/institute-dashboard" element={<InstituteRoute><InstituteDashboard /></InstituteRoute>} />
                  <Route path="/institute/room/:roomId" element={<InstituteRoute><InstituteRoomView /></InstituteRoute>} />
                  <Route path="/institute/test-rooms" element={<InstituteRoute><InstituteTestRooms /></InstituteRoute>} />
                  <Route path="/institute/competitions" element={<InstituteRoute><InstituteCompetitions /></InstituteRoute>} />
                  <Route path="/create-test" element={<InstituteRoute><CreateTest /></InstituteRoute>} />

                  {/* Specialized Practice Sections (Inside Layout) */}
                  <Route path="/company-practice" element={<CompanyPractice />} />
                  <Route path="/exam-practice" element={<ExamPractice />} />
                  <Route path="/soft-skills" element={<SoftSkills />} />

                  {/* New Profile Menu Routes */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/library" element={<Library />} />
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
