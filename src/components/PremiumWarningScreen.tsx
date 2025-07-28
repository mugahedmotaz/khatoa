import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Crown, Star, Zap, Shield, Sparkles } from 'lucide-react';

interface PremiumWarningScreenProps {
  featureName: string;
  featureDescription: string;
  featureIcon: React.ReactNode;
  onBack: () => void;
  onUpgrade: () => void;
  onTrial?: () => void; // زر التجربة المجانية
  trialEnded?: boolean; // هل انتهت الفترة التجريبية
}

const PremiumWarningScreen = ({ 
  featureName, 
  featureDescription, 
  featureIcon, 
  onBack, 
  onUpgrade,
  onTrial,
  trialEnded
}: PremiumWarningScreenProps) => {
  const benefits = [
    { icon: <Star className="w-5 h-5" />, text: "وصول كامل لجميع الميزات المتقدمة" },
    { icon: <Zap className="w-5 h-5" />, text: "تحليلات ذكية وتقارير مفصلة" },
    { icon: <Shield className="w-5 h-5" />, text: "نسخ احتياطي آمن في السحابة" },
    { icon: <Sparkles className="w-5 h-5" />, text: "ثيمات حصرية ومساعد ذكي" }
  ];

  return (
    <div className="mobile-container bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white p-6 rounded-b-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/10 rounded-b-3xl"></div>
        <div className="relative z-10">
          <Button 
            onClick={onBack} 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
              <Crown className="w-10 h-10 text-yellow-300" />
            </div>
            <h1 className="text-2xl font-bold">ميزة متقدمة</h1>
            <p className="text-white/90 text-lg">هذه الميزة متاحة للمشتركين فقط</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 -mt-8 relative z-20">
        {/* Feature Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-3xl">{featureIcon}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{featureName}</h2>
                <p className="text-gray-600 leading-relaxed">{featureDescription}</p>
              </div>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-bold">
                <Crown className="w-4 h-4 mr-2" />
                ميزة متقدمة
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              ماذا ستحصل عليه مع النسخة المتقدمة؟
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 space-x-reverse p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                    {benefit.icon}
                  </div>
                  <p className="text-gray-700 font-medium flex-1">{benefit.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Preview */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div>
                <p className="text-white/90 text-sm">ابدأ من</p>
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <span className="text-4xl font-bold">29</span>
                  <div className="text-right">
                    <p className="text-xl">ريال</p>
                    <p className="text-sm text-white/80">شهرياً</p>
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-sm">يمكنك الإلغاء في أي وقت</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onUpgrade}
            className="w-full h-14 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 text-white font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <Crown className="w-6 h-6 mr-3" />
            ترقية للنسخة المتقدمة
          </Button>

          {/* زر التجربة المجانية */}
          {onTrial && !trialEnded && (
            <Button
              onClick={onTrial}
              variant="outline"
              className="w-full h-12 border-2 border-blue-400 text-blue-700 font-bold bg-white/80 hover:bg-blue-50 mt-1"
            >
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              جرّب مجاناً لمدة 3 أيام
            </Button>
          )}
          {/* رسالة انتهاء التجربة */}
          {trialEnded && (
            <div className="w-full text-center text-red-600 font-bold bg-red-50 border border-red-200 rounded-xl py-2 mt-2">
              انتهت فترة التجربة المجانية
            </div>
          )}

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
          >
            العودة للخلف
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="text-center space-y-2 pt-4">
          <div className="flex justify-center space-x-4 space-x-reverse text-sm text-gray-500">
            <div className="flex items-center space-x-1 space-x-reverse">
              <Shield className="w-4 h-4" />
              <span>آمن 100%</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <Star className="w-4 h-4" />
              <span>ضمان الاسترداد</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            أكثر من 10,000 مستخدم يثق بنا
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumWarningScreen;
