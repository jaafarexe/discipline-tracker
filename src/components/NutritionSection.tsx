import React, { useState } from 'react';
import { Utensils, Plus, Trash2, Camera, Share2, Check, ArrowRightLeft, Sparkles, AlertCircle, Info, History } from 'lucide-react';
import { LoggedFoodItem, NutritionItem } from '../types';
import { shareOrCopyMessage } from '../utils/share';
import { getTodayDateString, formatArabicDate } from '../utils/challenge';

interface NutritionSectionProps {
  todayLog: LoggedFoodItem[];
  onAddFoodItem: (item: Omit<LoggedFoodItem, 'id' | 'timestamp'>) => void;
  onRemoveFoodItem: (id: string) => void;
  onClearTodayLog: () => void;
  pastDaysNutrition: { date: string; calories: number; protein: number }[];
}

export const STAPLES: NutritionItem[] = [
  { id: 'egg', name: 'بيضة مسلوقة/مقلية', calories: 70, protein: 6, unitLabel: '1 بيضة' },
  { id: 'olive_oil', name: 'ملعقة زيت زيتون', calories: 120, protein: 0, unitLabel: '1 ملعقة طعام' },
  { id: 'syrian_bread', name: 'رغيف خبز سوري', calories: 250, protein: 7, unitLabel: '1 رغيف' },
  { id: 'hummus', name: 'حمص حب مسلوق', calories: 160, protein: 8, unitLabel: '100 غرام' },
  { id: 'bulgur', name: 'برغل مطبوخ', calories: 85, protein: 3, unitLabel: '100 غرام' },
  { id: 'dry_soy', name: 'فول صويا ناشف', calories: 445, protein: 36.5, unitLabel: '100 غرام' },
];

