
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CyclePhase } from '@/lib/types';
import { getSuggestionForPhase } from '@/lib/cycleUtils';

interface DailySuggestionProps {
  phase: CyclePhase;
}

const DailySuggestion: React.FC<DailySuggestionProps> = ({ phase }) => {
  const suggestion = getSuggestionForPhase(phase);
  
  return (
    <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">Today's Suggestion</h3>
        <p className="text-muted-foreground">{suggestion}</p>
      </CardContent>
    </Card>
  );
};

export default DailySuggestion;
