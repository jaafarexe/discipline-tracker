import React, { useState } from 'react';
import { Users, UserPlus, Heart, PhoneCall, Trash2, Check, Clock, Calendar, Edit3 } from 'lucide-react';
import { ContactPerson } from '../types';
import { getTodayDateString, formatArabicDate } from '../utils/challenge';

interface SocialSectionProps {
  contacts: ContactPerson[];
  onAddContact: (contact: Omit<ContactPerson, 'id'>) => void;
  onUpdateLastContact: (id: string, dateStr: string) => void;
  onDeleteContact: (id: string) => void;
}

export const SocialSection: React.FC<SocialSectionProps> = ({
  contacts,
  onAddContact,
  onUpdateLastContact,
  onDeleteContact,
}) => {
  const todayDateStr = getTodayDateString();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [contactDate, setContactDate] = useState<string>(todayDateStr);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const deleteTimeoutRef = React.useRef<any>(null);

  React.useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  const handleDeleteClick = (id: string) => {
    if (confirmingDeleteId === id) {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
      setConfirmingDeleteId(null);
      onDeleteContact(id);
    } else {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
      setConfirmingDeleteId(id);
      deleteTimeoutRef.current = setTimeout(() => {
        setConfirmingDeleteId((curr) => (curr === id ? null : curr));
      }, 3000);
    }
  };

  const calculateDaysSince = (dateStr: string): number => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const contactDateObj = new Date(y, m - 1, d);
      contactDateObj.setHours(0, 0, 0, 0);

      const [ty, tm, td] = todayDateStr.split('-').map(Number);
      const todayObj = new Date(ty, tm - 1, td);
      todayObj.setHours(0, 0, 0, 0);

      const diffTime = todayObj.getTime() - contactDateObj.getTime();
      return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      return 0;
    }
  };

  const formatDaysSinceLabel = (days: number): { text: string; color: string } => {
    if (days === 0) return { text: 'تواصل اليوم', color: 'text-zinc-200' };
    if (days === 1) return { text: 'منذ يوم واحد', color: 'text-zinc-300' };
    if (days === 2) return { text: 'منذ يومين', color: 'text-zinc-400' };
    if (days <= 10) return { text: `منذ ${days} أيام`, color: 'text-amber-400' };
    return { text: `منذ ${days} يوماً (انتبه!)`, color: 'text-red-400 font-bold' };
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddContact({
      name: name.trim(),
      note: note.trim() || 'شخص مقرب',
      lastContactDate: contactDate || todayDateStr,
    });

    setName('');
    setNote('');
    setContactDate(todayDateStr);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. SECTION HEADER */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block">
                دائرتك الخاصة الصامتة
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                سجل التواصل الإنساني
              </h2>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="min-h-[44px] px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4 text-red-500" />
            <span>إضافة شخص للدائرة</span>
          </button>
        </div>

        {/* Spartan Context */}
        <p className="text-xs text-zinc-400 mt-3 pt-3 border-t border-zinc-900">
          «الانضباط لا يعني العزلة القاطعة عن من تحب؛ بل يعني الوفاء لمن يقفون بجانبك والاطمئنان الدوري عليهم دون انقطاع.»
        </p>
      </div>

      {/* 2. ADD PERSON FORM */}
      {showAddForm && (
        <form onSubmit={handleFormSubmit} className="bg-[#0f0f13] border border-red-900/40 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-red-500" />
            إضافة شخص جديد إلى قائمتك الخاصة
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-zinc-300 block mb-1">الاسم:</label>
              <input
                type="text"
                required
                placeholder="مثال: الوالدة / أحمد"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-300 block mb-1">ملاحظة / الصلة:</label>
              <input
                type="text"
                placeholder="مثال: رفيق الدرب / أخي الأكبر"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-300 block mb-1">تاريخ آخر تواصل:</label>
              <input
                type="date"
                value={contactDate}
                onChange={(e) => setContactDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 font-mono-num"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-900">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              حفظ الشخص
            </button>
          </div>
        </form>
      )}

      {/* 3. CONTACTS LIST (Or Seeded Empty with the exact hint) */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>قائمة المقربين</span>
            <span className="text-xs font-mono-num text-zinc-500">({contacts.length})</span>
          </h3>
          <span className="text-xs text-zinc-500 font-mono-num">يتم احتساب الأيام تلقائياً</span>
        </div>

        {contacts.length === 0 ? (
          /* Exact prompt requirement: "Seed it empty with the hint: الأشخاص يلي بيهمّوك — سندك وأهلك والمقرّبين" */
          <div className="py-10 px-4 text-center bg-zinc-950/40 border border-dashed border-zinc-800 rounded-xl space-y-2">
            <div className="w-12 h-12 rounded-full bg-zinc-900 mx-auto flex items-center justify-center text-red-500/70 mb-2">
              <Heart className="w-6 h-6 stroke-[1.8]" />
            </div>
            <p className="text-sm font-semibold text-zinc-300">
              «الأشخاص يلي بيهمّوك — سندك وأهلك والمقرّبين»
            </p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              سجل أشخاصك المهمين هنا لتبقى على صلة دائمة بهم، وتراقب متى كان آخر تواصل بينكم بخصوصية كاملة.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-3 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5 text-red-500" />
              <span>إضافة أول شخص</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((person) => {
              const daysSince = calculateDaysSince(person.lastContactDate);
              const status = formatDaysSinceLabel(daysSince);

              return (
                <div
                  key={person.id}
                  className="bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-white">{person.name}</span>
                        <span className="text-xs text-zinc-400">· {person.note}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono-num mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>آخر تواصل: {formatArabicDate(person.lastContactDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Days since and quick contact button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-900">
                    <div className="text-right font-mono-num">
                      <span className={`text-xs block ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateLastContact(person.id, todayDateStr)}
                        className="min-h-[40px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600/60 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="تحديث تاريخ آخر تواصل إلى اليوم"
                      >
                        <Check className="w-3.5 h-3.5 text-red-500" />
                        <span>تواصلت اليوم</span>
                      </button>

                      {confirmingDeleteId === person.id ? (
                        <button
                          onClick={() => handleDeleteClick(person.id)}
                          className="min-h-[40px] px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-950/60 cursor-pointer animate-pulse"
                          title="تأكيد الحذف النهائي"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>تأكيد الحذف؟</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(person.id)}
                          className="text-zinc-600 hover:text-red-400 p-2 rounded-lg transition-colors cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
