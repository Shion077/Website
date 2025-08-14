import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { BookAppointment } from './components/BookAppointment';
import { AppointmentsList } from './components/AppointmentsList';
import { PatientRecords } from './components/PatientRecords';

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'book-appointment':
        return <BookAppointment />;
      case 'appointments':
        return <AppointmentsList />;
      case 'patients':
        return <PatientRecords />;
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