// أنواع البيانات الخاصة بنظام المصادقة

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  createdAt: Date;
  lastLoginAt: Date;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  preferences: UserPreferences;
  subscription: UserSubscription;
  selectedHabits: string[];
  // خصائص إضافية للتوافق مع المكونات الأخرى
  goal: string;
  startDate: string;
  level: number;
  totalPoints: number;
  achievements: string[];
  streak: number;
  longestStreak: number;
  reminderSettings: ReminderSettings;
}

export interface ReminderSettings {
  enabled: boolean;
  times: string[];
  motivationalQuotes: boolean;
  sound: boolean;
}

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    habits: boolean;
    achievements: boolean;
    reminders: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showProgress: boolean;
    allowFriendRequests: boolean;
  };
}

export interface UserSubscription {
  planId: string | null;
  planName: string | null;
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  features: string[];
  trialUsed: boolean;
  trialEndDate: Date | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  agreeToTerms: boolean;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface VerificationData {
  email: string;
  code: string;
}
