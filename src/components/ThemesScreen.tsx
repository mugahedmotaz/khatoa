import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Palette, Check, Crown, Lock, Star, Sparkles, Moon, Sun } from 'lucide-react';
import { hasFeatureAccessWithTrial, activatePremiumTrial } from '@/utils/subscriptionManager';
import PremiumWarningScreen from './PremiumWarningScreen';

interface ThemesScreenProps {
  onBack: () => void;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  isPremium: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  category: 'basic' | 'nature' | 'spiritual' | 'modern' | 'animated';
}

const ThemesScreen = ({ onBack }: ThemesScreenProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('default');
  const [currentCategory, setCurrentCategory] = useState<string>('all');

  const { access: hasAccess, isTrialActive, trialEnded } = hasFeatureAccessWithTrial('themes');

  const themes: Theme[] = [
    {
      id: 'default',
      name: 'الافتراضي',
      description: 'التصميم الأساسي للتطبيق',
      preview: '🎨',
      isPremium: false,
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981',
        background: '#F8FAFC'
      },
      category: 'basic'
    },
    {
      id: 'nature_green',
      name: 'الطبيعة الخضراء',
      description: 'ألوان مستوحاة من الطبيعة',
      preview: '🌿',
      isPremium: true,
      colors: {
        primary: '#059669',
        secondary: '#34D399',
        accent: '#10B981',
        background: '#ECFDF5'
      },
      category: 'nature'
    },
    {
      id: 'ocean_blue',
      name: 'المحيط الأزرق',
      description: 'هدوء المحيط وصفاء السماء',
      preview: '🌊',
      isPremium: true,
      colors: {
        primary: '#0EA5E9',
        secondary: '#38BDF8',
        accent: '#06B6D4',
        background: '#F0F9FF'
      },
      category: 'nature'
    },
    {
      id: 'sunset_orange',
      name: 'غروب الشمس',
      description: 'دفء الغروب وجمال الألوان',
      preview: '🌅',
      isPremium: true,
      colors: {
        primary: '#EA580C',
        secondary: '#FB923C',
        accent: '#F59E0B',
        background: '#FFF7ED'
      },
      category: 'nature'
    },
    {
      id: 'spiritual_gold',
      name: 'الذهبي الروحاني',
      description: 'ألوان تبعث على الهدوء والتأمل',
      preview: '🕌',
      isPremium: true,
      colors: {
        primary: '#D97706',
        secondary: '#FBBF24',
        accent: '#92400E',
        background: '#FFFBEB'
      },
      category: 'spiritual'
    },
    {
      id: 'night_mode',
      name: 'الوضع الليلي',
      description: 'مريح للعينين في الإضاءة المنخفضة',
      preview: '🌙',
      isPremium: true,
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#A855F7',
        background: '#0F172A'
      },
      category: 'modern'
    },
    {
      id: 'royal_purple',
      name: 'البنفسجي الملكي',
      description: 'أناقة وفخامة في التصميم',
      preview: '👑',
      isPremium: true,
      colors: {
        primary: '#7C3AED',
        secondary: '#A855F7',
        accent: '#C084FC',
        background: '#FAF5FF'
      },
      category: 'modern'
    },
    {
      id: 'animated_gradient',
      name: 'التدرج المتحرك',
      description: 'خلفيات متحركة وتأثيرات بصرية',
      preview: '✨',
      isPremium: true,
      colors: {
        primary: '#EC4899',
        secondary: '#8B5CF6',
        accent: '#06B6D4',
        background: '#FEFCE8'
      },
      category: 'animated'
    }
  ];

  const categories = [
    { id: 'all', name: 'الكل', icon: '🎨' },
    { id: 'basic', name: 'أساسي', icon: '⚪' },
    { id: 'nature', name: 'طبيعة', icon: '🌿' },
    { id: 'spiritual', name: 'روحاني', icon: '🕌' },
    { id: 'modern', name: 'عصري', icon: '💎' },
    { id: 'animated', name: 'متحرك', icon: '✨' }
  ];

  useEffect(() => {
    // تحميل الثيم المحفوظ
    const savedTheme = localStorage.getItem('selected_theme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    if (theme.isPremium && !hasAccess) {
      // عرض رسالة ترقية
      return;
    }

    setSelectedTheme(themeId);
    localStorage.setItem('selected_theme', themeId);

    // تطبيق الألوان على CSS variables (يمكن تطويرها لاحقاً)
    document.documentElement.style.setProperty('--primary-color', theme.colors.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.colors.secondary);
    document.documentElement.style.setProperty('--accent-color', theme.colors.accent);
    document.documentElement.style.setProperty('--background-color', theme.colors.background);
  };

  const filteredThemes = currentCategory === 'all' 
    ? themes 
    : themes.filter(theme => theme.category === currentCategory);

  if (!hasAccess) {
    return (
      <PremiumWarningScreen
        featureName="ثيمات متقدمة"
        featureDescription="مجموعة من الثيمات الحصرية والتدرجات المتحركة متاحة فقط للمشتركين."
        featureIcon={<Palette className="w-8 h-8 text-purple-500" />}
        onBack={onBack}
        onUpgrade={() => { window.location.reload(); }}
        onTrial={() => {
          activatePremiumTrial();
          window.location.reload();
        }}
        trialEnded={trialEnded}
      />
    );
  }

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
          <h1 className="text-2xl font-bold">الثيمات المتقدمة</h1>
        </div>

        <div className="text-center">
          <div className="text-4xl mb-2">🎨</div>
          <p className="text-motivation-foreground/90">
            اختر الثيم المفضل لديك
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* فئات الثيمات */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex space-x-2 space-x-reverse overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setCurrentCategory(category.id)}
                  variant={currentCategory === category.id ? "default" : "outline"}
                  className={`flex-shrink-0 ${
                    currentCategory === category.id 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                      : ''
                  }`}
                >
                  <span className="text-lg ml-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* الثيم الحالي */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-green-600 ml-2" />
                <h3 className="text-xl font-bold text-gray-800">الثيم الحالي</h3>
              </div>
              
              <div className="space-y-2">
                <div className="text-4xl">
                  {themes.find(t => t.id === selectedTheme)?.preview}
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {themes.find(t => t.id === selectedTheme)?.name}
                </div>
                <div className="text-sm text-gray-600">
                  {themes.find(t => t.id === selectedTheme)?.description}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* شبكة الثيمات */}
        <div className="grid grid-cols-2 gap-4">
          {filteredThemes.map((theme) => (
            <Card 
              key={theme.id} 
              className={`shadow-card cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                selectedTheme === theme.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => applyTheme(theme.id)}
            >
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  {/* معاينة الثيم */}
                  <div 
                    className="w-full h-20 rounded-lg flex items-center justify-center text-3xl relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                    }}
                  >
                    <span className="text-white drop-shadow-lg">{theme.preview}</span>
                    
                    {/* شارة Premium */}
                    {theme.isPremium && (
                      <div className="absolute top-1 right-1">
                        <Crown className="w-4 h-4 text-yellow-300" />
                      </div>
                    )}
                    
                    {/* علامة التحديد */}
                    {selectedTheme === theme.id && (
                      <div className="absolute bottom-1 left-1 bg-white rounded-full p-1">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* معلومات الثيم */}
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{theme.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                  </div>
                  
                  {/* ألوان الثيم */}
                  <div className="flex justify-center space-x-1 space-x-reverse">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: theme.colors.primary }}
                    ></div>
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: theme.colors.secondary }}
                    ></div>
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: theme.colors.accent }}
                    ></div>
                  </div>
                  
                  {/* حالة الثيم */}
                  {theme.isPremium && !hasAccess ? (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      <Lock className="w-3 h-3 ml-1" />
                      متقدم
                    </Badge>
                  ) : selectedTheme === theme.id ? (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <Check className="w-3 h-3 ml-1" />
                      مُطبق
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      انقر للتطبيق
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* معلومات إضافية */}
        <Card className="shadow-card bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <Sparkles className="w-8 h-8 text-purple-500 mx-auto" />
              <h3 className="font-bold text-gray-800">نصائح الثيمات</h3>
              <p className="text-sm text-gray-600">
                • اختر ثيماً يناسب وقت استخدامك للتطبيق<br/>
                • الثيمات الداكنة مريحة للعينين ليلاً<br/>
                • الثيمات الطبيعية تساعد على الاسترخاء
              </p>
            </div>
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

export default ThemesScreen;
