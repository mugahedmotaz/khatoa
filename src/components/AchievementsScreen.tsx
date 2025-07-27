import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Trophy, Star, Zap, Crown, Target } from 'lucide-react';
import { User, DailyProgress } from '@/types';
import { achievements, weeklyChallenge } from '@/data/habits';
import { motion } from 'framer-motion';

interface AchievementsScreenProps {
  user: User;
  dailyProgress: DailyProgress[];
  onBack: () => void;
}

const AchievementsScreen = ({ user, dailyProgress, onBack }: AchievementsScreenProps) => {
  // حساب التقدم للإنجازات
  const calculateProgress = (achievement: any) => {
    switch (achievement.type) {
      case 'total_days':
        return Math.min(dailyProgress.length, achievement.requirement);
      case 'streak':
        return Math.min(user.streak, achievement.requirement);
      case 'points':
        return Math.min(user.totalPoints, achievement.requirement);
      default:
        return 0;
    }
  };

  // تحديد مستوى المستخدم
  const getLevelInfo = (points: number) => {
    const levels = [
      { level: 1, name: 'مبتدئ', minPoints: 0, maxPoints: 99, icon: '🌱', color: 'text-green-500' },
      { level: 2, name: 'متحمس', minPoints: 100, maxPoints: 299, icon: '🌿', color: 'text-green-600' },
      { level: 3, name: 'ملتزم', minPoints: 300, maxPoints: 599, icon: '🌳', color: 'text-blue-500' },
      { level: 4, name: 'متقدم', minPoints: 600, maxPoints: 999, icon: '⭐', color: 'text-purple-500' },
      { level: 5, name: 'خبير', minPoints: 1000, maxPoints: 1999, icon: '🏆', color: 'text-yellow-500' },
      { level: 6, name: 'أسطورة', minPoints: 2000, maxPoints: Infinity, icon: '👑', color: 'text-gold-500' }
    ];

    return levels.find(l => points >= l.minPoints && points <= l.maxPoints) || levels[0];
  };

  const currentLevel = getLevelInfo(user.totalPoints);
  const nextLevel = getLevelInfo(user.totalPoints + 1);
  const progressToNext = nextLevel ? 
    ((user.totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100 : 100;

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* الهيدر */}
      <div className="gradient-motivation text-motivation-foreground p-6 rounded-b-3xl">
        <div className="flex items-center space-x-4 space-x-reverse mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-motivation-foreground hover:bg-motivation-foreground/10"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">الإنجازات والمكافآت</h1>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">🏆</div>
          <p className="opacity-90">احتفل بإنجازاتك ومسيرتك</p>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-6">
        {/* مستوى المستخدم الحالي */}
        <Card className="shadow-card border-motivation/20">
          <CardHeader className="text-center">
            <div className="text-6xl mb-2">{currentLevel.icon}</div>
            <CardTitle className={`text-2xl ${currentLevel.color}`}>
              {currentLevel.name}
            </CardTitle>
            <div className="space-y-2">
              <div className="flex justify-center items-center space-x-2 space-x-reverse">
                <Zap className="w-4 h-4 text-motivation" />
                <span className="text-lg font-bold">{user.totalPoints} نقطة</span>
              </div>
              <div className="text-sm text-foreground/70">المستوى {currentLevel.level}</div>
            </div>
          </CardHeader>
          <CardContent>
            {nextLevel && nextLevel.level !== currentLevel.level && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>التقدم للمستوى التالي</span>
                  <span>{nextLevel.minPoints - user.totalPoints} نقطة متبقية</span>
                </div>
                <Progress value={progressToNext} className="h-2" />
                <div className="text-center text-sm text-foreground/70">
                  المستوى التالي: {nextLevel.name} {nextLevel.icon}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-card text-center">
            <CardContent className="p-4">
              <Trophy className="w-6 h-6 text-motivation mx-auto mb-1" />
              <div className="text-lg font-bold">{user.achievements.length}</div>
              <div className="text-xs text-foreground/70">إنجاز مفتوح</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-4">
              <Target className="w-6 h-6 text-success mx-auto mb-1" />
              <div className="text-lg font-bold">{user.streak}</div>
              <div className="text-xs text-foreground/70">يوم متتالي</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-4">
              <Star className="w-6 h-6 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold">{user.longestStreak}</div>
              <div className="text-xs text-foreground/70">أطول سلسلة</div>
            </CardContent>
          </Card>
        </div>

        {/* التحدي الأسبوعي */}
        <Card className="shadow-card border-success/20 bg-success-light/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl ml-2">🎯</span>
              التحدي الأسبوعي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">{weeklyChallenge.name}</h3>
              <p className="text-foreground/70">{weeklyChallenge.description}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>التقدم</span>
                <span>{weeklyChallenge.currentValue}/{weeklyChallenge.targetValue}</span>
              </div>
              <Progress 
                value={(weeklyChallenge.currentValue / weeklyChallenge.targetValue) * 100} 
                className="h-3"
              />
            </div>
            
            <div className="p-3 bg-success-light/30 rounded-lg">
              <div className="text-sm font-medium text-success-foreground">
                🎁 المكافأة: {weeklyChallenge.reward}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قائمة الإنجازات */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 ml-2" />
              جميع الإنجازات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement) => {
              const progress = calculateProgress(achievement);
              const isUnlocked = progress >= achievement.requirement;
              const progressPercentage = (progress / achievement.requirement) * 100;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border transition-all ${
                    isUnlocked 
                      ? 'bg-success-light/30 border-success/30' 
                      : 'bg-secondary/30 border-border'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`text-3xl ${isUnlocked ? 'grayscale-0' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold">{achievement.name}</h3>
                        {isUnlocked && (
                          <Badge className="bg-success text-success-foreground">
                            مفتوح
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground/70 mb-2">
                        {achievement.description}
                      </p>
                      
                      {!isUnlocked && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>التقدم</span>
                            <span>{progress}/{achievement.requirement}</span>
                          </div>
                          <Progress value={progressPercentage} className="h-1" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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

export default AchievementsScreen;