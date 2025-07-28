import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, Key, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/utils/authService';
import { ResetPasswordData, VerificationData } from '@/types/auth';

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
  onResetSuccess: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBackToLogin,
  onResetSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: email, 2: verification, 3: success
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('البريد الإلكتروني غير صحيح');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword({ email });
      
      if (response.success) {
        setSuccessMessage(response.message);
        setCurrentStep(2);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('رمز التحقق مطلوب');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // في التطبيق الحقيقي، يتم التحقق من الرمز وإعادة تعيين كلمة المرور
      const savedCode = localStorage.getItem(`reset_code_${email}`);
      
      if (savedCode === verificationCode.toUpperCase()) {
        // محاكاة إعادة تعيين كلمة المرور
        const newPassword = Math.random().toString(36).substring(2, 10);
        localStorage.setItem(`password_${email}`, newPassword);
        localStorage.removeItem(`reset_code_${email}`);
        
        setSuccessMessage(`تم إعادة تعيين كلمة المرور بنجاح. كلمة المرور الجديدة: ${newPassword}`);
        setCurrentStep(3);
      } else {
        setError('رمز التحقق غير صحيح');
      }
    } catch (error) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Key className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">نسيت كلمة المرور؟</h1>
        <p className="text-blue-100">لا تقلق، سنساعدك في استعادتها</p>
      </div>

      <form onSubmit={handleSendResetCode} className="space-y-6">
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">البريد الإلكتروني</label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className="bg-white/10 border-white/20 text-white placeholder-blue-200 pr-12 h-12 rounded-xl focus:border-orange-400 focus:ring-orange-400"
              placeholder="أدخل بريدك الإلكتروني"
              disabled={isLoading}
            />
          </div>
          <p className="text-blue-200 text-sm">سنرسل لك رمز إعادة التعيين على هذا البريد</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>جاري الإرسال...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <span>إرسال رمز التحقق</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">تحقق من بريدك</h1>
        <p className="text-blue-100">أدخل الرمز المرسل إلى</p>
        <p className="text-purple-300 font-medium">{email}</p>
      </div>

      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-green-200 text-sm text-center mb-6">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">رمز التحقق</label>
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value.toUpperCase());
              if (error) setError('');
            }}
            className="bg-white/10 border-white/20 text-white placeholder-blue-200 h-12 rounded-xl focus:border-blue-400 focus:ring-blue-400 text-center text-lg font-mono tracking-widest"
            placeholder="أدخل الرمز المكون من 6 أحرف"
            maxLength={6}
            disabled={isLoading}
          />
          <p className="text-blue-200 text-sm text-center">تحقق من صندوق الوارد أو الرسائل المهملة</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>جاري التحقق...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <span>تحقق من الرمز</span>
                <Shield className="w-5 h-5" />
              </div>
            )}
          </Button>

          <Button
            type="button"
            onClick={() => setCurrentStep(1)}
            variant="outline"
            className="w-full h-12 border-white/20 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <ArrowLeft className="w-5 h-5" />
              <span>تغيير البريد الإلكتروني</span>
            </div>
          </Button>
        </div>
      </form>

      {/* إعادة إرسال الرمز */}
      <div className="text-center">
        <p className="text-blue-200 text-sm mb-2">لم تستلم الرمز؟</p>
        <button
          type="button"
          onClick={handleSendResetCode}
          className="text-purple-300 hover:text-purple-100 text-sm font-medium transition-colors"
          disabled={isLoading}
        >
          إعادة إرسال الرمز
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">تم بنجاح!</h1>
        <p className="text-blue-100">تم إعادة تعيين كلمة المرور</p>
      </div>

      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-200 text-sm">
          {successMessage}
        </div>
      )}

      <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
        <h4 className="text-blue-100 font-medium mb-2">نصائح أمنية:</h4>
        <ul className="text-blue-200 text-sm space-y-1 text-right">
          <li>• احفظ كلمة المرور الجديدة في مكان آمن</li>
          <li>• استخدم كلمة مرور قوية ومعقدة</li>
          <li>• لا تشارك كلمة المرور مع أي شخص</li>
          <li>• غيّر كلمة المرور بانتظام</li>
        </ul>
      </div>

      <Button
        onClick={onResetSuccess}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        <div className="flex items-center justify-center space-x-2 space-x-reverse">
          <span>تسجيل الدخول الآن</span>
          <ArrowRight className="w-5 h-5" />
        </div>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* بطاقة استعادة كلمة المرور */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* مؤشر التقدم */}
          {currentStep < 3 && (
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-orange-500 text-white' : 'bg-white/20 text-blue-200'
                }`}>
                  1
                </div>
                <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-orange-500' : 'bg-white/20'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-white/20 text-blue-200'
                }`}>
                  2
                </div>
              </div>
            </div>
          )}

          {/* محتوى الخطوات */}
          {currentStep === 1 && renderEmailStep()}
          {currentStep === 2 && renderVerificationStep()}
          {currentStep === 3 && renderSuccessStep()}

          {/* العودة لتسجيل الدخول */}
          {currentStep === 1 && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-blue-200">أو</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={onBackToLogin}
                variant="outline"
                className="w-full h-12 border-white/20 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <ArrowLeft className="w-5 h-5" />
                  <span>العودة لتسجيل الدخول</span>
                </div>
              </Button>
            </>
          )}
        </div>

        {/* معلومات إضافية */}
        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">
            إذا واجهت مشاكل، تواصل مع 
            <span className="text-orange-300 font-medium"> فريق الدعم</span>
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

export default ForgotPasswordScreen;
