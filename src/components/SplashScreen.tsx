import { useEffect } from 'react';
import logoImage from '@/assets/logo.svg';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="mobile-container gradient-primary flex items-center justify-center">
      <div className="text-center text-white space-y-8 p-8">
        <div className="mb-8">
        </div>
        <img src= {logoImage} alt="" />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">خخ</h1>
          <p className="text-xl opacity-90">كل يوم خطوة... كل يوم مجاهدة</p>
        </div>
        
        <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default SplashScreen;