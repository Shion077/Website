import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { Homepage } from './components/Homepage';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { BookAppointment } from './components/BookAppointment';
import { AppointmentsList } from './components/AppointmentsList';
import { PatientRecords } from './components/PatientRecords';
import { WalkInPatient } from './components/WalkInPatient';
import { PatientProfile } from './components/PatientProfile';

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show login form when user clicks login or is logging in
  if (showLogin && !user) {
    return <LoginForm />;
  }

  // Show homepage for non-authenticated users
  if (!user) {
    return <Homepage onLoginClick={() => setShowLogin(true)} />;
  }

  // Show authenticated app with navigation
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'book-appointment':
        return <BookAppointment />;
      case 'appointments':
        return <AppointmentsList />;
      case 'patients':
        // Only allow access to patient records for admin/dentist
        if (user.role === 'admin' || user.role === 'dentist') {
          return <PatientRecords />;
        }
        return <Dashboard />; // Fallback to dashboard
      case 'walk-in-patient':
        // Only allow access to walk-in feature for staff, admin, dentist
        if (user.role === 'admin' || user.role === 'dentist' || user.role === 'staff') {
          return <WalkInPatient />;
        }
        return <Dashboard />; // Fallback to dashboard
      case 'my-profile':
        // Only for patients
        if (user.role === 'patient') {
          return <PatientProfile />;
        }
        return <Dashboard />; // Fallback to dashboard
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}