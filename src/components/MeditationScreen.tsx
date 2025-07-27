import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mic, MicOff, Play, Pause, Download, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MeditationScreenProps {
  onBack: () => void;
}

const MeditationScreen = ({ onBack }: MeditationScreenProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState('');
  const [dhikrCount, setDhikrCount] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const dhikrList = [
    { text: 'سبحان الله', count: 33 },
    { text: 'الحمد لله', count: 33 },
    { text: 'الله أكبر', count: 34 },
    { text: 'لا إله إلا الله', count: 100 },
    { text: 'استغفر الله', count: 100 },
    { text: 'سبحان الله وبحمده', count: 100 },
    { text: 'سبحان الله العظيم', count: 100 }
  ];

  const meditationSessions = [
    {
      title: 'تأمل الصباح',
      duration: '5 دقائق',
      description: 'جلسة هادئة لبداية يوم مليئة بالطاقة الإيجابية',
      icon: '🌅'
    },
    {
      title: 'تأمل المساء',
      duration: '10 دقائق',
      description: 'استرخاء وتفريغ للتوتر وإعداد للنوم الهادئ',
      icon: '🌙'
    },
    {
      title: 'تأمل التنفس',
      duration: '7 دقائق',
      description: 'تركيز على التنفس لتهدئة العقل والجسم',
      icon: '🫁'
    },
    {
      title: 'تأمل الامتنان',
      duration: '8 دقائق',
      description: 'التفكر في النعم وزيادة الشعور بالرضا',
      icon: '🙏'
    }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlobs([blob]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "بدأ التسجيل 🎙️",
        description: "تحدث بصراحة عن مشاعرك وأفكارك",
      });
    } catch (error) {
      toast({
        title: "خطأ في التسجيل",
        description: "تأكد من السماح بالوصول للميكروفون",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      toast({
        title: "تم إيقاف التسجيل ✅",
        description: `مدة التسجيل: ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`,
      });
    }
  };

  const playRecording = () => {
    if (recordedBlobs.length > 0) {
      const audioBlob = recordedBlobs[0];
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => setIsPlaying(false);
      
      audio.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const downloadRecording = () => {
    if (recordedBlobs.length > 0) {
      const audioBlob = recordedBlobs[0];
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meditation-${new Date().toISOString().split('T')[0]}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const deleteRecording = () => {
    setRecordedBlobs([]);
    setRecordingTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    toast({
      title: "تم حذف التسجيل",
      description: "يمكنك تسجيل جلسة جديدة",
    });
  };

  const incrementDhikr = () => {
    setDhikrCount(prev => prev + 1);
  };

  const resetDhikr = () => {
    setDhikrCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* الهيدر */}
      <div className="gradient-success text-success-foreground p-6 rounded-b-3xl">
        <div className="flex items-center space-x-4 space-x-reverse mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-success-foreground hover:bg-success-foreground/10"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">التأمل والأذكار</h1>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">🧘‍♀️</div>
          <p className="opacity-90">اهدأ واسترخي واستشعر السكينة</p>
        </div>
      </div>

      <div className="p-6 space-y-6 mt-12">
        {/* جلسات التأمل */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl ml-2">🎧</span>
              جلسات التأمل المرشدة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meditationSessions.map((session, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto p-4 justify-start hover:bg-success-light/20"
              >
                <div className="flex items-center w-full">
                  <span className="text-2xl ml-3">{session.icon}</span>
                  <div className="flex-1 text-right">
                    <div className="font-medium">{session.title}</div>
                    <div className="text-sm text-foreground/70">{session.description}</div>
                    <div className="text-xs text-success font-medium">{session.duration}</div>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* عداد الأذكار */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl ml-2">📿</span>
              عداد الأذكار
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* اختيار الذكر */}
            <div className="space-y-2">
              <label className="text-sm font-medium">اختر الذكر:</label>
              <div className="grid grid-cols-2 gap-2">
                {dhikrList.map((dhikr, index) => (
                  <Button
                    key={index}
                    variant={selectedDhikr === dhikr.text ? "default" : "outline"}
                    onClick={() => {
                      setSelectedDhikr(dhikr.text);
                      resetDhikr();
                    }}
                    className="text-sm h-auto p-2"
                  >
                    {dhikr.text}
                  </Button>
                ))}
              </div>
            </div>

            {selectedDhikr && (
              <div className="text-center space-y-4">
                <div className="p-6 bg-success-light/20 rounded-xl">
                  <div className="text-2xl font-bold mb-2">{selectedDhikr}</div>
                  <div className="text-4xl font-bold text-success">{dhikrCount}</div>
                  <div className="text-sm text-foreground/70">
                    الهدف: {dhikrList.find(d => d.text === selectedDhikr)?.count || 0}
                  </div>
                </div>
                
                <div className="flex space-x-3 space-x-reverse">
                  <Button
                    onClick={incrementDhikr}
                    className="flex-1 h-14 text-lg bg-success text-success-foreground"
                  >
                    تسبيح
                  </Button>
                  <Button
                    onClick={resetDhikr}
                    variant="outline"
                    className="h-14"
                  >
                    إعادة تعيين
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* التسجيل الصوتي للتأمل */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl ml-2">🎙️</span>
              تسجيل جلسة تأمل شخصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isRecording && recordedBlobs.length === 0 && (
              <Button
                onClick={startRecording}
                className="w-full h-14 bg-success text-success-foreground"
              >
                <Mic className="w-5 h-5 ml-2" />
                بدء التسجيل
              </Button>
            )}

            {isRecording && (
              <div className="text-center space-y-4">
                <div className="p-4 bg-destructive-light/20 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
                    <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                    <span className="font-medium">جاري التسجيل...</span>
                  </div>
                  <div className="text-2xl font-bold">{formatTime(recordingTime)}</div>
                </div>
                
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="w-full h-12"
                >
                  <MicOff className="w-5 h-5 ml-2" />
                  إيقاف التسجيل
                </Button>
              </div>
            )}

            {!isRecording && recordedBlobs.length > 0 && (
              <div className="space-y-3">
                <div className="p-3 bg-success-light/20 rounded-lg text-center">
                  <div className="font-medium">تسجيل جاهز</div>
                  <div className="text-sm text-foreground/70">المدة: {formatTime(recordingTime)}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={isPlaying ? pauseRecording : playRecording}
                    className="bg-primary text-primary-foreground"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 ml-1" /> : <Play className="w-4 h-4 ml-1" />}
                    {isPlaying ? 'إيقاف' : 'تشغيل'}
                  </Button>
                  
                  <Button
                    onClick={downloadRecording}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 ml-1" />
                    تحميل
                  </Button>
                </div>
                
                <Button
                  onClick={deleteRecording}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف التسجيل
                </Button>
              </div>
            )}
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

export default MeditationScreen;