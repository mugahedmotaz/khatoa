// خدمة المصادقة والتحقق من الهوية
import { 
  User, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  ResetPasswordData, 
  ChangePasswordData,
  VerificationData,
  UserSubscription 
} from '@/types/auth';

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authToken: string | null = null;

  private constructor() {
    this.loadUserFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // تحميل بيانات المستخدم من التخزين المحلي
  private loadUserFromStorage(): void {
    try {
      const userData = localStorage.getItem('khatoa_user');
      const token = localStorage.getItem('khatoa_token');
      
      if (userData && token) {
        this.currentUser = JSON.parse(userData);
        this.authToken = token;
        
        // تحديث آخر وقت دخول
        if (this.currentUser) {
          this.currentUser.lastLoginAt = new Date();
          this.saveUserToStorage();
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات المستخدم:', error);
      this.clearUserData();
    }
  }

  // حفظ بيانات المستخدم في التخزين المحلي
  private saveUserToStorage(): void {
    if (this.currentUser && this.authToken) {
      localStorage.setItem('khatoa_user', JSON.stringify(this.currentUser));
      localStorage.setItem('khatoa_token', this.authToken);
    }
  }

  // مسح بيانات المستخدم
  private clearUserData(): void {
    this.currentUser = null;
    this.authToken = null;
    localStorage.removeItem('khatoa_user');
    localStorage.removeItem('khatoa_token');
    localStorage.removeItem('khatoa_remember_me');
  }

  // تسجيل الدخول
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // محاكاة طلب API
      await this.simulateApiCall();

      // التحقق من البيانات المحفوظة محلياً
      const savedUsers = this.getSavedUsers();
      const user = savedUsers.find(u => u.email === credentials.email);

      if (!user) {
        return {
          success: false,
          message: 'البريد الإلكتروني غير مسجل'
        };
      }

      // في التطبيق الحقيقي، يجب التحقق من كلمة المرور بشكل آمن
      const savedPassword = localStorage.getItem(`password_${user.email}`);
      if (savedPassword !== credentials.password) {
        return {
          success: false,
          message: 'كلمة المرور غير صحيحة'
        };
      }

      // تحديث بيانات المستخدم
      user.lastLoginAt = new Date();
      this.currentUser = user;
      this.authToken = this.generateToken();

      // حفظ البيانات
      this.saveUserToStorage();
      
      if (credentials.rememberMe) {
        localStorage.setItem('khatoa_remember_me', 'true');
      }

      return {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: this.currentUser,
        token: this.authToken
      };

    } catch (error) {
      return {
        success: false,
        message: 'حدث خطأ أثناء تسجيل الدخول'
      };
    }
  }

  // تسجيل حساب جديد
  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // التحقق من صحة البيانات
      const validation = this.validateRegistrationData(data);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.message
        };
      }

      // محاكاة طلب API
      await this.simulateApiCall();

      // التحقق من عدم وجود المستخدم مسبقاً
      const savedUsers = this.getSavedUsers();
      const existingUser = savedUsers.find(u => u.email === data.email);

      if (existingUser) {
        return {
          success: false,
          message: 'البريد الإلكتروني مسجل مسبقاً'
        };
      }

      // إنشاء مستخدم جديد
      const newUser: User = {
        id: this.generateUserId(),
        email: data.email,
        name: data.name,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isEmailVerified: false,
        isPhoneVerified: false,
        selectedHabits: [],
        preferences: {
          language: 'ar',
          theme: 'auto',
          notifications: {
            email: true,
            push: true,
            habits: true,
            achievements: true,
            reminders: true
          },
          privacy: {
            profileVisibility: 'private',
            showProgress: true,
            allowFriendRequests: true
          }
        },
        subscription: {
          planId: null,
          planName: null,
          isActive: false,
          startDate: null,
          endDate: null,
          features: [],
          trialUsed: false,
          trialEndDate: null
        }
      };

      // حفظ المستخدم الجديد
      savedUsers.push(newUser);
      localStorage.setItem('khatoa_users', JSON.stringify(savedUsers));
      localStorage.setItem(`password_${data.email}`, data.password);

      // تسجيل الدخول تلقائياً
      this.currentUser = newUser;
      this.authToken = this.generateToken();
      this.saveUserToStorage();

      return {
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: this.currentUser,
        token: this.authToken
      };

    } catch (error) {
      return {
        success: false,
        message: 'حدث خطأ أثناء إنشاء الحساب'
      };
    }
  }

  // تسجيل الخروج
  public async logout(): Promise<void> {
    try {
      // محاكاة طلب API
      await this.simulateApiCall(500);
      
      // مسح البيانات المحلية
      this.clearUserData();
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      // مسح البيانات حتى لو فشل الطلب
      this.clearUserData();
    }
  }

  // إعادة تعيين كلمة المرور
  public async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    try {
      await this.simulateApiCall();

      const savedUsers = this.getSavedUsers();
      const user = savedUsers.find(u => u.email === data.email);

      if (!user) {
        return {
          success: false,
          message: 'البريد الإلكتروني غير مسجل'
        };
      }

      // في التطبيق الحقيقي، يتم إرسال رمز التحقق عبر البريد الإلكتروني
      const resetCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem(`reset_code_${data.email}`, resetCode);
      
      // محاكاة إرسال البريد الإلكتروني
      console.log(`رمز إعادة التعيين: ${resetCode}`);

      return {
        success: true,
        message: 'تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني'
      };

    } catch (error) {
      return {
        success: false,
        message: 'حدث خطأ أثناء إرسال رمز إعادة التعيين'
      };
    }
  }

  // تغيير كلمة المرور
  public async changePassword(data: ChangePasswordData): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          message: 'يجب تسجيل الدخول أولاً'
        };
      }

      await this.simulateApiCall();

      // التحقق من كلمة المرور الحالية
      const savedPassword = localStorage.getItem(`password_${this.currentUser.email}`);
      if (savedPassword !== data.currentPassword) {
        return {
          success: false,
          message: 'كلمة المرور الحالية غير صحيحة'
        };
      }

      if (data.newPassword !== data.confirmPassword) {
        return {
          success: false,
          message: 'كلمة المرور الجديدة غير متطابقة'
        };
      }

      // حفظ كلمة المرور الجديدة
      localStorage.setItem(`password_${this.currentUser.email}`, data.newPassword);

      return {
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح'
      };

    } catch (error) {
      return {
        success: false,
        message: 'حدث خطأ أثناء تغيير كلمة المرور'
      };
    }
  }

  // التحقق من البريد الإلكتروني
  public async verifyEmail(data: VerificationData): Promise<AuthResponse> {
    try {
      await this.simulateApiCall();

      // في التطبيق الحقيقي، يتم التحقق من الرمز مع الخادم
      const savedCode = localStorage.getItem(`verification_code_${data.email}`);
      
      if (savedCode !== data.code) {
        return {
          success: false,
          message: 'رمز التحقق غير صحيح'
        };
      }

      // تحديث حالة التحقق
      if (this.currentUser && this.currentUser.email === data.email) {
        this.currentUser.isEmailVerified = true;
        this.saveUserToStorage();
      }

      // مسح رمز التحقق
      localStorage.removeItem(`verification_code_${data.email}`);

      return {
        success: true,
        message: 'تم التحقق من البريد الإلكتروني بنجاح'
      };

    } catch (error) {
      return {
        success: false,
        message: 'حدث خطأ أثناء التحقق من البريد الإلكتروني'
      };
    }
  }

  // إرسال رمز التحقق
  public async sendVerificationCode(email: string): Promise<AuthResponse> {
    try {
      await this.simulateApiCall();

      // إنشاء رمز تحقق
      const verificationCode = Math.random().toString().substring(2, 8);
      localStorage.setItem(`verification_code_${email}`, verificationCode);
      
      // محاكاة إرسال البريد الإلكتروني
      console.log(`رمز التحقق: ${verificationCode}`);

      return {
        success: true,
        message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
      };

    } catch (error) {
      return {
        success: false,
        message: 'حدث خطأ أثناء إرسال رمز التحقق'
      };
    }
  }

  // الحصول على المستخدم الحالي
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // التحقق من حالة المصادقة
  public isAuthenticated(): boolean {
    return this.currentUser !== null && this.authToken !== null;
  }

  // تحديث بيانات المستخدم
  public async updateUser(userData: Partial<User>): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          message: 'يجب تسجيل الدخول أولاً'
        };
      }

      await this.simulateApiCall();

      // تحديث البيانات
      this.currentUser = { ...this.currentUser, ...userData };
      this.saveUserToStorage();

      // تحديث في قائمة المستخدمين المحفوظة
      const savedUsers = this.getSavedUsers();
      const userIndex = savedUsers.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex !== -1) {
        savedUsers[userIndex] = this.currentUser;
        localStorage.setItem('khatoa_users', JSON.stringify(savedUsers));
      }

      return {
        success: true,
        message: 'تم تحديث البيانات بنجاح',
        user: this.currentUser
      };

    } catch (error) {
      return {
        success: false,
        message: 'حدث خطأ أثناء تحديث البيانات'
      };
    }
  }

  // دوال مساعدة
  private getSavedUsers(): User[] {
    try {
      const users = localStorage.getItem('khatoa_users');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  private generateToken(): string {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }

  private async simulateApiCall(delay: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private validateRegistrationData(data: RegisterData): { isValid: boolean; message: string } {
    if (!data.name.trim()) {
      return { isValid: false, message: 'الاسم مطلوب' };
    }

    if (!data.email.trim()) {
      return { isValid: false, message: 'البريد الإلكتروني مطلوب' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { isValid: false, message: 'البريد الإلكتروني غير صحيح' };
    }

    if (data.password.length < 6) {
      return { isValid: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }

    if (data.password !== data.confirmPassword) {
      return { isValid: false, message: 'كلمة المرور غير متطابقة' };
    }

    if (!data.agreeToTerms) {
      return { isValid: false, message: 'يجب الموافقة على الشروط والأحكام' };
    }

    return { isValid: true, message: '' };
  }
}

// تصدير instance واحد
export const authService = AuthService.getInstance();
