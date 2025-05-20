
import { CycleData, CycleDay, CyclePhase, DetailedCyclePhase } from './types';
import { addDays, format, isBefore, isEqual, parseISO, subDays } from 'date-fns';

// Detailed cycle data
const detailedCycleData: Record<number, {
  detailedPhase: DetailedCyclePhase;
  hormoneState: string;
  cognition: string;
  optimal: string;
  avoid: string;
}> = {
  1: { detailedPhase: 'Early Follicular', hormoneState: '↓ E₂, ↓ P₄', cognition: 'Very low dynamical complexity; mental fog', optimal: 'Gentle recovery: light stretching, deep breathing, journaling', avoid: 'High-focus work, heavy socializing' },
  2: { detailedPhase: 'Early Follicular', hormoneState: '↓ E₂, ↓ P₄', cognition: 'Low energy; mood dipped', optimal: 'Self-care, reflection, planning', avoid: 'Deadline-driven tasks' },
  3: { detailedPhase: 'Early Follicular', hormoneState: '↓ E₂, ↓ P₄', cognition: 'Gradual arousal of networks', optimal: 'Creative brainstorming (low pressure)', avoid: 'Intense workouts' },
  4: { detailedPhase: 'Early Follicular', hormoneState: '↓ E₂, ↓ P₄', cognition: 'Attention still sluggish', optimal: 'Skill-learning at easy pace', avoid: 'Complex problem-solving' },
  5: { detailedPhase: 'Early Follicular', hormoneState: '↓ E₂, ↓ P₄', cognition: 'Executive control still low', optimal: 'Mindful walking, art therapy', avoid: 'High-stakes meetings' },
  6: { detailedPhase: 'Early Follicular', hormoneState: '↓ E₂, ↓ P₄', cognition: 'Slow ramp of connectivity', optimal: 'Light cardio, social check-ins', avoid: 'Marathon training' },
  7: { detailedPhase: 'Early Follicular', hormoneState: '↓ E₂, ↓ P₄', cognition: 'Approaching mid-fog', optimal: 'Gentle yoga, outline week ahead', avoid: 'New project launches' },
  8: { detailedPhase: 'Pre-Ovulatory', hormoneState: '↑ E₂, ↓ P₄', cognition: 'Rapid rise in whole-brain complexity', optimal: 'Brainstorming, negotiation, creative work', avoid: 'Overly routine/admin tasks' },
  9: { detailedPhase: 'Pre-Ovulatory', hormoneState: '↑ E₂, ↓ P₄', cognition: 'Peak cognitive flexibility', optimal: 'Complex problem-solving, public speaking', avoid: 'Monotonous chores' },
  10: { detailedPhase: 'Pre-Ovulatory', hormoneState: '↑ E₂, ↓ P₄', cognition: 'High verbal fluency, memory recall', optimal: 'Presentations, writing reports', avoid: 'Passive learning' },
  11: { detailedPhase: 'Pre-Ovulatory', hormoneState: '↑ E₂, ↓ P₄', cognition: 'Strong executive control', optimal: 'Strategic planning, leadership meetings', avoid: 'Social conflict resolution (if avoidable)' },
  12: { detailedPhase: 'Pre-Ovulatory', hormoneState: '↑ E₂, ↓ P₄', cognition: 'High energy, motivation', optimal: 'Intense workouts, networking', avoid: 'Overcommitment' },
  13: { detailedPhase: 'Pre-Ovulatory', hormoneState: '↑ E₂, ↓ P₄', cognition: 'Peak alertness', optimal: 'Risk-managed challenges, learning new skills', avoid: 'Emotional heavy lifting' },
  14: { detailedPhase: 'Pre-Ovulatory', hormoneState: '↑ E₂, ↓ P₄', cognition: 'Top dynamical complexity', optimal: 'Creative sprints, innovation labs', avoid: 'Repetitive tasks' },
  15: { detailedPhase: 'Mid-Luteal', hormoneState: '↑ P₄, ↔ E₂', cognition: 'Complex but region-specific shifts', optimal: 'Collaborative team work', avoid: 'High-risk decisions' },
  16: { detailedPhase: 'Mid-Luteal', hormoneState: '↑ P₄, ↔ E₂', cognition: 'Emotional salience ↑', optimal: 'Empathy-driven tasks, mentoring', avoid: 'Confrontations' },
  17: { detailedPhase: 'Mid-Luteal', hormoneState: '↑ P₄, ↔ E₂', cognition: 'Slight drop in focus', optimal: 'Moderate exercise, creative hobbies', avoid: 'Intense concentration work' },
  18: { detailedPhase: 'Mid-Luteal', hormoneState: '↑ P₄, ↔ E₂', cognition: 'Some somatomotor↓ (fatigue)', optimal: 'Restorative yoga, low-impact sports', avoid: 'HIIT workouts' },
  19: { detailedPhase: 'Mid-Luteal', hormoneState: '↑ P₄, ↔ E₂', cognition: 'Memory for emotional events ↑', optimal: 'Storytelling, relationship-building', avoid: 'Technical deep-dives' },
  20: { detailedPhase: 'Mid-Luteal', hormoneState: '↑ P₄, ↔ E₂', cognition: 'Mood lability risk begins', optimal: 'Self-reflection, creative writing', avoid: 'Critical negotiations' },
  21: { detailedPhase: 'Mid-Luteal', hormoneState: '↑ P₄, ↔ E₂', cognition: 'Anxiety spike possible', optimal: 'Calming practices (meditation, nature walks)', avoid: 'Overstimulating environments' },
  22: { detailedPhase: 'Late Luteal (PME)', hormoneState: '↑ P₄, ↓ E₂', cognition: 'Dynamical complexity ↓', optimal: 'Gentle self-care, light social support', avoid: 'Large presentations, intense workouts' },
  23: { detailedPhase: 'Late Luteal (PME)', hormoneState: '↑ P₄, ↓ E₂', cognition: 'Emotional reactivity ↑', optimal: 'Journaling feelings, soothing music', avoid: 'High-pressure tasks' },
  24: { detailedPhase: 'Late Luteal (PME)', hormoneState: '↑ P₄, ↓ E₂', cognition: 'Cognitive fog returns', optimal: 'Rest, low-stimulus activities', avoid: 'Strategic planning' },
  25: { detailedPhase: 'Late Luteal (PME)', hormoneState: '↑ P₄, ↓ E₂', cognition: 'Irritability peak', optimal: 'Social support, light exercise', avoid: 'Complex problem solving' },
  26: { detailedPhase: 'Late Luteal (PME)', hormoneState: '↑ P₄, ↓ E₂', cognition: 'Focus still low', optimal: 'Gentle stretching, relaxation', avoid: 'Emotional heavy-lifting' },
  27: { detailedPhase: 'Late Luteal (PME)', hormoneState: '↑ P₄, ↓ E₂', cognition: 'Nearing menses; mood dipping', optimal: 'Preliminary cycle planning', avoid: 'New commitments' },
  28: { detailedPhase: 'Late Luteal (PME)', hormoneState: '↑ P₄, ↓ E₂', cognition: 'Lowest pre-menses dynamical complexity', optimal: 'Restorative self-care, light socializing', avoid: 'Big launches or deadlines' }
};

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

