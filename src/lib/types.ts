
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type MoodRating = 1 | 2 | 3 | 4 | 5;

export type MoodEntry = {
  id: string;
  timestamp: string;
  mood: MoodRating;
  notes?: string;
  symptoms?: string[];
};

export type CycleDay = {
  date: string;
  phase: CyclePhase;
  isMenstruation: boolean;
  dayOfCycle: number;
};

export type CycleData = {
  averageCycleLength: number;
  lastPeriodStart: string;
  periodLength: number;
  lutealPhaseLength: number;
  entries: Record<string, CycleDay>;
};

export type UserData = {
  name?: string;
  cycleData: CycleData;
  moodEntries: MoodEntry[];
};
