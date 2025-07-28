import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { availableHabits } from '@/data/habits';
import { HabitGoal } from '@/types';

interface OnboardingScreenProps {
  onComplete: (habitGoals: HabitGoal[]) => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [customHabits, setCustomHabits] = useState<HabitGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<number | null>(null);
  
  // نموذج إضافة/تعديل عادة
  const [habitForm, setHabitForm] = useState({
    name: '',
    goal: '',
    details: '',
    priority: 2, // متوسط
    type: 'يومية',
    endDate: ''
  });

  const steps = [
    {
      title: "مرحباً بك في خطوة",
      description: "التطبيق الذي سيساعدك على بناء عادات إيجابية تغير حياتك للأفضل",
      icon: "🌟",
      gradient: "gradient-primary"
    },
    {
      title: "خطوة بخطوة",
      description: "نؤمن أن التغيير الحقيقي يحدث بالخطوات الصغيرة والثبات اليومي",
      icon: "👣",
      gradient: "gradient-motivation"
    },
    {
      title: "أضف عاداتك المخصصة",
      description: "أضف عادات مخصصة بتفاصيل دقيقة أو اختر من القائمة المقترحة",
      icon: "🎯",
      gradient: "gradient-success"
    }
  ];

  const currentStepData = steps[currentStep];

  const resetForm = () => {
    setHabitForm({
      name: '',
      goal: '',
      details: '',
      priority: 2,
      type: 'يومية',
      endDate: ''
    });
  };

  const handleAddFromSuggested = (habit: any) => {
    const newHabit: HabitGoal = {
      habitId: `custom_${Date.now()}`,
      name: habit.name,
      goal: habit.description,
      details: `عادة مقترحة: ${habit.description}`,
      priority: 2,
      type: 'يومية',
      endDate: ''
    };
    setCustomHabits(prev => [...prev, newHabit]);
  };

