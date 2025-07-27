import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "مرحباً بك في مُجاهدة",
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
      title: "ابدأ رحلتك الآن",
      description: "اختر 3 عادات بسيطة وابدأ رحلة التطوير مع دعم وتحفيز يومي",
      icon: "🚀",
      gradient: "gradient-success"
    }
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={`mobile-container ${currentStepData.gradient} flex flex-col`}>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-white space-y-8">
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
          </div>
        </div>
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
            className="text-white hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5 ml-2" />
            السابق
          </Button>

          <Button
            onClick={nextStep}
            className="bg-white text-primary-dark hover:bg-white/90 shadow-button px-8"
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