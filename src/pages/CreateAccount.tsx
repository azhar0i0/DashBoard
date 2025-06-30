
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import RegisterPage from '@/components/auth/RegisterPage';
import { ThemeProvider } from '@/context/ThemeContext';

const CreateAccount: React.FC = () => {
  const { login } = useAuth();

  const handleRegister = (userData: any) => {
    // Register the new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role as 'admin' | 'accountant' | 'employee'
    };
    login(newUser, userData.password || 'defaultPassword');
  };

  const handleSwitchToLogin = () => {
    // This would redirect to login page - for now just go to home
    window.location.href = '/';
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <RegisterPage 
          onRegister={handleRegister}
          onSwitchToLogin={handleSwitchToLogin} 
        />
      </div>
    </ThemeProvider>
  );
};

export default CreateAccount;
