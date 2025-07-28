import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DailyProgress, HabitGoal } from '@/types';
import { User } from '@/types/auth';
import { availableHabits } from '@/data/habits';
import { authService } from '@/utils/authService';

// مكونات التطبيق
import SplashScreen from '@/components/SplashScreen';
import JournalScreen from '@/components/JournalScreen';
import AuthManager from '@/components/AuthManager';
import OnboardingScreen from '@/components/OnboardingScreen';
import HomeScreen from '@/components/HomeScreen';
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
import { hasFeatureAccessWithTrial, getUpgradeMessage, PREMIUM_FEATURES, checkFeatureAccess, getCurrentSubscriptionStatus, activatePremiumTrial } from '@/utils/subscriptionManager';
import { toast } from '@/hooks/use-toast';

const defaultUser: User = {
  id: '',
  email: '',
  name: '',
  avatar: '',
  phone: '',
  dateOfBirth: '',
  gender: 'male',
  createdAt: new Date(),
  lastLoginAt: new Date(),
  isEmailVerified: false,
  isPhoneVerified: false,
  preferences: {
    language: 'ar',
    theme: 'auto',
    notifications: {
      email: true,
      push: true,
      habits: true,
      achievements: true,
      reminders: true,
    },
    privacy: {
      profileVisibility: 'private',
      showProgress: false,
      allowFriendRequests: false,
    },
  },
  subscription: {
    planId: null,
    planName: null,
    isActive: false,
    startDate: null,
    endDate: null,
    features: [],
    trialUsed: false,
    trialEndDate: null,
  },
  selectedHabits: [],
  // خصائص إضافية
  goal: '',
  startDate: '',
  level: 1,
  totalPoints: 0,
  achievements: [],
  streak: 0,
  longestStreak: 0,
  reminderSettings: {
    enabled: false,
    times: [],
    motivationalQuotes: false,
    sound: false,
  },
};

