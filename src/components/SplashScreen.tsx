import { useEffect, useState } from 'react';
import logoImage from '@/assets/logo.png';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  const inspirationalQuotes = [
    "كل يوم خطوة... كل يوم مجاهدة",
    "النجاح يبدأ بخطوة واحدة",
    "اجعل كل يوم أفضل من الذي قبله",
    "قوتك الحقيقية في استمراريتك"
  ];

  useEffect(() => {
    // إظهار المحتوى تدريجياً
    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // تحديث شريط التقدم
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 800);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // تغيير الاقتباسات
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % inspirationalQuotes.length);
    }, 1500);

    return () => {
      clearTimeout(showTimer);
      clearInterval(progressInterval);
      clearInterval(quoteInterval);
    };
  }, [onComplete]);

  return (
    <div className="mobile-container relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* دوائر متحركة في الخلفية */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-purple-400/10 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-blue-400/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-indigo-400/10 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        
        {/* تأثير الجسيمات */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-white">
        {/* الشعار */}
        <div className={`transition-all duration-1000 transform ${
          showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
        }`}>
          <div className="relative mb-8">
            {/* هالة حول الشعار */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20">
              <img 
                src={logoImage} 
                alt="Khatoa Logo" 
                className="w-24 h-24 mx-auto filter drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* اسم التطبيق */}
        <div className={`transition-all duration-1000 delay-300 transform ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            خطوة
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mb-8"></div>
        </div>

        {/* الاقتباسات المتحركة */}
        <div className={`transition-all duration-1000 delay-500 transform ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="h-16 flex items-center justify-center mb-12">
            <p className="text-xl text-center px-6 transition-all duration-500 transform">
              {inspirationalQuotes[currentQuote]}
            </p>
          </div>
        </div>

        {/* شريط التقدم الإبداعي */}
        <div className={`w-full max-w-xs transition-all duration-1000 delay-700 transform ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="relative">
            {/* خلفية شريط التقدم */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              {/* شريط التقدم */}
              <div 
                className="h-full bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* تأثير اللمعان */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            {/* نسبة التقدم */}
            <div className="text-center mt-4">
              <span className="text-sm text-white/70">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* نقاط التحميل المتحركة */}
        <div className={`flex space-x-2 mt-8 transition-all duration-1000 delay-900 transform ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white/40 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>

        {/* رسالة التحميل */}
        <div className={`mt-6 transition-all duration-1000 delay-1000 transform ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <p className="text-sm text-white/60 text-center">
            {progress < 30 ? 'جاري التحضير...' : 
             progress < 60 ? 'تحميل البيانات...' : 
             progress < 90 ? 'تجهيز التطبيق...' : 'تم التحميل!'}
          </p>
        </div>
      </div>

      {/* تأثير الانتقال النهائي */}
      {progress >= 100 && (
        <div className="absolute inset-0 bg-gradient-to-t from-purple-600 to-transparent opacity-20 animate-pulse"></div>
      )}
    </div>
  );
};

export default SplashScreen;