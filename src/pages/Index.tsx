import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DailyProgress } from '@/types';
import { User } from '@/types/auth';
import { availableHabits } from '@/data/habits';
import { authService } from '@/utils/authService';

// مكونات التطبيق
import SplashScreen from '@/components/SplashScreen';
import AuthManager from '@/components/AuthManager';
import OnboardingScreen from '@/components/OnboardingScreen';
import HomeScreen from '@/components/HomeScreen';
import JournalScreen from '@/components/JournalScreen';
import StatisticsScreen from '@/components/StatisticsScreen';
import SettingsScreen from '@/components/SettingsScreen';
import AchievementsScreen from '@/components/AchievementsScreen';
import RemindersScreen from '@/components/RemindersScreen';
import MeditationScreen from '@/components/MeditationScreen';
import AnalyticsScreen from '@/components/AnalyticsScreen';
import AIAssistantScreen from '@/components/AIAssistantScreen';
import SocialScreen from '@/components/SocialScreen';
import PremiumScreen from '@/components/PremiumScreen';
import PremiumWarningScreen from '@/components/PremiumWarningScreen';
import SpiritualScreen from '@/components/SpiritualScreen';
import ThemesScreen from '@/components/ThemesScreen';
import AccountScreen from '@/components/AccountScreen';
import { hasFeatureAccessWithTrial, getUpgradeMessage, PREMIUM_FEATURES, checkFeatureAccess } from '@/utils/subscriptionManager';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useLocalStorage('khatoa-onboarded', false);
  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress[]>('khatoa-progress', []);

  // تحميل بيانات المستخدم عند بدء التطبيق
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  // التحكم في الشاشات
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        setCurrentScreen('auth');
      } else if (!isOnboarded) {
        setCurrentScreen('onboarding');
      } else {
        setCurrentScreen('home');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboarded]);

  // معالج نجاح المصادقة
  const handleAuthSuccess = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
      if (!isOnboarded) {
        setCurrentScreen('onboarding');
      } else {
        setCurrentScreen('home');
      }
    }
  };

  // معالج تسجيل الخروج
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentScreen('auth');
  };

  // إكمال التأهيل
  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    setCurrentScreen('home');
  };

  // تبديل حالة العادة
  const handleHabitToggle = (habitId: string) => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const habitData = availableHabits.find(h => h.id === habitId);
    const points = habitData?.points || 0;
    
    setDailyProgress(prev => {
      const existingDay = prev.find(p => p.date === today);
      
      if (existingDay) {
        const isCompleting = !existingDay.completedHabits.includes(habitId);
        const newCompletedHabits = isCompleting
          ? [...existingDay.completedHabits, habitId]
          : existingDay.completedHabits.filter(id => id !== habitId);
        const pointsChange = isCompleting ? points : -points;
        
        return prev.map(p => 
          p.date === today 
            ? {
                ...p,
                completedHabits: newCompletedHabits,
                pointsEarned: (p.pointsEarned || 0) + pointsChange
              }
            : p
        );
      } else {
        return [...prev, {
          date: today,
          completedHabits: [habitId],
          pointsEarned: points
        }];
      }
    });
  };

  // عرض الشاشات
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => {}} />;
      
      case 'auth':
        return <AuthManager onAuthSuccess={handleAuthSuccess} />;
      
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      
      case 'home':
        return (
          <HomeScreen
            user={user}
            dailyProgress={dailyProgress}
            onHabitToggle={handleHabitToggle}
            onNavigate={setCurrentScreen}
          />
        );
      
      case 'journal':
        return (
          <JournalScreen 
            onBack={() => setCurrentScreen('home')}
            onSaveEntry={(entry) => {
              const today = new Date().toISOString().split('T')[0];
              setDailyProgress(prev => {
                const existingDay = prev.find(p => p.date === today);
                if (existingDay) {
                  return prev.map(p => 
                    p.date === today 
                      ? { ...p, journalEntry: entry }
                      : p
                  );
                } else {
                  return [...prev, {
                    date: today,
                    completedHabits: [],
                    journalEntry: entry,
                    pointsEarned: 0
                  }];
                }
              });
            }}
            currentEntry={() => {
              const today = new Date().toISOString().split('T')[0];
              const todayProgress = dailyProgress.find(p => p.date === today);
              return todayProgress?.journalEntry || '';
            }()}
          />
        );
      
      case 'statistics':
        return (
          <StatisticsScreen
            user={user}
            dailyProgress={dailyProgress}
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      case 'settings':
        return (
          <SettingsScreen
            user={user}
            onBack={() => setCurrentScreen('home')}
            onUpdateUser={(updatedUser) => {
              setUser(updatedUser);
              authService.updateUser(updatedUser);
            }}
            onLogout={handleLogout}
          />
        );
      
      case 'account':
        return (
          <AccountScreen
            onBack={() => setCurrentScreen('home')}
            onLogout={handleLogout}
            onUpgrade={() => setCurrentScreen('premium')}
          />
        );
      
      case 'achievements':
        return (
          <AchievementsScreen
            user={user}
            dailyProgress={dailyProgress}
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      case 'reminders':
        return (
          <RemindersScreen 
            user={user}
            onBack={() => setCurrentScreen('home')}
            onUpdateReminders={(settings) => {
              if (user) {
                const updatedUser = { ...user, reminderSettings: settings };
                setUser(updatedUser);
                authService.updateUser(updatedUser);
              }
            }}
          />
        );
      
      case 'meditation':
        return <MeditationScreen onBack={() => setCurrentScreen('home')} />;
      
      case 'analytics':
        return checkFeatureAccess('analytics') ? (
          <AnalyticsScreen
            user={user}
            dailyProgress={dailyProgress}
            onBack={() => setCurrentScreen('home')}
          />
        ) : (
          <PremiumWarningScreen
            featureName={PREMIUM_FEATURES.analytics.name}
            featureDescription={PREMIUM_FEATURES.analytics.description}
            featureIcon="📊"
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => setCurrentScreen('premium')}
          />
        );
      
      case 'social':
        return checkFeatureAccess('social') ? (
          <SocialScreen 
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => setCurrentScreen('premium')}
            currentUser={user}
          />
        ) : (
          <PremiumWarningScreen
            featureName={PREMIUM_FEATURES.social.name}
            featureDescription={PREMIUM_FEATURES.social.description}
            featureIcon="👥"
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => setCurrentScreen('premium')}
          />
        );
      
      case 'ai_assistant':
        return checkFeatureAccess('ai_assistant') ? (
          <AIAssistantScreen 
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => setCurrentScreen('premium')}
            userHabits={user?.selectedHabits || []}
            userProgress={dailyProgress}
          />
        ) : (
          <PremiumWarningScreen
            featureName={PREMIUM_FEATURES.ai_assistant.name}
            featureDescription={PREMIUM_FEATURES.ai_assistant.description}
            featureIcon="🤖"
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => setCurrentScreen('premium')}
          />
        );
      
      case 'spiritual':
        return checkFeatureAccess('spiritual') ? (
          <SpiritualScreen onBack={() => setCurrentScreen('home')} />
        ) : (
          <PremiumWarningScreen
            featureName={PREMIUM_FEATURES.spiritual.name}
            featureDescription={PREMIUM_FEATURES.spiritual.description}
            featureIcon="🕌"
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => setCurrentScreen('premium')}
          />
        );
      
      case 'themes':
        return checkFeatureAccess('themes') ? (
          <ThemesScreen onBack={() => setCurrentScreen('home')} />
        ) : (
          <PremiumWarningScreen
            featureName={PREMIUM_FEATURES.themes.name}
            featureDescription={PREMIUM_FEATURES.themes.description}
            featureIcon="🎨"
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => setCurrentScreen('premium')}
          />
        );
      
      case 'premium':
        return (
          <PremiumScreen 
            onBack={() => setCurrentScreen('home')} 
            onPurchase={(planId) => {
              console.log('Purchasing plan:', planId);
              setCurrentScreen('home');
            }}
            currentPlan={user?.subscription.planId || null}
          />
        );
      
      default:
        return <SplashScreen onComplete={() => {}} />;
    }
  };

  return <div className="min-h-screen">{renderScreen()}</div>;
};

export default Index;
