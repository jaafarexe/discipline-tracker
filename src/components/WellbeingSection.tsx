import React, { useState, useEffect } from 'react';
import { Eye, Smile, Wind, Play, Pause, RotateCcw, Check, Heart, Sparkles, BatteryCharging } from 'lucide-react';
import { DailyMoodRecord, MoodScore } from '../types';
import { getTodayDateString, formatArabicDate } from '../utils/challenge';

interface WellbeingSectionProps {
  moodHistory: DailyMoodRecord[];
  onSaveTodayMood: (record: DailyMoodRecord) => void;
}

const MOOD_OPTIONS: { score: MoodScore; label: string; emoji: string }[] = [
  { score: 1, label: 'منهك', emoji: '😩' },
  { score: 2, label: 'متعب', emoji: '🥱' },
  { score: 3, label: 'عادي', emoji: '😐' },
  { score: 4, label: 'نشيط', emoji: '⚡' },
  { score: 5, label: 'ممتاز', emoji: '🤩' },
];

export const WellbeingSection: React.FC<WellbeingSectionProps> = ({
  moodHistory,
  onSaveTodayMood,
}) => {
  const todayDateStr = getTodayDateString();
  const todayMood = moodHistory.find((m) => m.date === todayDateStr);

  // 1. Eye-Rest Timer (20 seconds countdown)
  const [eyeSeconds, setEyeSeconds] = useState<number>(20);
  const [isEyeRunning, setIsEyeRunning] = useState<boolean>(false);
  const [eyeDoneNotice, setEyeDoneNotice] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isEyeRunning && eyeSeconds > 0) {
      interval = setInterval(() => {
        setEyeSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isEyeRunning && eyeSeconds === 0) {
      setIsEyeRunning(false);
      setEyeDoneNotice(true);
      setTimeout(() => setEyeDoneNotice(false), 5000);
    }
    return () => clearInterval(interval);
  }, [isEyeRunning, eyeSeconds]);

  const handleStartEyeTimer = () => {
    if (eyeSeconds === 0) setEyeSeconds(20);
    setIsEyeRunning(true);
    setEyeDoneNotice(false);
  };

  const handleResetEyeTimer = () => {
    setIsEyeRunning(false);
    setEyeSeconds(20);
    setEyeDoneNotice(false);
  };

  // 2. Mood Logging
  const handleSelectMood = (opt: typeof MOOD_OPTIONS[0]) => {
    onSaveTodayMood({
      date: todayDateStr,
      score: opt.score,
      label: opt.label,
      emoji: opt.emoji,
      timestamp: new Date().toISOString(),
    });
  };

  // 3. Calm Breathing Timer (2 minutes, 4-4-4: Inhale 4s, Hold 4s, Exhale 4s)
  const [breathTotalSeconds, setBreathTotalSeconds] = useState<number>(120); // 2 minutes
  const [isBreathRunning, setIsBreathRunning] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathPhaseSecond, setBreathPhaseSecond] = useState<number>(4);

  useEffect(() => {
    let timer: any = null;
    if (isBreathRunning && breathTotalSeconds > 0) {
      timer = setInterval(() => {
        setBreathTotalSeconds((prev) => prev - 1);

        // Cycle of 12 seconds: 4s inhale, 4s hold, 4s exhale
        setBreathPhaseSecond((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Switch phase
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'inhale') return 'hold';
              if (currentPhase === 'hold') return 'exhale';
              return 'inhale';
            });
            return 4;
          }
        });
      }, 1000);
    } else if (isBreathRunning && breathTotalSeconds === 0) {
      setIsBreathRunning(false);
    }
    return () => clearInterval(timer);
  }, [isBreathRunning, breathTotalSeconds]);

  const handleToggleBreathing = () => {
    if (!isBreathRunning && breathTotalSeconds === 0) {
      setBreathTotalSeconds(120);
      setBreathPhase('inhale');
      setBreathPhaseSecond(4);
    }
    setIsBreathRunning(!isBreathRunning);
  };

  const handleResetBreathing = () => {
    setIsBreathRunning(false);
    setBreathTotalSeconds(120);
    setBreathPhase('inhale');
    setBreathPhaseSecond(4);
  };

  const formatMinutesSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Get past 7 days history
  const recent7Days = moodHistory.slice(0, 7);

  return (
    <div className="space-y-6">
      {/* 1. EYE-REST TIMER (20-20-20) */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500">
              <Eye className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block">
                صيانة البصر أثناء جلسات الدراسة
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                راحة العين 20-20-20: كل 20 دقيقة، طلّع على بعيد 20 ثانية
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Visual Circular Countdown */}
            <div className="relative w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono-num font-black text-2xl text-white">
              {eyeSeconds}
              <div
                className="absolute inset-0 rounded-full border-2 border-red-600 transition-all"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${((20 - eyeSeconds) / 20) * 100}% 0%, 100% 100%, 0% 100%)`,
                }}
              />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-200 block">
                {isEyeRunning ? 'المؤقت يعمل: انظر الآن إلى نقطة بعيدة (6 أمتار على الأقل)...' : 'المؤقت متوقف'}
              </span>
              <p className="text-xs text-zinc-500 mt-0.5">
                تطبيق قاعدة 20-20-20 يحمي شبكية العين ويريح عضلات التركيز.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleResetEyeTimer}
              className="min-h-[44px] px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="إعادة تعيين"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {isEyeRunning ? (
              <button
                onClick={() => setIsEyeRunning(false)}
                className="min-h-[44px] px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>إيقاف مؤقت</span>
              </button>
            ) : (
              <button
                onClick={handleStartEyeTimer}
                className="min-h-[44px] px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-red-950/40 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>ابدأ الـ 20 ثانية</span>
              </button>
            )}
          </div>
        </div>

        {eyeDoneNotice && (
          <div className="mt-3 p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-red-400 shrink-0" />
            <span>انتهت الـ 20 ثانية بنجاح! ارتاحت عضلات عينيك، عُد لدراستك وتركيزك.</span>
          </div>
        )}
      </div>

      {/* 2. DAILY ONE-TAP ENERGY / MOOD LOG (5 Emoji buttons + 7-day history) */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                مقياس الطاقة والمزاج اليومي
              </h3>
              <p className="text-xs text-zinc-500">
                تسجيل بنقرة واحدة لتتبع تذبذب طاقتك مع الالتزام السبارطي
              </p>
            </div>
          </div>

          {todayMood && (
            <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono-num">
              <span>تم تسجيل اليوم:</span>
              <span className="text-white font-bold text-sm">{todayMood.emoji} {todayMood.label}</span>
            </div>
          )}
        </div>

        {/* Five One-Tap Emoji Buttons (منهك 😩 إلى ممتاز 🤩) */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-5">
          {MOOD_OPTIONS.map((opt) => {
            const isSelected = todayMood?.score === opt.score;
            return (
              <button
                key={opt.score}
                onClick={() => handleSelectMood(opt)}
                className={`min-h-[64px] rounded-xl border p-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 border-red-600 text-white shadow-lg ring-1 ring-red-500/50 scale-102'
                    : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                <span className="text-2xl sm:text-3xl select-none">{opt.emoji}</span>
                <span className="text-[11px] font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* 7-Day Mini History Strip */}
        <div className="border-t border-zinc-900 pt-3">
          <span className="text-xs font-semibold text-zinc-500 block mb-2">
            سجل آخر 7 أيام:
          </span>
          {recent7Days.length === 0 ? (
            <p className="text-xs text-zinc-600">انقر على مستواك اليوم لحفظ أول سجل.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {recent7Days.map((rec) => (
                <div
                  key={rec.date}
                  className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-2.5 text-center"
                >
                  <span className="text-xl block mb-1">{rec.emoji}</span>
                  <span className="text-xs font-bold text-white block">{rec.label}</span>
                  <span className="text-[10px] text-zinc-500 block font-mono-num mt-0.5">
                    {formatArabicDate(rec.date).split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. CALM BREATHING TIMER (2 Minutes, 4-4-4 Box Breathing) */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                مؤقت التنفس الهادئ (دقيقتان وفق نمط 4-4-4)
              </h3>
              <p className="text-xs text-zinc-500">
                شهيق 4 ثوانٍ · حبس 4 ثوانٍ · زفير 4 ثوانٍ (تهدئة نبضات القلب وخفض الكورتيزول)
              </p>
            </div>
          </div>

          <div className="font-mono-num text-sm font-bold text-zinc-300 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg w-fit">
            الوقت المتبقي: {formatMinutesSeconds(breathTotalSeconds)}
          </div>
        </div>

        {/* Animated Circle Container */}
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-1000 border-2 ${
              breathPhase === 'inhale'
                ? 'scale-115 bg-red-950/40 border-red-600 shadow-xl shadow-red-950/50'
                : breathPhase === 'hold'
                ? 'scale-115 bg-zinc-900 border-zinc-500 shadow-md'
                : 'scale-90 bg-zinc-950 border-zinc-800 shadow-inner'
            }`}
          >
            <span className="text-lg font-black text-white block">
              {breathPhase === 'inhale' && 'شهيق'}
              {breathPhase === 'hold' && 'حبس'}
              {breathPhase === 'exhale' && 'زفير'}
            </span>
            <span className="text-2xl font-mono-num font-bold text-red-400 mt-1">
              {breathPhaseSecond}
            </span>
          </div>

          <p className="text-xs text-zinc-400 mt-6 max-w-xs">
            {breathPhase === 'inhale' && 'اسحب الهواء بعمق وببطء من الأنف واملأ صدرك'}
            {breathPhase === 'hold' && 'احتفظ بالأكسجين في رئتيك بهدوء وسكون تام'}
            {breathPhase === 'exhale' && 'أخرج الهواء ببطء من الفم وفرّغ كل التوتر'}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleResetBreathing}
              className="min-h-[44px] px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="إعادة ضبط"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleBreathing}
              className={`min-h-[44px] px-8 py-2 rounded-lg text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isBreathRunning
                  ? 'bg-zinc-800 hover:bg-zinc-700'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-950/40'
              }`}
            >
              {isBreathRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{breathTotalSeconds < 120 ? 'استئناف التنفس' : 'بدء جلسة التنفس (2 دقيقة)'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