function normalizeUser(u: Partial<User> | null): User | null {
  if (!u) return null;
  return {
    ...defaultUser,
    ...u,
    preferences: { ...defaultUser.preferences, ...u.preferences },
    subscription: { ...defaultUser.subscription, ...u.subscription },
    reminderSettings: { ...defaultUser.reminderSettings, ...u.reminderSettings },
    selectedHabits: u.selectedHabits || [],
    achievements: u.achievements || [],
  };
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [user, setUser] = useState<User | null>(null);

  const handlePurchase = (planId: string) => {
    if (user) {
      // The subscription is already activated in PremiumScreen by subscriptionManager.
      // So we just need to refresh the user state from the source of truth.
      const newSubscription = subscriptionManager.getCurrentSubscriptionStatus(user.id);
      setUser(prevUser => prevUser ? { ...prevUser, subscription: newSubscription } : null);

      // رسالة تأكيد
      toast({
        title: 'تم تفعيل النسخة المتقدمة! 🎉',
        description: 'تم تفعيل جميع الميزات فوراً. استمتع بتجربتك المتقدمة.',
      });

      // إعادة المستخدم تلقائياً للشاشة المطلوبة أو الرئيسية
      if (requestedPremiumScreen) {
        setCurrentScreen(requestedPremiumScreen);
        setRequestedPremiumScreen(null);
      } else {
        setCurrentScreen('home');
      }
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useLocalStorage('khatoa-onboarded', false);
  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress[]>('khatoa-progress', []);
  const [hasShownSplash, setHasShownSplash] = useLocalStorage('khatoa-splash-shown', false);
  const [requestedPremiumScreen, setRequestedPremiumScreen] = useState<string | null>(null);

  // تحميل بيانات المستخدم عند بدء التطبيق
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(normalizeUser(currentUser));
      setIsAuthenticated(true);
    }
  }, []);

  // مستمع لتحديثات المستخدم من PaymentModal
  useEffect(() => {
    const handleUserUpdate = (event: CustomEvent) => {
      const updatedUser = event.detail;
      if (updatedUser) {
        setUser(normalizeUser(updatedUser));
      }
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
    };
  }, []);

  // التحكم في الشاشات
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShownSplash) {
        setHasShownSplash(true);
      }

      // تعيين الشاشة الأولية فقط إذا كانت الشاشة الحالية هي splash أو auth
      if (currentScreen === 'splash' || currentScreen === 'auth') {
        if (!isAuthenticated) {
          setCurrentScreen('auth');
        } else if (!isOnboarded) {
          setCurrentScreen('onboarding');
        } else {
          setCurrentScreen('home');
        }
      }
    }, hasShownSplash ? 0 : 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboarded, hasShownSplash, setHasShownSplash, currentScreen]);

  // معالج نجاح المصادقة
  const handleAuthSuccess = (fromRegistration = false) => {
    let currentUser = authService.getCurrentUser();
    if (currentUser) {
      // تفعيل التجربة المجانية تلقائياً إذا لم تستخدم
      if (!currentUser.subscription.trialUsed) {
        const now = new Date();
        const trialEnd = new Date(now);
        trialEnd.setDate(now.getDate() + 3);
        currentUser = {
          ...currentUser,
          subscription: {
            ...currentUser.subscription,
            trialUsed: true,
            trialEndDate: trialEnd.toISOString(),
          },
        };
        setUser(normalizeUser(currentUser));
        authService.updateUser(currentUser);
      } else {
        setUser(normalizeUser(currentUser));
      }
      setIsAuthenticated(true);

      // إذا كان من التسجيل، انتقل للتخصيص مباشرة
      if (fromRegistration) {
        setCurrentScreen('onboarding');
      } else {
        // إذا لم يحدد عادات انتقل للتخصيص، وإلا الرئيسية
        if (!currentUser.selectedHabits || currentUser.selectedHabits.length === 0) {
          setCurrentScreen('onboarding');
        } else {
          setCurrentScreen('home');
        }
      }
    }
  };

  // معالج تفعيل التجربة المجانية
  const handleActivateTrial = () => {
    if (!user) return false;

    const success = activatePremiumTrial();
    if (success) {
      // تحديث بيانات المستخدم المحلية
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) {
        setUser(normalizeUser(updatedUser));
      }
    }
    return success;
  };

  // معالج تسجيل الخروج
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentScreen('auth');
  };

  // إكمال التأهيل
  const handleOnboardingComplete = (habitGoals: HabitGoal[]) => {
    if (user) {
      const updatedUser = {
        ...user,
        selectedHabits: habitGoals.map(h => h.habitId),
        habitGoals
      };
      setUser(updatedUser);
      authService.updateUser(updatedUser);
    }
    setIsOnboarded(true);
    setCurrentScreen('home');
  };

  // تبديل حالة العادة
  const handleHabitToggle = (habitId: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    // ابحث أولاً في availableHabits للحصول على النقاط
    const habitFromAvailable = availableHabits.find(h => h.id === habitId);
    // إذا لم يوجد نقاط، اجعل الافتراضي 10
    const points = habitFromAvailable?.points || 10;

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
    // دعم شاشات التحذير القادمة من HomeScreen
    if (currentScreen.startsWith('premiumWarning_')) {
      const featureKey = currentScreen.replace('premiumWarning_', '');
      const subscriptionStatus = getCurrentSubscriptionStatus();
      const premiumFeature = PREMIUM_FEATURES[featureKey];
      if (!premiumFeature) return <PremiumWarningScreen onBack={() => setCurrentScreen('home')} featureName="ميزة مدفوعة" featureDescription="هذه الميزة تتطلب اشتراكاً أو تجربة مجانية." featureIcon="👑" onUpgrade={() => setCurrentScreen('premium')} onTrial={() => { if (handleActivateTrial()) setCurrentScreen(featureKey); }} trialEnded={subscriptionStatus.trialEnded} />;
      return (
        <PremiumWarningScreen
          featureName={premiumFeature.name}
          featureDescription={premiumFeature.description}
          featureIcon={premiumFeature.icon || '👑'}
          onBack={() => setCurrentScreen('home')}
          onUpgrade={() => {
            setRequestedPremiumScreen(featureKey);
            setCurrentScreen('premium');
          }}
          onTrial={() => {
            if (handleActivateTrial()) {
              setCurrentScreen(featureKey);
            }
          }}
          trialEnded={subscriptionStatus.trialEnded}
        />
      );
    }
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => { }} />;

      case 'auth':
        return <AuthManager onAuthSuccess={handleAuthSuccess} />;

      case 'onboarding':
        return (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        );

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
            currentEntry={(() => {
              const today = new Date().toISOString().split('T')[0];
              const todayProgress = dailyProgress.find(p => p.date === today);
              return todayProgress?.journalEntry || '';
            })()}
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
                const updatedUser = normalizeUser({ ...user, reminderSettings: settings });
                setUser(updatedUser);
                authService.updateUser(updatedUser);
              }
            }}
          />
        );

      case 'meditation':
        return <MeditationScreen onBack={() => setCurrentScreen('home')} />;

      case 'analytics': {
        const subscriptionStatus = getCurrentSubscriptionStatus();
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
            onUpgrade={() => {
              setRequestedPremiumScreen('analytics');
              setCurrentScreen('premium');
            }}
            onTrial={() => {
              if (handleActivateTrial()) {
                setCurrentScreen('analytics');
              }
            }}
            trialEnded={subscriptionStatus.trialEnded}
          />
        );
      }

      case 'social': {
        const subscriptionStatus = getCurrentSubscriptionStatus();
        return checkFeatureAccess('social') ? (
          <SocialScreen
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => {
              setRequestedPremiumScreen('social');
              setCurrentScreen('premium');
            }}
            currentUser={user}
          />
        ) : (
          <PremiumWarningScreen
            featureName={PREMIUM_FEATURES.social.name}
            featureDescription={PREMIUM_FEATURES.social.description}
            featureIcon="👥"
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => {
              setRequestedPremiumScreen('social');
              setCurrentScreen('premium');
            }}
            onTrial={() => {
              if (handleActivateTrial()) {
                setCurrentScreen('social');
              }
            }}
            trialEnded={subscriptionStatus.trialEnded}
          />
        );
      }

      case 'analytics': {
        const { access, trialEnded } = hasFeatureAccessWithTrial('analytics');
        return access ? (
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
            onUpgrade={() => {
              setRequestedPremiumScreen('analytics');
              setCurrentScreen('premium');
            }}
            onTrial={() => {
              if (handleActivateTrial()) {
                setCurrentScreen('analytics');
              }
            }}
            trialEnded={trialEnded}
          />
        );
      }

      case 'ai_assistant': {
        const subscriptionStatus = getCurrentSubscriptionStatus();
        return checkFeatureAccess('ai_assistant') ? (
          <AIAssistantScreen
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => {
              setRequestedPremiumScreen('ai_assistant');
              setCurrentScreen('premium');
            }}
            userHabits={user?.selectedHabits || []}
            userProgress={dailyProgress}
          />
        ) : (
          <PremiumWarningScreen
            featureName={PREMIUM_FEATURES.ai_assistant.name}
            featureDescription={PREMIUM_FEATURES.ai_assistant.description}
            featureIcon="🤖"
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => {
              setRequestedPremiumScreen('ai_assistant');
              setCurrentScreen('premium');
            }}
            onTrial={() => {
              if (handleActivateTrial()) {
                setCurrentScreen('ai_assistant');
              }
            }}
            trialEnded={subscriptionStatus.trialEnded}
          />
        );
      }

      case 'spiritual': {
        const subscriptionStatus = getCurrentSubscriptionStatus();
        return checkFeatureAccess('spiritual') ? (
          <SpiritualScreen onBack={() => setCurrentScreen('home')} />
        ) : (
          <PremiumWarningScreen
            featureName={PREMIUM_FEATURES.spiritual.name}
            featureDescription={PREMIUM_FEATURES.spiritual.description}
            featureIcon="🕌"
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => {
              setRequestedPremiumScreen('spiritual');
              setCurrentScreen('premium');
            }}
            onTrial={() => {
              if (handleActivateTrial()) {
                setCurrentScreen('spiritual');
              }
            }}
            trialEnded={subscriptionStatus.trialEnded}
          />
        );
      }

      case 'themes': {
        const subscriptionStatus = getCurrentSubscriptionStatus();
        return checkFeatureAccess('themes') ? (
          <ThemesScreen onBack={() => setCurrentScreen('home')} />
        ) : (
          <PremiumWarningScreen
            featureName={PREMIUM_FEATURES.themes.name}
            featureDescription={PREMIUM_FEATURES.themes.description}
            featureIcon="🎨"
            onBack={() => setCurrentScreen('home')}
            onUpgrade={() => {
              setRequestedPremiumScreen('themes');
              setCurrentScreen('premium');
            }}
            onTrial={() => {
              if (handleActivateTrial()) {
                setCurrentScreen('themes');
              }
            }}
            trialEnded={subscriptionStatus.trialEnded}
          />
        );
      }

      case 'settings':
        return (
          <SettingsScreen
            user={user}
            onBack={() => setCurrentScreen('home')}
            onNavigate={setCurrentScreen}
            onUpdateUser={(updatedUser) => {
              setUser(updatedUser);
              authService.updateUser(updatedUser);
            }}
            onResetApp={() => {
              // إعادة تعيين التطبيق
              localStorage.clear();
              window.location.reload();
            }}
          />
        );

      case 'account':
        return (
          <AccountScreen
            onBack={() => setCurrentScreen('home')}
            onLogout={handleLogout}
            onUpgrade={() => setCurrentScreen('premium')}
            onNavigate={setCurrentScreen}
          />
        );

      case 'premium':
        return (
          <PremiumScreen
            onBack={() => {
              if (requestedPremiumScreen) {
                setCurrentScreen(requestedPremiumScreen);
                setRequestedPremiumScreen(null);
              } else {
                setCurrentScreen('home');
              }
            }}
            onPurchase={handlePurchase}
            currentPlan={user?.subscription.planId || null}
          />
        );

      default:
        return (
          <HomeScreen
            user={user}
            dailyProgress={dailyProgress}
            onHabitToggle={handleHabitToggle}
            onNavigate={setCurrentScreen}
          />
        );
    }
  };

  return <div className="min-h-screen">{renderScreen()}</div>;
};

export default Index;
