import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { User, DailyProgress } from '@/types';
import { availableHabits } from '@/data/habits';

interface StatisticsScreenProps {
  user: User;
  dailyProgress: DailyProgress[];
  onBack: () => void;
}

const StatisticsScreen = ({ user, dailyProgress, onBack }: StatisticsScreenProps) => {
  const userHabits = availableHabits.filter(habit => 
    user.selectedHabits.includes(habit.id)
  );

  // حساب الإحصائيات
  const totalDays = dailyProgress.length;
  const daysWithAllHabits = dailyProgress.filter(day => 
    day.completedHabits.length === userHabits.length
  ).length;
  
  const overallCompletionRate = totalDays > 0 
    ? Math.round((daysWithAllHabits / totalDays) * 100)
    : 0;

  // حساب أفضل عادة (الأكثر التزاماً)
  const habitStats = userHabits.map(habit => {
    const completionCount = dailyProgress.filter(day => 
      day.completedHabits.includes(habit.id)
    ).length;
    return {
      ...habit,
      completionRate: totalDays > 0 ? Math.round((completionCount / totalDays) * 100) : 0,
      completionCount
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  // حساب أطول سلسلة متتالية
  const calculateStreak = () => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    const sortedDays = [...dailyProgress].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 0; i < sortedDays.length; i++) {
      if (sortedDays[i].completedHabits.length === userHabits.length) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  };

  const longestStreak = calculateStreak();

  // إحصائيات الأسبوع الماضي
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const lastWeekProgress = dailyProgress.filter(day => 
    new Date(day.date) >= weekAgo
  );
  
  const weeklyCompletionRate = lastWeekProgress.length > 0
    ? Math.round((lastWeekProgress.filter(day => 
        day.completedHabits.length === userHabits.length
      ).length / lastWeekProgress.length) * 100)
    : 0;

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* الهيدر */}
      <div className="gradient-success text-success-foreground p-6 rounded-b-3xl">
        <div className="flex items-center space-x-4 space-x-reverse mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-success-foreground hover:bg-success-foreground/10"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">إحصائياتك</h1>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="opacity-90">تتبع تقدمك ونجاحاتك</p>
        </div>
      </div>

      <div className="p-6 space-y-6 mt-12">
        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card text-center">
            <CardContent className="p-4">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success">{overallCompletionRate}%</div>
              <div className="text-sm text-foreground/70">معدل الإنجاز العام</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-4">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{totalDays}</div>
              <div className="text-sm text-foreground/70">يوم من المجاهدة</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-4">
              <Target className="w-8 h-8 text-motivation mx-auto mb-2" />
              <div className="text-2xl font-bold text-motivation">{longestStreak}</div>
              <div className="text-sm text-foreground/70">أطول سلسلة متتالية</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-4">
              <Award className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success">{weeklyCompletionRate}%</div>
              <div className="text-sm text-foreground/70">إنجاز الأسبوع</div>
            </CardContent>
          </Card>
        </div>

        {/* أفضل العادات */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl ml-2">🏆</span>
              ترتيب عاداتك
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {habitStats.map((habit, index) => (
              <div key={habit.id} className="flex items-center space-x-3 space-x-reverse p-3 bg-secondary/30 rounded-lg">
                <div className="text-xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                <div className="text-2xl">{habit.icon}</div>
                <div className="flex-1 text-right">
                  <div className="font-medium">{habit.name}</div>
                  <div className="text-sm text-foreground/70">
                    {habit.completionCount} من {totalDays} أيام
                  </div>
                </div>
                <Badge 
                  variant={habit.completionRate >= 80 ? "default" : "secondary"}
                  className={habit.completionRate >= 80 ? "bg-success" : ""}
                >
                  {habit.completionRate}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* رسائل تحفيزية حسب الأداء */}
        <Card className="shadow-card border-motivation/20 bg-motivation-light/30">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">
              {overallCompletionRate >= 80 ? '🌟' : 
               overallCompletionRate >= 60 ? '💪' : 
               overallCompletionRate >= 40 ? '🌱' : '🚀'}
            </div>
            <p className="text-motivation-foreground font-medium">
              {overallCompletionRate >= 80 ? 
                'ممتاز! أنت في طريقك الصحيح للتميز!' :
               overallCompletionRate >= 60 ? 
                'أداء جيد! استمر والتزم أكثر' :
               overallCompletionRate >= 40 ? 
                'بداية جميلة، ثق بنفسك واستمر' :
                'كل بداية صعبة، لكن المهم أن تبدأ!'
              }
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

export default StatisticsScreen;