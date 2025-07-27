import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bell, Clock, Volume2, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { User, ReminderSettings } from '@/types';
import { toast } from '@/hooks/use-toast';

interface RemindersScreenProps {
  user: User;
  onBack: () => void;
  onUpdateReminders: (settings: ReminderSettings) => void;
}

const RemindersScreen = ({ user, onBack, onUpdateReminders }: RemindersScreenProps) => {
  const [settings, setSettings] = useState<ReminderSettings>(user.reminderSettings);
  const [newTime, setNewTime] = useState('');

  const handleToggleEnabled = (enabled: boolean) => {
    const updatedSettings = { ...settings, enabled };
    setSettings(updatedSettings);
    onUpdateReminders(updatedSettings);
    
    if (enabled) {
      // طلب إذن التنبيهات
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            toast({
              title: "تم تفعيل التذكيرات! 🔔",
              description: "ستصلك تذكيرات في الأوقات المحددة",
            });
          }
        });
      }
    }
  };

  const handleToggleQuotes = (motivationalQuotes: boolean) => {
    const updatedSettings = { ...settings, motivationalQuotes };
    setSettings(updatedSettings);
    onUpdateReminders(updatedSettings);
  };

  const handleToggleSound = (sound: boolean) => {
    const updatedSettings = { ...settings, sound };
    setSettings(updatedSettings);
    onUpdateReminders(updatedSettings);
  };

  const addTime = () => {
    if (newTime && !settings.times.includes(newTime)) {
      const updatedSettings = {
        ...settings,
        times: [...settings.times, newTime].sort()
      };
      setSettings(updatedSettings);
      onUpdateReminders(updatedSettings);
      setNewTime('');
      toast({
        title: "تم إضافة الوقت! ⏰",
        description: `سيتم تذكيرك في الساعة ${newTime}`,
      });
    }
  };

  const removeTime = (timeToRemove: string) => {
    const updatedSettings = {
      ...settings,
      times: settings.times.filter(time => time !== timeToRemove)
    };
    setSettings(updatedSettings);
    onUpdateReminders(updatedSettings);
    toast({
      title: "تم حذف الوقت",
      description: "لن تصلك تذكيرات في هذا الوقت",
    });
  };

  const scheduleNotification = (time: string, message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const timeUntilNotification = scheduledTime.getTime() - now.getTime();
      
      setTimeout(() => {
        new Notification('مُجاهدة - تذكير', {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }, timeUntilNotification);
    }
  };

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
          <h1 className="text-2xl font-bold">التذكيرات الذكية</h1>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">🔔</div>
          <p className="opacity-90">لا تنس عاداتك اليومية أبداً</p>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-6">
        {/* تفعيل التذكيرات */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 ml-2" />
                تفعيل التذكيرات
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={handleToggleEnabled}
              />
            </CardTitle>
          </CardHeader>
          {settings.enabled && (
            <CardContent>
              <div className="text-sm text-foreground/70">
                سيتم إرسال تذكيرات في الأوقات المحددة لمساعدتك على الالتزام بعاداتك
              </div>
            </CardContent>
          )}
        </Card>

        {settings.enabled && (
          <>
            {/* أوقات التذكير */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 ml-2" />
                  أوقات التذكير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* الأوقات الحالية */}
                <div className="space-y-2">
                  {settings.times.map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">{time}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTime(time)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* إضافة وقت جديد */}
                <div className="flex space-x-2 space-x-reverse">
                  <Input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={addTime}
                    disabled={!newTime || settings.times.includes(newTime)}
                    className="bg-primary text-primary-foreground"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* خيارات التذكير */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>خيارات التذكير</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <MessageCircle className="w-5 h-5 text-motivation" />
                    <div>
                      <div className="font-medium">الاقتباسات التحفيزية</div>
                      <div className="text-sm text-foreground/70">إضافة رسائل ملهمة للتذكيرات</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.motivationalQuotes}
                    onCheckedChange={handleToggleQuotes}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Volume2 className="w-5 h-5 text-success" />
                    <div>
                      <div className="font-medium">الصوت</div>
                      <div className="text-sm text-foreground/70">تشغيل صوت مع التذكيرات</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={handleToggleSound}
                  />
                </div>
              </CardContent>
            </Card>

            {/* معاينة التذكير */}
            <Card className="shadow-card border-motivation/20 bg-motivation-light/20">
              <CardHeader>
                <CardTitle className="text-motivation-foreground">معاينة التذكير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🌱</span>
                    </div>
                    <div className="font-bold">مُجاهدة - تذكير</div>
                  </div>
                  <div className="text-sm">
                    وقت إكمال عاداتك اليومية! 
                    {settings.motivationalQuotes && (
                      <div className="mt-1 italic text-foreground/70">
                        "كل يوم هو فرصة جديدة لتصبح نسخة أفضل من نفسك"
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* اختبار التذكير */}
            <Button
              onClick={() => {
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('مُجاهدة - تذكير تجريبي', {
                    body: settings.motivationalQuotes 
                      ? 'هذا تذكير تجريبي! "النجاح هو مجموع الجهود الصغيرة المتكررة"'
                      : 'هذا تذكير تجريبي!',
                    icon: '/favicon.ico'
                  });
                  toast({
                    title: "تم إرسال التذكير التجريبي! 📱",
                    description: "تحقق من شريط الإشعارات",
                  });
                } else {
                  toast({
                    title: "غير متاح",
                    description: "التذكيرات غير مدعومة في هذا المتصفح",
                    variant: "destructive"
                  });
                }
              }}
              variant="outline"
              className="w-full h-12 border-2 border-dashed"
            >
              اختبار التذكير الآن
            </Button>
          </>
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

export default RemindersScreen;