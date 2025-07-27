export interface User {
  name: string;
  goal: string;
  selectedHabits: string[];
  startDate: string;
  level: number;
  totalPoints: number;
  achievements: string[];
  streak: number;
  longestStreak: number;
  reminderSettings: ReminderSettings;
}

export interface ReminderSettings {
  enabled: boolean;
  times: string[];
  motivationalQuotes: boolean;
  sound: boolean;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DailyProgress {
  date: string;
  completedHabits: string[];
  journalEntry?: string;
  audioJournalUrl?: string;
  motivationQuote?: string;
  pointsEarned: number;
  meditationMinutes?: number;
  dhikrCount?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'total_days' | 'points' | 'specific_habit';
  unlocked?: boolean;
  unlockedDate?: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  startDate: string;
  endDate: string;
  targetValue: number;
  currentValue: number;
  reward: string;
  type: 'weekly' | 'monthly' | 'seasonal';
}

export interface AppState {
  user: User | null;
  isOnboarded: boolean;
  currentScreen: string;
  dailyProgress: DailyProgress[];
  habits: Habit[];
  achievements: Achievement[];
  challenges: Challenge[];
}