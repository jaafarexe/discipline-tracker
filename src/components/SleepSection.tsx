import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Coffee, RefreshCw, Sparkles, Check, Info, Anchor } from 'lucide-react';
import { calculateWakeUpTimes, calculateBedtimes, calculateNaps, FALL_ASLEEP_BUFFER_MINUTES } from '../utils/sleep';

interface SleepSectionProps {
  savedTargetWakeUpTime: string;
  onSaveTargetWakeUpTime: (time: string) => void;
}

export const SleepSection: React.FC<SleepSectionProps> = ({
  savedTargetWakeUpTime,
  onSaveTargetWakeUpTime,
}) => {
  const [mode, setMode] = useState<'now' | 'target' | 'nap'>('now');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [targetTime, setTargetTime] = useState<string>(savedTargetWakeUpTime || '05:00');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleRefreshTime = () => {
    setCurrentTime(new Date());
  };

  const handleTargetTimeChange = (newTime: string) => {
    setTargetTime(newTime);
    onSaveTargetWakeUpTime(newTime);
  };

  const currentFormatted = currentTime.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const wakeUpSlots = calculateWakeUpTimes(currentTime);
  const bedtimeSlots = calculateBedtimes(targetTime);
  const napOptions = calculateNaps(currentTime);

  return (
    <div className="space-y-6">
      {/* 1. FIXED ANCHORS CARD (Prompt requirement: "فيقتك 05:00 — أنسب أوقات النوم: 21:15 و 22:45") */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-red-900/40 rounded-2xl p-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500 shrink-0">
              <Anchor className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block mb-0.5">
                المرساة الثابتة للانضباط السبارطي
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                فيقتك 05:00 — أنسب أوقات النوم: <span className="font-mono-num text-red-400 font-extrabold">21:15</span> و <span className="font-mono-num text-zinc-300 font-extrabold">22:45</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                21:15 تمنحك 5 دورات نوم كاملة (7.5 ساعات صافية). وإذا تأخرت، فالخيار البديل الصارم هو 22:45 (4 دورات / 6 ساعات).
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <span className="text-[10px] text-zinc-500 uppercase font-mono-num">القاعدة 1 و 5</span>
            <span className="text-xs font-mono-num bg-red-950/60 border border-red-900/60 text-red-300 px-2.5 py-1 rounded-lg">
              استيقاظ 05:00 ص
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN SLEEP CALCULATOR PANEL */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />

        {/* Section Header & Three-Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block mb-1">
              حاسبة النوم الاستثنائية
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              حاسبة دورات النوم والاستشفاء
            </h2>
          </div>

          {/* Three Modes: 1) رح نام هلأ 2) بدي فيق الساعة 3) قيلولة */}
          <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setMode('now')}
              className={`flex-1 sm:flex-initial min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'now'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-red-500" />
              <span>1. رح نام هلأ</span>
            </button>

            <button
              onClick={() => setMode('target')}
              className={`flex-1 sm:flex-initial min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'target'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-zinc-300" />
              <span>2. بدي فيق الساعة</span>
            </button>

            <button
              onClick={() => setMode('nap')}
              className={`flex-1 sm:flex-initial min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'nap'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-500" />
              <span>3. قيلولة</span>
            </button>
          </div>
        </div>

        {/* ---------------- MODE 1: رح نام هلأ ---------------- */}
        {mode === 'now' && (
          <div>
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 block">التوقيت الحالي للذهاب للفراش</span>
                  <span className="text-xl font-bold text-white font-mono-num">
                    {currentFormatted}
                  </span>
                </div>
              </div>

              <button
                onClick={handleRefreshTime}
                className="min-h-[40px] text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>تحديث للتوقيت الحالي</span>
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-3">
              إذا دخلت الفراش الآن، استيقظ في أحد هذه المواعيد (تم احتساب 15 دقيقة نوم مسبقاً):
            </p>

            {/* Results Grid with 7.5h Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {wakeUpSlots.map((slot) => {
                const isOptimal75 = slot.isClosestTo7Point5;
                return (
                  <div
                    key={slot.cycles}
                    className={`relative p-4 rounded-xl border transition-all ${
                      isOptimal75
                        ? 'bg-gradient-to-b from-red-950/40 to-zinc-900/90 border-red-600 shadow-lg shadow-red-950/40 ring-1 ring-red-500/50'
                        : 'bg-zinc-950/70 border-zinc-800/80'
                    }`}
                  >
                    {isOptimal75 && (
                      <div className="absolute -top-2.5 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>الأقرب لـ 7.5 ساعات (مثالي)</span>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-400">
                        {slot.cycles} دورات نوم
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono-num">
                        {slot.durationLabel}
                      </span>
                    </div>

                    <div className="my-2">
                      <span className="text-2xl sm:text-3xl font-black font-mono-num text-white tracking-tight">
                        {slot.timeFormatted}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-zinc-900 mt-2">
                      <span className={`text-xs font-bold block ${isOptimal75 ? 'text-red-400' : 'text-zinc-300'}`}>
                        {slot.qualityLabel}
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-0.5 block">
                        {slot.tagline}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- MODE 2: بدي فيق الساعة ---------------- */}
        {mode === 'target' && (
          <div>
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
              <div>
                <span className="text-xs font-semibold text-zinc-300 block mb-1">
                  حدد توقيت استيقاظك المستهدف:
                </span>
                <p className="text-[11px] text-zinc-500">
                  (التوقيت السبارطي الأساسي هو 05:00 فجراً)
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleTargetTimeChange('05:00')}
                  className={`px-3 py-1.5 text-xs font-mono-num font-bold rounded-lg border transition-colors cursor-pointer ${
                    targetTime === '05:00'
                      ? 'bg-red-950/80 border-red-600 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  05:00 ص (سبارطي)
                </button>

                <button
                  onClick={() => handleTargetTimeChange('06:00')}
                  className={`px-2.5 py-1.5 text-xs font-mono-num font-bold rounded-lg border transition-colors cursor-pointer ${
                    targetTime === '06:00'
                      ? 'bg-red-950/80 border-red-600 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  06:00 ص
                </button>

                <input
                  type="time"
                  value={targetTime}
                  onChange={(e) => handleTargetTimeChange(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono-num font-bold text-white focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            <p className="text-xs text-zinc-400 mb-3">
              للاستيقاظ بنشاط وقوة في الساعة <strong className="text-white font-mono-num">{targetTime}</strong>، نم في أحد هذه الأوقات بالضبط:
            </p>

            {/* Results Grid with 7.5h Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {bedtimeSlots.map((slot) => {
                const isOptimal75 = slot.isClosestTo7Point5;
                return (
                  <div
                    key={slot.cycles}
                    className={`relative p-4 rounded-xl border transition-all ${
                      isOptimal75
                        ? 'bg-gradient-to-b from-red-950/40 to-zinc-900/90 border-red-600 shadow-lg shadow-red-950/40 ring-1 ring-red-500/50'
                        : 'bg-zinc-950/70 border-zinc-800/80'
                    }`}
                  >
                    {isOptimal75 && (
                      <div className="absolute -top-2.5 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>الأقرب لـ 7.5 ساعات (مثالي)</span>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-400">
                        {slot.cycles} دورات نوم
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono-num">
                        {slot.durationLabel}
                      </span>
                    </div>

                    <div className="my-2">
                      <span className="text-2xl sm:text-3xl font-black font-mono-num text-white tracking-tight">
                        {slot.timeFormatted}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-zinc-900 mt-2">
                      <span className={`text-xs font-bold block ${isOptimal75 ? 'text-red-400' : 'text-zinc-300'}`}>
                        {slot.qualityLabel}
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-0.5 block">
                        {slot.tagline}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- MODE 3: قيلولة (Two Choices) ---------------- */}
        {mode === 'nap' && (
          <div>
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 block">بدء القيلولة الآن ({currentFormatted})</span>
                  <span className="text-base font-bold text-white">
                    اختر نوع القيلولة للاستيقاظ دون شلل نوم
                  </span>
                </div>
              </div>

              <button
                onClick={handleRefreshTime}
                className="min-h-[40px] text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>تحديث التوقيت</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {napOptions.map((nap) => (
                <div
                  key={nap.type}
                  className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/50 border border-amber-900/60 px-2 py-0.5 rounded">
                      {nap.badge}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono-num font-semibold">
                      {nap.durationLabel}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">
                    {nap.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4">
                    {nap.description}
                  </p>

                  <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 flex items-baseline justify-between">
                    <span className="text-xs text-zinc-400">اضبط المنبه على:</span>
                    <span className="text-2xl font-black font-mono-num text-white">
                      {nap.wakeFormatted}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Small Note Buffer as requested */}
        <div className="mt-6 p-3.5 bg-zinc-950/80 border border-zinc-800/70 rounded-xl flex items-start gap-2.5 text-xs text-zinc-400">
          <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
          <p>
            <strong className="text-zinc-300">ملاحظة علمية دقيقة:</strong> تم إضافة 15 دقيقة تلقائياً كوقت استغراق في النوم (Fall-asleep buffer) في وضعي النوم ودورة الـ 90 دقيقة. هذا يضمن أن منبهك يرن تماماً وأنت في نهاية دورة نوم خفيفة فتستيقظ بنشاط مطلق.
          </p>
        </div>
      </div>
    </div>
  );
};
