import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, ArrowRight, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="space-y-6">
      {/* حقل الاسم */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">الاسم الكامل</label>
        <div className="relative">
          <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-blue-200 pr-12 h-12 rounded-xl focus:border-purple-400 focus:ring-purple-400"
            placeholder="أدخل اسمك الكامل"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* حقل البريد الإلكتروني */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">البريد الإلكتروني</label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-blue-200 pr-12 h-12 rounded-xl focus:border-purple-400 focus:ring-purple-400"
            placeholder="أدخل بريدك الإلكتروني"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* حقل رقم الهاتف (اختياري) */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">رقم الهاتف (اختياري)</label>
        <div className="relative">
          <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-blue-200 pr-12 h-12 rounded-xl focus:border-purple-400 focus:ring-purple-400"
            placeholder="أدخل رقم هاتفك"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* معلومات شخصية إضافية */}
      <div className="grid grid-cols-2 gap-4">
        {/* تاريخ الميلاد */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">تاريخ الميلاد</label>
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="bg-white/10 border-white/20 text-white pr-12 h-12 rounded-xl focus:border-purple-400 focus:ring-purple-400"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* الجنس */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">الجنس</label>
          <select
            value={formData.gender || ''}
            onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
            className="w-full h-12 bg-white/10 border border-white/20 text-white rounded-xl focus:border-purple-400 focus:ring-purple-400 px-3"
            disabled={isLoading}
          >
            <option value="" className="bg-gray-800">اختر الجنس</option>
            <option value="male" className="bg-gray-800">ذكر</option>
            <option value="female" className="bg-gray-800">أنثى</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* حقل كلمة المرور */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">كلمة المرور</label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
          <Input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-blue-200 pr-12 pl-12 h-12 rounded-xl focus:border-purple-400 focus:ring-purple-400"
            placeholder="أدخل كلمة المرور"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-blue-200 text-xs">يجب أن تكون 6 أحرف على الأقل</p>
      </div>

      {/* تأكيد كلمة المرور */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">تأكيد كلمة المرور</label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-blue-200 pr-12 pl-12 h-12 rounded-xl focus:border-purple-400 focus:ring-purple-400"
            placeholder="أعد إدخال كلمة المرور"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* الموافقة على الشروط */}
      <div className="space-y-4">
        <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              className="w-5 h-5 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 cursor-pointer"
              disabled={isLoading}
            />
            {formData.agreeToTerms && (
              <Check className="absolute top-0.5 left-0.5 w-3 h-3 text-purple-400 pointer-events-none" />
            )}
          </div>
          <div className="text-blue-100 text-sm leading-relaxed">
            أوافق على 
            <span className="text-purple-300 font-medium hover:underline cursor-pointer"> الشروط والأحكام </span>
            و 
            <span className="text-purple-300 font-medium hover:underline cursor-pointer"> سياسة الخصوصية </span>
            الخاصة بتطبيق خطوة
          </div>
        </label>

        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
          <h4 className="text-blue-100 font-medium mb-2">مميزات الحساب:</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li className="flex items-center space-x-2 space-x-reverse">
              <Check className="w-4 h-4 text-green-400" />
              <span>تتبع العادات والأهداف الشخصية</span>
            </li>
            <li className="flex items-center space-x-2 space-x-reverse">
              <Check className="w-4 h-4 text-green-400" />
              <span>إحصائيات وتقارير مفصلة</span>
            </li>
            <li className="flex items-center space-x-2 space-x-reverse">
              <Check className="w-4 h-4 text-green-400" />
              <span>تذكيرات ذكية وإشعارات</span>
            </li>
            <li className="flex items-center space-x-2 space-x-reverse">
              <Check className="w-4 h-4 text-green-400" />
              <span>مزامنة البيانات عبر الأجهزة</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* بطاقة التسجيل */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* الشعار والعنوان */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">إنشاء حساب جديد</h1>
            <p className="text-blue-100">انضم إلينا وابدأ رحلتك</p>
          </div>

          {/* مؤشر التقدم */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                currentStep >= 1 ? 'bg-purple-500 text-white' : 'bg-white/20 text-blue-200'
              }`}>
                1
              </div>
              <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                currentStep >= 2 ? 'bg-purple-500' : 'bg-white/20'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                currentStep >= 2 ? 'bg-purple-500 text-white' : 'bg-white/20 text-blue-200'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* نموذج التسجيل */}
          <form onSubmit={handleSubmit}>
            {currentStep === 1 ? renderStep1() : renderStep2()}

            {/* رسالة الخطأ */}
            {error && (
              <div className="mt-6 bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            {/* أزرار التنقل */}
            <div className="mt-8 space-y-4">
              {currentStep === 1 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <span>التالي</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2 space-x-reverse">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>جاري إنشاء الحساب...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2 space-x-reverse">
                        <span>إنشاء الحساب</span>
                        <UserPlus className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    variant="outline"
                    className="w-full h-12 border-white/20 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    السابق
                  </Button>
                </div>
              )}
            </div>
          </form>

          {/* خط فاصل */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-blue-200">أو</span>
            </div>
          </div>

          {/* تسجيل الدخول */}
          <div className="text-center">
            <p className="text-blue-100 mb-4">لديك حساب بالفعل؟</p>
            <Button
              type="button"
              onClick={onSwitchToLogin}
              variant="outline"
              className="w-full h-12 border-white/20 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
              disabled={isLoading}
            >
              تسجيل الدخول
            </Button>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">
            بإنشاء حساب، أنت توافق على 
            <span className="text-purple-300 font-medium"> الشروط والأحكام </span>
            و 
            <span className="text-purple-300 font-medium"> سياسة الخصوصية</span>
          </p>
        </div>
      </div>

      {/* أنماط CSS إضافية */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RegisterScreen;
