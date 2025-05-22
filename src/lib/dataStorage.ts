
import { UserData, MoodEntry } from './types';
import { getDefaultCycleData } from './cycleUtils';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isEqual } from 'date-fns';

// Storage keys
const USER_DATA_KEY = 'cycle_app_user_data';

// Load user data from localStorage
export const loadUserData = (): UserData => {
  const storedData = localStorage.getItem(USER_DATA_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }
  
  // Return default data for new users
  return {
    cycleData: getDefaultCycleData(),
    moodEntries: [],
    savedSymptoms: [] // Initialize saved symptoms as empty array
  };
};

// Save user data to localStorage
export const saveUserData = (userData: UserData): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

// Add a new mood entry
export const addMoodEntry = (
  mood: number, 
  notes?: string, 
  symptoms?: string[],
  moodLabels?: string[]
): MoodEntry => {
  const userData = loadUserData();
  
  // Ensure mood is between 1-5 for backward compatibility
  const normalizedMood = Math.min(5, Math.max(1, mood)) as 1 | 2 | 3 | 4 | 5;
  
  const newEntry: MoodEntry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    mood: normalizedMood,
    notes,
    symptoms,
    moodLabels
  };
  
  userData.moodEntries.push(newEntry);
  saveUserData(userData);
  
  return newEntry;
};

// Update cycle data
export const updateCycleData = (
  lastPeriodStart: string,
  cycleLength: number,
  periodLength: number
): void => {
  const userData = loadUserData();
  
  userData.cycleData = {
    ...userData.cycleData,
    lastPeriodStart,
    averageCycleLength: cycleLength,
    periodLength
  };
  
  saveUserData(userData);
};

// Get mood entries for a specific date
export const getMoodEntriesForDate = (date: Date): MoodEntry[] => {
  const userData = loadUserData();
  const dateStr = format(date, 'yyyy-MM-dd');
  
  return userData.moodEntries.filter(entry => {
    const entryDate = entry.timestamp.split('T')[0];
    return entryDate === dateStr;
  });
};

// Add new functions for saved symptoms
export const getSavedSymptoms = (): string[] => {
  const userData = loadUserData();
  return userData.savedSymptoms || [];
};

export const addSavedSymptom = (symptom: string): string[] => {
  const userData = loadUserData();
  
  // Initialize if not exists
  if (!userData.savedSymptoms) {
    userData.savedSymptoms = [];
  }
  
  // Check if symptom already exists
  if (!userData.savedSymptoms.includes(symptom)) {
    userData.savedSymptoms.push(symptom);
    saveUserData(userData);
  }
  
  return userData.savedSymptoms;
};

export const removeSavedSymptom = (symptom: string): string[] => {
  const userData = loadUserData();
  
  if (userData.savedSymptoms) {
    userData.savedSymptoms = userData.savedSymptoms.filter(s => s !== symptom);
    saveUserData(userData);
  }
  
  return userData.savedSymptoms || [];
};
