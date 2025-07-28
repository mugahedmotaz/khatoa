import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/utils/authService';
import { LoginCredentials } from '@/types/auth';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onSwitchToRegister,
  onForgotPassword
}) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('جميع الحقول مطلوبة');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      
      if (response.success) {
        onLoginSuccess();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* الهيدر */}
      <div className="gradient-primary text-primary-foreground p-6 rounded-b-3xl">
        <div className="text-center">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-2xl font-bold mb-2">مرحباً بك</h1>
          <p className="opacity-90">سجل دخولك للمتابعة</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <User className="w-5 h-5 ml-2" />
              تسجيل الدخول
            </CardTitle>
          </CardHeader>
          <CardContent>

            <form onSubmit={handleSubmit} className="space-y-4">
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
              </div>

              {/* خيارات إضافية */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="rounded"
                    disabled={isLoading}
                  />
                  <span className="text-sm">تذكرني</span>
                </label>
                
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={onForgotPassword}
                  className="p-0 h-auto text-primary"
                  disabled={isLoading}
                >
                  نسيت كلمة المرور؟
                </Button>
              </div>

              {/* رسالة الخطأ */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              {/* زر تسجيل الدخول */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري تسجيل الدخول...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <span>تسجيل الدخول</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

          </CardContent>
        </Card>

        {/* تسجيل حساب جديد */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">ليس لديك حساب؟</p>
              <Button
                type="button"
                onClick={onSwitchToRegister}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                إنشاء حساب جديد
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* تسجيل دخول سريع للتجربة */}
        <Card className="shadow-card border-primary/20">
          <CardContent className="pt-6">
            <p className="text-primary text-sm text-center mb-3 font-medium">للتجربة السريعة:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted p-2 rounded-lg">
                <p className="text-muted-foreground font-medium">البريد:</p>
                <p className="text-foreground">demo@khatoa.com</p>
              </div>
              <div className="bg-muted p-2 rounded-lg">
                <p className="text-muted-foreground font-medium">كلمة المرور:</p>
                <p className="text-foreground">123456</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
