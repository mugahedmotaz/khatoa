import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, ArrowRight, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/utils/authService';
import { RegisterData } from '@/types/auth';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onSwitchToLogin
}) => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: undefined,
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: keyof RegisterData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('الاسم مطلوب');
      return false;
    }
    if (!formData.email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('البريد الإلكتروني غير صحيح');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('يجب الموافقة على الشروط والأحكام');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      
      if (response.success) {
        onRegisterSuccess();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      {/* حقل الاسم */}
      <div className="space-y-2">
        <label className="text-sm font-medium">الاسم الكامل</label>
        <div className="relative">
          <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="pr-10"
            placeholder="أدخل اسمك الكامل"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* حقل البريد الإلكتروني */}
      <div className="space-y-2">
        <label className="text-sm font-medium">البريد الإلكتروني</label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pr-10"
            placeholder="أدخل بريدك الإلكتروني"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* حقل رقم الهاتف (اختياري) */}
      <div className="space-y-2">
        <label className="text-sm font-medium">رقم الهاتف (اختياري)</label>
        <div className="relative">
          <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="pr-10"
            placeholder="أدخل رقم هاتفك"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* معلومات شخصية إضافية */}
      <div className="grid grid-cols-2 gap-4">
        {/* تاريخ الميلاد */}
        <div className="space-y-2">
          <label className="text-sm font-medium">تاريخ الميلاد</label>
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="pr-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* الجنس */}
        <div className="space-y-2">
          <label className="text-sm font-medium">الجنس</label>
          <select
            value={formData.gender || ''}
            onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            <option value="">اختر الجنس</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      {/* حقل كلمة المرور */}
      <div className="space-y-2">
        <label className="text-sm font-medium">كلمة المرور</label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pr-10 pl-10"
            placeholder="أدخل كلمة المرور"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">يجب أن تكون 6 أحرف على الأقل</p>
      </div>

      {/* تأكيد كلمة المرور */}
      <div className="space-y-2">
        <label className="text-sm font-medium">تأكيد كلمة المرور</label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="pr-10 pl-10"
            placeholder="أعد إدخال كلمة المرور"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* الموافقة على الشروط */}
      <div className="space-y-4">
        <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            className="rounded mt-0.5"
            disabled={isLoading}
          />
          <div className="text-sm leading-relaxed">
            أوافق على 
            <Button variant="link" className="p-0 h-auto text-primary font-medium"> الشروط والأحكام </Button>
            و 
            <Button variant="link" className="p-0 h-auto text-primary font-medium"> سياسة الخصوصية </Button>
            الخاصة بتطبيق خطوة
          </div>
        </label>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium mb-2">مميزات الحساب:</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-center space-x-2 space-x-reverse">
              <Check className="w-4 h-4 text-green-600" />
              <span>تتبع العادات والأهداف الشخصية</span>
            </li>
            <li className="flex items-center space-x-2 space-x-reverse">
              <Check className="w-4 h-4 text-green-600" />
              <span>إحصائيات وتقارير مفصلة</span>
            </li>
            <li className="flex items-center space-x-2 space-x-reverse">
              <Check className="w-4 h-4 text-green-600" />
              <span>تذكيرات ذكية وإشعارات</span>
            </li>
            <li className="flex items-center space-x-2 space-x-reverse">
              <Check className="w-4 h-4 text-green-600" />
              <span>مزامنة البيانات عبر الأجهزة</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* الهيدر */}
      <div className="gradient-primary text-primary-foreground p-6 rounded-b-3xl">
        <div className="text-center">
          <div className="text-4xl mb-2">👥</div>
          <h1 className="text-2xl font-bold mb-2">إنشاء حساب جديد</h1>
          <p className="opacity-90">انضم إلينا وابدأ رحلتك</p>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* مؤشر التقدم */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-primary' : 'bg-muted'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 ? renderStep1() : renderStep2()}

              {/* رسالة الخطأ */}
              {error && (
                <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              {/* أزرار التنقل */}
              <div className="mt-6 space-y-4">
                {currentStep === 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full"
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <span>التالي</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2 space-x-reverse">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>جاري إنشاء الحساب...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2 space-x-reverse">
                          <span>إنشاء الحساب</span>
                          <UserPlus className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      السابق
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* تسجيل الدخول */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">لديك حساب بالفعل؟</p>
              <Button
                type="button"
                onClick={onSwitchToLogin}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                تسجيل الدخول
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterScreen;
