import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Heart, BookOpen, Star, Volume2, VolumeX, Play, Pause, Crown } from 'lucide-react';
import { hasFeatureAccessWithTrial, activatePremiumTrial } from '@/utils/subscriptionManager';
import PremiumWarningScreen from './PremiumWarningScreen';

interface SpiritualScreenProps {
  onBack: () => void;
}

interface PrayerTime {
  name: string;
  time: string;
  arabic: string;
  passed: boolean;
  current: boolean;
}

interface Dhikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  reward: string;
}

const SpiritualScreen = ({ onBack }: SpiritualScreenProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dhikrCount, setDhikrCount] = useState<{ [key: string]: number }>({});
  const [selectedDhikr, setSelectedDhikr] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const { access: hasAccess, isTrialActive, trialEnded } = hasFeatureAccessWithTrial('spiritual');

  // أوقات الصلاة (بيانات تجريبية - يجب ربطها بـ API حقيقي)
  const prayerTimes: PrayerTime[] = [
    { name: 'الفجر', time: '05:30', arabic: 'الفجر', passed: currentTime.getHours() > 5 || (currentTime.getHours() === 5 && currentTime.getMinutes() >= 30), current: false },
    { name: 'الشروق', time: '06:45', arabic: 'الشروق', passed: currentTime.getHours() > 6 || (currentTime.getHours() === 6 && currentTime.getMinutes() >= 45), current: false },
    { name: 'الظهر', time: '12:15', arabic: 'الظهر', passed: currentTime.getHours() > 12 || (currentTime.getHours() === 12 && currentTime.getMinutes() >= 15), current: false },
    { name: 'العصر', time: '15:30', arabic: 'العصر', passed: currentTime.getHours() > 15 || (currentTime.getHours() === 15 && currentTime.getMinutes() >= 30), current: false },
    { name: 'المغرب', time: '18:00', arabic: 'المغرب', passed: currentTime.getHours() > 18, current: false },
    { name: 'العشاء', time: '19:30', arabic: 'العشاء', passed: currentTime.getHours() > 19 || (currentTime.getHours() === 19 && currentTime.getMinutes() >= 30), current: false },
  ];

  // الأذكار
  const adhkar: Dhikr[] = [
    {
      id: 'subhan_allah',
      arabic: 'سُبْحَانَ اللَّهِ',
      transliteration: 'Subhan Allah',
      translation: 'سبحان الله',
      count: 33,
      reward: 'تسبيح الله عز وجل'
    },
    {
      id: 'alhamdulillah',
      arabic: 'الْحَمْدُ لِلَّهِ',
      transliteration: 'Alhamdulillah',
      translation: 'الحمد لله',
      count: 33,
      reward: 'حمد الله عز وجل'
    },
    {
      id: 'allahu_akbar',
      arabic: 'اللَّهُ أَكْبَرُ',
      transliteration: 'Allahu Akbar',
      translation: 'الله أكبر',
      count: 34,
      reward: 'تكبير الله عز وجل'
    },
    {
      id: 'la_ilaha_illa_allah',
      arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
      transliteration: 'La ilaha illa Allah',
      translation: 'لا إله إلا الله',
      count: 100,
      reward: 'كلمة التوحيد'
    },
    {
      id: 'astaghfirullah',
      arabic: 'أَسْتَغْفِرُ اللَّهَ',
      transliteration: 'Astaghfirullah',
      translation: 'أستغفر الله',
      count: 100,
      reward: 'الاستغفار'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // تحميل عدادات الأذكار من التخزين المحلي
    const savedCounts = localStorage.getItem('dhikr_counts');
    if (savedCounts) {
      setDhikrCount(JSON.parse(savedCounts));
    }
  }, []);

  const handleDhikrClick = (dhikrId: string) => {
    const newCount = (dhikrCount[dhikrId] || 0) + 1;
    const updatedCounts = { ...dhikrCount, [dhikrId]: newCount };
    setDhikrCount(updatedCounts);
    localStorage.setItem('dhikr_counts', JSON.stringify(updatedCounts));

    // تشغيل صوت (محاكاة)
    if (soundEnabled) {
      // يمكن إضافة صوت حقيقي هنا
      console.log('Playing dhikr sound');
    }
  };

  const resetDhikrCount = (dhikrId: string) => {
    const updatedCounts = { ...dhikrCount, [dhikrId]: 0 };
    setDhikrCount(updatedCounts);
    localStorage.setItem('dhikr_counts', JSON.stringify(updatedCounts));
  };

  const getNextPrayer = () => {
    const now = currentTime;
    for (const prayer of prayerTimes) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);
      
      if (prayerTime > now) {
        return prayer;
      }
    }
    return prayerTimes[0]; // الفجر في اليوم التالي
  };

  const getTimeUntilNextPrayer = () => {
    const nextPrayer = getNextPrayer();
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);
    
    if (prayerTime < currentTime) {
      prayerTime.setDate(prayerTime.getDate() + 1);
    }
    
    const diff = prayerTime.getTime() - currentTime.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursLeft}:${minutesLeft.toString().padStart(2, '0')}`;
  };

  if (!hasAccess) {
    return (
      <PremiumWarningScreen
        featureName="ميزات روحانية"
        featureDescription="أوقات الصلاة وعداد الأذكار والميزات الروحانية متاحة فقط للمشتركين."
        featureIcon={<Heart className="w-8 h-8 text-red-500" />}
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

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* الهيدر */}
      <div className="gradient-motivation text-motivation-foreground p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-motivation-foreground hover:bg-motivation-foreground/10"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          
          <h1 className="text-2xl font-bold">الميزات الروحانية</h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-motivation-foreground hover:bg-motivation-foreground/10"
          >
            {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </Button>
        </div>

        <div className="text-center">
          <div className="text-4xl mb-2">🕌</div>
          <p className="text-motivation-foreground/90">
            {currentTime.toLocaleTimeString('ar-SA', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* الصلاة القادمة */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-green-600 ml-2" />
                <h3 className="text-xl font-bold text-gray-800">الصلاة القادمة</h3>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {getNextPrayer().name}
                </div>
                <div className="text-lg text-gray-600">
                  {getNextPrayer().time}
                </div>
                <div className="text-sm text-gray-500">
                  متبقي: {getTimeUntilNextPrayer()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* أوقات الصلاة */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 ml-2 text-blue-500" />
              أوقات الصلاة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prayerTimes.map((prayer, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    prayer.current ? 'bg-green-100 border-2 border-green-300' :
                    prayer.passed ? 'bg-gray-100' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ml-3 ${
                      prayer.current ? 'bg-green-500' :
                      prayer.passed ? 'bg-gray-400' : 'bg-blue-500'
                    }`}></div>
                    <span className={`font-medium ${
                      prayer.passed ? 'text-gray-500' : 'text-gray-800'
                    }`}>
                      {prayer.name}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    prayer.passed ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {prayer.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* عداد الأذكار */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 ml-2 text-red-500" />
              عداد الأذكار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adhkar.map((dhikr) => (
                <div key={dhikr.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-blue-800 mb-2">
                      {dhikr.arabic}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {dhikr.transliteration}
                    </div>
                    <div className="text-xs text-gray-500">
                      {dhikr.reward}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {dhikrCount[dhikr.id] || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        من {dhikr.count}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 space-x-reverse">
                      <Button
                        onClick={() => handleDhikrClick(dhikr.id)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                      >
                        <Heart className="w-4 h-4 ml-1" />
                        سبح
                      </Button>
                      
                      <Button
                        onClick={() => resetDhikrCount(dhikr.id)}
                        variant="outline"
                        size="sm"
                      >
                        إعادة
                      </Button>
                    </div>
                  </div>
                  
                  {/* شريط التقدم */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(((dhikrCount[dhikr.id] || 0) / dhikr.count) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
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

export default SpiritualScreen;
