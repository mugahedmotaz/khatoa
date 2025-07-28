import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, User, Target, RefreshCw, Trash2, Edit, Crown, Zap } from 'lucide-react';
import { User as UserType } from '@/types';
import { availableHabits } from '@/data/habits';
import { toast } from '@/hooks/use-toast';
import { getCurrentSubscriptionStatus } from '@/utils/subscriptionManager';

interface SettingsScreenProps {
  user: UserType;
  onBack: () => void;
  onUpdateUser: (user: UserType) => void;
  onResetApp: () => void;
}

const SettingsScreen = ({ user, onBack, onUpdateUser, onResetApp }: SettingsScreenProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(user.selectedHabits);

  // حالة الاشتراك
  const subscriptionStatus = getCurrentSubscriptionStatus();

  const userHabits = availableHabits.filter(habit => 
    user.selectedHabits.includes(habit.id)
  );

  const handleSaveName = () => {
    if (newName.trim()) {
      onUpdateUser({ ...user, name: newName.trim() });
      setIsEditingName(false);
      toast({
        title: "تم التحديث! ✨",
        description: "تم تحديث اسمك بنجاح",
      });
    }
  };

  const toggleHabit = (habitId: string) => {
    setSelectedHabits(prev => {
      if (prev.includes(habitId)) {
        return prev.filter(id => id !== habitId);
      } else if (prev.length < 3) {
        return [...prev, habitId];
      }
      return prev;
    });
  };

  const handleSaveHabits = () => {
    if (selectedHabits.length === 3) {
      onUpdateUser({ ...user, selectedHabits });
      toast({
        title: "تم التحديث! 🎯",
        description: "تم تحديث عاداتك بنجاح",
      });
    }
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين التطبيق؟ سيتم حذف جميع البيانات!')) {
      onResetApp();
      toast({
        title: "تم الإعادة تعيين",
        description: "تم حذف جميع البيانات وإعادة تعيين التطبيق",
      });
    }
  };

  const startDate = new Date(user.startDate);
  const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* الهيدر */}
      <div className="gradient-primary text-primary-foreground p-6 rounded-b-3xl">
        <div className="flex items-center space-x-4 space-x-reverse mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">الإعدادات</h1>
          
          {/* شارة الاشتراك */}
          {subscriptionStatus.isPremium && (
            <Badge className={`${
              subscriptionStatus.isTrial 
                ? 'bg-blue-500/20 text-blue-100 border-blue-300' 
                : 'bg-yellow-500/20 text-yellow-100 border-yellow-300'
            } px-3 py-1 text-xs font-bold flex items-center gap-1`}>
              {subscriptionStatus.isTrial ? (
                <Zap className="w-3 h-3" />
              ) : (
                <Crown className="w-3 h-3" />
              )}
              {subscriptionStatus.isTrial ? 'تجربة مجانية' : 'عضو مميز'}
              <span>– باقي {subscriptionStatus.daysLeft} يوم</span>
            </Badge>
          )}
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">⚙️</div>
          <p className="opacity-90">تخصيص تجربتك الشخصية</p>
        </div>
      </div>

      <div className="p-6 space-y-6 mt-12">
        {/* معلومات المستخدم */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 ml-2" />
              ملفك الشخصي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex space-x-2 space-x-reverse">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleSaveName}>
                      حفظ
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(user.name);
                      }}
                    >
                      إلغاء
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-lg">{user.name}</div>
                      <div className="text-sm text-foreground/70">
                        {daysSinceStart} ايام الاستمرارية
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingName(true)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm text-foreground/70 mb-1">هدفك الحالي</div>
              <div className="font-medium">{user.goal}</div>
            </div>
          </CardContent>
        </Card>

        {/* تحديث العادات */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="w-5 h-5 ml-2" />
                عاداتك الحالية
              </div>
              <Badge variant="secondary">
                {selectedHabits.length}/3
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* العادات الحالية */}
            <div className="space-y-2">
              {userHabits.map(habit => (
                <div key={habit.id} className="flex items-center p-3 bg-success-light/30 rounded-lg">
                  <span className="text-2xl ml-3">{habit.icon}</span>
                  <div className="flex-1 text-right">
                    <div className="font-medium">{habit.name}</div>
                    <div className="text-sm text-foreground/70">{habit.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* تحديث العادات */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">تغيير العادات:</h4>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {availableHabits.map(habit => {
                  const isSelected = selectedHabits.includes(habit.id);
                  const canSelect = selectedHabits.length < 3 || isSelected;
                  
                  return (
                    <Button
                      key={habit.id}
                      variant="outline"
                      size="sm"
                      onClick={() => toggleHabit(habit.id)}
                      disabled={!canSelect}
                      className={`justify-start h-auto p-2 ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'
                      } ${!canSelect ? 'opacity-50' : ''}`}
                    >
                      <span className="text-lg ml-2">{habit.icon}</span>
                      <span className="text-sm">{habit.name}</span>
                    </Button>
                  );
                })}
              </div>
              
              {selectedHabits.length === 3 && 
               JSON.stringify(selectedHabits.sort()) !== JSON.stringify(user.selectedHabits.sort()) && (
                <Button
                  onClick={handleSaveHabits}
                  className="w-full mt-3 bg-success text-success-foreground"
                >
                  حفظ العادات الجديدة
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* إعادة تعيين التطبيق */}
        <Card className="shadow-card border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <RefreshCw className="w-5 h-5 ml-2" />
              إعادة تعيين التطبيق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/70 mb-4">
              سيتم حذف جميع البيانات والإحصائيات وإعادة التطبيق لحالته الأولى.
            </p>
            <Button
              onClick={handleReset}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              إعادة تعيين التطبيق
            </Button>
          </CardContent>
        </Card>

        {/* معلومات التطبيق */}
        <Card className="shadow-card">
          <CardContent className="p-4 text-center text-sm text-foreground/70">
            <div className="mb-2">🌱 مُجاهدة - كل يوم خطوة</div>
            <div>تطبيق تطوير العادات الإيجابية</div>
            <div>&copy; Development By Mugahed Motaz 2025</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;