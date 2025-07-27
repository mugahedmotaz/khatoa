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
  
  // حالات المذكرات المحفوظة
  const [savedEntries, setSavedEntries] = useState<Array<{id: string, content: string, date: string}>>([]);
  const [showSavedEntries, setShowSavedEntries] = useState(false);
  
  // حالات الملاحظات المحمية
  const [privateNote, setPrivateNote] = useState('');
  const [savedPrivateNotes, setSavedPrivateNotes] = useState<Array<{id: string, content: string, date: string}>>([]);
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [showPrivateNotesList, setShowPrivateNotesList] = useState(false);

  const handleSave = () => {
    if (entry.trim()) {
      // حفظ في القائمة المحلية
      const newEntry = {
        id: Date.now().toString(),
        content: entry.trim(),
        date: new Date().toLocaleDateString('ar-SA')
      };
      const updatedEntries = [newEntry, ...savedEntries];
      setSavedEntries(updatedEntries);
      localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
      
      // حفظ في النظام الأساسي
      onSaveEntry(entry.trim());
      
      // مسح منطقة الإدخال
      setEntry('');
      
      toast({
        title: "تم الحفظ! 💜",
        description: "تم حفظ مذكرتك في قائمة المذكرات",
      });
    }
  };

  // تحميل البيانات المحفوظة
  useEffect(() => {
    const loadSavedData = () => {
      // تحميل المذكرات العادية
      const savedJournalEntries = localStorage.getItem('journal_entries');
      if (savedJournalEntries) {
        setSavedEntries(JSON.parse(savedJournalEntries));
      }
      
      // تحميل بيانات الملاحظات الخاصة
      const savedPassword = localStorage.getItem('private_note_password');
      const savedPrivateNotesData = localStorage.getItem('private_notes_list');
      setIsPasswordSet(!!savedPassword);
      if (savedPrivateNotesData) {
        setSavedPrivateNotes(JSON.parse(savedPrivateNotesData));
      }
    };
    loadSavedData();
  }, []);

  // حفظ الملاحظة الخاصة
  const handleSavePrivateNote = () => {
    if (privateNote.trim()) {
      const newPrivateNote = {
        id: Date.now().toString(),
        content: privateNote.trim(),
        date: new Date().toLocaleDateString('ar-SA')
      };
      const updatedPrivateNotes = [newPrivateNote, ...savedPrivateNotes];
      setSavedPrivateNotes(updatedPrivateNotes);
      localStorage.setItem('private_notes_list', JSON.stringify(updatedPrivateNotes));
      
      // مسح منطقة الإدخال
      setPrivateNote('');
      
      toast({
        title: "تم الحفظ! 🔒",
        description: "تم حفظ ملاحظتك الخاصة في القائمة الآمنة",
      });
    }
  };
  
  // حذف مذكرة عادية
  const deleteEntry = (id: string) => {
    const updatedEntries = savedEntries.filter(entry => entry.id !== id);
    setSavedEntries(updatedEntries);
    localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
    toast({
      title: "تم الحذف",
      description: "تم حذف المذكرة",
    });
  };
  
  // حذف ملاحظة خاصة
  const deletePrivateNote = (id: string) => {
    const updatedPrivateNotes = savedPrivateNotes.filter(note => note.id !== id);
    setSavedPrivateNotes(updatedPrivateNotes);
    localStorage.setItem('private_notes_list', JSON.stringify(updatedPrivateNotes));
    toast({
      title: "تم الحذف",
      description: "تم حذف الملاحظة الخاصة",
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
    setShowPrivateNotesList(false);
  };

  // إغلاق النافذة
  const closeModal = () => {
    setShowPrivateModal(false);
    setPasswordInput('');
    setIsAuthenticated(false);
    setIsSettingPassword(false);
    setShowPrivateNotesList(false);
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
            onClick={() => setShowSavedEntries(!showSavedEntries)}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
          >
            <Heart className="w-4 h-4 ml-2" />
            مذكراتي المحفوظة ({savedEntries.length})
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
        
        {/* قائمة المذكرات المحفوظة */}
        {showSavedEntries && (
          <Card className="shadow-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Heart className="w-5 h-5 ml-2 text-blue-500" />
                مذكراتي المحفوظة ({savedEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>لا توجد مذكرات محفوظة بعد</p>
                  <p className="text-sm">ابدأ بكتابة مذكرتك الأولى!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {savedEntries.map((entry) => (
                    <div key={entry.id} className="bg-gray-50 rounded-lg p-4 border-r-4 border-blue-400">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-500">{entry.date}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                      <p className="text-right leading-relaxed" style={{ direction: 'rtl' }}>
                        {entry.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
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
                
                {/* أزرار التبديل */}
                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => setShowPrivateNotesList(false)}
                    variant={!showPrivateNotesList ? "default" : "outline"}
                    className="flex-1"
                  >
                    كتابة جديدة
                  </Button>
                  <Button
                    onClick={() => setShowPrivateNotesList(true)}
                    variant={showPrivateNotesList ? "default" : "outline"}
                    className="flex-1"
                  >
                    الملاحظات المحفوظة ({savedPrivateNotes.length})
                  </Button>
                </div>
                
                {!showPrivateNotesList ? (
                  /* منطقة الكتابة */
                  <div className="space-y-4">
                    <Textarea
                      placeholder="اكتب ملاحظتك الخاصة الجديدة هنا... هذه المساحة محمية وآمنة تماماً"
                      value={privateNote}
                      onChange={(e) => setPrivateNote(e.target.value)}
                      className="min-h-40 text-right resize-none border-2 border-purple-200 focus:border-purple-400"
                      style={{ direction: 'rtl' }}
                    />
                    
                    <div className="text-sm text-gray-500 text-right">
                      {privateNote.length} حرف • {new Date().toLocaleDateString('ar-SA')}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSavePrivateNote}
                        disabled={!privateNote.trim()}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
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
                ) : (
                  /* قائمة الملاحظات المحفوظة */
                  <div className="space-y-4">
                    {savedPrivateNotes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">🔒</div>
                        <p>لا توجد ملاحظات خاصة محفوظة بعد</p>
                        <p className="text-sm">ابدأ بكتابة ملاحظتك الأولى!</p>
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto space-y-3">
                        {savedPrivateNotes.map((note) => (
                          <div key={note.id} className="bg-purple-50 rounded-lg p-4 border-r-4 border-purple-400">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm text-gray-500">{note.date}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePrivateNote(note.id)}
                                className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                              >
                                ×
                              </Button>
                            </div>
                            <p className="text-right leading-relaxed" style={{ direction: 'rtl' }}>
                              {note.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      className="w-full"
                    >
                      إغلاق
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default JournalScreen;