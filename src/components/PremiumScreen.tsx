import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Crown, Star, Zap, Shield, Users, Brain, Heart, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PremiumScreenProps {
  onBack: () => void;
  onPurchase: (planId: string) => void;
  currentPlan?: string;
}

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'analytics' | 'social' | 'ai' | 'spiritual' | 'customization';
  isPremium: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  originalPrice?: number;
  features: string[];
  badge?: string;
  color: string;
  popular?: boolean;
}

const PremiumScreen = ({ onBack, onPurchase, currentPlan }: PremiumScreenProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [showFeatures, setShowFeatures] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: 'الاشتراك الشهري',
      price: 29,
      duration: 'شهر',
      features: ['جميع الميزات المتقدمة', 'تحليلات ذكية', 'ميزات اجتماعية', 'دعم فوري'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'yearly',
      name: 'الاشتراك السنوي',
      price: 199,
      originalPrice: 348,
      duration: 'سنة',
      features: ['جميع الميزات المتقدمة', 'تحليلات ذكية', 'ميزات اجتماعية', 'دعم أولوية', 'نسخ احتياطي لا محدود'],
      badge: 'وفر 43%',
      color: 'from-purple-500 to-pink-500',
      popular: true,
    },
    {
      id: 'lifetime',
      name: 'الاشتراك مدى الحياة',
      price: 499,
      originalPrice: 999,
      duration: 'مدى الحياة',
      features: ['جميع الميزات الحالية والمستقبلية', 'أولوية في الميزات الجديدة', 'دعم VIP', 'تخصيص كامل'],
      badge: 'وفر 50%',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const premiumFeatures: PremiumFeature[] = [
    {
      id: 'analytics',
      name: 'تحليلات ذكية',
      description: 'تقارير مفصلة وإحصائيات متقدمة لتتبع تقدمك',
      icon: Brain,
      category: 'analytics',
      isPremium: true,
    },
    {
      id: 'social',
      name: 'ميزات اجتماعية',
      description: 'تحديات جماعية ولوحة المتصدرين',
      icon: Users,
      category: 'social',
      isPremium: true,
    },
    {
      id: 'ai_assistant',
      name: 'المساعد الذكي',
      description: 'نصائح مخصصة واقتراحات ذكية بالذكاء الاصطناعي',
      icon: Zap,
      category: 'ai',
      isPremium: true,
    },
    {
      id: 'spiritual',
      name: 'الميزات الروحانية',
      description: 'تذكيرات الصلاة وعداد الأذكار وقراءة القرآن',
      icon: Heart,
      category: 'spiritual',
      isPremium: true,
    },
    {
      id: 'themes',
      name: 'ثيمات متقدمة',
      description: 'خلفيات متحركة وثيمات مخصصة',
      icon: Star,
      category: 'customization',
      isPremium: true,
    },
    {
      id: 'backup',
      name: 'نسخ احتياطي آمن',
      description: 'حفظ بياناتك في السحابة مع تشفير متقدم',
      icon: Shield,
      category: 'analytics',
      isPremium: true,
    },
  ];

  const handlePurchase = (planId: string) => {
    // محاكاة عملية الدفع
    toast({
      title: "جاري معالجة الدفع... 💳",
      description: "يرجى الانتظار لحظات",
    });

    setTimeout(() => {
      onPurchase(planId);
      toast({
        title: "تم الاشتراك بنجاح! 🎉",
        description: "مرحباً بك في النسخة المتقدمة من خطوة",
      });
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      analytics: 'text-blue-500',
      social: 'text-green-500',
      ai: 'text-purple-500',
      spiritual: 'text-pink-500',
      customization: 'text-yellow-500',
    };
    return colors[category as keyof typeof colors] || 'text-gray-500';
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* الهيدر */}
      <div className="gradient-motivation text-motivation-foreground p-6 rounded-b-3xl">
        <div className="flex items-center space-x-4 space-x-reverse mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-motivation-foreground hover:bg-motivation-foreground/10"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">النسخة المتقدمة</h1>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">👑</div>
          <p className="opacity-90">اكتشف إمكانياتك الكاملة مع الميزات المتقدمة</p>
        </div>
      </div>

      <div className="p-6 space-y-6 mt-12">
        {/* تبديل العرض */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFeatures(false)}
            variant={!showFeatures ? "default" : "outline"}
            className="flex-1"
          >
            خطط الاشتراك
          </Button>
          <Button
            onClick={() => setShowFeatures(true)}
            variant={showFeatures ? "default" : "outline"}
            className="flex-1"
          >
            الميزات المتقدمة
          </Button>
        </div>

        {!showFeatures ? (
          /* خطط الاشتراك */
          <div className="space-y-4">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`shadow-card cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id ? 'ring-2 ring-motivation scale-105' : ''
                } ${plan.popular ? 'border-2 border-motivation' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardHeader className="relative">
                  {plan.badge && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white">
                      {plan.badge}
                    </Badge>
                  )}
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      الأكثر شعبية
                    </Badge>
                  )}
                  
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Crown className={`w-6 h-6 ml-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`} />
                      <span>{plan.name}</span>
                    </div>
                    {selectedPlan === plan.id && <Check className="w-5 h-5 text-green-500" />}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {plan.originalPrice} ر.س
                        </span>
                      )}
                      <span className={`text-3xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                        {plan.price} ر.س
                      </span>
                    </div>
                    <span className="text-gray-600">/ {plan.duration}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 ml-2" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* زر الاشتراك */}
            <Button
              onClick={() => handlePurchase(selectedPlan)}
              disabled={currentPlan === selectedPlan}
              className="w-full h-14 text-lg gradient-motivation text-motivation-foreground shadow-button"
            >
              {currentPlan === selectedPlan ? (
                <>
                  <Crown className="w-5 h-5 ml-2" />
                  مشترك حالياً
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 ml-2" />
                  اشترك الآن
                </>
              )}
            </Button>
          </div>
        ) : (
          /* الميزات المتقدمة */
          <div className="space-y-4">
            {premiumFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className={`p-3 rounded-full bg-gray-100 ${getCategoryColor(feature.category)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{feature.name}</h3>
                          {feature.isPremium && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                              متقدم
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* معلومات إضافية */}
        <Card className="shadow-card bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">ضمان استرداد الأموال</h3>
            <p className="text-sm text-gray-600">
              إذا لم تكن راضياً عن الخدمة، يمكنك استرداد أموالك خلال 30 يوماً
            </p>
          </CardContent>
        </Card>

        {/* زر العودة */}
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-12"
        >
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
};

export default PremiumScreen;
