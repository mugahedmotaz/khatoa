// نظام إدارة الاشتراكات والميزات المدفوعة

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isActive: boolean;
  expiryDate?: Date;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  requiredPlan?: string[];
}

class SubscriptionManager {
  private static instance: SubscriptionManager;
  private currentSubscription: SubscriptionPlan | null = null;

  private constructor() {
    this.loadSubscription();
  }

  public static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  // تحميل بيانات الاشتراك من التخزين المحلي
  private loadSubscription(): void {
    const savedSubscription = localStorage.getItem('user_subscription');
    if (savedSubscription) {
      const subscription = JSON.parse(savedSubscription);
      // التحقق من انتهاء صلاحية الاشتراك
      if (subscription.expiryDate && new Date(subscription.expiryDate) > new Date()) {
        this.currentSubscription = {
          ...subscription,
          expiryDate: new Date(subscription.expiryDate)
        };
      } else {
        // إزالة الاشتراك المنتهي الصلاحية
        localStorage.removeItem('user_subscription');
      }
    }
  }

  // حفظ بيانات الاشتراك
  private saveSubscription(): void {
    if (this.currentSubscription) {
      localStorage.setItem('user_subscription', JSON.stringify(this.currentSubscription));
    }
  }

  // تفعيل اشتراك جديد
  public activateSubscription(planId: string): boolean {
    const plans = {
      monthly: {
        id: 'monthly',
        name: 'الاشتراك الشهري',
        price: 29,
        duration: 'شهر',
        features: ['analytics', 'social', 'ai_assistant', 'themes'],
        isActive: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 يوم
      },
      yearly: {
        id: 'yearly',
        name: 'الاشتراك السنوي',
        price: 199,
        duration: 'سنة',
        features: ['analytics', 'social', 'ai_assistant', 'themes', 'backup', 'spiritual'],
        isActive: true,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 365 يوم
      },
      lifetime: {
        id: 'lifetime',
        name: 'الاشتراك مدى الحياة',
        price: 499,
        duration: 'مدى الحياة',
        features: ['analytics', 'social', 'ai_assistant', 'themes', 'backup', 'spiritual', 'vip_support'],
        isActive: true,
        // بدون تاريخ انتهاء للاشتراك مدى الحياة
      }
    };

    const selectedPlan = plans[planId as keyof typeof plans];
    if (selectedPlan) {
      this.currentSubscription = selectedPlan;
      this.saveSubscription();
      return true;
    }
    return false;
  }

  // التحقق من وجود اشتراك نشط
  public hasActiveSubscription(): boolean {
    if (!this.currentSubscription) return false;
    
    // إذا كان الاشتراك مدى الحياة
    if (this.currentSubscription.id === 'lifetime') return true;
    
    // التحقق من تاريخ الانتهاء
    if (this.currentSubscription.expiryDate) {
      return new Date() < this.currentSubscription.expiryDate;
    }
    
    return false;
  }

  // التحقق من إمكانية الوصول لميزة معينة
  public hasFeatureAccess(featureId: string): boolean {
    if (!this.hasActiveSubscription()) return false;
    
    return this.currentSubscription?.features.includes(featureId) || false;
  }

  // الحصول على معلومات الاشتراك الحالي
  public getCurrentSubscription(): SubscriptionPlan | null {
    return this.currentSubscription;
  }

  // إلغاء الاشتراك
  public cancelSubscription(): void {
    this.currentSubscription = null;
    localStorage.removeItem('user_subscription');
  }

