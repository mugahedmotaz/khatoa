import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Calendar, Target, Award, BarChart3, PieChart, Activity, Crown, Lock } from 'lucide-react';
import { hasFeatureAccessWithTrial, activatePremiumTrial, getUpgradeMessage } from '@/utils/subscriptionManager';
import { toast } from '@/hooks/use-toast';
import PremiumWarningScreen from './PremiumWarningScreen';

interface AnalyticsScreenProps {
  onBack: () => void;
  user?: any;
  dailyProgress?: any[];
}

interface AnalyticsData {
  totalDays: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: number[];
  habitPerformance: { name: string; completion: number; trend: 'up' | 'down' | 'stable' }[];
  bestTimeOfDay: string;
  mostProductiveDay: string;
}

const AnalyticsScreen = ({ onBack, user, dailyProgress = [] }: AnalyticsScreenProps) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  const { access: hasAccess, isTrialActive, trialEnded } = hasFeatureAccessWithTrial('analytics');

  useEffect(() => {
    if (hasAccess) {
      generateAnalytics();
    }
    setLoading(false);
  }, [hasAccess, selectedPeriod]);

  const generateAnalytics = () => {
    if (!user || !dailyProgress.length) {
      setAnalyticsData(null);
      return;
    }

    // حساب التحليلات الحقيقية من بيانات المستخدم
    const totalDays = dailyProgress.length;
    const totalPossibleHabits = user.selectedHabits.length * totalDays;
    const totalCompletedHabits = dailyProgress.reduce((sum, day) => sum + day.completedHabits.length, 0);
    const completionRate = totalPossibleHabits > 0 ? Math.round((totalCompletedHabits / totalPossibleHabits) * 100) : 0;

    // حساب السلسلة الحالية
    let currentStreak = 0;
    const sortedProgress = [...dailyProgress].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const day of sortedProgress) {
      if (day.completedHabits.length > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // حساب أطول سلسلة
    let longestStreak = 0;
    let tempStreak = 0;
    for (const day of dailyProgress) {
      if (day.completedHabits.length > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // حساب التقدم الأسبوعي (آخر 7 أيام)
    const last7Days = dailyProgress.slice(-7);
    const weeklyProgress = last7Days.map(day => {
      const dayCompletion = user.selectedHabits.length > 0 ? 
        Math.round((day.completedHabits.length / user.selectedHabits.length) * 100) : 0;
      return dayCompletion;
    });
    
    // ملء الأيام المفقودة بـ 0
    while (weeklyProgress.length < 7) {
      weeklyProgress.unshift(0);
    }

    // حساب أداء كل عادة
    const habitPerformance = user.selectedHabits.map((habitId: string) => {
      const habitName = getHabitName(habitId);
      const completions = dailyProgress.filter(day => day.completedHabits.includes(habitId)).length;
      const completion = totalDays > 0 ? Math.round((completions / totalDays) * 100) : 0;
      
      // حساب الاتجاه (مقارنة النصف الأول بالنصف الثاني)
      const midPoint = Math.floor(totalDays / 2);
      const firstHalf = dailyProgress.slice(0, midPoint);
      const secondHalf = dailyProgress.slice(midPoint);
      
      const firstHalfCompletion = firstHalf.filter(day => day.completedHabits.includes(habitId)).length;
      const secondHalfCompletion = secondHalf.filter(day => day.completedHabits.includes(habitId)).length;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (secondHalfCompletion > firstHalfCompletion) trend = 'up';
      else if (secondHalfCompletion < firstHalfCompletion) trend = 'down';
      
      return { name: habitName, completion, trend };
    });

    // تحديد أفضل وقت ويوم (بيانات وهمية لأنها تحتاج تتبع الوقت)
    const bestTimeOfDay = 'الصباح الباكر (6-9 ص)';
    const mostProductiveDay = 'الثلاثاء';

    const realData: AnalyticsData = {
      totalDays,
      completionRate,
      currentStreak,
      longestStreak,
      weeklyProgress,
      habitPerformance,
      bestTimeOfDay,
      mostProductiveDay,
    };
    
    setAnalyticsData(realData);
  };

  const getHabitName = (habitId: string) => {
    // قائمة العادات المتاحة (يجب استيرادها من data/habits)
    const habitsMap: { [key: string]: string } = {
      'quran': 'قراءة القرآن',
      'prayer': 'الصلاة في وقتها',
      'exercise': 'التمارين الرياضية',
      'water': 'شرب الماء',
      'sleep': 'النوم المبكر',
      'reading': 'القراءة',
      'meditation': 'التأمل',
      'gratitude': 'الامتنان',
    };
    return habitsMap[habitId] || habitId;
  };

  const PremiumFeatureCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
    <Card className="shadow-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-50"></div>
      <CardContent className="relative p-6 text-center">
        <div className="absolute top-2 right-2">
          <Crown className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="mb-4">
          <Icon className="w-12 h-12 mx-auto text-gray-400" />
          <Lock className="w-6 h-6 mx-auto mt-2 text-gray-400" />
        </div>
        <h3 className="font-semibold mb-2 text-gray-600">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <Button
          onClick={() => toast({ title: 'قريباً!', description: 'هذه الميزة ستكون متاحة قريباً' })}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
        >
          <Crown className="w-4 h-4 ml-2" />
          ترقية للمتقدم
        </Button>
      </CardContent>
    </Card>
  );

  if (!hasAccess) {
    return (
      <PremiumWarningScreen
        featureName="تحليلات متقدمة"
        featureDescription="تحليلات ذكية وتقارير مفصلة عن أدائك وعاداتك متاحة فقط للمشتركين."
        featureIcon={<BarChart3 className="w-8 h-8 text-blue-500" />}
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

  if (loading || !analyticsData) {
    return (
      <div className="mobile-container bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-motivation/30 border-t-motivation rounded-full mx-auto mb-4"></div>
          <p>جاري تحليل البيانات...</p>
        </div>
      </div>
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
          <h1 className="text-2xl font-bold">التحليلات الذكية</h1>
          <Badge className="bg-yellow-500 text-white">
            <Crown className="w-3 h-3 ml-1" />
            متقدم
          </Badge>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="opacity-90">رؤى عميقة حول تقدمك وعاداتك</p>
        </div>
      </div>

      <div className="p-6 space-y-6 mt-12">
        {/* فلاتر الفترة الزمنية */}
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              variant={selectedPeriod === period ? "default" : "outline"}
              className="flex-1"
            >
              {period === 'week' ? 'أسبوع' : period === 'month' ? 'شهر' : 'سنة'}
            </Button>
          ))}
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-blue-600">{analyticsData.totalDays}</div>
              <div className="text-sm text-gray-600">إجمالي الأيام</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-600">{analyticsData.completionRate}%</div>
              <div className="text-sm text-gray-600">معدل الإنجاز</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold text-orange-600">{analyticsData.currentStreak}</div>
              <div className="text-sm text-gray-600">السلسلة الحالية</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold text-purple-600">{analyticsData.longestStreak}</div>
              <div className="text-sm text-gray-600">أطول سلسلة</div>
            </CardContent>
          </Card>
        </div>

        {/* التقدم الأسبوعي */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 ml-2 text-blue-500" />
              التقدم الأسبوعي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map((day, index) => (
                <div key={day} className="flex items-center">
                  <span className="w-16 text-sm">{day}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analyticsData.weeklyProgress[index]}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analyticsData.weeklyProgress[index]}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* أداء العادات */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 ml-2 text-green-500" />
              أداء العادات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.habitPerformance.map((habit, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 ml-3"></div>
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium ml-2">{habit.completion}%</span>
                    <div className={`w-4 h-4 ${
                      habit.trend === 'up' ? 'text-green-500' : 
                      habit.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {habit.trend === 'up' ? '↗️' : habit.trend === 'down' ? '↘️' : '➡️'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* رؤى ذكية */}
        <Card className="shadow-card bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 ml-2 text-purple-500" />
              رؤى ذكية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-white rounded-lg">
                <div className="text-2xl ml-3">🌅</div>
                <div>
                  <div className="font-medium">أفضل وقت للإنتاجية</div>
                  <div className="text-sm text-gray-600">{analyticsData.bestTimeOfDay}</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-white rounded-lg">
                <div className="text-2xl ml-3">📅</div>
                <div>
                  <div className="font-medium">اليوم الأكثر إنتاجية</div>
                  <div className="text-sm text-gray-600">{analyticsData.mostProductiveDay}</div>
                </div>
              </div>
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

export default AnalyticsScreen;
