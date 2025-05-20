
import { CycleData, CycleDay, CyclePhase } from './types';
import { addDays, format, isBefore, isEqual, parseISO, subDays } from 'date-fns';

// Default cycle data for new users
export const getDefaultCycleData = (): CycleData => {
  const today = new Date();
  return {
    averageCycleLength: 28,
    lastPeriodStart: format(subDays(today, 14), 'yyyy-MM-dd'),
    periodLength: 5,
    lutealPhaseLength: 14,
    entries: {},
  };
};

// Calculate the current cycle phase
export const getCyclePhase = (cycleData: CycleData, date: Date): CyclePhase => {
  const dateStr = format(date, 'yyyy-MM-dd');
  if (cycleData.entries[dateStr]) {
    return cycleData.entries[dateStr].phase;
  }

  // If we don't have precalculated data, calculate on the fly
  const lastPeriodStart = parseISO(cycleData.lastPeriodStart);
  const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
  
  // Adjust for cycle repeating
  const dayInCycle = ((daysSinceLastPeriod % cycleData.averageCycleLength) + cycleData.averageCycleLength) % cycleData.averageCycleLength;

  if (dayInCycle < cycleData.periodLength) {
    return 'menstrual';
  } else if (dayInCycle < cycleData.averageCycleLength - cycleData.lutealPhaseLength) {
    return 'follicular';
  } else if (dayInCycle < cycleData.averageCycleLength - cycleData.lutealPhaseLength + 4) {
    return 'ovulation';
  } else {
    return 'luteal';
  }
};

// Get information about the current day in the cycle
export const getDayInfo = (cycleData: CycleData, date: Date): CycleDay => {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  if (cycleData.entries[dateStr]) {
    return cycleData.entries[dateStr];
  }
  
  const lastPeriodStart = parseISO(cycleData.lastPeriodStart);
  const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate which cycle this is and the day within that cycle
  const cycleOffset = Math.floor(daysSinceLastPeriod / cycleData.averageCycleLength);
  const thisCycleStart = addDays(lastPeriodStart, cycleOffset * cycleData.averageCycleLength);
  const dayOfCycle = Math.floor((date.getTime() - thisCycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const phase = getCyclePhase(cycleData, date);
  const isMenstruation = phase === 'menstrual';
  
  return {
    date: dateStr,
    phase,
    isMenstruation,
    dayOfCycle
  };
};

// Get a suggestion based on the current cycle phase
export const getSuggestionForPhase = (phase: CyclePhase): string => {
  const suggestions = {
    menstrual: [
      "Take it easy today. Your body is working hard.",
      "Hydrate more than usual today.",
      "Warmth may help with cramps - try a heating pad.",
      "It's okay to rest more during this phase.",
      "Consider iron-rich foods today.",
    ],
    follicular: [
      "Your energy is building. A good day for starting new projects.",
      "You might feel more creative today - embrace it!",
      "Your body responds well to exercise during this phase.",
      "Social activities might feel more appealing now.",
      "This is a good time for planning and decision-making.",
    ],
    ovulation: [
      "You may feel more confident and energetic today.",
      "This is a peak time for verbal and physical communication.",
      "A good day for social events or important conversations.",
      "You may notice heightened senses during this phase.",
      "Your problem-solving abilities are enhanced during this phase.",
    ],
    luteal: [
      "You may be more sensitive during this phase - practice self-compassion.",
      "Your attention to detail increases during this phase.",
      "This is a good time for organization and routine tasks.",
      "Listen to your body if you need more calories or comfort.",
      "Mindfulness activities can be helpful during this phase.",
    ]
  };
  
  const phaseOptions = suggestions[phase];
  return phaseOptions[Math.floor(Math.random() * phaseOptions.length)];
};

// Function to get a moon phase emoji representation (simplified)
export const getMoonPhaseEmoji = (cycleData: CycleData, date: Date): string => {
  const { dayOfCycle } = getDayInfo(cycleData, date);
  const totalPhases = 8; // Simplified moon representation with 8 phases
  const phaseIndex = Math.floor((dayOfCycle - 1) / cycleData.averageCycleLength * totalPhases) % totalPhases;
  
  const moonPhases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
  return moonPhases[phaseIndex];
};

// Get color for a specific phase
export const getPhaseColorClass = (phase: CyclePhase): string => {
  switch (phase) {
    case 'menstrual':
      return 'phase-menstrual';
    case 'follicular':
      return 'phase-follicular';
    case 'ovulation':
      return 'phase-ovulation';
    case 'luteal':
      return 'phase-luteal';
    default:
      return 'bg-gray-100';
  }
};
