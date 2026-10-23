import React from 'react';
import { Calendar, Target, Clock, CheckCircle } from 'lucide-react';
import { DayChallengeInfo } from '../types';

interface DayCounterSectionProps {
  challenge: DayChallengeInfo;
}

export const DayCounterSection: React.FC<DayCounterSectionProps> = ({ challenge }) => {
  const {
    currentDay,
    totalDays,
    percentage,
    daysRemaining,
    startDateFormatted,
    endDateFormatted,
    todayFormatted,
    status
  } = challenge;

  return (
    <section id="day-counter" className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
      {/* Background Spartan Accent Line */}
      <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block mb-1">
            الجزء الأول · خط الأساس الزمني
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            عداد الـ 90 يوماً
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono-num bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-lg w-fit">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>{todayFormatted}</span>
        </div>
      </div>

      {/* Main Big Day Display */}
      <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-5 sm:p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-6xl font-black font-mono-num text-white tracking-tight">
              اليوم {currentDay}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-zinc-500 font-mono-num">
              من {totalDays}
            </span>
          </div>

          <div className="text-left font-mono-num">
            <span className="text-xl sm:text-2xl font-bold text-red-500">
              {percentage}%
            </span>
            <span className="text-xs text-zinc-500 block">نسبة الانقضاء</span>
          </div>
        </div>

        {/* Thin progress bar as requested: "plus a thin progress bar of the 90 days" */}
        <div className="space-y-2 mt-4">
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80 relative">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-zinc-500 font-mono-num pt-1">
            <span>البداية: {startDateFormatted} (اليوم 1)</span>
            <span>النهاية: {endDateFormatted} (اليوم 90)</span>
          </div>
        </div>
      </div>

      {/* Spartan Metrics Row (Clean Unboxed Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-xl p-3.5">
          <span className="text-[11px] text-zinc-500 block mb-1">الأيام المكتملة</span>
          <p className="text-xl font-bold font-mono-num text-zinc-200">
            {currentDay - 1} <span className="text-xs text-zinc-500 font-normal">يوماً</span>
          </p>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-xl p-3.5">
          <span className="text-[11px] text-zinc-500 block mb-1">المتبقي للنهاية</span>
          <p className="text-xl font-bold font-mono-num text-red-400">
            {daysRemaining} <span className="text-xs text-zinc-500 font-normal">يوماً</span>
          </p>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-xl p-3.5">
          <span className="text-[11px] text-zinc-500 block mb-1">الأسابيع المتبقية</span>
          <p className="text-xl font-bold font-mono-num text-zinc-200">
            {Math.ceil(daysRemaining / 7)} <span className="text-xs text-zinc-500 font-normal">أسابيع</span>
          </p>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-xl p-3.5">
          <span className="text-[11px] text-zinc-500 block mb-1">حالة التحدي</span>
          <p className="text-sm font-bold text-zinc-300 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse"></span>
            {status === 'active' ? 'في قلب المعركة' : status === 'before' ? 'لم يبدأ بعد' : 'اكتمل التحدي'}
          </p>
        </div>
      </div>

      {/* Spartan Discipline Quote / Reminder */}
      <div className="mt-4 pt-3 border-t border-zinc-900 text-xs text-zinc-500 flex items-center justify-between">
        <span>«الأيام تمضي بلا تراجع، ولا مكان للأعذار في معسكر الـ 90 يوماً.»</span>
        <span className="font-mono-num text-[11px] text-zinc-600">Day {currentDay}/90</span>
      </div>
    </section>
  );
};
