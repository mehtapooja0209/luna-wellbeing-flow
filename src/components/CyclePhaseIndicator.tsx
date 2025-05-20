
import React from 'react';
import { CyclePhase } from '@/lib/types';
import { getPhaseColorClass } from '@/lib/cycleUtils';

interface CyclePhaseIndicatorProps {
  phase: CyclePhase;
  dayOfCycle: number;
  className?: string;
}

const phaseLabels: Record<CyclePhase, string> = {
  menstrual: 'Menstrual',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal'
};

const CyclePhaseIndicator: React.FC<CyclePhaseIndicatorProps> = ({ 
  phase, 
  dayOfCycle,
  className = '' 
}) => {
  const colorClass = getPhaseColorClass(phase);
  
  return (
    <div className={`rounded-lg p-3 ${colorClass} ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">Current Phase</p>
          <h3 className="text-xl font-bold">{phaseLabels[phase]}</h3>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Day</p>
          <p className="text-2xl font-bold">{dayOfCycle}</p>
        </div>
      </div>
    </div>
  );
};

export default CyclePhaseIndicator;