  // الحصول على الأيام المتبقية في الاشتراك
  public getDaysRemaining(): number {
    if (!this.currentSubscription || this.currentSubscription.id === 'lifetime') {
      return -1; // مدى الحياة
    }
    
    if (this.currentSubscription.expiryDate) {
      const today = new Date();
      const expiry = this.currentSubscription.expiryDate;
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    
    return 0;
  }

  // الحصول على قائمة الميزات المتاحة
  public getAvailableFeatures(): string[] {
    if (!this.hasActiveSubscription()) return [];
    return this.currentSubscription?.features || [];
  }

  // التحقق من انتهاء صلاحية الاشتراك قريباً (أقل من 7 أيام)
  public isExpiringSoon(): boolean {
    const daysRemaining = this.getDaysRemaining();
    return daysRemaining > 0 && daysRemaining <= 7;
  }
}

// تصدير instance واحد
export const subscriptionManager = SubscriptionManager.getInstance();

// قائمة الميزات المتاحة
export const PREMIUM_FEATURES: { [key: string]: PremiumFeature } = {
  analytics: {
    id: 'analytics',
    name: 'تحليلات ذكية',
    description: 'تقارير مفصلة وإحصائيات متقدمة',
    category: 'analytics',
    isPremium: true,
    requiredPlan: ['monthly', 'yearly', 'lifetime']
  },
  social: {
    id: 'social',
    name: 'ميزات اجتماعية',
    description: 'تحديات جماعية ولوحة المتصدرين',
    category: 'social',
    isPremium: true,
    requiredPlan: ['monthly', 'yearly', 'lifetime']
  },
  ai_assistant: {
    id: 'ai_assistant',
    name: 'المساعد الذكي',
    description: 'نصائح مخصصة بالذكاء الاصطناعي',
    category: 'ai',
    isPremium: true,
    requiredPlan: ['monthly', 'yearly', 'lifetime']
  },
  themes: {
    id: 'themes',
    name: 'ثيمات متقدمة',
    description: 'خلفيات متحركة وثيمات مخصصة',
    category: 'customization',
    isPremium: true,
    requiredPlan: ['monthly', 'yearly', 'lifetime']
  },
  backup: {
    id: 'backup',
    name: 'نسخ احتياطي آمن',
    description: 'حفظ البيانات في السحابة',
    category: 'security',
    isPremium: true,
    requiredPlan: ['yearly', 'lifetime']
  },
  spiritual: {
    id: 'spiritual',
    name: 'الميزات الروحانية',
    description: 'تذكيرات الصلاة وعداد الأذكار',
    category: 'spiritual',
    isPremium: true,
    requiredPlan: ['yearly', 'lifetime']
  },
  vip_support: {
    id: 'vip_support',
    name: 'دعم VIP',
    description: 'دعم فني مخصص وأولوية في الرد',
    category: 'support',
    isPremium: true,
    requiredPlan: ['lifetime']
  }
};

// دالة مساعدة للتحقق من الميزة
export const checkFeatureAccess = (featureId: string): boolean => {
  return subscriptionManager.hasFeatureAccess(featureId);
};

// دالة للحصول على رسالة الترقية
export const getUpgradeMessage = (featureId: string): string => {
  const feature = PREMIUM_FEATURES[featureId];
  if (feature) {
    return `هذه الميزة "${feature.name}" متاحة فقط للمشتركين في النسخة المتقدمة`;
  }
  return 'هذه الميزة متاحة فقط للمشتركين في النسخة المتقدمة';
};

// ===================== تجربة مجانية للميزات المدفوعة =====================
const TRIAL_KEY = 'premium_trial_start';
const TRIAL_ACTIVE_KEY = 'premium_trial_active';
const TRIAL_PERIOD_DAYS = 3;

// تفعيل التجربة المجانية (مرة واحدة فقط)
export function activatePremiumTrial() {
  if (localStorage.getItem(TRIAL_ACTIVE_KEY) === 'true') return false;
  localStorage.setItem(TRIAL_KEY, new Date().toISOString());
  localStorage.setItem(TRIAL_ACTIVE_KEY, 'true');
  return true;
}

// التحقق من صلاحية التجربة المجانية
export function isPremiumTrialActive() {
  const start = localStorage.getItem(TRIAL_KEY);
  const active = localStorage.getItem(TRIAL_ACTIVE_KEY) === 'true';
  if (!start || !active) return false;
  const startDate = new Date(start);
  const now = new Date();
  const diff = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diff > TRIAL_PERIOD_DAYS) {
    localStorage.setItem(TRIAL_ACTIVE_KEY, 'false');
    return false;
  }
  return true;
}

// التحقق هل انتهت التجربة المجانية
export function isPremiumTrialEnded() {
  const start = localStorage.getItem(TRIAL_KEY);
  if (!start) return false;
  const startDate = new Date(start);
  const now = new Date();
  const diff = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  return diff > TRIAL_PERIOD_DAYS;
}

// دالة تعطي حالة الاشتراك الحالية (مدفوع أو تجريبي) وعدد الأيام المتبقية
export function getCurrentSubscriptionStatus() {
  // تحقق أولاً من الاشتراك المدفوع
  const sub = subscriptionManager.getCurrentSubscription();
  const now = new Date();
  
  // تحقق من انتهاء التجربة المجانية
  const trialStart = localStorage.getItem(TRIAL_KEY);
  const trialActive = localStorage.getItem(TRIAL_ACTIVE_KEY) === 'true';
  const trialEnded = trialStart && !trialActive;
  
  if (sub && sub.expiryDate) {
    const expiryDate = new Date(sub.expiryDate);
    const diff = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      isPremium: true,
      isTrial: false,
      daysLeft: diff > 0 ? diff : 0,
      expiresAt: expiryDate,
      trialEnded: !!trialEnded,
    };
  }
  
  // للاشتراك مدى الحياة
  if (sub && sub.id === 'lifetime') {
    return {
      isPremium: true,
      isTrial: false,
      daysLeft: 999999, // رقم كبير للدلالة على عدم انتهاء الصلاحية
      expiresAt: null,
      trialEnded: !!trialEnded,
    };
  }
  
  // تحقق من التجربة المجانية
  if (trialStart && trialActive) {
    const startDate = new Date(trialStart);
    const expiresAt = new Date(startDate);
    expiresAt.setDate(startDate.getDate() + TRIAL_PERIOD_DAYS);
    const diff = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // إذا انتهت التجربة، قم بإلغائها
    if (diff <= 0) {
      localStorage.setItem(TRIAL_ACTIVE_KEY, 'false');
      return {
        isPremium: false,
        isTrial: false,
        daysLeft: 0,
        expiresAt: null,
        trialEnded: true,
      };
    }
    
    return {
      isPremium: true,
      isTrial: true,
      daysLeft: diff,
      expiresAt,
      trialEnded: false,
    };
  }
  
  // لا يوجد اشتراك
  return {
    isPremium: false,
    isTrial: false,
    daysLeft: 0,
    expiresAt: null,
    trialEnded: !!trialEnded,
  };
}

// دالة وصول موحدة: اشتراك أو تجربة مجانية
export function hasFeatureAccessWithTrial(featureId: string) {
  const hasSubscription = subscriptionManager.hasFeatureAccess(featureId);
  const trialActive = isPremiumTrialActive();
  const trialEnded = isPremiumTrialEnded();
  return {
    access: hasSubscription || trialActive,
    isTrialActive: trialActive,
    trialEnded: trialEnded && !hasSubscription, // انتهت التجربة ولا يوجد اشتراك
  };
}
