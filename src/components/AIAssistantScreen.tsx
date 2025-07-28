import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Bot, Zap, Crown, Lock, Send, Lightbulb, Target, TrendingUp, MessageCircle } from 'lucide-react';
import { hasFeatureAccessWithTrial, activatePremiumTrial, getUpgradeMessage } from '@/utils/subscriptionManager';
import { toast } from '@/hooks/use-toast';
import PremiumWarningScreen from './PremiumWarningScreen';

interface AIAssistantScreenProps {
  onBack: () => void;
  onUpgrade: () => void;
  userHabits: any[];
  userProgress: any[];
}

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'tip' | 'warning' | 'achievement' | 'suggestion';
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

const AIAssistantScreen = ({ onBack, onUpgrade, userHabits, userProgress }: AIAssistantScreenProps) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');

  const { access: hasAccess, isTrialActive, trialEnded } = hasFeatureAccessWithTrial('ai_assistant');

  useEffect(() => {
    if (hasAccess) {
      initializeAI();
      generateInsights();
    }
  }, [hasAccess]);

  const initializeAI = () => {
    const welcomeMessage: AIMessage = {
      id: '1',
      type: 'ai',
      content: 'مرحباً! أنا مساعدك الذكي في رحلة تطوير العادات. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
      suggestions: [
        'كيف يمكنني تحسين عاداتي؟',
        'اقترح لي عادة جديدة',
        'لماذا أفشل في الالتزام؟',
        'ما هو أفضل وقت للتمرين؟'
      ]
    };
    setMessages([welcomeMessage]);
  };

  const generateInsights = () => {
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        title: 'تحسين وقت النوم',
        description: 'لاحظت أن أداءك يتحسن عندما تنام قبل الساعة 11 مساءً. حاول الالتزام بهذا الوقت.',
        type: 'tip',
        icon: '🌙',
        priority: 'high'
      },
      {
        id: '2',
        title: 'إنجاز رائع!',
        description: 'لقد حافظت على عادة القراءة لمدة 15 يوماً متتالياً. أنت في الطريق الصحيح!',
        type: 'achievement',
        icon: '🎉',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'تنبيه: انخفاض في الأداء',
        description: 'أداؤك في عادة التمارين انخفض بنسبة 30% هذا الأسبوع. هل تحتاج لتعديل الجدول؟',
        type: 'warning',
        icon: '⚠️',
        priority: 'high'
      },
      {
        id: '4',
        title: 'اقتراح عادة جديدة',
        description: 'بناءً على اهتماماتك، أقترح إضافة عادة "التأمل لمدة 10 دقائق" في الصباح.',
        type: 'suggestion',
        icon: '🧘‍♂️',
        priority: 'medium'
      }
    ];
    setInsights(mockInsights);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // محاكاة رد المساعد الذكي
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string) => {
    const responses = {
      'تحسين': {
        content: 'لتحسين عاداتك، أنصحك بـ:\n\n1. البدء بخطوات صغيرة\n2. ربط العادة الجديدة بعادة موجودة\n3. تتبع التقدم يومياً\n4. مكافأة نفسك عند تحقيق الأهداف\n\nما العادة التي تريد تحسينها تحديداً؟',
        suggestions: ['عادة القراءة', 'التمارين الرياضية', 'النوم المبكر', 'شرب الماء']
      },
      'اقترح': {
        content: 'بناءً على تحليل بياناتك، إليك بعض العادات المقترحة:\n\n🧘‍♂️ التأمل (10 دقائق يومياً)\n📚 القراءة (20 صفحة يومياً)\n💧 شرب الماء (8 أكواب يومياً)\n🚶‍♂️ المشي (30 دقيقة يومياً)\n\nأي منها يثير اهتمامك؟',
        suggestions: ['التأمل', 'القراءة', 'شرب الماء', 'المشي']
      },
      'فشل': {
        content: 'عدم الالتزام أمر طبيعي! إليك الأسباب الشائعة والحلول:\n\n❌ أهداف كبيرة جداً → ابدأ بخطوات صغيرة\n❌ عدم وجود تذكيرات → استخدم التنبيهات\n❌ عدم رؤية النتائج → ركز على العملية وليس النتيجة\n❌ عدم وجود دافع → اربط العادة بهدف أكبر\n\nما التحدي الأكبر الذي تواجهه؟',
        suggestions: ['أهداف كبيرة', 'نسيان العادة', 'عدم الدافع', 'ضيق الوقت']
      },
      'وقت': {
        content: 'أفضل وقت للتمرين يعتمد على نمط حياتك:\n\n🌅 الصباح الباكر (6-8 ص):\n• طاقة عالية\n• أقل انشغالات\n• يحفز باقي اليوم\n\n🌆 المساء (5-7 م):\n• تفريغ ضغوط اليوم\n• وقت أكثر مرونة\n• يساعد على النوم\n\nمتى تشعر بأعلى طاقة؟',
        suggestions: ['الصباح الباكر', 'بعد الظهر', 'المساء', 'غير متأكد']
      }
    };

    // البحث عن كلمات مفتاحية في رسالة المستخدم
    for (const [key, response] of Object.entries(responses)) {
      if (userInput.includes(key)) {
        return response;
      }
    }

    // رد افتراضي
    return {
      content: 'شكراً لسؤالك! أحتاج لمزيد من التفاصيل لأتمكن من مساعدتك بشكل أفضل. هل يمكنك توضيح ما تحتاج إليه تحديداً؟',
      suggestions: ['نصائح عامة', 'تحليل أدائي', 'اقتراح عادات', 'حل مشكلة']
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'tip': return 'border-blue-200 bg-blue-50';
      case 'warning': return 'border-red-200 bg-red-50';
      case 'achievement': return 'border-green-200 bg-green-50';
      case 'suggestion': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
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
        featureName="مساعد ذكي"
        featureDescription="مساعد ذكي مخصص لتطوير العادات ورؤى مخصصة متاح فقط للمشتركين."
        featureIcon={<Bot className="w-8 h-8 text-blue-500" />}
        onBack={onBack}
        onUpgrade={onUpgrade}
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
        <div className="flex items-center space-x-4 space-x-reverse mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-motivation-foreground hover:bg-motivation-foreground/10"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">المساعد الذكي</h1>
          <Badge className="bg-yellow-500 text-white">
            <Crown className="w-3 h-3 ml-1" />
            متقدم
          </Badge>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">🤖</div>
          <p className="opacity-90">مساعدك الشخصي المدعوم بالذكاء الاصطناعي</p>
        </div>
      </div>

      <div className="p-6 space-y-6 mt-12">
        {/* تبديل الأقسام */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            onClick={() => setActiveTab('chat')}
            variant={activeTab === 'chat' ? "default" : "ghost"}
            className={`flex-1 ${activeTab === 'chat' ? 'bg-white shadow-sm' : ''}`}
          >
            <MessageCircle className="w-4 h-4 ml-1" />
            المحادثة
          </Button>
          <Button
            onClick={() => setActiveTab('insights')}
            variant={activeTab === 'insights' ? "default" : "ghost"}
            className={`flex-1 ${activeTab === 'insights' ? 'bg-white shadow-sm' : ''}`}
          >
            <Lightbulb className="w-4 h-4 ml-1" />
            الرؤى الذكية
          </Button>
        </div>

        {/* محتوى المحادثة */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            {/* منطقة الرسائل */}
            <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border shadow-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    
                    {/* اقتراحات الرد */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-right text-xs p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* مؤشر الكتابة */}
              {isTyping && (
                <div className="flex justify-end">
                  <div className="bg-white border shadow-sm p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* منطقة الإدخال */}
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 text-right"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* محتوى الرؤى الذكية */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">رؤى ذكية مخصصة</h2>
              <Badge variant="outline">{insights.length} رؤية</Badge>
            </div>

            {insights.map((insight) => (
              <Card key={insight.id} className={`shadow-card border-2 ${getInsightColor(insight.type)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="text-2xl ml-3">{insight.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            insight.priority === 'high' ? 'border-red-300 text-red-600' :
                            insight.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                            'border-gray-300 text-gray-600'
                          }`}
                        >
                          {insight.priority === 'high' ? 'عالي' : 
                           insight.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

export default AIAssistantScreen;
