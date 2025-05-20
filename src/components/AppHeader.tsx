
import React from 'react';
import { Button } from '@/components/ui/button';
import { getMoonPhaseEmoji } from '@/lib/cycleUtils';
import { CycleData } from '@/lib/types';

interface AppHeaderProps {
  date: Date;
  cycleData: CycleData;
  onOpenSetup: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ date, cycleData, onOpenSetup }) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(date);
  
  const moonEmoji = getMoonPhaseEmoji(cycleData, date);
  
  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Moonflow</h1>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span>{formattedDate}</span>
          <span className="ml-1">{moonEmoji}</span>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onOpenSetup}
        className="border-cycle-lavender/50 hover:bg-cycle-soft-purple/50"
      >
        Cycle Settings
      </Button>
    </header>
  );
};

export default AppHeader;
