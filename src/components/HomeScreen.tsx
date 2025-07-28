import { useState, useEffect } from 'react';
import { hasFeatureAccessWithTrial } from '@/utils/subscriptionManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { availableHabits, motivationalQuotes } from '@/data/habits';
import { DailyProgress } from '@/types';
import { User } from '@/types/auth';
import { Check, Menu, Calendar, TrendingUp } from 'lucide-react';

interface HomeScreenProps {
  user: User;
  dailyProgress: DailyProgress[];
  onHabitToggle: (habitId: string) => void;
  onNavigate: (screen: string) => void;
}

const HomeScreen = ({ user, dailyProgress, onHabitToggle, onNavigate }: HomeScreenProps) => {
  const [currentQuote, setCurrentQuote] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayProgress = dailyProgress.find(p => p.date === today) || {
    date: today,
    completedHabits: []
  };

  // استخدم العادات المخصصة فقط
  const sortedHabits = (user.habitGoals || []).slice().sort((a, b) => a.priority - b.priority);

  const completionRate = sortedHabits.length === 0 ? 0 : Math.round(
    (todayProgress.completedHabits.length / sortedHabits.length) * 100
  );

  useEffect(() => {
    const randomQuote = motivationalQuotes[
      Math.floor(Math.random() * motivationalQuotes.length)
    ];
    setCurrentQuote(randomQuote);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'مساء الخير';
    return 'مساء الخير';
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* الهيدر */}
      <div className="gradient-primary text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('settings')}
            className="text-white hover:bg-white/20"
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex space-x-2 space-x-reverse">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('achievements')}
              className="text-white hover:bg-white/20"
            >
              <span className="text-lg">🏆</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('meditation')}
              className="text-white hover:bg-white/20"
            >
              <span className="text-lg">🧘‍♀️</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('reminders')}
              className="text-white hover:bg-white/20"
            >
              <span className="text-lg">🔔</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('analytics')}
              className="text-white hover:bg-white/20"
            >
              <TrendingUp className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">
            {getGreeting()}، {user.name}!
          </h1>

          {/* دائرة التقدم */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="white"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${completionRate * 3.14} ${314 - completionRate * 3.14}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{completionRate}%</div>
                <div className="text-sm opacity-90">مكتمل</div>
              </div>
            </div>
          </div>

          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {todayProgress.completedHabits.length} من {sortedHabits.length} عادات
          </Badge>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="p-6 space-y-6 mt-12">
        {/* الاقتباس اليومي */}
        <Card className="shadow-card border-motivation/20 bg-motivation-light/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">💫</div>
            <p className="text-motivation-foreground font-medium leading-relaxed">
              "{currentQuote}"
            </p>
          </CardContent>
        </Card>

        {/* العادات اليومية المخصصة */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl ml-2">📋</span>
              عاداتك اليوم
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-primary underline text-xs"
                onClick={() => onNavigate('settings')}
              >
                إدارة العادات
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedHabits.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <div className="text-3xl mb-2">✨</div>
                <p>لم تقم بإضافة أي عادات بعد.</p>
                <p className="mt-2 text-xs">يمكنك إضافة عادات جديدة من شاشة الإعدادات.</p>
              </div>
            ) : (
              sortedHabits.map((habit, index) => {
                const isCompleted = todayProgress.completedHabits.includes(habit.habitId);
                return (
                  <div key={habit.habitId} className="relative">
                    {/* خط الربط للتايم لاين */}
                    {index < sortedHabits.length - 1 && (
                      <div className="absolute right-6 top-12 w-0.5 h-6 bg-border"></div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => onHabitToggle(habit.habitId)}
                      className={`w-full h-auto p-4 justify-start transition-bounce ${isCompleted
                          ? 'bg-success-light border-success text-success-foreground'
                          : 'hover:bg-secondary'
                        }`}
                    >
                      <div className="flex items-center w-full">
                        {/* أيقونة الحالة */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-3 ${isCompleted ? 'bg-success' : 'bg-border'
                          }`}>
                          {isCompleted ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                          )}
                        </div>
                        {/* محتوى العادة */}
                        <div className="flex-1 text-right">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">{habit.name}</span>
                            <div>
                              <div className={`font-medium ${isCompleted ? 'line-through opacity-70' : ''}`}>{habit.goal}</div>
                              {habit.details && <div className="text-xs opacity-70">{habit.details}</div>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${habit.priority === 1 ? 'bg-red-100 text-red-800' : habit.priority === 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{habit.priority === 1 ? 'عالي' : habit.priority === 2 ? 'متوسط' : 'منخفض'}</span>
                            <span className="text-xs text-gray-500">{habit.type}</span>
                            {habit.endDate && <span className="text-xs text-gray-500">حتى: {new Date(habit.endDate).toLocaleDateString('ar')}</span>}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* زر المفكرة */}
        <Button
          onClick={() => onNavigate('journal')}
          variant="outline"
          className="w-full h-14 text-lg border-2 hover:bg-secondary transition-bounce"
        >
          <span className="text-2xl ml-3">📔</span>
          اكتب في مفكرتك اليومية
        </Button>

        {/* قسم الميزات المتقدمة */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">الميزات المتقدمة</h3>
              <p className="text-gray-600 text-sm">اكتشف إمكانيات جديدة لتطوير عاداتك</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => {
                  const { access } = hasFeatureAccessWithTrial('analytics');
                  if (access) {
                    onNavigate('analytics');
                  } else {
                    onNavigate('premiumWarning_analytics');
                  }
                }}
                className="group cursor-pointer bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100"
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">التحليلات الذكية</h4>
                    <p className="text-xs text-gray-500 mt-1">تقارير مفصلة</p>
                  </div>
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs">👑</span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => {
                  const { access } = hasFeatureAccessWithTrial('social');
                  if (access) {
                    onNavigate('social');
                  } else {
                    onNavigate('premiumWarning_social');
                  }
                }}
                className="group cursor-pointer bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-100"
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">التحديات الجماعية</h4>
                    <p className="text-xs text-gray-500 mt-1">تنافس مع الأصدقاء</p>
                  </div>
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs">👑</span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => {
                  const { access } = hasFeatureAccessWithTrial('ai_assistant');
                  if (access) {
                    onNavigate('ai_assistant');
                  } else {
                    onNavigate('premiumWarning_ai_assistant');
                  }
                }}
                className="group cursor-pointer bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100"
              >
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">المساعد الذكي</h4>
                    <p className="text-xs text-gray-500 mt-1">نصائح مخصصة</p>
                  </div>
                  <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs">👑</span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => {
                  const { access } = hasFeatureAccessWithTrial('spiritual');
                  if (access) {
                    onNavigate('spiritual');
                  } else {
                    onNavigate('premiumWarning_spiritual');
                  }
                }}
                className="group cursor-pointer bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100"
              >
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-lg">🕌</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">الميزات الروحانية</h4>
                    <p className="text-xs text-gray-500 mt-1">أوقات الصلاة</p>
                  </div>
                  <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs">👑</span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('themes')}
                className="group cursor-pointer bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100"
              >
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-lg">🎨</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">الثيمات المتقدمة</h4>
                    <p className="text-xs text-gray-500 mt-1">ألوان جميلة</p>
                  </div>
                  <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs">👑</span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('premium')}
                className="group cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 col-span-2"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-2xl">💎</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">الترقية الآن</h4>
                    <p className="text-xs text-white/80 mt-1">جميع الميزات المتقدمة</p>
                  </div>
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs">⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeScreen;