import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, User, Target, RefreshCw, Trash2, Edit, Crown, Zap, LogOut, Plus, Check, X } from 'lucide-react';
import { User as UserType, HabitGoal } from '@/types';
import { availableHabits } from '@/data/habits';
import { toast } from '@/hooks/use-toast';
import { getCurrentSubscriptionStatus } from '@/utils/subscriptionManager';

interface SettingsScreenProps {
  user: UserType;
  onBack: () => void;
  onUpdateUser: (user: UserType) => void;
  onResetApp: () => void;
  onLogout?: () => void;
  onNavigate: (screen: string) => void; // <-- Prop for navigation
}

const SettingsScreen = ({ user, onBack, onUpdateUser, onResetApp, onLogout, onNavigate }: SettingsScreenProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(user.selectedHabits);
  const [showHabitManager, setShowHabitManager] = useState(false);
  const [editingHabitIndex, setEditingHabitIndex] = useState<number | null>(null);
  const [habitForm, setHabitForm] = useState({
    name: '',
    goal: '',
    details: '',
    priority: 2,
    type: 'يومية',
    endDate: ''
  });

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

  const handleSaveHabit = () => {
    if (!habitForm.name.trim() || !habitForm.goal.trim()) {
      alert('يرجى إدخال اسم العادة والهدف على الأقل');
      return;
    }

    const newHabit: HabitGoal = {
      habitId: editingHabitIndex !== null ? (user.habitGoals || [])[editingHabitIndex].habitId : `custom_${Date.now()}`,
      name: habitForm.name.trim(),
      goal: habitForm.goal.trim(),
      details: habitForm.details.trim(),
      priority: habitForm.priority,
      type: habitForm.type,
      endDate: habitForm.endDate
    };

    let updatedHabits = [...(user.habitGoals || [])];
    
    if (editingHabitIndex !== null) {
      updatedHabits[editingHabitIndex] = newHabit;
    } else {
      updatedHabits.push(newHabit);
    }

    const updatedUser = {
      ...user,
      habitGoals: updatedHabits,
      selectedHabits: updatedHabits.map(h => h.habitId)
    };
    
    onUpdateUser(updatedUser);
    setShowHabitManager(false);
    setEditingHabitIndex(null);
    resetHabitForm();
    
    toast({
      title: editingHabitIndex !== null ? "تم التعديل! ✨" : "تم الإضافة! 🎯",
      description: editingHabitIndex !== null ? "تم تعديل العادة بنجاح" : "تم إضافة العادة الجديدة بنجاح",
    });
  };

  const handleEditHabit = (index: number) => {
    const habit = (user.habitGoals || [])[index];
    setHabitForm({
      name: habit.name,
      goal: habit.goal,
      details: habit.details || '',
      priority: habit.priority,
      type: habit.type,
      endDate: habit.endDate || ''
    });
    setEditingHabitIndex(index);
    setShowHabitManager(true);
  };

  const handleDeleteHabit = (index: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه العادة؟')) {
      const updatedHabits = (user.habitGoals || []).filter((_, i) => i !== index);
      const updatedUser = {
        ...user,
        habitGoals: updatedHabits,
        selectedHabits: updatedHabits.map(h => h.habitId)
      };
      
      onUpdateUser(updatedUser);
      
      toast({
        title: "تم الحذف! 🗑️",
        description: "تم حذف العادة بنجاح",
      });
    }
  };

  const resetHabitForm = () => {
    setHabitForm({
      name: '',
      goal: '',
      details: '',
      priority: 2,
      type: 'يومية',
      endDate: ''
    });
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1: return 'عالي';
      case 2: return 'متوسط';
      case 3: return 'منخفض';
      default: return 'متوسط';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      if (onLogout) {
        onLogout();
        toast({
          title: "تم تسجيل الخروج",
          description: "تم تسجيل خروجك بنجاح",
        });
      }
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
            <Badge className={`${subscriptionStatus.isTrial
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
                      className={`justify-start h-auto p-2 ${isSelected
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
                    className="w-full mt-3 bg-success text-success-foreground">
                    حفظ التغييرات
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>

        {/* إدارة العادات المخصصة */}
        <Card className="shadow-card border-card">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Target className="w-5 h-5 ml-2" />
              إدارة العادات المخصصة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/70 mb-4">
              عرض وتعديل وإضافة عاداتك المخصصة مع تفاصيلها الكاملة.
            </p>
            
            {/* عرض العادات الحالية */}
            {user.habitGoals && user.habitGoals.length > 0 ? (
              <div className="space-y-3 mb-4">
                {user.habitGoals.map((habit, index) => (
                  <div key={habit.habitId} className="bg-card rounded-lg p-3 border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-primary">{habit.name}</h4>
                        <p className="text-sm text-muted-foreground">{habit.goal}</p>
                        {habit.details && (
                          <p className="text-xs text-muted-foreground/70 mt-1">{habit.details}</p>
                        )}
                        <div className="flex items-center space-x-2 space-x-reverse mt-2">
                          <Badge className={getPriorityColor(habit.priority)}>
                            {getPriorityText(habit.priority)}
                          </Badge>
                          <span className="text-xs text-muted-foreground/70">{habit.type}</span>
                          {habit.endDate && (
                            <span className="text-xs text-muted-foreground/70">
                              حتى: {new Date(habit.endDate).toLocaleDateString('ar')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1 space-x-reverse ml-2">
                        <Button
                          onClick={() => handleEditHabit(index)}
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteHabit(index)}
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground/70">
                <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>لم تقم بإضافة أي عادات مخصصة بعد</p>
              </div>
            )}
            
            <Button
              onClick={() => {
                resetHabitForm();
                setEditingHabitIndex(null);
                setShowHabitManager(true);
              }}
              className="w-full border-purple-300 text-primary hover:bg-purple-50"
              variant="outline"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة عادة جديدة
            </Button>
          </CardContent>
        </Card>

        {/* نموذج إدارة العادة */}
        {showHabitManager && (
          <Card className="shadow-card border-card">
            <CardHeader>
              <CardTitle className="text-primary">
                {editingHabitIndex !== null ? 'تعديل العادة' : 'إضافة عادة جديدة'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">اسم العادة *</label>
                <Input
                  value={habitForm.name}
                  onChange={(e) => setHabitForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثلاً: قراءة الكتب"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">الهدف *</label>
                <Input
                  value={habitForm.goal}
                  onChange={(e) => setHabitForm(prev => ({ ...prev, goal: e.target.value }))}
                  placeholder="مثلاً: قراءة 20 صفحة يومياً"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">تفاصيل إضافية</label>
                <Input
                  value={habitForm.details}
                  onChange={(e) => setHabitForm(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="أي ملاحظات أو تفاصيل إضافية..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">الأولوية</label>
                  <select
                    value={habitForm.priority}
                    onChange={(e) => setHabitForm(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value={1}>عالي</option>
                    <option value={2}>متوسط</option>
                    <option value={3}>منخفض</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">النوع</label>
                  <select
                    value={habitForm.type}
                    onChange={(e) => setHabitForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="يومية">يومية</option>
                    <option value="أسبوعية">أسبوعية</option>
                    <option value="مؤقتة">مؤقتة</option>
                    <option value="شهرية">شهرية</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">تاريخ النهاية (اختياري)</label>
                <Input
                  type="date"
                  value={habitForm.endDate}
                  onChange={(e) => setHabitForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              
              <div className="flex space-x-3 space-x-reverse pt-4">
                <Button
                  onClick={handleSaveHabit}
                  className="flex-1 bg-primary hover:bg-blue-700 text-white"
                >
                  <Check className="w-4 h-4 ml-2" />
                  {editingHabitIndex !== null ? 'حفظ التعديل' : 'إضافة العادة'}
                </Button>
                <Button
                  onClick={() => {
                    setShowHabitManager(false);
                    setEditingHabitIndex(null);
                    resetHabitForm();
                  }}
                  variant="outline"
                  className="border-gray-300 text-muted-foreground hover:bg-card"
                >
                  <X className="w-4 h-4 ml-2" />
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* إدارة الحساب */}
        <Card className="shadow-card border-card">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <User className="w-5 h-5 ml-2" />
              إدارة الحساب والأمان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/70 mb-4">
              تغيير معلوماتك الشخصية، كلمة المرور، وإعدادات الأمان.
            </p>
            <Button
              onClick={() => onNavigate('account')}
              variant="outline"
              className="w-full border-blue-300 text-primary hover:bg-blue-50"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              الانتقال لإدارة الحساب
            </Button>
          </CardContent>
        </Card>

        {/* تسجيل الخروج */}
        {onLogout && (
          <Card className="shadow-card border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <LogOut className="w-5 h-5 ml-2" />
                تسجيل الخروج
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70 mb-4">
                سيتم تسجيل خروجك من الحساب والعودة لشاشة تسجيل الدخول.
              </p>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </CardContent>
          </Card>
        )}

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