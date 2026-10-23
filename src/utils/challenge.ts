import { DailyRule, DayChallengeInfo, SubjectCurriculum, DailyScoreRecord } from '../types';

export const CHALLENGE_START_DATE = '2026-01-01';
export const CHALLENGE_END_DATE = '2026-03-31';
export const CHALLENGE_TOTAL_DAYS = 90;

export const SPARTAN_RULES: DailyRule[] = [
  {
    id: 'wake_up_5am',
    title: 'الاستيقاظ 05:00',
    points: 1,
    description: 'نهوض حاسم وفوري دون زر غفوة، بداية مبكرة وسيطرة على اليوم'
  },
  {
    id: 'study_deep',
    title: 'دراسة 2–3 ساعات والهاتف بعيد',
    points: 2,
    description: 'تركيز عميق مغلق خالي من أي مشتتات، الهاتف مغلق أو في غرفة أخرى'
  },
  {
    id: 'workout',
    title: 'التمرين',
    points: 2,
    description: 'تدريب بدني عالي الشدة بدون أي أعذار لبناء قوة الجسد وصلابته'
  },
  {
    id: 'bulking_diet',
    title: 'أكل التضخيم كامل',
    points: 1,
    description: 'الالتزام بكامل وجبات خطة التضخيم وتغطية البروتين والسعرات المقررة'
  },
  {
    id: 'sleep_on_time',
    title: 'النوم على الموعد',
    points: 1,
    description: 'إيقاف الشاشات والدخول في الفراش بالتوقيت الدقيق لدورات النوم'
  },
  {
    id: 'dopamine_detox',
    title: 'صفر محتوى إباحي وصفر تمرير لا نهائي',
    points: 2,
    description: 'انضباط عصبي صارم: لا إباحية، لا تيك توك، لا ريلز، صيانة طاقة الدوبامين'
  },
  {
    id: 'score_report',
    title: 'تقرير النقاط',
    points: 1,
    description: 'محاسبة النفس وتقييم اليوم وحفظ السجل بصدق (يُفعّل آلياً عند حفظ اليوم)',
    isAutoCheckedOnSave: true
  }
];

export const INITIAL_CURRICULUM: SubjectCurriculum[] = [
  { id: 'math', name: 'الرياضيات', total: 68, done: 0 },
  { id: 'physics', name: 'الفيزياء', total: 36, done: 0 },
  { id: 'chemistry', name: 'الكيمياء', total: 37, done: 0 },
  { id: 'science', name: 'العلوم', total: 51, done: 0 },
  { id: 'arabic', name: 'اللغة العربية', total: 58, done: 0 },
  { id: 'english', name: 'اللغة الإنكليزية', total: 69, done: 0 },
  { id: 'russian', name: 'اللغة الروسية', total: 28, done: 0 },
  { id: 'religion', name: 'التربية الدينية', total: 44, done: 0 },
];

export function getTodayDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatArabicDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function getChallengeProgress(referenceDate: Date = new Date()): DayChallengeInfo {
  const y = referenceDate.getFullYear();
  const m = referenceDate.getMonth();
  const d = referenceDate.getDate();
  const todayMidnight = new Date(y, m, d);

  const [sY, sM, sD] = CHALLENGE_START_DATE.split('-').map(Number);
  const startMidnight = new Date(sY, sM - 1, sD);

  const diffTime = todayMidnight.getTime() - startMidnight.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const currentDay = diffDays + 1;

  let status: 'active' | 'before' | 'completed' = 'active';
  if (currentDay < 1) {
    status = 'before';
  } else if (currentDay > CHALLENGE_TOTAL_DAYS) {
    status = 'completed';
  }

  const clampedDay = Math.max(1, Math.min(CHALLENGE_TOTAL_DAYS, currentDay));
  const percentage = Math.min(100, Math.max(0, Math.round((clampedDay / CHALLENGE_TOTAL_DAYS) * 100)));
  const daysRemaining = Math.max(0, CHALLENGE_TOTAL_DAYS - clampedDay);

  const todayStr = getTodayDateString(referenceDate);

  return {
    currentDay: clampedDay,
    totalDays: CHALLENGE_TOTAL_DAYS,
    percentage,
    daysRemaining,
    startDateFormatted: '13 أكتوبر 2026',
    endDateFormatted: '10 يناير 2027',
    todayFormatted: formatArabicDate(todayStr),
    status
  };
}

export function calculateAverageScore(history: DailyScoreRecord[]): number {
  if (!history || history.length === 0) return 0;
  const total = history.reduce((sum, item) => sum + item.score, 0);
  return Number((total / history.length).toFixed(1));
}
