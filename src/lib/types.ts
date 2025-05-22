
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

// More detailed cycle phase types
export type DetailedCyclePhase = 
  'Early Follicular' | 
  'Pre-Ovulatory' | 
  'Mid-Luteal' | 
  'Late Luteal (PME)';

export type MoodRating = 1 | 2 | 3 | 4 | 5;

export type MoodEntry = {
  id: string;
  timestamp: string;
  mood: MoodRating;
  notes?: string;
  symptoms?: string[];
  moodLabels?: string[]; // Added to store multiple mood labels
};

export type Reminder = {
  id: string;
  title: string;
  description?: string;
  time?: string; // Time in HH:MM format
  isCompleted: boolean;
};

export type CycleDay = {
  date: string;
  phase: CyclePhase;
  detailedPhase?: DetailedCyclePhase;
  dayOfCycle: number;
  isMenstruation: boolean;
  hormoneState?: string;
  cognition?: string;
  optimal?: string;
  avoid?: string;
  reminders?: Reminder[];
  symptoms?: string[]; // For tracking symptoms on specific days
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
  savedSymptoms?: string[]; // Added for permanent user symptoms
  chronicConditions?: string[]; // Added for tracking chronic conditions
};
