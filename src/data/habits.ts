import { Habit } from '@/types';

export const availableHabits: Habit[] = [
  {
    id: 'reading',
    name: 'قراءة كتاب',
    icon: '📚',
    category: 'تطوير ذاتي',
    description: 'قراءة 10 صفحات يومياً',
    points: 15,
    difficulty: 'medium'
  },
  {
    id: 'prayer',
    name: 'الصلاة في وقتها',
    icon: '🤲',
    category: 'روحانيات',
    description: 'أداء الصلوات الخمس',
    points: 25,
    difficulty: 'easy'
  },
  {
    id: 'water',
    name: 'شرب الماء',
    icon: '💧',
    category: 'صحة',
    description: 'شرب 8 أكواب ماء يومياً',
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'exercise',
    name: 'التمرين',
    icon: '🏃‍♀️',
    category: 'صحة',
    description: '30 دقيقة نشاط بدني',
    points: 20,
    difficulty: 'hard'
  },
  {
    id: 'meditation',
    name: 'التأمل',
    icon: '🧘‍♀️',
    category: 'تطوير ذاتي',
    description: '10 دقائق تأمل وتنفس',
    points: 15,
    difficulty: 'medium'
  },
  {
    id: 'gratitude',
    name: 'الامتنان',
    icon: '🙏',
    category: 'روحانيات',
    description: 'كتابة 3 أشياء تشعر بالامتنان لها',
    points: 12,
    difficulty: 'easy'
  },
  {
    id: 'learning',
    name: 'تعلم مهارة جديدة',
    icon: '🎓',
    category: 'تطوير ذاتي',
    description: 'قضاء 30 دقيقة في تعلم شيء جديد',
    points: 18,
    difficulty: 'medium'
  },
  {
    id: 'organization',
    name: 'ترتيب المكان',
    icon: '🏠',
    category: 'تنظيم',
    description: 'ترتيب مكان واحد في البيت',
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'family',
    name: 'وقت مع الأهل',
    icon: '👨‍👩‍👧‍👦',
    category: 'علاقات',
    description: 'قضاء وقت ممتع مع الأهل',
    points: 15,
    difficulty: 'easy'
  },
  {
    id: 'sleep',
    name: 'النوم المبكر',
    icon: '🌙',
    category: 'صحة',
    description: 'النوم قبل الساعة 11 مساءً',
    points: 12,
    difficulty: 'medium'
  }
];

export const achievements = [
  {
    id: 'first_day',
    name: 'البداية الجميلة',
    description: 'أكمل أول يوم من العادات',
    icon: '🌱',
    requirement: 1,
    type: 'total_days' as const
  },
  {
    id: 'week_warrior',
    name: 'محارب الأسبوع',
    description: 'حافظ على عاداتك لمدة 7 أيام متتالية',
    icon: '🏆',
    requirement: 7,
    type: 'streak' as const
  },
  {
    id: 'month_master',
    name: 'سيد الشهر',
    description: 'حافظ على عاداتك لمدة 30 يوم متتالي',
    icon: '👑',
    requirement: 30,
    type: 'streak' as const
  },
  {
    id: 'hundred_club',
    name: 'نادي المئة',
    description: 'اجمع 100 نقطة إجمالية',
    icon: '💯',
    requirement: 100,
    type: 'points' as const
  },
  {
    id: 'thousand_legend',
    name: 'أسطورة الألف',
    description: 'اجمع 1000 نقطة إجمالية',
    icon: '⭐',
    requirement: 1000,
    type: 'points' as const
  }
];

export const weeklyChallenge = {
  id: 'week_perfect',
  name: 'الأسبوع المثالي',
  description: 'أكمل جميع عاداتك لمدة 7 أيام متتالية',
  icon: '🎯',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  targetValue: 7,
  currentValue: 0,
  reward: 'شارة الأسبوع المثالي + 50 نقطة إضافية',
  type: 'weekly' as const
};

export const motivationalQuotes = [
  "كل يوم هو فرصة جديدة لتصبح نسخة أفضل من نفسك",
  "النجاح هو مجموع الجهود الصغيرة المتكررة يوماً بعد يوم",
  "التغيير يبدأ بخطوة واحدة، وكل خطوة تحملك إلى الأمام",
  "لا تقلل من قوة العادات الصغيرة، فهي التي تصنع الفرق الكبير",
  "كن صبوراً مع نفسك، النمو يحتاج وقت",
  "أهم شيء هو أن تبدأ، حتى لو كانت البداية صغيرة",
  "كل يوم تلتزم فيه هو انتصار يستحق الاحتفال",
  "التقدم أهم من الكمال",
  "أنت أقوى مما تتخيل وأقدر على التغيير مما تعتقد",
  "الثبات على العادات الإيجابية هو طريقك لحياة أفضل"
];