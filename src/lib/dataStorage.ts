
import { UserData, MoodEntry, Reminder, CycleDay } from './types';
import { getDefaultCycleData } from './cycleUtils';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isEqual, addDays, isBefore } from 'date-fns';

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
  moodLabels?: string[],
  timestamp?: string // Optional parameter for adding entries for past dates
): MoodEntry => {
  const userData = loadUserData();
  
  // Ensure mood is between 1-5 for backward compatibility
  const normalizedMood = Math.min(5, Math.max(1, mood)) as 1 | 2 | 3 | 4 | 5;
  
  const newEntry: MoodEntry = {
    id: uuidv4(),
    timestamp: timestamp || new Date().toISOString(), // Use provided timestamp or current time
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

// New functions for reminders
export const addReminder = (date: Date, reminder: Omit<Reminder, 'id'>): Reminder => {
  const userData = loadUserData();
  const dateStr = format(date, 'yyyy-MM-dd');
  
  // Create or get the entry for this date
  if (!userData.cycleData.entries[dateStr]) {
    const dayInfo = getDayInfo(userData.cycleData, date);
    userData.cycleData.entries[dateStr] = dayInfo;
  }
  
  // Initialize reminders array if it doesn't exist
  if (!userData.cycleData.entries[dateStr].reminders) {
    userData.cycleData.entries[dateStr].reminders = [];
  }
  
  const newReminder: Reminder = {
    id: uuidv4(),
    ...reminder,
    isCompleted: false
  };
  
  userData.cycleData.entries[dateStr].reminders!.push(newReminder);
  saveUserData(userData);
  
  return newReminder;
};

export const updateReminder = (date: Date, reminderId: string, updates: Partial<Reminder>): boolean => {
  const userData = loadUserData();
  const dateStr = format(date, 'yyyy-MM-dd');
  
  if (!userData.cycleData.entries[dateStr]?.reminders) {
    return false;
  }
  
  const reminderIndex = userData.cycleData.entries[dateStr].reminders!
    .findIndex(r => r.id === reminderId);
    
  if (reminderIndex === -1) {
    return false;
  }
  
  userData.cycleData.entries[dateStr].reminders![reminderIndex] = {
    ...userData.cycleData.entries[dateStr].reminders![reminderIndex],
    ...updates
  };
  
  saveUserData(userData);
  return true;
};

export const removeReminder = (date: Date, reminderId: string): boolean => {
  const userData = loadUserData();
  const dateStr = format(date, 'yyyy-MM-dd');
  
  if (!userData.cycleData.entries[dateStr]?.reminders) {
    return false;
  }
  
  userData.cycleData.entries[dateStr].reminders = 
    userData.cycleData.entries[dateStr].reminders!.filter(r => r.id !== reminderId);
    
  saveUserData(userData);
  return true;
};

export const getRemindersForDate = (date: Date): Reminder[] => {
  const userData = loadUserData();
  const dateStr = format(date, 'yyyy-MM-dd');
  
  return userData.cycleData.entries[dateStr]?.reminders || [];
};

// Track chronic condition symptoms
export const addChronicCondition = (condition: string): string[] => {
  const userData = loadUserData();
  
  if (!userData.chronicConditions) {
    userData.chronicConditions = [];
  }
  
  if (!userData.chronicConditions.includes(condition)) {
    userData.chronicConditions.push(condition);
    saveUserData(userData);
  }
  
  return userData.chronicConditions;
};

export const removeChronicCondition = (condition: string): string[] => {
  const userData = loadUserData();
  
  if (userData.chronicConditions) {
    userData.chronicConditions = userData.chronicConditions.filter(c => c !== condition);
    saveUserData(userData);
  }
  
  return userData.chronicConditions || [];
};

export const getChronicConditions = (): string[] => {
  const userData = loadUserData();
  return userData.chronicConditions || [];
};

export const trackSymptomForDate = (date: Date, symptom: string): void => {
  const userData = loadUserData();
  const dateStr = format(date, 'yyyy-MM-dd');
  
  // Create or get the entry for this date
  if (!userData.cycleData.entries[dateStr]) {
    const dayInfo = getDayInfo(userData.cycleData, date);
    userData.cycleData.entries[dateStr] = dayInfo;
  }
  
  // Initialize symptoms array if it doesn't exist
  if (!userData.cycleData.entries[dateStr].symptoms) {
    userData.cycleData.entries[dateStr].symptoms = [];
  }
  
  // Add symptom if it doesn't already exist
  if (!userData.cycleData.entries[dateStr].symptoms!.includes(symptom)) {
    userData.cycleData.entries[dateStr].symptoms!.push(symptom);
    saveUserData(userData);
  }
};

export const removeSymptomFromDate = (date: Date, symptom: string): void => {
  const userData = loadUserData();
  const dateStr = format(date, 'yyyy-MM-dd');
  
  if (userData.cycleData.entries[dateStr]?.symptoms) {
    userData.cycleData.entries[dateStr].symptoms = 
      userData.cycleData.entries[dateStr].symptoms!.filter(s => s !== symptom);
    saveUserData(userData);
  }
};

export const getSymptomsForDate = (date: Date): string[] => {
  const userData = loadUserData();
  const dateStr = format(date, 'yyyy-MM-dd');
  
  return userData.cycleData.entries[dateStr]?.symptoms || [];
};

// Import needed for getDayInfo (circular dependency handled by hoisting)
import { getDayInfo } from './cycleUtils';
