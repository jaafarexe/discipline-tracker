import React, { useState } from 'react';
import { BookOpen, Plus, Minus, RotateCcw, CheckCircle, ArrowUpRight } from 'lucide-react';
import { SubjectCurriculum } from '../types';

interface CurriculumSectionProps {
  curriculum: SubjectCurriculum[];
  onUpdateDone: (subjectId: string, delta: number) => void;
  onSetDone: (subjectId: string, value: number) => void;
  onResetToDefaults: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  curriculum,
  onUpdateDone,
  onSetDone,
  onResetToDefaults,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const totalCurriculumTasks = 391;
  const totalDoneTasks = curriculum.reduce((acc, sub) => acc + sub.done, 0);
  const overallPercentage = ((totalDoneTasks / totalCurriculumTasks) * 100).toFixed(1);
  const tasksRemaining = Math.max(0, totalCurriculumTasks - totalDoneTasks);

  const startEditing = (subject: SubjectCurriculum) => {
    setEditingId(subject.id);
    setEditValue(String(subject.done));
  };

  const handleEditSubmit = (subject: SubjectCurriculum) => {
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed)) {
      onSetDone(subject.id, Math.max(0, Math.min(subject.total, parsed)));
    }
    setEditingId(null);
  };

  return (
    <section id="curriculum" className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
      {/* Background Spartan Accent */}
      <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block mb-1">
            الجزء الثالث · المعركة الأكاديمية
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            تقدم المنهاج
          </h2>
        </div>

        <button
          onClick={() => {
            if (confirm('هل ترغب بإعادة ضبط عدادات المنهاج إلى القيم الأولية؟')) {
              onResetToDefaults();
            }
          }}
          className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors w-fit"
          title="إعادة ضبط العدادات إلى القيم الابتدائية"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة القيم الأصلية</span>
        </button>
      </div>

      {/* OVERALL TOTAL DISPLAY AT TOP OF THIS SECTION (Big progress bar & done sum out of 391) */}
      <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-5xl font-black font-mono-num text-white tracking-tight">
              {totalDoneTasks}
            </span>
            <span className="text-lg sm:text-xl font-bold text-zinc-500 font-mono-num">
              من {totalCurriculumTasks} مهمة
            </span>
          </div>

          <div className="text-left font-mono-num flex items-baseline gap-3 sm:block">
            <span className="text-2xl sm:text-3xl font-black text-red-500">
              {overallPercentage}%
            </span>
            <span className="text-xs text-zinc-500 block">الإنجاز الكلي</span>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="w-full h-3.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/90 relative mb-3">
          <div
            className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, (totalDoneTasks / totalCurriculumTasks) * 100)}%` }}
          />
        </div>

        {/* Supplementary stats */}
        <div className="flex justify-between items-center text-xs text-zinc-400 font-mono-num pt-1">
          <span>المتبقي للإتمام الشامل: <strong className="text-zinc-200">{tasksRemaining}</strong> مهمة</span>
          <span>8 مواد دراسية</span>
        </div>
      </div>

      {/* Eight Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {curriculum.map((sub) => {
          const percent = sub.total > 0 ? Math.round((sub.done / sub.total) * 100) : 0;
          const isFinished = sub.done >= sub.total;
          const isEditing = editingId === sub.id;

          return (
            <div
              key={sub.id}
              className={`bg-zinc-950/70 border rounded-xl p-4 transition-all ${
                isFinished
                  ? 'border-red-900/40 bg-zinc-950/90'
                  : 'border-zinc-800/80 hover:border-zinc-700/80'
              }`}
            >
              {/* Subject Title & Percentage */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">
                    {sub.name}
                  </span>
                  {isFinished && (
                    <span className="text-[10px] text-red-400 bg-red-950/50 border border-red-900/60 px-1.5 py-0.2 rounded font-mono-num">
                      مكتمل
                    </span>
                  )}
                </div>

                <div className="text-left font-mono-num">
                  <span className={`text-sm font-bold ${isFinished ? 'text-red-400' : 'text-zinc-300'}`}>
                    {percent}%
                  </span>
                </div>
              </div>

              {/* Progress Bar for Subject */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/60 mb-4">
                <div
                  className={`h-full transition-all duration-300 ${
                    isFinished ? 'bg-red-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${Math.min(100, percent)}%` }}
                />
              </div>

              {/* Counter Control Zone */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {/* Done/Total Text & Tap to Edit */}
                <div className="font-mono-num">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max={sub.total}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditSubmit(sub)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSubmit(sub);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        className="w-16 bg-zinc-900 border border-red-600 rounded px-2 py-1 text-sm font-bold text-white text-center focus:outline-none"
                      />
                      <span className="text-xs text-zinc-500">/ {sub.total}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(sub)}
                      className="text-right group flex items-baseline gap-1.5 hover:text-red-400 transition-colors"
                      title="انقر لتعديل الرقم يدوياً"
                    >
                      <span className="text-xl font-black text-white group-hover:text-red-400">
                        {sub.done}
                      </span>
                      <span className="text-xs text-zinc-500 font-bold">
                        / {sub.total}
                      </span>
                      <span className="text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        تعديل
                      </span>
                    </button>
                  )}
                  <span className="text-[10px] text-zinc-500 block font-sans">
                    {sub.total - sub.done > 0 ? `متبقي ${sub.total - sub.done}` : 'تم إنجاز كامل المادة'}
                  </span>
                </div>

                {/* + and − Buttons (Touch hitbox >= 44px) */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateDone(sub.id, -1)}
                    disabled={sub.done <= 0}
                    aria-label={`إنقاص ${sub.name}`}
                    className="min-w-[44px] min-h-[44px] rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => onUpdateDone(sub.id, 1)}
                    disabled={sub.done >= sub.total}
                    aria-label={`زيادة ${sub.name}`}
                    className="min-w-[44px] min-h-[44px] rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-red-600/50 active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
