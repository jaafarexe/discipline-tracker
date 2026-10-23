/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, TabId } from './components/Header';
import { MainDashboard } from './components/MainDashboard';
import { GymSection } from './components/GymSection';
import { NutritionSection } from './components/NutritionSection';
import { SleepSection } from './components/SleepSection';
import { SocialSection } from './components/SocialSection';
import { WellbeingSection } from './components/WellbeingSection';
import {
  SPARTAN_RULES,
  INITIAL_CURRICULUM,
  getChallengeProgress,
  getTodayDateString,
} from './utils/challenge';
import {
  SubjectCurriculum,
  DailyScoreRecord,
  WorkoutDay,
  WeightRecord,
  LoggedFoodItem,
  ContactPerson,
  DailyMoodRecord,
} from './types';
import { Home, Dumbbell, Utensils, Moon, Users, Sparkles, ArrowUp } from 'lucide-react';

const STORAGE_KEYS = {
  CURRICULUM: 'spartan_curriculum_v2',
  HISTORY: 'spartan_daily_history_v2',
  DAILY_RULES: 'spartan_rules_by_date_v2',
  SLEEP_TARGET: 'spartan_sleep_target_v2',
  WORKOUT_DAYS: 'spartan_workout_days_v1',
  WEIGHT_HISTORY: 'spartan_weight_history_v1',
  NUTRITION_LOGS: 'spartan_nutrition_logs_v1',
  CONTACTS: 'spartan_contacts_v1',
  MOOD_HISTORY: 'spartan_mood_history_v1',
  ACTIVE_TAB: 'spartan_active_tab_v1',
};

const DEFAULT_WORKOUT_SPLIT: WorkoutDay[] = [
  {
    id: 'push',
    nameAr: 'Push',
    dayNameAr: 'الاثنين',
    dayOfWeek: 1,
    focus: 'تركيز: عضلات الصدر، الأكتاف الأمامية والجانبية، والترايسبس',
    exercises: [
      { id: 'p1', name: 'بنش بريس بار مستوي', setsReps: '4×8-10' },
      { id: 'p2', name: 'تجميع دمبلز مائل للأعلى', setsReps: '3×10-12' },
      { id: 'p3', name: 'ضغط أكتاف دمبلز جالس', setsReps: '3×8-10' },
      { id: 'p4', name: 'رفرفة جانبية دمبلز', setsReps: '4×12-15' },
      { id: 'p5', name: 'دفع ترايسبس حبل كيبل', setsReps: '3×12-15' },
    ],
  },
  {
    id: 'pull',
    nameAr: 'Pull',
    dayNameAr: 'الأربعاء',
    dayOfWeek: 3,
    focus: 'تركيز: عضلات الظهر العريض، الأكتاف الخلفية، والبايسبس',
    exercises: [
      { id: 'pu1', name: 'سحب ظهر عريض Lat Pulldown', setsReps: '4×10-12' },
      { id: 'pu2', name: 'تجديف بار مقلوب Barbell Row', setsReps: '4×8-10' },
      { id: 'pu3', name: 'سحب كيبل جالس Seated Row', setsReps: '3×10-12' },
      { id: 'pu4', name: 'فيس بول Face Pulls بالحبل', setsReps: '3×15' },
      { id: 'pu5', name: 'مرجحة بايسبس بار EZ', setsReps: '3×10-12' },
    ],
  },
  {
    id: 'legs',
    nameAr: 'Legs',
    dayNameAr: 'السبت',
    dayOfWeek: 6,
    focus: 'تركيز: عضلات الأرجل كاملة (رباعية، خلفية، سمانات) + توزين أسبوعي',
    exercises: [
      { id: 'l1', name: 'سكوات خلفي بالبار Squat', setsReps: '4×8-10' },
      { id: 'l2', name: 'جهاز دفع الأرجل Leg Press', setsReps: '3×10-12' },
      { id: 'l3', name: 'مرجحة أرجل خلفية Hamstring Curls', setsReps: '4×12' },
      { id: 'l4', name: 'مد أرجل أمامية Leg Extension', setsReps: '3×15' },
      { id: 'l5', name: 'سمانات واقف Standing Calf Raises', setsReps: '4×15' },
    ],
  },
];

