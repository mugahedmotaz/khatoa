import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AppState, User, DailyProgress } from '@/types';
import { availableHabits } from '@/data/habits';

// مكونات التطبيق
import SplashScreen from '@/components/SplashScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import CreateProfile from '@/components/CreateProfile';
import SelectHabits from '@/components/SelectHabits';
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
import { hasFeatureAccessWithTrial, getUpgradeMessage, PREMIUM_FEATURES } from '@/utils/subscriptionManager';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [user, setUser] = useLocalStorage<User | null>('mujahidah-user', null);
  const [isOnboarded, setIsOnboarded] = useLocalStorage('mujahidah-onboarded', false);
  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress[]>('mujahidah-progress', []);

  // التحكم في الشاشات
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOnboarded) {
        setCurrentScreen('onboarding');
      } else if (!user) {
        setCurrentScreen('create-profile');
      } else if (user.selectedHabits.length === 0) {
        setCurrentScreen('select-habits');
      } else {
        setCurrentScreen('home');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOnboarded, user]);

  // إكمال التأهيل
  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    setCurrentScreen('create-profile');
  };

  // إنشاء الملف الشخصي
  const handleCreateProfile = (newUser: User) => {
    setUser(newUser);
    setCurrentScreen('select-habits');
  };

  // اختيار العادات
  const handleSelectHabits = (selectedHabits: string[]) => {
    if (user) {
      const updatedUser = { ...user, selectedHabits };
      setUser(updatedUser);
      setCurrentScreen('home');
    }
  };

  // تبديل حالة العادة
  const handleHabitToggle = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habitData = availableHabits.find(h => h.id === habitId);
    const points = habitData?.points || 0;
    
    setDailyProgress(prev => {
      const existingDay = prev.find(p => p.date === today);
      
      if (existingDay) {
        // تحديث اليوم الموجود
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
        // إضافة يوم جديد
        return [
          ...prev,
          {
            date: today,
            completedHabits: [habitId],
            pointsEarned: points
          }
        ];
      }
    });

    // تحديث نقاط المستخدم
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const todayProgress = dailyProgress.find(p => p.date === today) || { completedHabits: [], pointsEarned: 0, date: today };
      const isCompleting = !todayProgress.completedHabits.includes(habitId);
      const pointsChange = isCompleting ? points : -points;
      setUser({
        ...user,
        totalPoints: Math.max(0, user.totalPoints + pointsChange)
      });
    }
  };

  // حفظ مدخلات المفكرة
  const handleSaveJournalEntry = (entry: string) => {
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
        return [
          ...prev,
          {
            date: today,
            completedHabits: [],
            journalEntry: entry,
            pointsEarned: 0
          }
        ];
      }
    });
  };

  // تحديث بيانات المستخدم
  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // إعادة تعيين التطبيق
  const handleResetApp = () => {
    setUser(null);
    setIsOnboarded(false);
    setDailyProgress([]);
    setCurrentScreen('splash');
  };

  // التنقل بين الشاشات
  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  // الحصول على مدخل المفكرة لليوم الحالي
  const getTodayJournalEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayProgress = dailyProgress.find(p => p.date === today);
    return todayProgress?.journalEntry || '';
  };

  // عرض الشاشة المناسبة
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => {}} />;
      
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      
      case 'create-profile':
        return <CreateProfile onComplete={handleCreateProfile} />;
      
      case 'select-habits':
        return <SelectHabits onComplete={handleSelectHabits} />;
      
      case 'home':
        return user ? (
          <HomeScreen
            user={user}
            dailyProgress={dailyProgress}
            onHabitToggle={handleHabitToggle}
            onNavigate={handleNavigate}
          />
        ) : null;
      
      case 'journal':
        return (
          <JournalScreen
            onBack={() => setCurrentScreen('home')}
            onSaveEntry={handleSaveJournalEntry}
            currentEntry={getTodayJournalEntry()}
          />
        );
      
      case 'statistics':
        return user ? (
          <StatisticsScreen
            user={user}
            dailyProgress={dailyProgress}
            onBack={() => setCurrentScreen('home')}
          />
        ) : null;
      
      case 'achievements':
        return user ? (
          <AchievementsScreen
            user={user}
            dailyProgress={dailyProgress}
            onBack={() => setCurrentScreen('home')}
          />
        ) : null;
      
      case 'reminders':
        return user ? (
          <RemindersScreen
            user={user}
            onBack={() => setCurrentScreen('home')}
            onUpdateReminders={(settings) => setUser({...user, reminderSettings: settings})}
          />
        ) : null;
      
      case 'meditation':
        return (
          <MeditationScreen
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      case 'settings':
        return user ? (
          <SettingsScreen
            user={user}
            onBack={() => setCurrentScreen('home')}
            onUpdateUser={handleUpdateUser}
            onResetApp={handleResetApp}
          />
        ) : null;
      
      case 'analytics':
        return checkFeatureAccess('analytics') ? (
          <AnalyticsScreen 
            onBack={() => setCurrentScreen('home')} 
            user={user}
            dailyProgress={dailyProgress}
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
        return <PremiumScreen 
          onBack={() => setCurrentScreen('home')} 
          onPurchase={(planId) => {
            // محاكاة عملية الشراء
            console.log('Purchasing plan:', planId);
            setCurrentScreen('home');
          }}
          currentPlan={null}
        />;
      default:
        return <SplashScreen onComplete={() => {}} />;
    }
  };

  return <div className="min-h-screen">{renderScreen()}</div>;
};

export default Index;
