import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { availableHabits } from '@/data/habits';
import { Check } from 'lucide-react';

interface SelectHabitsProps {
  onComplete: (selectedHabits: string[]) => void;
}

const SelectHabits = ({ onComplete }: SelectHabitsProps) => {
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

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

  const handleContinue = () => {
    if (selectedHabits.length === 3) {
      onComplete(selectedHabits);
    }
  };

  const categories = [...new Set(availableHabits.map(habit => habit.category))];

  return (
    <div className="mobile-container bg-background min-h-screen">
      <div className="p-6 space-y-6">
        {/* الهيدر */}
        <div className="text-center space-y-4 pt-4">
          <div className="text-5xl">🎯</div>
          <h1 className="text-2xl font-bold">اختر 3 عادات للبدء</h1>
          <p className="text-foreground/70">ابدأ بعادات بسيطة وقابلة للتطبيق</p>
          
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm">
              تم اختيار {selectedHabits.length} من 3
            </Badge>
          </div>
        </div>

        {/* العادات مجمعة بالفئات */}
        <div className="space-y-6">
          {categories.map(category => (
            <Card key={category} className="shadow-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableHabits
                    .filter(habit => habit.category === category)
                    .map(habit => {
                      const isSelected = selectedHabits.includes(habit.id);
                      const canSelect = selectedHabits.length < 3 || isSelected;
                      
                      return (
                        <Button
                          key={habit.id}
                          variant="outline"
                          onClick={() => toggleHabit(habit.id)}
                          disabled={!canSelect}
                          className={`w-full h-auto p-4 justify-start transition-bounce ${
                            isSelected 
                              ? 'bg-success text-success-foreground border-success shadow-button' 
                              : 'hover:bg-secondary'
                          } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center w-full">
                            <div className="text-2xl ml-3">{habit.icon}</div>
                            <div className="flex-1 text-right">
                              <div className="font-medium">{habit.name}</div>
                              <div className="text-sm opacity-70">{habit.description}</div>
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 mr-2 text-success-foreground" />
                            )}
                          </div>
                        </Button>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* زر المتابعة */}
        <div className="sticky bottom-6">
          <Button
            onClick={handleContinue}
            disabled={selectedHabits.length !== 3}
            className="w-full h-14 text-lg gradient-primary text-white shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedHabits.length === 3 
              ? 'ابدأ رحلة التطوير!' 
              : `اختر ${3 - selectedHabits.length} عادات أخرى`
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectHabits;