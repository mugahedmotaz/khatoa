import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowRight, Heart, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface JournalScreenProps {
  onBack: () => void;
  onSaveEntry: (entry: string) => void;
  currentEntry?: string;
}

const JournalScreen = ({ onBack, onSaveEntry, currentEntry = '' }: JournalScreenProps) => {
  const [entry, setEntry] = useState(currentEntry);
  
  // حالات الملاحظات المحمية
  const [privateNote, setPrivateNote] = useState('');
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  const handleSave = () => {
    if (entry.trim()) {
      onSaveEntry(entry.trim());
      toast({
        title: "تم الحفظ! 💜",
        description: "تم حفظ مشاعرك في مفكرتك اليومية",
      });
    }
  };

  // تحميل البيانات المحفوظة
  useEffect(() => {
    const loadSavedData = () => {
      const savedPassword = localStorage.getItem('private_note_password');
      const savedNote = localStorage.getItem('private_note_content');
      setIsPasswordSet(!!savedPassword);
      if (savedNote) setPrivateNote(savedNote);
    };
    loadSavedData();
  }, []);

  // حفظ الملاحظة الخاصة
  const handleSavePrivateNote = () => {
    localStorage.setItem('private_note_content', privateNote);
    toast({
      title: "تم الحفظ! 🔒",
      description: "تم حفظ ملاحظتك الخاصة بأمان",
    });
  };

  // تعيين كلمة السر لأول مرة
  const handleSetPassword = () => {
    if (passwordInput.trim().length < 4) {
      toast({
        title: "كلمة السر قصيرة",
        description: "يجب أن تكون 4 أحرف أو أكثر",
      });
      return;
    }
    localStorage.setItem('private_note_password', passwordInput);
    setIsPasswordSet(true);
    setIsAuthenticated(true);
    setPasswordInput('');
    setIsSettingPassword(false);
    toast({
      title: "تم تعيين كلمة السر 🔐",
      description: "يمكنك الآن حفظ وقراءة ملاحظاتك الخاصة",
    });
  };

  // التحقق من كلمة السر
  const handleCheckPassword = () => {
    const savedPassword = localStorage.getItem('private_note_password');
    if (passwordInput === savedPassword) {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      toast({
        title: "كلمة السر غير صحيحة ❌",
        description: "حاول مرة أخرى",
      });
    }
  };

  // فتح نافذة الملاحظات الخاصة
  const openPrivateNotes = () => {
    setShowPrivateModal(true);
    setIsAuthenticated(false);
    setPasswordInput('');
    setIsSettingPassword(!isPasswordSet);
  };

  // إغلاق النافذة
  const closeModal = () => {
    setShowPrivateModal(false);
    setPasswordInput('');
    setIsAuthenticated(false);
    setIsSettingPassword(false);
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

      <div className="p-6 space-y-6 mt-12">
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
            onClick={openPrivateNotes}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            <Lock className="w-4 h-4 ml-2" />
            ملاحظاتي الخاصة 🔒
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

      {/* نافذة الملاحظات الخاصة */}
      {showPrivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            {!isAuthenticated ? (
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🔐</div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {isSettingPassword ? "تعيين كلمة سر جديدة" : "أدخل كلمة السر"}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2">
                    {isSettingPassword 
                      ? "اختر كلمة سر قوية لحماية ملاحظاتك الخاصة"
                      : "أدخل كلمة السر لعرض ملاحظاتك الخاصة"
                    }
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={isSettingPassword ? "كلمة السر الجديدة (4 أحرف على الأقل)" : "كلمة السر"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="pr-10 text-right"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          isSettingPassword ? handleSetPassword() : handleCheckPassword();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={isSettingPassword ? handleSetPassword : handleCheckPassword}
                      disabled={!passwordInput.trim()}
                      className="flex-1 gradient-motivation text-motivation-foreground"
                    >
                      {isSettingPassword ? "تعيين كلمة السر" : "دخول"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">📝</div>
                  <h2 className="text-xl font-bold text-gray-800">ملاحظاتك الخاصة</h2>
                  <p className="text-gray-600 text-sm mt-2">مساحة آمنة لأفكارك الشخصية</p>
                </div>
                
                <div className="space-y-4">
                  <Textarea
                    placeholder="اكتب ملاحظاتك الخاصة هنا... هذه المساحة محمية وآمنة تماماً"
                    value={privateNote}
                    onChange={(e) => setPrivateNote(e.target.value)}
                    className="min-h-40 text-right resize-none border-2 border-purple-200 focus:border-purple-400"
                    style={{ direction: 'rtl' }}
                  />
                  
                  <div className="text-sm text-gray-500 text-right">
                    {privateNote.length} حرف • آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSavePrivateNote}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                    >
                      <Save className="w-4 h-4 ml-2" />
                      حفظ الملاحظة
                    </Button>
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      className="flex-1"
                    >
                      إغلاق
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default JournalScreen;