export const NutritionSection: React.FC<NutritionSectionProps> = ({
  todayLog,
  onAddFoodItem,
  onRemoveFoodItem,
  onClearTodayLog,
  pastDaysNutrition,
}) => {
  const TARGET_CALORIES = 2500;
  const TARGET_PROTEIN = 120;

  // Totals for today
  const todayCalories = todayLog.reduce((sum, item) => sum + item.calories * item.quantity, 0);
  const todayProtein = Number(
    todayLog.reduce((sum, item) => sum + item.protein * item.quantity, 0).toFixed(1)
  );

  const calPercent = Math.min(100, Math.round((todayCalories / TARGET_CALORIES) * 100));
  const proPercent = Math.min(100, Math.round((todayProtein / TARGET_PROTEIN) * 100));

  // Soy converter state
  const [dryGrams, setDryGrams] = useState<string>('100');
  const parsedDry = parseFloat(dryGrams) || 0;
  const soakedGrams = Number((parsedDry * 2.24).toFixed(1));
  const soyProtein = Number((parsedDry * 0.365).toFixed(1));
  const soyCalories = Math.round(parsedDry * 4.45);

  // Custom food entry
  const [customName, setCustomName] = useState<string>('');
  const [customCal, setCustomCal] = useState<string>('');
  const [customPro, setCustomPro] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);

  // Malek request feedback
  const [malekFeedback, setMalekFeedback] = useState<string | null>(null);

  // Add fixed lunch
  const handleAddFixedLunch = () => {
    onAddFoodItem({
      name: 'وجبة الغدا الثابتة',
      calories: 1800,
      protein: 45,
      quantity: 1,
    });
  };

  // Add staple
  const handleAddStaple = (staple: NutritionItem) => {
    onAddFoodItem({
      itemId: staple.id,
      name: staple.name,
      calories: staple.calories,
      protein: staple.protein,
      quantity: 1,
    });
  };

  // Add custom food
  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const c = parseInt(customCal, 10) || 0;
    const p = parseFloat(customPro) || 0;
    onAddFoodItem({
      name: customName.trim(),
      calories: c,
      protein: p,
      quantity: 1,
    });
    setCustomName('');
    setCustomCal('');
    setCustomPro('');
    setShowCustomForm(false);
  };

  // Add calculated soy to log
  const handleAddCalculatedSoy = () => {
    if (parsedDry <= 0) return;
    onAddFoodItem({
      name: `فول صويا (${parsedDry}غ ناشف = ${soakedGrams}غ منقوع)`,
      calories: soyCalories,
      protein: soyProtein,
      quantity: 1,
    });
  };

  // Malek meal calculator
  const handleAskMalekAboutMeal = async () => {
    const message = `احسبلي سعرات هالأكلة وبروتينها. أهدافي اليومية 2500 سعرة و120غ بروتين، وأكلت لحد هلأ ${todayCalories} سعرة و${todayProtein}غ بروتين.`;

    const res = await shareOrCopyMessage(message, 'حساب سعرات أكلة من ملك');
    setMalekFeedback(res.feedbackText);

    setTimeout(() => {
      setMalekFeedback(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. DAILY TARGETS HEADER */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500">
              <Utensils className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block">
                خطة التضخيم الغذائي السبارطية
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                الأهداف اليومية: 2500 سعرة · 120غ بروتين
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAskMalekAboutMeal}
              className="min-h-[44px] px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-red-900/60 text-xs font-bold text-red-400 hover:text-red-300 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="توليد رسالة جاهزة لملك مع مجموع اليوم"
            >
              <Camera className="w-4 h-4 text-red-500" />
              <span>صوّرت أكلة — احسبها عند ملك</span>
            </button>
          </div>
        </div>

        {malekFeedback && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-red-400 shrink-0" />
              <span>{malekFeedback}</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-semibold">
              📌 تنبيه: أرفق الصورة مع الرسالة بالشات
            </span>
          </div>
        )}

        {/* Dual Target Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
          {/* Calories Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-zinc-400">السعرات الحرارية</span>
              <div className="font-mono-num text-xs">
                <strong className="text-base font-bold text-white">{todayCalories}</strong>
                <span className="text-zinc-500"> / {TARGET_CALORIES} سعرة</span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-500"
                style={{ width: `${calPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500 font-mono-num">
              <span>{calPercent}% منجز</span>
              <span>متبقي: {Math.max(0, TARGET_CALORIES - todayCalories)} سعرة</span>
            </div>
          </div>

          {/* Protein Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-zinc-400">البروتين الصافي</span>
              <div className="font-mono-num text-xs">
                <strong className="text-base font-bold text-white">{todayProtein}غ</strong>
                <span className="text-zinc-500"> / {TARGET_PROTEIN}غ</span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${proPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500 font-mono-num">
              <span>{proPercent}% منجز</span>
              <span>متبقي: {Math.max(0, Number((TARGET_PROTEIN - todayProtein).toFixed(1)))}غ</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ONE-TAP CARD: «وجبة الغدا الثابتة» */}
      <div className="bg-gradient-to-r from-red-950/40 via-zinc-900/90 to-zinc-950 border border-red-900/50 rounded-2xl p-5 relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block mb-1">
              بنقرة واحدة · عماد التضخيم
            </span>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              وجبة الغدا الثابتة
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              تحتوي على <strong className="text-white font-mono-num">1800 سعرة حرارية</strong> و <strong className="text-red-400 font-mono-num">45غ بروتين</strong> تغطي 62% من طاقتك اليومية.
            </p>
          </div>

          <button
            onClick={handleAddFixedLunch}
            className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/50 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>تسجيل وجبة الغدا الآن</span>
          </button>
        </div>
      </div>

      {/* 3. BUILT-IN STAPLES LIST (Labeled تقريبية) */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
          <div>
            <h3 className="text-base font-bold text-white">
              الأطعمة الأساسية المعتمدة
            </h3>
            <span className="text-xs text-zinc-500">
              (قيم تقريبية لكل وحدة لتسجيل سريع بنقرة زر)
            </span>
          </div>

          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-red-500" />
            <span>إضافة طعام مخصص</span>
          </button>
        </div>

        {/* Custom Food Form */}
        {showCustomForm && (
          <div className="mb-4 p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <span className="text-xs font-bold text-zinc-300 block">إضافة صنف مخصص لليوم:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="اسم الأكلة (مثال: علبة تونة)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
              <input
                type="number"
                placeholder="السعرات (مثال: 180)"
                value={customCal}
                onChange={(e) => setCustomCal(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 font-mono-num"
              />
              <input
                type="number"
                step="0.1"
                placeholder="البروتين بالغرام (مثال: 30)"
                value={customPro}
                onChange={(e) => setCustomPro(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 font-mono-num"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowCustomForm(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddCustom}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg"
              >
                إضافة
              </button>
            </div>
          </div>
        )}

        {/* Staples Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STAPLES.map((staple) => (
            <div
              key={staple.id}
              className="bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-3.5 flex items-center justify-between gap-2 transition-all"
            >
              <div>
                <span className="text-sm font-bold text-white block">
                  {staple.name}
                </span>
                <span className="text-[11px] text-zinc-500 block mb-1">
                  {staple.unitLabel}
                </span>
                <div className="text-xs font-mono-num text-zinc-400 flex items-center gap-2">
                  <span className="text-zinc-200 font-bold">{staple.calories} سعرة</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-red-400 font-bold">{staple.protein}غ بروتين</span>
                </div>
              </div>

              <button
                onClick={() => handleAddStaple(staple)}
                aria-label={`إضافة ${staple.name}`}
                className="min-w-[44px] min-h-[44px] rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600/60 active:scale-95 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="إضافة لوجبات اليوم"
              >
                <Plus className="w-4 h-4 text-red-500 stroke-[2.5]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SOY CONVERTER: Dry grams -> Soaked (x2.24) & Protein (x0.365) */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-900">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              محول فول الصويا (ناشف ⟷ منقوع)
            </h3>
            <p className="text-xs text-zinc-500">
              معامل النقع: الناشف × 2.24 · نسبة البروتين: الناشف × 0.365
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Input Dry Grams */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5">
            <label className="text-xs text-zinc-400 block mb-1">الوزن ناشف (قبل النقع):</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="10"
                value={dryGrams}
                onChange={(e) => setDryGrams(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base font-bold text-white font-mono-num focus:border-red-600 focus:outline-none"
              />
              <span className="text-xs text-zinc-400 font-mono-num">غرام</span>
            </div>
            {/* Quick buttons */}
            <div className="flex gap-1.5 mt-2">
              {['50', '100', '150'].map((g) => (
                <button
                  key={g}
                  onClick={() => setDryGrams(g)}
                  className={`text-[10px] px-2 py-0.5 rounded font-mono-num ${
                    dryGrams === g ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {g}غ
                </button>
              ))}
            </div>
          </div>

          {/* Results: Soaked Grams & Protein */}
          <div className="sm:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 font-mono-num">
              <div>
                <span className="text-xs text-zinc-500 block">الوزن بعد النقع (×2.24):</span>
                <span className="text-xl font-bold text-white">{soakedGrams} غرام منقوع</span>
              </div>
              <div className="flex items-center gap-4 text-xs pt-1">
                <span className="text-red-400 font-bold">{soyProtein}غ بروتين صافي</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-300 font-bold">{soyCalories} سعرة تقريباً</span>
              </div>
            </div>

            <button
              onClick={handleAddCalculatedSoy}
              disabled={parsedDry <= 0}
              className="min-h-[44px] px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-bold text-zinc-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-3.5 h-3.5 text-red-500" />
              <span>أضف للوجبات</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. TODAY'S FOOD LOG & HISTORY */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">
              سجل وجبات اليوم ({todayLog.length})
            </h3>
            <span className="text-xs font-mono-num text-zinc-500">
              {todayCalories} سعرة · {todayProtein}غ بروتين
            </span>
          </div>

          {todayLog.length > 0 && (
            <button
              onClick={() => {
                if (confirm('هل ترغب بتفريغ سجل وجبات اليوم؟')) {
                  onClearTodayLog();
                }
              }}
              className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تفريغ اليوم</span>
            </button>
          )}
        </div>

        {todayLog.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-500 bg-zinc-950/40 rounded-xl border border-zinc-800/60">
            لم تسجل أي طعام اليوم بعد. استخدم «وجبة الغدا الثابتة» أو الأطعمة الأساسية أعلاه لبدء الحساب.
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {todayLog.map((food) => (
              <div
                key={food.id}
                className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-semibold text-white block">{food.name}</span>
                  <span className="text-[11px] text-zinc-500 font-mono-num">
                    {food.calories} سعرة · {food.protein}غ بروتين
                  </span>
                </div>

                <button
                  onClick={() => onRemoveFoodItem(food.id)}
                  aria-label="حذف الصنف"
                  className="text-zinc-600 hover:text-red-400 p-1.5 rounded transition-colors"
                  title="حذف هذا الصنف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Small past days history */}
        {pastDaysNutrition.length > 0 && (
          <div className="mt-5 pt-4 border-t border-zinc-900">
            <span className="text-xs font-semibold text-zinc-400 block mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-zinc-500" />
              أيام سابقة مسجلة:
            </span>
            <div className="space-y-1.5">
              {pastDaysNutrition.slice(0, 5).map((p) => (
                <div
                  key={p.date}
                  className="bg-zinc-950/50 border border-zinc-800/50 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs font-mono-num"
                >
                  <span className="text-zinc-400">{formatArabicDate(p.date)}</span>
                  <span className="text-zinc-200">
                    <strong>{p.calories}</strong> سعرة · <strong>{p.protein}</strong>غ بروتين
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
