import React, { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { authService } from '@/utils/authService';

interface AuthManagerProps {
  onAuthSuccess: () => void;
}

type AuthScreen = 'login' | 'register' | 'forgot-password';

const AuthManager: React.FC<AuthManagerProps> = ({ onAuthSuccess }) => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من حالة المصادقة عند تحميل المكون
    const checkAuthStatus = () => {
      if (authService.isAuthenticated()) {
        onAuthSuccess();
      } else {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [onAuthSuccess]);

  const handleLoginSuccess = () => {
    onAuthSuccess();
  };

  const handleRegisterSuccess = () => {
    onAuthSuccess();
  };

  const handleForgotPasswordSuccess = () => {
    setCurrentScreen('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري التحقق من حالة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentScreen === 'login' && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setCurrentScreen('register')}
          onForgotPassword={() => setCurrentScreen('forgot-password')}
        />
      )}
      
      {currentScreen === 'register' && (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setCurrentScreen('login')}
        />
      )}
      
      {currentScreen === 'forgot-password' && (
        <ForgotPasswordScreen
          onBackToLogin={() => setCurrentScreen('login')}
          onResetSuccess={handleForgotPasswordSuccess}
        />
      )}
    </>
  );
};

export default AuthManager;
