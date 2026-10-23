import React, { useState } from 'react';
import { Check, CheckCircle2, Save, History, Trash2, ChevronDown, ChevronUp, AlertCircle, Award, Trophy } from 'lucide-react';
import { DailyRule, DailyScoreRecord } from '../types';
import { SPARTAN_RULES, formatArabicDate } from '../utils/challenge';

interface DailyPointsSectionProps {
  checkedRuleIds: string[];
  onToggleRule: (ruleId: string) => void;
  onSaveDay: () => void;
  todayScore: number;
  history: DailyScoreRecord[];
  onDeleteHistoryItem: (date: string) => void;
  currentDayNumber: number;
  todayDateStr: string;
}

export const DailyPointsSection: React.FC<DailyPointsSectionProps> = ({
  checkedRuleIds,
  onToggleRule,
  onSaveDay,
  todayScore,
  history,
  onDeleteHistoryItem,
  currentDayNumber,
  todayDateStr,
}) => {
  const [showHistory, setShowHistory] = useState<boolean>(true);
  const [expandedHistoryDate, setExpandedHistoryDate] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Calculate running average
  const totalSavedDays = history.length;
  const runningAverage = totalSavedDays > 0
    ? (history.reduce((sum, h) => sum + h.score, 0) / totalSavedDays).toFixed(1)
    : '0.0';

  const isTodayAlreadySaved = history.some((h) => h.date === todayDateStr);

  const handleSaveClick = () => {
    onSaveDay();
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
    }, 3000);
  };

  // Spartan evaluation based on live score
  const getDisciplineStatus = (score: number) => {
    if (score === 10) return { label: 'انضباط سبارطي مطلق', color: 'text-red-500' };
    if (score >= 8) return { label: 'أداء صلب وقوي', color: 'text-zinc-200' };
    if (score >= 6) return { label: 'مقبول - لا تتهاون', color: 'text-zinc-400' };
    return { label: 'غير كافٍ - استعد تركيزك', color: 'text-zinc-500' };
  };

  const status = getDisciplineStatus(todayScore);

  return (
    <section id="daily-points" className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
      {/* Background Spartan Accent */}
      <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block mb-1">
            الجزء الثاني · القواعد اليومية السبع
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            نقاطي اليوم
          </h2>
        </div>

        {/* Live Score Display */}
        <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 block">المجموع المباشر</span>
            <span className={`text-xs font-semibold ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="border-r border-zinc-800 pr-3 mr-1 text-center font-mono-num">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {todayScore}
            </span>
            <span className="text-sm font-bold text-zinc-600">/10</span>
          </div>
        </div>
      </div>

      {/* Score Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/80">
          <div
            className="h-full bg-red-600 transition-all duration-300 ease-out"
            style={{ width: `${(todayScore / 10) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-zinc-500 font-mono-num mt-1.5">
          <span>0 نقاط</span>
          <span>الهدف الأقصى: 10 / 10</span>
        </div>
      </div>

      {/* Seven Spartan Rules List */}
      <div className="space-y-2.5 mb-6">
        {SPARTAN_RULES.map((rule) => {
          const isChecked = checkedRuleIds.includes(rule.id);
          return (
            <div
              key={rule.id}
              onClick={() => onToggleRule(rule.id)}
              className={`flex items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none min-h-[56px] ${
                isChecked
                  ? 'bg-zinc-900/90 border-red-900/60 text-white shadow-sm'
                  : 'bg-zinc-950/60 border-zinc-800/70 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/40'
              }`}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onToggleRule(rule.id);
                }
              }}
            >
              <div className="flex items-start sm:items-center gap-3">
                {/* Touch Checkbox */}
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors border ${
                    isChecked
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'border-zinc-700 bg-zinc-900 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm sm:text-base font-semibold ${isChecked ? 'text-white' : 'text-zinc-200'}`}>
                      {rule.title}
                    </span>
                    {rule.isAutoCheckedOnSave && (
                      <span className="text-[10px] text-red-400 bg-red-950/60 border border-red-900/50 px-1.5 py-0.5 rounded">
                        يُفعّل آلياً عند الحفظ
                      </span>
                    )}
                  </div>
                  {rule.description && (
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                      {rule.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Point Badge (Strict Spartan Unboxed Discipline) */}
              <div className="shrink-0 text-left font-mono-num">
                <span
                  className={`text-sm font-bold ${
                    isChecked ? 'text-red-400' : 'text-zinc-500'
                  }`}
                >
                  +{rule.points} {rule.points === 1 ? 'نقطة' : 'نقاط'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button Bar */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="text-right w-full sm:w-auto">
          <p className="text-xs text-zinc-400">
            {isTodayAlreadySaved
              ? 'اليوم محفوظ مسبقاً في السجل. الضغط مجدداً سيحدّث نتيجتك.'
              : 'احفظ نقاطك لتوثيق تقدمك واحتساب المعدل التراكمي.'}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            ملاحظة: القاعدة السابعة «تقرير النقاط» تُفعّل ذاتياً بمجرد الحفظ.
          </p>
        </div>

        <button
          onClick={handleSaveClick}
          className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ اليوم</span>
          <span className="font-mono-num text-xs bg-red-700/60 px-2 py-0.5 rounded">
            {todayScore}/10
          </span>
        </button>
      </div>

      {/* Save Success Notice */}
      {saveSuccessNotice && (
        <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-200">
          <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
          <span>تم تفعيل قاعدة «تقرير النقاط» وتخزين نتيجة اليوم ({todayScore}/10) في السجل بنجاح!</span>
        </div>
      )}

      {/* Past Days History & Running Average */}
      <div className="border-t border-zinc-900 pt-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-400" />
              سجل الأيام السابقة
            </h3>
            <span className="text-xs text-zinc-500 font-mono-num">
              ({totalSavedDays} أيام مسجلة)
            </span>
          </div>

          {/* Running Average Metric */}
          <div className="flex items-center gap-2 text-xs font-mono-num bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg">
            <span className="text-zinc-500 font-sans">المعدل التراكمي:</span>
            <span className="font-bold text-white text-sm">
              {runningAverage}
            </span>
            <span className="text-zinc-500 text-[11px]">/ 10</span>
          </div>
        </div>

        {/* History List */}
        {totalSavedDays === 0 ? (
          <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-6 text-center text-xs text-zinc-500">
            <p>لا يوجد أيام مسجلة بعد. انقر على «حفظ اليوم» بعد إتمام مهامك لإضافة أول سجل.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {history.map((record) => {
              const isExpanded = expandedHistoryDate === record.date;
              return (
                <div
                  key={record.date}
                  className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedHistoryDate(isExpanded ? null : record.date)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono-num font-bold text-zinc-300">
                        {record.dayNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-zinc-200">
                            {formatArabicDate(record.date)}
                          </span>
                          {record.date === todayDateStr && (
                            <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded font-sans">
                              اليوم
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-500 font-mono-num">
                          اليوم {record.dayNumber} من 90 · {record.completedRules?.length || 0} قواعد منجزة
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left font-mono-num">
                        <span className={`text-base font-bold ${record.score >= 8 ? 'text-red-400' : 'text-zinc-200'}`}>
                          {record.score}
                        </span>
                        <span className="text-xs text-zinc-500"> / 10</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`هل أنت متأكد من حذف سجل ${formatArabicDate(record.date)}؟`)) {
                            onDeleteHistoryItem(record.date);
                          }
                        }}
                        className="text-zinc-600 hover:text-red-400 p-1.5 rounded transition-colors"
                        title="حذف هذا اليوم"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="p-3.5 bg-zinc-900/40 border-t border-zinc-900 text-xs text-zinc-400">
                      <p className="font-semibold text-zinc-300 mb-2">القواعد التي تم إنجازها في هذا اليوم:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {SPARTAN_RULES.map((rule) => {
                          const achieved = record.completedRules?.includes(rule.id);
                          return (
                            <div
                              key={rule.id}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-[11px] ${
                                achieved
                                  ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
                                  : 'bg-transparent border-transparent text-zinc-600 line-through'
                              }`}
                            >
                              <span>{rule.title}</span>
                              <span className="font-mono-num">+{rule.points}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
