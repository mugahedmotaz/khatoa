import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';

interface CreateProfileProps {
  onComplete: (user: User) => void;
}

const CreateProfile = ({ onComplete }: CreateProfileProps) => {
  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');

  const goals = [
    { id: 'self-development', name: 'تطوير ذاتي', icon: '🎯', color: 'primary' },
    { id: 'health', name: 'صحة ولياقة', icon: '💪', color: 'success' },
    { id: 'spirituality', name: 'روحانيات', icon: '🤲', color: 'motivation' },
    { id: 'organization', name: 'تنظيم الوقت', icon: '⏰', color: 'primary' },
    { id: 'relationships', name: 'علاقات اجتماعية', icon: '❤️', color: 'success' },
    { id: 'other', name: 'أهداف أخرى', icon: '✨', color: 'motivation' }
  ];

  const handleSubmit = () => {
    if (name.trim() && selectedGoal) {
      const user: User = {
        name: name.trim(),
        goal: selectedGoal,
        selectedHabits: [],
        startDate: new Date().toISOString(),
        level: 1,
        totalPoints: 0,
        achievements: [],
        streak: 0,
        longestStreak: 0,
        reminderSettings: {
          enabled: true,
          times: ['09:00', '18:00'],
          motivationalQuotes: true,
          sound: true
        }
      };
      onComplete(user);
    }
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      <div className="p-6 space-y-8">
        {/* الهيدر */}
        <div className="text-center space-y-4 pt-8">
          <div className="text-6xl">👋</div>
          <h1 className="text-2xl font-bold">أهلاً وسهلاً!</h1>
          <p className="text-foreground/70">دعنا نتعرف عليك أكثر</p>
        </div>

        {/* إدخال الاسم */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">ما اسمك؟</CardTitle>
            <CardDescription>سنستخدم اسمك لتخصيص تجربتك</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="اكتب اسمك هنا..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg h-12 text-center"
            />
          </CardContent>
        </Card>

        {/* اختيار الهدف */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">ما هو هدفك الرئيسي؟</CardTitle>
            <CardDescription>اختر المجال الذي تريد التركيز عليه</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <Button
                  key={goal.id}
                  variant={selectedGoal === goal.id ? "default" : "outline"}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`h-20 flex-col space-y-2 transition-bounce ${
                    selectedGoal === goal.id 
                      ? 'bg-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="text-sm font-medium">{goal.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* زر المتابعة */}
        <Button
          onClick={handleSubmit}
          disabled={!name.trim() || !selectedGoal}
          className="w-full h-14 text-lg gradient-primary text-white shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          متابعة إلى اختيار العادات
        </Button>
      </div>
    </div>
  );
};

export default CreateProfile;