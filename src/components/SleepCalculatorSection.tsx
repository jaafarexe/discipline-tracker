import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, RefreshCw, Sparkles, Check, Info } from 'lucide-react';
import { calculateWakeUpTimes, calculateBedtimes, FALL_ASLEEP_BUFFER_MINUTES } from '../utils/sleep';

interface SleepCalculatorSectionProps {
  savedTargetWakeUpTime: string;
  onSaveTargetWakeUpTime: (time: string) => void;
}

export const SleepCalculatorSection: React.FC<SleepCalculatorSectionProps> = ({
  savedTargetWakeUpTime,
  onSaveTargetWakeUpTime,
}) => {
  const [mode, setMode] = useState<'now' | 'target'>('now');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [targetTime, setTargetTime] = useState<string>(savedTargetWakeUpTime || '05:00');

  // Update current time periodically or on demand
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
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
    hour12: true
  });

  const wakeUpSlots = calculateWakeUpTimes(currentTime);
  const bedtimeSlots = calculateBedtimes(targetTime);

  return (
    <section id="sleep-calculator" className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
      {/* Background Spartan Accent */}
      <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block mb-1">
            الجزء الرابع · بيولوجيا التعافي
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            حاسبة دورات النوم
          </h2>
        </div>

        {/* Mode Selector Tabs (Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setMode('now')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'now'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-red-500" />
            <span>رح نام هلأ</span>
          </button>
          <button
            onClick={() => setMode('target')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'target'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-zinc-300" />
            <span>بدي فيق الساعة</span>
          </button>
        </div>
      </div>

      {/* Mode A: "رح نام هلأ" (Current time as bedtime) */}
      {mode === 'now' && (
        <div>
          {/* Current Time Bar */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-zinc-500 block">وقت الذهاب للفراش الآن</span>
                <span className="text-lg font-bold text-white font-mono-num">
                  {currentFormatted}
                </span>
              </div>
            </div>

            <button
              onClick={handleRefreshTime}
              className="text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>تحديث للتوقيت الحالي</span>
            </button>
          </div>

          <p className="text-xs text-zinc-400 mb-3">
            إذا ذهبت إلى الفراش الآن، استيقظ في أحد هذه الأوقات لتقطع نومك في نهاية الدورة وتستيقظ بنشاط كامل:
          </p>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {wakeUpSlots.map((slot) => {
              const isOptimal = slot.cycles === 5;
              return (
                <div
                  key={slot.cycles}
                  className={`relative p-4 rounded-xl border transition-all ${
                    isOptimal
                      ? 'bg-zinc-900/90 border-red-600/70 shadow-lg shadow-red-950/20'
                      : 'bg-zinc-950/70 border-zinc-800/80'
                  }`}
                >
                  {isOptimal && (
                    <div className="absolute -top-2.5 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      موصى به للانضباط
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
                    <span className={`text-xs font-bold block ${isOptimal ? 'text-red-400' : 'text-zinc-300'}`}>
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

      {/* Mode B: "بدي فيق الساعة" (Target wake up time) */}
      {mode === 'target' && (
        <div>
          {/* Target Time Setting Bar */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
            <div>
              <span className="text-xs font-semibold text-zinc-300 block mb-1">
                حدد التوقيت المستهدف للاستيقاظ:
              </span>
              <p className="text-[11px] text-zinc-500">
                (القاعدة 1 في متتبّع الانضباط: الاستيقاظ الساعة 05:00 فجراً)
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Quick Preset Buttons */}
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
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm font-mono-num font-bold text-white focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>

          <p className="text-xs text-zinc-400 mb-3">
            للاستيقاظ بنشاط في تمام الساعة <strong className="text-white font-mono-num">{targetTime}</strong>، يجب أن تنام في أحد التوقيتات التالية:
          </p>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {bedtimeSlots.map((slot) => {
              const isOptimal = slot.cycles === 5;
              return (
                <div
                  key={slot.cycles}
                  className={`relative p-4 rounded-xl border transition-all ${
                    isOptimal
                      ? 'bg-zinc-900/90 border-red-600/70 shadow-lg shadow-red-950/20'
                      : 'bg-zinc-950/70 border-zinc-800/80'
                  }`}
                >
                  {isOptimal && (
                    <div className="absolute -top-2.5 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      الموعد الذهبي
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
                    <span className={`text-xs font-bold block ${isOptimal ? 'text-red-400' : 'text-zinc-300'}`}>
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

      {/* Mandatory Fall-asleep Buffer Note as specified */}
      <div className="mt-5 p-3.5 bg-zinc-950/80 border border-zinc-800/70 rounded-xl flex items-start gap-2.5 text-xs text-zinc-400">
        <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <p>
          <strong className="text-zinc-300">ملاحظة علمية:</strong> تم إضافة 15 دقيقة كوقت استغراق في النوم (Fall-asleep buffer) تلقائياً في كلا الوضعين. تدوم دورة النوم الطبيعية 90 دقيقة؛ والاستيقاظ بنهاية الدورة يمنع خمول النوم ويضمن يقظة فورية بدون كسل.
        </p>
      </div>
    </section>
  );
};
