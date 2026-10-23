import React, { useState } from 'react';
import { Dumbbell, Plus, Trash2, Scale, Send, Check, Copy, Share2, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { WorkoutDay, Exercise, WeightRecord } from '../types';
import { shareOrCopyMessage } from '../utils/share';
import { formatArabicDate, getTodayDateString } from '../utils/challenge';

interface GymSectionProps {
  workoutDays: WorkoutDay[];
  onUpdateWorkoutDays: (days: WorkoutDay[]) => void;
  weightHistory: WeightRecord[];
  onAddWeightRecord: (weight: number, dateStr: string) => void;
  onDeleteWeightRecord: (id: string) => void;
}

export const GymSection: React.FC<GymSectionProps> = ({
  workoutDays,
  onUpdateWorkoutDays,
  weightHistory,
  onAddWeightRecord,
  onDeleteWeightRecord,
}) => {
  const today = new Date();
  const todayDayOfWeek = today.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  const todayDateStr = getTodayDateString(today);

  // Determine active split tab: default to today's workout if Mon, Wed, Sat, else Mon
  const getInitialActiveDay = (): 'push' | 'pull' | 'legs' => {
    if (todayDayOfWeek === 1) return 'push';
    if (todayDayOfWeek === 3) return 'pull';
    if (todayDayOfWeek === 6) return 'legs';
    return 'push';
  };

  const [activeDayId, setActiveDayId] = useState<'push' | 'pull' | 'legs'>(getInitialActiveDay);
  const [newWeightInput, setNewWeightInput] = useState<string>('');
  const [weightNotice, setWeightNotice] = useState<string | null>(null);

  // Exercise request modal state
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [exerciseName, setExerciseName] = useState<string>('');
  const [targetMuscle, setTargetMuscle] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // New exercise inline form
  const [newExName, setNewExName] = useState<string>('');
  const [newExSets, setNewExSets] = useState<string>('4×8-10');
  const [isAddingExercise, setIsAddingExercise] = useState<boolean>(false);

  // Identify today's session info
  const getTodaySessionInfo = () => {
    if (todayDayOfWeek === 1) return { day: 'push', title: 'اليوم: Push (الاثنين)', isGymDay: true };
    if (todayDayOfWeek === 3) return { day: 'pull', title: 'اليوم: Pull (الأربعاء)', isGymDay: true };
    if (todayDayOfWeek === 6) return { day: 'legs', title: 'اليوم: Legs وتوزين أسبوعي (السبت)', isGymDay: true };
    return { day: null, title: 'اليوم استشفاء عضلي وراحة نشطة', isGymDay: false };
  };

  const todaySession = getTodaySessionInfo();
  const currentDayData = workoutDays.find((d) => d.id === activeDayId) || workoutDays[0];

  // Latest weight
  const latestWeight = weightHistory.length > 0 ? weightHistory[0].weight : 70;
  const weightProgress = Math.min(100, Math.max(0, ((latestWeight - 70) / (85 - 70)) * 100));

  // Exercise management
  const handleAddExercise = (dayId: string) => {
    if (!newExName.trim()) return;
    const newEx: Exercise = {
      id: `ex_${Date.now()}`,
      name: newExName.trim(),
      setsReps: newExSets.trim() || '3×10',
    };

    const updated = workoutDays.map((day) => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        exercises: [...day.exercises, newEx],
      };
    });

    onUpdateWorkoutDays(updated);
    setNewExName('');
    setIsAddingExercise(false);
  };

  const handleRemoveExercise = (dayId: string, exId: string) => {
    const updated = workoutDays.map((day) => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        exercises: day.exercises.filter((ex) => ex.id !== exId),
      };
    });
    onUpdateWorkoutDays(updated);
  };

  const handleUpdateExercise = (dayId: string, exId: string, field: 'name' | 'setsReps', val: string) => {
    const updated = workoutDays.map((day) => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        exercises: day.exercises.map((ex) => {
          if (ex.id !== exId) return ex;
          return { ...ex, [field]: val };
        }),
      };
    });
    onUpdateWorkoutDays(updated);
  };

  // Weight save handler
  const handleSaveWeight = () => {
    const parsed = parseFloat(newWeightInput);
    if (isNaN(parsed) || parsed < 40 || parsed > 150) {
      setWeightNotice('يرجى إدخال وزن صحيح بالكيلوغرام (مثال: 78.5)');
      return;
    }
    onAddWeightRecord(parsed, todayDateStr);
    setNewWeightInput('');
    setWeightNotice(`تم تسجيل وزن ${parsed} كغ بنجاح!`);
    setTimeout(() => setWeightNotice(null), 3000);
  };

  // Send exercise request to Malek
  const handleSendRequestToMalek = async () => {
    if (!exerciseName.trim() || !targetMuscle.trim()) {
      setShareFeedback('يرجى ملء اسم التمرين والعضلة المستهدفة');
      return;
    }

    const message = `طلب إضافة تمرين:
• اسم التمرين: ${exerciseName.trim()}
• العضلة المستهدفة: ${targetMuscle.trim()}
• ليش بدك ياه: ${reason.trim() || 'تطوير القوة والبناء العضلي'}

خطتي الحالية: Push اثنين، Pull أربعاء، Legs سبت — شوف كيف بينضاف بدون ما يتضارب مع الباقي`;

    const res = await shareOrCopyMessage(message, 'طلب تمرين جديد من ملك');
    setShareFeedback(res.feedbackText);

    if (res.success) {
      setTimeout(() => {
        setShareFeedback(null);
        setShowRequestModal(false);
        setExerciseName('');
        setTargetMuscle('');
        setReason('');
      }, 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TODAY'S STATUS CARD */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500">
              <Dumbbell className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block">
                برنامج النادي 3-Day Split
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {todaySession.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRequestModal(true)}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-red-900/60 text-xs font-bold text-red-400 hover:text-red-300 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>اطلب إضافة تمرين من ملك</span>
            </button>
          </div>
        </div>

        {/* Quick reminder */}
        <div className="mt-3 text-xs text-zinc-400 flex items-center gap-2 border-t border-zinc-900 pt-3">
          <span className="font-mono-num text-zinc-500">تقسيم الخطة:</span>
          <span className={todayDayOfWeek === 1 ? 'text-red-400 font-bold' : ''}>الاثنين Push</span>
          <span>·</span>
          <span className={todayDayOfWeek === 3 ? 'text-red-400 font-bold' : ''}>الأربعاء Pull</span>
          <span>·</span>
          <span className={todayDayOfWeek === 6 ? 'text-red-400 font-bold' : ''}>السبت Legs (توزين)</span>
        </div>
      </div>

      {/* 2. SPLIT SELECTOR TABS */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-950 border border-zinc-800/80 rounded-xl">
        <button
          onClick={() => setActiveDayId('push')}
          className={`min-h-[44px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
            activeDayId === 'push'
              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>الاثنين · Push</span>
          <span className="text-[10px] text-zinc-500 font-normal">صدر · أكتاف · ترايسبس</span>
        </button>

        <button
          onClick={() => setActiveDayId('pull')}
          className={`min-h-[44px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
            activeDayId === 'pull'
              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>الأربعاء · Pull</span>
          <span className="text-[10px] text-zinc-500 font-normal">ظهر · بايسبس · فخاد</span>
        </button>

        <button
          onClick={() => setActiveDayId('legs')}
          className={`min-h-[44px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
            activeDayId === 'legs'
              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>السبت · Legs</span>
          <span className="text-[10px] text-zinc-500 font-normal">أرجل كاملة + توزين</span>
        </button>
      </div>

      {/* 3. ACTIVE DAY CARD & EXERCISES LIST */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>تمارين يوم {currentDayData.dayNameAr}</span>
              <span className="text-xs text-red-500 font-mono-num font-bold">
                ({currentDayData.nameAr})
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{currentDayData.focus}</p>
          </div>

          <button
            onClick={() => setIsAddingExercise(true)}
            className="min-h-[40px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-red-500" />
            <span>إضافة تمرين</span>
          </button>
        </div>

        {/* Add Exercise Inline Form */}
        {isAddingExercise && (
          <div className="mb-4 p-3.5 bg-zinc-950 border border-red-900/40 rounded-xl space-y-3">
            <span className="text-xs font-bold text-red-400 block">إضافة تمرين جديد:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="اسم التمرين (مثال: بنش بريس بار)"
                value={newExName}
                onChange={(e) => setNewExName(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
              <input
                type="text"
                placeholder="الجلسات والتكرارات (مثال: 4×8-10)"
                value={newExSets}
                onChange={(e) => setNewExSets(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 font-mono-num"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setIsAddingExercise(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleAddExercise(activeDayId)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors"
              >
                حفظ التمرين
              </button>
            </div>
          </div>
        )}

        {/* Exercises List */}
        <div className="space-y-2.5">
          {currentDayData.exercises.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">
              لا توجد تمارين مسجلة لهذا اليوم. انقر على «إضافة تمرين» لبدء جدولك.
            </p>
          ) : (
            currentDayData.exercises.map((ex, idx) => (
              <div
                key={ex.id}
                className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between gap-3 group hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono-num text-zinc-500 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={ex.name}
                      onChange={(e) => handleUpdateExercise(activeDayId, ex.id, 'name', e.target.value)}
                      className="bg-transparent text-sm font-semibold text-white focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700 rounded px-1.5 py-0.5"
                    />
                    <input
                      type="text"
                      value={ex.setsReps}
                      onChange={(e) => handleUpdateExercise(activeDayId, ex.id, 'setsReps', e.target.value)}
                      className="bg-transparent text-xs text-zinc-400 font-mono-num focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700 rounded px-1.5 py-0.5"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveExercise(activeDayId, ex.id)}
                  aria-label="حذف التمرين"
                  className="text-zinc-600 hover:text-red-400 p-1.5 rounded transition-colors shrink-0"
                  title="حذف هذا التمرين"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. SATURDAY'S CARD WEIGH-IN FIELD & HISTORY (Goal: 70 to 85 kg) */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                توزين السبت الأسبوعي
              </h3>
              <p className="text-xs text-zinc-400">
                الهدف: التضخيم النظيف من <strong className="text-white font-mono-num">70 كغ</strong> إلى <strong className="text-red-400 font-mono-num">85 كغ</strong>
              </p>
            </div>
          </div>

          <div className="text-left font-mono-num">
            <span className="text-xs text-zinc-500 block">آخر وزن مسجل</span>
            <span className="text-xl font-black text-white">{latestWeight} كغ</span>
          </div>
        </div>

        {/* Progress Bar towards 85 kg */}
        <div className="mb-5 space-y-1.5">
          <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-500"
              style={{ width: `${weightProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-zinc-500 font-mono-num">
            <span>البداية: 70 كغ</span>
            <span>الهدف المنشود: 85 كغ</span>
          </div>
        </div>

        {/* Weigh-in input */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3.5 mb-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full text-right">
            <label className="text-xs text-zinc-400 block mb-1">
              سجل وزنك اليوم ({todayDateStr}):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="50"
                max="150"
                placeholder="مثال: 78.5"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold text-white font-mono-num focus:border-red-600 focus:outline-none"
              />
              <span className="text-xs text-zinc-400 font-mono-num shrink-0">كغ</span>
            </div>
          </div>

          <button
            onClick={handleSaveWeight}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wide transition-all shrink-0 cursor-pointer"
          >
            حفظ الوزن
          </button>
        </div>

        {weightNotice && (
          <p className="text-xs text-red-400 mb-3 bg-red-950/40 p-2 rounded-lg border border-red-900/50">
            {weightNotice}
          </p>
        )}

        {/* Weight History List */}
        <div>
          <span className="text-xs font-semibold text-zinc-400 block mb-2">سجل التوزين السابق:</span>
          {weightHistory.length === 0 ? (
            <p className="text-xs text-zinc-600">لا يوجد أوزان مسجلة حتى الآن.</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {weightHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg px-3 py-2 flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-300">{formatArabicDate(rec.date)}</span>
                  <div className="flex items-center gap-3 font-mono-num">
                    <span className="font-bold text-white text-sm">{rec.weight} كغ</span>
                    <button
                      onClick={() => onDeleteWeightRecord(rec.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                      title="حذف هذا القياس"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. REQUEST EXERCISE MODAL FORM FOR MALEK */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              طلب إضافة تمرين من ملك
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              اكتب تفاصيل التمرين وسيتم صياغة رسالة عربية دقيقة جاهزة للمشاركة أو النسخ مع سياق جدولك الحالي.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs text-zinc-300 block mb-1">اسم التمرين:</label>
                <input
                  type="text"
                  placeholder="مثال: ديدليفت روماني بالدمبلز"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1">العضلة المستهدفة:</label>
                <input
                  type="text"
                  placeholder="مثال: عضلات الفخذ الخلفية وأسفل الظهر"
                  value={targetMuscle}
                  onChange={(e) => setTargetMuscle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1">ليش بدك ياه (السبب والهدف):</label>
                <textarea
                  rows={2}
                  placeholder="مثال: حاسس في ضعف بالهامسترينغ وبدي ركّز على استطالتها"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Context Note preview */}
              <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-300 block mb-0.5">سطر السياق المُرفق تلقائياً:</span>
                "خطتي الحالية: Push اثنين، Pull أربعاء، Legs سبت — شوف كيف بينضاف بدون ما يتضارب مع الباقي"
              </div>
            </div>

            {shareFeedback && (
              <div className="mb-4 p-2.5 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-red-400 shrink-0" />
                <span>{shareFeedback}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setShareFeedback(null);
                }}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                إغلاق
              </button>
              <button
                onClick={handleSendRequestToMalek}
                className="min-h-[44px] px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال أو نسخ لملك</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
