
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CyclePhase } from '@/lib/types';
import { getSuggestionForPhase } from '@/lib/cycleUtils';

interface DailySuggestionProps {
  phase: CyclePhase;
  dayOfCycle: number;
  detailedPhase?: string;
  hormoneState?: string;
  cognition?: string;
  optimal?: string;
  avoid?: string;
}

const DailySuggestion: React.FC<DailySuggestionProps> = ({ 
  phase, 
  dayOfCycle, 
  detailedPhase,
  hormoneState,
  cognition,
  optimal,
  avoid
}) => {
  const suggestion = optimal || getSuggestionForPhase(phase, dayOfCycle);
  
  return (
    <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
      <CardContent className="pt-6 space-y-3">
        {detailedPhase && (
          <div>
            <h3 className="text-lg font-semibold">Phase: {detailedPhase}</h3>
            {hormoneState && <p className="text-sm font-medium">{hormoneState}</p>}
          </div>
        )}
        
        {cognition && (
          <div>
            <h4 className="font-medium text-sm">Today's Brain Activity</h4>
            <p className="text-muted-foreground">{cognition}</p>
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-sm">Today's Suggestion</h4>
          <p className="text-muted-foreground">{suggestion}</p>
        </div>
        
        {avoid && (
          <div>
            <h4 className="font-medium text-sm text-red-600">Consider Avoiding</h4>
            <p className="text-muted-foreground">{avoid}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailySuggestion;