  const handleSaveHabit = () => {
    if (!habitForm.name.trim() || !habitForm.goal.trim()) {
      toast.error('يرجى إدخال اسم العادة والهدف على الأقل');
      return;
    }

    const newHabit: HabitGoal = {
      habitId: editingIndex !== null ? customHabits[editingIndex].habitId : `custom_${Date.now()}`,
      name: habitForm.name.trim(),
      goal: habitForm.goal.trim(),
      details: habitForm.details.trim(),
      priority: habitForm.priority,
      type: habitForm.type,
      endDate: habitForm.endDate
    };

    if (editingIndex !== null) {
      // تعديل عادة موجودة
      setCustomHabits(prev => prev.map((habit, index) => 
        index === editingIndex ? newHabit : habit
      ));
      setEditingIndex(null);
    } else {
      // إضافة عادة جديدة
      setCustomHabits(prev => [...prev, newHabit]);
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEditHabit = (index: number) => {
    const habit = customHabits[index];
    setHabitForm({
      name: habit.name,
      goal: habit.goal,
      details: habit.details || '',
      priority: habit.priority,
      type: habit.type,
      endDate: habit.endDate || ''
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const confirmDeleteHabit = () => {
    if (habitToDelete !== null) {
      setCustomHabits(prev => prev.filter((_, i) => i !== habitToDelete));
      setHabitToDelete(null);
      toast.success('تم حذف العادة بنجاح');
    }
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
      case 1: return 'bg-red-500/20 text-red-100 border-red-300';
      case 2: return 'bg-yellow-500/20 text-yellow-100 border-yellow-300';
      case 3: return 'bg-muted/20 text-muted-foreground border-muted';
      default: return 'bg-yellow-500/20 text-yellow-100 border-yellow-300';
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // تأكد من إضافة عادة واحدة على الأقل
      if (customHabits.length === 0) {
        alert('يرجى إضافة عادة واحدة على الأقل');
        return;
      }
      onComplete(customHabits);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [goalInput, setGoalInput] = useState('');

  return (
    <div className={`h-full flex flex-col justify-between bg-cover bg-center ${currentStepData.gradient}`}>
      <AlertDialog open={habitToDelete !== null} onOpenChange={() => setHabitToDelete(null)}>
        <AlertDialogContent className="bg-card border-card text-primary">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription className="text-primary/70">
              سيتم حذف هذه العادة بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-primary/20 hover:bg-primary/10 text-primary">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteHabit} className="bg-red-500 hover:bg-red-600 text-white">تأكيد الحذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex-1 flex items-center justify-center p-8">
        {currentStep < 2 ? (
          <div className="text-center text-primary space-y-8">
            <div className="text-8xl mb-8 animate-bounce">
              {currentStepData.icon}
            </div>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold leading-relaxed">
                {currentStepData.title}
              </h1>
              <p className="text-lg opacity-90 leading-relaxed max-w-sm mx-auto">
                {currentStepData.description}
              </p>
              {/* حقل هدف المستخدم الرئيسي */}
              {currentStep === 1 && (
                <div className="max-w-xs mx-auto mt-8">
                  <label className="block mb-2 text-primary/80 text-sm font-medium">حدد هدفك الرئيسي</label>
                  <Input
                    value={goalInput}
                    onChange={e => setGoalInput(e.target.value)}
                    placeholder="مثلاً: تطوير الذات أو الصحة أو الإنتاجية"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <div className="text-center text-primary space-y-4 mb-6">
              <div className="text-6xl mb-4">{currentStepData.icon}</div>
              <h1 className="text-2xl font-bold">{currentStepData.title}</h1>
              <p className="opacity-90">{currentStepData.description}</p>
            </div>
            
            {/* نموذج إضافة/تعديل عادة */}
            {showAddForm && (
              <Card className="bg-card border-card mb-6">
                <CardHeader>
                  <CardTitle className="text-primary text-center">
                    {editingIndex !== null ? 'تعديل العادة' : 'إضافة عادة جديدة'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-primary/80 text-sm block mb-2">اسم العادة *</label>
                    <Input
                      value={habitForm.name}
                      onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
                      placeholder="مثلاً: قراءة الكتب"
                      className="bg-card border-card/60 text-primary placeholder:text-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label className="text-primary/80 text-sm block mb-2">الهدف *</label>
                    <Input
                      value={habitForm.goal}
                      onChange={(e) => setHabitForm({ ...habitForm, goal: e.target.value })}
                      placeholder="مثلاً: قراءة 20 صفحة يومياً"
                      className="bg-card border-card/60 text-primary placeholder:text-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label className="text-primary/80 text-sm block mb-2">تفاصيل إضافية</label>
                    <Textarea
                      value={habitForm.details}
                      onChange={(e) => setHabitForm({ ...habitForm, details: e.target.value })}
                      placeholder="(اختياري) أضف تفاصيل إضافية تساعدك على الالتزام"
                      className="bg-card border-card/60 text-primary placeholder:text-primary/50 resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-primary/80 text-sm block mb-2">الأولوية</label>
                      <Select
                        value={String(habitForm.priority)}
                        onValueChange={(value) => setHabitForm({ ...habitForm, priority: Number(value) })}
                      >
                        <SelectTrigger className="bg-card border-card/60 text-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">عالي</SelectItem>
                          <SelectItem value="2">متوسط</SelectItem>
                          <SelectItem value="3">منخفض</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-primary/80 text-sm block mb-2">النوع</label>
                      <Select
                        value={habitForm.type}
                        onValueChange={(value) => setHabitForm({ ...habitForm, type: value })}
                      >
                        <SelectTrigger className="bg-card border-card/60 text-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="يومية">يومية</SelectItem>
                          <SelectItem value="أسبوعية">أسبوعية</SelectItem>
                          <SelectItem value="مؤقتة">مؤقتة</SelectItem>
                          <SelectItem value="شهرية">شهرية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-primary/80 text-sm block mb-2">تاريخ النهاية (اختياري)</label>
                    <Input
                      type="date"
                      value={habitForm.endDate}
                      onChange={(e) => setHabitForm({ ...habitForm, endDate: e.target.value })}
                      className="bg-card border-card/60 text-primary"
                    />
                  </div>
                  
                  <div className="flex space-x-3 space-x-reverse pt-4">
                    <Button
                      onClick={handleSaveHabit}
                      className="flex-1 bg-white text-primary-foreground hover:bg-white/90"
                    >
                      <Check className="w-4 h-4 ml-2" />
                      {editingIndex !== null ? 'حفظ التعديل' : 'إضافة العادة'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingIndex(null);
                        resetForm();
                      }}
                      variant="outline"
                      className="border-card/60 text-primary hover:bg-card"
                    >
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* العادات المضافة */}
            <Card className="bg-card border-card mb-6">
              <CardHeader>
                <CardTitle className="text-primary text-center flex items-center justify-between">
                  <span>عاداتك المخصصة ({customHabits.length})</span>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    size="sm"
                    className="bg-primary/10 hover:bg-primary/20 text-primary"
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {customHabits.length === 0 ? (
                  <div className="text-center text-primary/70 py-8">
                    <div className="text-4xl mb-4">📝</div>
                    <p>لم تقم بإضافة أي عادات بعد</p>
                    <p className="text-sm mt-2">اضغط على "إضافة" لبدء إضافة عاداتك المخصصة</p>
                  </div>
                ) : (
                  customHabits.map((habit, index) => (
                    <div key={habit.habitId} className="bg-white/5 border border-card rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-primary font-medium text-lg">{habit.name}</h3>
                          <p className="text-primary/80 text-sm">{habit.goal}</p>
                          {habit.details && (
                            <p className="text-primary/60 text-xs mt-1">{habit.details}</p>
                          )}
                        </div>
                        <div className="flex space-x-2 space-x-reverse ml-3">
                          <Button
                            onClick={() => handleEditHabit(index)}
                            size="sm"
                            variant="ghost"
                            className="text-primary/80 hover:bg-card"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setHabitToDelete(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 space-x-reverse text-xs">
                        <span className={`px-2 py-1 rounded border ${getPriorityColor(habit.priority)}`}>
                          {getPriorityText(habit.priority)}
                        </span>
                        <span className="text-primary/60">{habit.type}</span>
                        {habit.endDate && (
                          <span className="text-primary/60">حتى: {new Date(habit.endDate).toLocaleDateString('ar')}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            
            {/* العادات المقترحة */}
            <Card className="bg-card border-card">
              <CardHeader>
                <CardTitle className="text-primary text-center">
                  أو اختر من العادات المقترحة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {availableHabits.slice(0, 6).map((habit) => (
                    <Button
                      key={habit.id}
                      onClick={() => handleAddFromSuggested(habit)}
                      variant="outline"
                      className="border-card/60 text-primary hover:bg-card h-auto p-3 flex flex-col items-center space-y-2"
                    >
                      <span className="text-2xl">{habit.icon}</span>
                      <span className="text-sm text-center">{habit.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="p-8 space-y-6">
        {/* نقاط التقدم */}
        <div className="flex justify-center space-x-3 space-x-reverse">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-white' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* أزرار التنقل */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-primary hover:bg-primary/10 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5 ml-2" />
            السابق
          </Button>

          <Button
            onClick={nextStep}
            className="bg-white text-primary-foreground hover:bg-white/90 shadow-button px-8"
            disabled={currentStep === steps.length - 1 && customHabits.length === 0}
          >
            {currentStep === steps.length - 1 ? 'ابدأ الآن' : 'التالي'}
            <ChevronLeft className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;