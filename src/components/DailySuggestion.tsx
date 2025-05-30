
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

const getFoodSuggestions = (phase: CyclePhase): string => {
  switch (phase) {
    case 'menstrual':
      return '🍫 Dark chocolate, iron-rich foods (spinach, lentils), warming foods (ginger tea, soup), magnesium-rich foods (almonds, avocado)';
    case 'follicular':
      return '🥗 Fresh fruits and vegetables, lean proteins (chicken, fish), whole grains, fermented foods (yogurt, kimchi)';
    case 'ovulation':
      return '🌶️ Anti-inflammatory foods (berries, leafy greens), fiber-rich foods, healthy fats (salmon, walnuts), cooling foods (cucumber, watermelon)';
    case 'luteal':
      return '🥜 Complex carbs (quinoa, sweet potatoes), B-vitamin rich foods (eggs, sunflower seeds), calcium-rich foods (dairy, tahini)';
    default:
      return '🍎 Balanced nutrition with plenty of fruits and vegetables';
  }
};

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
  const foodSuggestion = getFoodSuggestions(phase);
  
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

        <div>
          <h4 className="font-medium text-sm">🍽️ Recommended Foods</h4>
          <p className="text-muted-foreground text-sm">{foodSuggestion}</p>
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
