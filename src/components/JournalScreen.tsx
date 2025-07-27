import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Heart, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface JournalScreenProps {
  onBack: () => void;
  onSaveEntry: (entry: string) => void;
  currentEntry?: string;
}

const JournalScreen = ({ onBack, onSaveEntry, currentEntry = '' }: JournalScreenProps) => {
  const [entry, setEntry] = useState(currentEntry);

  const handleSave = () => {
    if (entry.trim()) {
      onSaveEntry(entry.trim());
      toast({
        title: "تم الحفظ! 💜",
        description: "تم حفظ مشاعرك في مفكرتك اليومية",
      });
    }
  };

  const prompts = [
    "كيف كان شعورك اليوم؟",
    "ما هو أفضل شيء حدث لك اليوم؟",
    "ما الذي تعلمته اليوم؟",
    "ما هي ثلاثة أشياء تشعر بالامتنان لها؟",
    "كيف ساعدتك عاداتك اليوم؟"
  ];

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
          <h1 className="text-2xl font-bold">مفكرتك اليومية</h1>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">📔</div>
          <p className="opacity-90">شاركنا مشاعرك وأفكارك اليوم</p>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-6">
        {/* أسئلة للإلهام */}
        <Card className="shadow-card border-motivation/20">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Heart className="w-5 h-5 ml-2 text-motivation" />
              أسئلة لتحفيز التفكير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {prompts.map((prompt, index) => (
                <div key={index} className="text-sm text-foreground/70 p-2 bg-motivation-light/30 rounded-lg">
                  • {prompt}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* منطقة الكتابة */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <Textarea
              placeholder="اكتب مشاعرك وأفكارك هنا... لا توجد قيود أو قواعد، فقط عبر عن نفسك بحرية."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="min-h-48 text-lg leading-relaxed border-0 resize-none focus:ring-0 focus:outline-none"
              style={{ direction: 'rtl' }}
            />
            
            <div className="flex justify-between items-center mt-4 text-sm text-foreground/50">
              <span>{entry.length} حرف</span>
              <span>{new Date().toLocaleDateString('ar-SA')}</span>
            </div>
          </CardContent>
        </Card>

        {/* أزرار الحفظ والإجراءات */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            disabled={!entry.trim()}
            className="w-full h-14 text-lg gradient-motivation text-motivation-foreground shadow-button disabled:opacity-50"
          >
            <Save className="w-5 h-5 ml-2" />
            حفظ المفكرة
          </Button>
          
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12"
          >
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JournalScreen;