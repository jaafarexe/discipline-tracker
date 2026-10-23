import React from 'react';
import { Shield, Home, Dumbbell, Utensils, Moon, Users, Sparkles } from 'lucide-react';

export type TabId = 'home' | 'gym' | 'nutrition' | 'sleep' | 'social' | 'wellbeing';

interface HeaderProps {
  currentDay: number;
  totalDays: number;
  dailyPoints: number;
  curriculumDone: number;
  curriculumTotal: number;
  todayCalories: number;
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  totalDays,
  dailyPoints,
  curriculumDone,
  curriculumTotal,
  todayCalories,
  activeTab,
  onSelectTab,
}) => {
  const curriculumPercent = Math.round((curriculumDone / curriculumTotal) * 100);

  const navTabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'gym', label: 'النادي', icon: Dumbbell },
    { id: 'nutrition', label: 'التغذية', icon: Utensils },
    { id: 'sleep', label: 'النوم', icon: Moon },
    { id: 'social', label: 'تواصل', icon: Users },
    { id: 'wellbeing', label: 'رفاهية', icon: Sparkles },
  ];

  return (
    <header className="border-b border-zinc-900 bg-[#060608]/95 backdrop-blur-md sticky top-0 z-40">
      {/* 1. STARK SPARTAN MOTTO BANNER AT THE VERY TOP */}
      <div className="bg-zinc-950 border-b border-zinc-900/80 py-2 px-4 text-center">
        <p className="font-motto text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-300 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block"></span>
          "Follow your plan, not your mood"
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block"></span>
        </p>
      </div>

      {/* 2. TOP BAR TITLE & CORE STATUS */}
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand Wordmark & Spartan Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 shadow-inner">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                متتبّع الانضباط
              </h1>
              <p className="text-[11px] text-zinc-500 font-medium">
                مركز الحياة الشخصية · التزام سبارطي صارم
              </p>
            </div>
          </div>

          {/* Quick Metrics (Unboxed Metadata) */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono-num text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 px-3 py-1.5 rounded-lg w-full sm:w-auto justify-around sm:justify-start">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-sans">التحدي:</span>
              <span className="font-bold text-white">{currentDay}/{totalDays}</span>
            </div>
            <span className="text-zinc-700" aria-hidden="true">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-sans">النقاط:</span>
              <span className={`font-bold ${dailyPoints >= 8 ? 'text-red-400' : 'text-zinc-200'}`}>
                {dailyPoints}/10
              </span>
            </div>
            <span className="text-zinc-700" aria-hidden="true">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-sans">المنهاج:</span>
              <span className="font-bold text-white">{curriculumPercent}%</span>
            </div>
            <span className="text-zinc-700" aria-hidden="true">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-sans">الغذاء:</span>
              <span className="font-bold text-white">{todayCalories}</span>
            </div>
          </div>
        </div>

        {/* 3. SIX MAIN TABS NAVIGATION (Top bar on desktop & tablet) */}
        <nav className="flex items-center gap-1 mt-3 pt-2 border-t border-zinc-900 overflow-x-auto no-scrollbar text-xs font-medium">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`min-h-[40px] whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white font-bold shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
