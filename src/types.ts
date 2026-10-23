export interface DayChallengeInfo {
  currentDay: number;
  totalDays: number;
  percentage: number;
  daysRemaining: number;
  startDateFormatted: string;
  endDateFormatted: string;
  todayFormatted: string;
  status: 'active' | 'before' | 'completed';
}

export interface DailyRule {
  id: string;
  title: string;
  points: number;
  description?: string;
  isAutoCheckedOnSave?: boolean;
}

export interface DailyScoreRecord {
  date: string; // YYYY-MM-DD
  dayNumber: number; // Day 1 to 90
  score: number; // out of 10
  maxScore: number;
  completedRules: string[];
  savedAt: string;
  note?: string;
}

export interface SubjectCurriculum {
  id: string;
  name: string;
  total: number;
  done: number;
  category?: string;
}

export interface SleepCycleItem {
  cycles: number;
  sleepHours: number;
  sleepMinutes: number;
  timeFormatted: string;
  time24: string;
  durationLabel: string;
  quality: 'optimal' | 'great' | 'minimum' | 'emergency';
  qualityLabel: string;
  tagline: string;
  isClosestTo7Point5?: boolean;
}

// ----------------- NEW LIFE HUB TYPES -----------------

// Gym / النادي
export interface Exercise {
  id: string;
  name: string;
  setsReps: string; // e.g. "4×8-10"
}

export interface WorkoutDay {
  id: 'push' | 'pull' | 'legs';
  nameAr: string; // Push, Pull, Legs
  dayNameAr: string; // الاثنين, الأربعاء, السبت
  dayOfWeek: number; // 1 (Mon), 3 (Wed), 6 (Sat)
  focus: string;
  exercises: Exercise[];
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  note?: string;
}

// Nutrition / التغذية
export interface NutritionItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  unitLabel: string;
}

export interface LoggedFoodItem {
  id: string;
  itemId?: string;
  name: string;
  calories: number;
  protein: number;
  quantity: number;
  timestamp: string;
}

export interface DailyNutritionLog {
  date: string; // YYYY-MM-DD
  items: LoggedFoodItem[];
}

// Social / تواصل
export interface ContactPerson {
  id: string;
  name: string;
  note: string;
  lastContactDate: string; // YYYY-MM-DD
}

// Wellbeing / رفاهية
export type MoodScore = 1 | 2 | 3 | 4 | 5;

export interface DailyMoodRecord {
  date: string; // YYYY-MM-DD
  score: MoodScore;
  label: string;
  emoji: string;
  timestamp: string;
}
