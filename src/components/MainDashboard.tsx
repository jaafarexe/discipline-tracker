import React from 'react';
import { DayCounterSection } from './DayCounterSection';
import { DailyPointsSection } from './DailyPointsSection';
import { CurriculumSection } from './CurriculumSection';
import { DayChallengeInfo, SubjectCurriculum, DailyScoreRecord } from '../types';

interface MainDashboardProps {
  challenge: DayChallengeInfo;
  checkedRuleIds: string[];
  onToggleRule: (ruleId: string) => void;
  onSaveDay: () => void;
  todayScore: number;
  history: DailyScoreRecord[];
  onDeleteHistoryItem: (date: string) => void;
  todayDateStr: string;
  curriculum: SubjectCurriculum[];
  onUpdateCurriculumDone: (subjectId: string, delta: number) => void;
  onSetCurriculumDone: (subjectId: string, value: number) => void;
  onResetCurriculum: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  challenge,
  checkedRuleIds,
  onToggleRule,
  onSaveDay,
  todayScore,
  history,
  onDeleteHistoryItem,
  todayDateStr,
  curriculum,
  onUpdateCurriculumDone,
  onSetCurriculumDone,
  onResetCurriculum,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Day Counter */}
      <DayCounterSection challenge={challenge} />

      {/* 2. Daily Points */}
      <DailyPointsSection
        checkedRuleIds={checkedRuleIds}
        onToggleRule={onToggleRule}
        onSaveDay={onSaveDay}
        todayScore={todayScore}
        history={history}
        onDeleteHistoryItem={onDeleteHistoryItem}
        currentDayNumber={challenge.currentDay}
        todayDateStr={todayDateStr}
      />

      {/* 3. Curriculum Progress */}
      <CurriculumSection
        curriculum={curriculum}
        onUpdateDone={onUpdateCurriculumDone}
        onSetDone={onSetCurriculumDone}
        onResetToDefaults={onResetCurriculum}
      />
    </div>
  );
};