// Ensure we have a valid Date object
const ensureDate = (date: any): Date => {
  if (date instanceof Date) {
    return date;
  }
  // Try to parse string date
  if (typeof date === 'string') {
    try {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    } catch (e) {
      console.error('Error parsing date string:', e);
    }
  }
  // Default to current date if invalid
  console.warn('Invalid date provided, using current date as fallback');
  return new Date();
};

// Map detailed phase to simple phase
const mapDetailedPhaseToSimple = (detailedPhase: DetailedCyclePhase): CyclePhase => {
  switch (detailedPhase) {
    case 'Early Follicular':
      return 'follicular';
    case 'Pre-Ovulatory':
      return 'ovulation';
    case 'Mid-Luteal':
    case 'Late Luteal (PME)':
      return 'luteal';
    default:
      return 'follicular';
  }
};

// Calculate the current cycle phase
export const getCyclePhase = (cycleData: CycleData, date: Date): CyclePhase => {
  // Ensure date is a valid Date object
  const safeDate = ensureDate(date);
  const dateStr = format(safeDate, 'yyyy-MM-dd');
  
  if (cycleData.entries[dateStr]) {
    return cycleData.entries[dateStr].phase;
  }

  // If we don't have precalculated data, calculate on the fly
  const lastPeriodStart = parseISO(cycleData.lastPeriodStart);
  const daysSinceLastPeriod = Math.floor((safeDate.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
  
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
  // Ensure date is a valid Date object
  const safeDate = ensureDate(date);
  const dateStr = format(safeDate, 'yyyy-MM-dd');
  
  if (cycleData.entries[dateStr]) {
    return cycleData.entries[dateStr];
  }
  
  const lastPeriodStart = parseISO(cycleData.lastPeriodStart);
  const daysSinceLastPeriod = Math.floor((safeDate.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate which cycle this is and the day within that cycle
  const cycleOffset = Math.floor(daysSinceLastPeriod / cycleData.averageCycleLength);
  const thisCycleStart = addDays(lastPeriodStart, cycleOffset * cycleData.averageCycleLength);
  const dayOfCycle = Math.floor((safeDate.getTime() - thisCycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Get phase and detailed info
  const phase = getCyclePhase(cycleData, safeDate);
  const isMenstruation = phase === 'menstrual';
  
  // Add detailed info if within standard cycle length
  let detailedInfo = {};
  if (dayOfCycle > 0 && dayOfCycle <= 28) {
    detailedInfo = detailedCycleData[dayOfCycle] || {};
  }
  
  return {
    date: dateStr,
    phase,
    isMenstruation,
    dayOfCycle,
    ...detailedInfo
  };
};

// Get a suggestion based on the current cycle phase
export const getSuggestionForPhase = (phase: CyclePhase, dayOfCycle: number): string => {
  // First try to get a detailed suggestion
  if (dayOfCycle > 0 && dayOfCycle <= 28) {
    const detailedData = detailedCycleData[dayOfCycle];
    if (detailedData) {
      return detailedData.optimal;
    }
  }
  
  // Fall back to general suggestions
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
  // Ensure date is a valid Date object
  const safeDate = ensureDate(date);
  const { dayOfCycle } = getDayInfo(cycleData, safeDate);
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
