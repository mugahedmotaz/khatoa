import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, Users, Trophy, Target, Crown, Lock, Medal, Star, MessageCircle, UserPlus } from 'lucide-react';
import { hasFeatureAccessWithTrial, activatePremiumTrial, getUpgradeMessage } from '@/utils/subscriptionManager';
import { toast } from '@/hooks/use-toast';
import PremiumWarningScreen from './PremiumWarningScreen';

interface SocialScreenProps {
  onBack: () => void;
  onUpgrade: () => void;
  currentUser: any;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  duration: string;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  streak: number;
  rank: number;
  badges: string[];
}

const SocialScreen = ({ onBack, onUpgrade, currentUser }: SocialScreenProps) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'friends'>('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const { access: hasAccess, isTrialActive, trialEnded } = hasFeatureAccessWithTrial('social');

  useEffect(() => {
    if (hasAccess) {
      loadSocialData();
    }
    setLoading(false);
  }, [hasAccess]);

  const loadSocialData = () => {
    // محاكاة تحميل البيانات الاجتماعية
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'تحدي الـ 30 يوم',
        description: 'حافظ على عاداتك لمدة 30 يوماً متتالياً',
        participants: 156,
        duration: '30 يوم',
        reward: '500 نقطة + شارة ذهبية',
        difficulty: 'hard',
        category: 'عام'
      },
      {
        id: '2',
        title: 'تحدي الصباح الباكر',
        description: 'استيقظ قبل الساعة 6 صباحاً لمدة أسبوع',
        participants: 89,
        duration: '7 أيام',
        reward: '200 نقطة + شارة الصباح',
        difficulty: 'medium',
        category: 'نمط الحياة'
      },
      {
        id: '3',
        title: 'تحدي القراءة اليومية',
        description: 'اقرأ 20 صفحة يومياً لمدة أسبوعين',
        participants: 234,
        duration: '14 يوم',
        reward: '300 نقطة + شارة القارئ',
        difficulty: 'easy',
        category: 'تعليم'
      }
    ];

    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: '1',
        name: 'أحمد محمد',
        avatar: '👨‍💼',
        points: 2850,
        streak: 45,
        rank: 1,
        badges: ['🏆', '🔥', '📚']
      },
      {
        id: '2',
        name: 'فاطمة علي',
        avatar: '👩‍🎓',
        points: 2640,
        streak: 38,
        rank: 2,
        badges: ['🥈', '⭐', '💪']
      },
      {
        id: '3',
        name: 'محمد حسن',
        avatar: '👨‍🏫',
        points: 2420,
        streak: 32,
        rank: 3,
        badges: ['🥉', '🎯', '📖']
      },
      {
        id: '4',
        name: 'مريم أحمد',
        avatar: '👩‍💻',
        points: 2180,
        streak: 28,
        rank: 4,
        badges: ['🌟', '💎']
      },
      {
        id: '5',
        name: 'عبدالله سالم',
        avatar: '👨‍⚕️',
        points: 1950,
        streak: 25,
        rank: 5,
        badges: ['🔥', '🎖️']
      }
    ];

    setChallenges(mockChallenges);
    setLeaderboard(mockLeaderboard);
  };

  const joinChallenge = (challengeId: string) => {
    toast({
      title: "تم الانضمام للتحدي! 🎯",
      description: "بدأ التحدي الآن، حظاً موفقاً!",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      case 'hard': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'سهل';
      case 'medium': return 'متوسط';
      case 'hard': return 'صعب';
      default: return 'غير محدد';
    }
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
          onClick={onUpgrade}
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
        featureName="ميزات اجتماعية"
        featureDescription="تحديات جماعية ولوحة المتصدرين ومتابعة الأصدقاء متاحة فقط للمشتركين."
        featureIcon={<Users className="w-8 h-8 text-blue-500" />}
        onBack={onBack}
        onUpgrade={onUpgrade}
        onTrial={() => {
          activatePremiumTrial();
          window.location.reload(); // تحديث الواجهة مباشرة بعد التفعيل
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
          <h1 className="text-2xl font-bold">المجتمع</h1>
          <Badge className="bg-yellow-500 text-white">
            <Crown className="w-3 h-3 ml-1" />
            متقدم
          </Badge>
        </div>

        <div className="text-center">
          <div className="text-4xl mb-2">👥</div>
          <p className="opacity-90">تواصل وتنافس مع المجتمع</p>
        </div>
      </div>

      <div className="p-6 space-y-6 mt-12">
        {/* تبديل الأقسام */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'challenges', label: 'التحديات', icon: Target },
            { id: 'leaderboard', label: 'المتصدرين', icon: Trophy },
            { id: 'friends', label: 'الأصدقاء', icon: Users }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              onClick={() => setActiveTab(id as any)}
              variant={activeTab === id ? "default" : "ghost"}
              className={`flex-1 ${activeTab === id ? 'bg-white shadow-sm' : ''}`}
            >
              <Icon className="w-4 h-4 ml-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* محتوى التحديات */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">التحديات النشطة</h2>
              <Badge variant="outline">{challenges.length} تحدي</Badge>
            </div>

            {challenges.map((challenge) => (
              <Card key={challenge.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{challenge.title}</CardTitle>
                      <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {getDifficultyText(challenge.difficulty)}
                        </Badge>
                        <Badge variant="outline">{challenge.category}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <Users className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <div className="text-sm font-medium">{challenge.participants}</div>
                      <div className="text-xs text-gray-500">مشارك</div>
                    </div>
                    <div className="text-center">
                      <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                      <div className="text-sm font-medium">{challenge.duration}</div>
                      <div className="text-xs text-gray-500">المدة</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <Medal className="w-4 h-4 text-yellow-500 ml-2" />
                      <span className="text-sm font-medium">المكافأة: {challenge.reward}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => joinChallenge(challenge.id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                  >
                    <Target className="w-4 h-4 ml-2" />
                    انضم للتحدي
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* محتوى لوحة المتصدرين */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">لوحة المتصدرين</h2>
              <Badge variant="outline">هذا الأسبوع</Badge>
            </div>

            {leaderboard.map((entry, index) => (
              <Card key={entry.id} className={`shadow-card ${index < 3 ? 'border-2 border-yellow-200' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    {/* المركز */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center ml-4">
                      {index === 0 && <div className="text-2xl">🥇</div>}
                      {index === 1 && <div className="text-2xl">🥈</div>}
                      {index === 2 && <div className="text-2xl">🥉</div>}
                      {index > 2 && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{entry.rank}</span>
                        </div>
                      )}
                    </div>

                    {/* معلومات المستخدم */}
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="text-2xl ml-2">{entry.avatar}</span>
                        <span className="font-semibold">{entry.name}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 ml-1 text-yellow-500" />
                          {entry.points} نقطة
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 ml-1 text-orange-500" />
                          {entry.streak} يوم
                        </div>
                      </div>

                      {/* الشارات */}
                      <div className="flex gap-1 mt-2">
                        {entry.badges.map((badge, badgeIndex) => (
                          <span key={badgeIndex} className="text-lg">{badge}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* محتوى الأصدقاء */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">الأصدقاء</h2>
              <Button size="sm" className="bg-blue-500 text-white">
                <UserPlus className="w-4 h-4 ml-1" />
                إضافة صديق
              </Button>
            </div>

            {/* البحث عن الأصدقاء */}
            <div className="relative">
              <Input
                placeholder="ابحث عن الأصدقاء..."
                className="text-right"
              />
            </div>

            {/* قائمة الأصدقاء */}
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">لا يوجد أصدقاء بعد</h3>
              <p className="text-sm mb-4">ابدأ بإضافة أصدقائك لمشاركة رحلتك معهم</p>
              <Button className="bg-blue-500 text-white">
                <UserPlus className="w-4 h-4 ml-2" />
                إضافة أول صديق
              </Button>
            </div>
          </div>
        )}

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

export default SocialScreen;
