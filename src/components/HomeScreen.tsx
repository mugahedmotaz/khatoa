import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { availableHabits, motivationalQuotes } from '@/data/habits';
import { User, DailyProgress } from '@/types';
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

  const userHabits = availableHabits.filter(habit => 
    user.selectedHabits.includes(habit.id)
  );

  const completionRate = Math.round(
    (todayProgress.completedHabits.length / userHabits.length) * 100
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
              onClick={() => onNavigate('statistics')}
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
            {todayProgress.completedHabits.length} من {userHabits.length} عادات
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

        {/* العادات اليومية */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl ml-2">📋</span>
              عاداتك اليوم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userHabits.map((habit, index) => {
              const isCompleted = todayProgress.completedHabits.includes(habit.id);
              
              return (
                <div key={habit.id} className="relative">
                  {/* خط الربط للتايم لاين */}
                  {index < userHabits.length - 1 && (
                    <div className="absolute right-6 top-12 w-0.5 h-6 bg-border"></div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => onHabitToggle(habit.id)}
                    className={`w-full h-auto p-4 justify-start transition-bounce ${
                      isCompleted 
                        ? 'bg-success-light border-success text-success-foreground' 
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center w-full">
                      {/* أيقونة الحالة */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-3 ${
                        isCompleted ? 'bg-success' : 'bg-border'
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
                          <span className="text-2xl">{habit.icon}</span>
                          <div>
                            <div className={`font-medium ${isCompleted ? 'line-through opacity-70' : ''}`}>
                              {habit.name}
                            </div>
                            <div className="text-sm opacity-70">{habit.description}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              );
            })}
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
      </div>
    </div>
  );
};

export default HomeScreen;