const INITIAL_WEIGHT_HISTORY: WeightRecord[] = [
  { id: 'w_init', date: '2026-01-01', weight: 70, note: 'بداية التحدي (الهدف المنشود: 85 كغ)' },
];

export default function App() {
  const todayDateStr = getTodayDateString();
  const challenge = getChallengeProgress();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) as TabId;
      if (saved && ['home', 'gym', 'nutrition', 'sleep', 'social', 'wellbeing'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'home';
  });

  // 1. Curriculum State
  const [curriculum, setCurriculum] = useState<SubjectCurriculum[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRICULUM);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CURRICULUM;
  });

  // 2. Daily Rules checked for dates: { [dateStr]: string[] }
  const [rulesByDate, setRulesByDate] = useState<{ [date: string]: string[] }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_RULES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // 3. History of saved daily scores
  const [history, setHistory] = useState<DailyScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 4. Target wake-up time for sleep calculator
  const [targetWakeUpTime, setTargetWakeUpTime] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SLEEP_TARGET) || '05:00';
    } catch {
      return '05:00';
    }
  });

  // 5. Workout Days (3-day split)
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKOUT_DAYS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_WORKOUT_SPLIT;
  });

  // 6. Weight Records History
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHT_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WEIGHT_HISTORY;
  });

  // 7. Nutrition Logs by Date: { [date: string]: LoggedFoodItem[] }
  const [nutritionLogsByDate, setNutritionLogsByDate] = useState<{ [date: string]: LoggedFoodItem[] }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NUTRITION_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // 8. Social Contacts (Seeded empty as requested)
  const [contacts, setContacts] = useState<ContactPerson[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 9. Wellbeing Mood History
  const [moodHistory, setMoodHistory] = useState<DailyMoodRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOOD_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
    } catch {}
  }, [activeTab]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));
    } catch {}
  }, [curriculum]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_RULES, JSON.stringify(rulesByDate));
    } catch {}
  }, [rulesByDate]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKOUT_DAYS, JSON.stringify(workoutDays));
    } catch {}
  }, [workoutDays]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, JSON.stringify(weightHistory));
    } catch {}
  }, [weightHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NUTRITION_LOGS, JSON.stringify(nutritionLogsByDate));
    } catch {}
  }, [nutritionLogsByDate]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch {}
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MOOD_HISTORY, JSON.stringify(moodHistory));
    } catch {}
  }, [moodHistory]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Today's checked rules
  const todayCheckedRuleIds = rulesByDate[todayDateStr] || [];

  const calculatePoints = (ruleIds: string[]): number => {
    return SPARTAN_RULES.reduce((sum, rule) => {
      return ruleIds.includes(rule.id) ? sum + rule.points : sum;
    }, 0);
  };

  const todayScore = calculatePoints(todayCheckedRuleIds);

  const handleToggleRule = (ruleId: string) => {
    setRulesByDate((prev) => {
      const currentList = prev[todayDateStr] || [];
      const updatedList = currentList.includes(ruleId)
        ? currentList.filter((id) => id !== ruleId)
        : [...currentList, ruleId];
      return {
        ...prev,
        [todayDateStr]: updatedList,
      };
    });
  };

  const handleSaveDay = () => {
    const currentList = rulesByDate[todayDateStr] || [];
    let updatedList = [...currentList];

    // Auto-check rule 7 on save
    if (!updatedList.includes('score_report')) {
      updatedList.push('score_report');
    }

    setRulesByDate((prev) => ({
      ...prev,
      [todayDateStr]: updatedList,
    }));

    const finalScore = calculatePoints(updatedList);

    const newRecord: DailyScoreRecord = {
      date: todayDateStr,
      dayNumber: challenge.currentDay,
      score: finalScore,
      maxScore: 10,
      completedRules: updatedList,
      savedAt: new Date().toISOString(),
    };

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.date !== todayDateStr);
      return [newRecord, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
  };

  const handleDeleteHistoryItem = (dateToDelete: string) => {
    setHistory((prev) => prev.filter((item) => item.date !== dateToDelete));
  };

  // Curriculum Handlers
  const handleUpdateCurriculumDone = (subjectId: string, delta: number) => {
    setCurriculum((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const newDone = Math.max(0, Math.min(sub.total, sub.done + delta));
        return { ...sub, done: newDone };
      })
    );
  };

  const handleSetCurriculumDone = (subjectId: string, value: number) => {
    setCurriculum((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const newDone = Math.max(0, Math.min(sub.total, value));
        return { ...sub, done: newDone };
      })
    );
  };

  const handleResetCurriculum = () => {
    setCurriculum(INITIAL_CURRICULUM);
  };

  // Sleep Calculator Target Wake Up Time
  const handleSaveTargetWakeUpTime = (time: string) => {
    setTargetWakeUpTime(time);
    try {
      localStorage.setItem(STORAGE_KEYS.SLEEP_TARGET, time);
    } catch (e) {
      console.error(e);
    }
  };

  // Weight handlers
  const handleAddWeightRecord = (weight: number, dateStr: string) => {
    const newRecord: WeightRecord = {
      id: `w_${Date.now()}`,
      date: dateStr,
      weight,
    };
    setWeightHistory((prev) => [newRecord, ...prev.filter((w) => w.date !== dateStr)]);
  };

  const handleDeleteWeightRecord = (id: string) => {
    setWeightHistory((prev) => prev.filter((w) => w.id !== id));
  };

  // Nutrition handlers
  const todayFoodItems = nutritionLogsByDate[todayDateStr] || [];

  const handleAddFoodItem = (itemData: Omit<LoggedFoodItem, 'id' | 'timestamp'>) => {
    const newItem: LoggedFoodItem = {
      ...itemData,
      id: `food_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
    };
    setNutritionLogsByDate((prev) => ({
      ...prev,
      [todayDateStr]: [...(prev[todayDateStr] || []), newItem],
    }));
  };

  const handleRemoveFoodItem = (id: string) => {
    setNutritionLogsByDate((prev) => ({
      ...prev,
      [todayDateStr]: (prev[todayDateStr] || []).filter((item) => item.id !== id),
    }));
  };

  const handleClearTodayLog = () => {
    setNutritionLogsByDate((prev) => ({
      ...prev,
      [todayDateStr]: [],
    }));
  };

  const pastDaysNutrition = Object.entries(nutritionLogsByDate)
    .filter(([d]) => d !== todayDateStr)
    .map(([date, items]) => ({
      date,
      calories: items.reduce((s, i) => s + i.calories * i.quantity, 0),
      protein: Number(items.reduce((s, i) => s + i.protein * i.quantity, 0).toFixed(1)),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  // Social Contacts handlers
  const handleAddContact = (contactData: Omit<ContactPerson, 'id'>) => {
    const newContact: ContactPerson = {
      ...contactData,
      id: `c_${Date.now()}`,
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const handleUpdateLastContact = (id: string, dateStr: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, lastContactDate: dateStr } : c))
    );
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // Wellbeing handlers
  const handleSaveTodayMood = (record: DailyMoodRecord) => {
    setMoodHistory((prev) => [
      record,
      ...prev.filter((m) => m.date !== record.date),
    ]);
  };

  const curriculumDoneTotal = curriculum.reduce((sum, s) => sum + s.done, 0);
  const todayCaloriesTotal = todayFoodItems.reduce(
    (sum, item) => sum + item.calories * item.quantity,
    0
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-100 flex flex-col justify-between selection:bg-red-950 selection:text-red-200">
      {/* 1. TOP HEADER WITH MOTTO, BRAND, STATUS, AND TAB NAVIGATION */}
      <Header
        currentDay={challenge.currentDay}
        totalDays={challenge.totalDays}
        dailyPoints={todayScore}
        curriculumDone={curriculumDoneTotal}
        curriculumTotal={391}
        todayCalories={todayCaloriesTotal}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* 2. MAIN ACTIVE TAB CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 w-full flex-1 space-y-6 sm:space-y-8 pb-24 sm:pb-12">
        {/* TAB 1: الرئيسية */}
        {activeTab === 'home' && (
          <MainDashboard
            challenge={challenge}
            checkedRuleIds={todayCheckedRuleIds}
            onToggleRule={handleToggleRule}
            onSaveDay={handleSaveDay}
            todayScore={todayScore}
            history={history}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            todayDateStr={todayDateStr}
            curriculum={curriculum}
            onUpdateCurriculumDone={handleUpdateCurriculumDone}
            onSetCurriculumDone={handleSetCurriculumDone}
            onResetCurriculum={handleResetCurriculum}
          />
        )}

        {/* TAB 2: النادي */}
        {activeTab === 'gym' && (
          <GymSection
            workoutDays={workoutDays}
            onUpdateWorkoutDays={setWorkoutDays}
            weightHistory={weightHistory}
            onAddWeightRecord={handleAddWeightRecord}
            onDeleteWeightRecord={handleDeleteWeightRecord}
          />
        )}

        {/* TAB 3: التغذية */}
        {activeTab === 'nutrition' && (
          <NutritionSection
            todayLog={todayFoodItems}
            onAddFoodItem={handleAddFoodItem}
            onRemoveFoodItem={handleRemoveFoodItem}
            onClearTodayLog={handleClearTodayLog}
            pastDaysNutrition={pastDaysNutrition}
          />
        )}

        {/* TAB 4: النوم */}
        {activeTab === 'sleep' && (
          <SleepSection
            savedTargetWakeUpTime={targetWakeUpTime}
            onSaveTargetWakeUpTime={handleSaveTargetWakeUpTime}
          />
        )}

        {/* TAB 5: تواصل */}
        {activeTab === 'social' && (
          <SocialSection
            contacts={contacts}
            onAddContact={handleAddContact}
            onUpdateLastContact={handleUpdateLastContact}
            onDeleteContact={handleDeleteContact}
          />
        )}

        {/* TAB 6: رفاهية */}
        {activeTab === 'wellbeing' && (
          <WellbeingSection
            moodHistory={moodHistory}
            onSaveTodayMood={handleSaveTodayMood}
          />
        )}
      </main>

      {/* 3. MOBILE FIXED BOTTOM NAVIGATION BAR (Thumb Zone Optimization: 6 Tabs) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090c]/95 backdrop-blur-md border-t border-zinc-800/80 px-1 py-1">
        <div className="grid grid-cols-6 items-center h-14">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'home' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-1">الرئيسية</span>
          </button>

          <button
            onClick={() => setActiveTab('gym')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'gym' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-1">النادي</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'nutrition' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-1">التغذية</span>
          </button>

          <button
            onClick={() => setActiveTab('sleep')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'sleep' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-1">النوم</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'social' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-1">تواصل</span>
          </button>

          <button
            onClick={() => setActiveTab('wellbeing')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'wellbeing' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-1">رفاهية</span>
          </button>
        </div>
      </div>

      {/* 4. SCROLL TO TOP FLOATING BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="الرجوع للأعلى"
          className="fixed left-4 bottom-20 sm:bottom-6 z-30 w-11 h-11 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* 5. QUIET SPARTAN FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#060608] py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-motto text-zinc-400 font-semibold tracking-wide text-[11px]">
            DISCIPLINE EQUALS FREEDOM · 90-DAY PROTOCOL
          </p>
          <p className="text-[11px] text-zinc-600">
            جميع البيانات محفوظة محلياً في متصفحك (localStorage) · لا يتم إرسال أي بيانات لخوادم خارجية
          </p>
        </div>
      </footer>
    </div>
  );
}
