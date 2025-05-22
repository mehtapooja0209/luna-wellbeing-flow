
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Plus, X, Save, Star, StarOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Common symptoms list
export const commonSymptoms = [
  'Headache', 'Cramps', 'Bloating', 'Fatigue', 
  'Backache', 'Breast Tenderness', 'Nausea', 'Insomnia',
  'Acne', 'Mood Swings', 'Anxiety', 'Cravings',
  'Dizziness', 'Hot Flashes', 'Joint Pain', 'Low Energy',
  'Brain Fog', 'Irritability', 'Depression', 'Restlessness',
  'Sleep Disturbance', 'Constipation', 'Diarrhea', 'Indigestion',
  'Swelling', 'Weight Gain', 'Skin Changes', 'Hair Changes',
  'Libido Changes', 'Concentration Issues'
];

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  savedSymptoms: string[];
  onToggleSymptom: (symptom: string) => void;
  onSaveSymptom: (symptom: string) => void;
  onRemoveSavedSymptom: (symptom: string) => void;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({ 
  selectedSymptoms,
  savedSymptoms,
  onToggleSymptom,
  onSaveSymptom,
  onRemoveSavedSymptom
}) => {
  const [customSymptom, setCustomSymptom] = useState('');
  const [showSavedSymptoms, setShowSavedSymptoms] = useState(true);

  const addCustomSymptom = () => {
    if (customSymptom.trim() === '') return;
    
    if (!selectedSymptoms.includes(customSymptom)) {
      onToggleSymptom(customSymptom);
    }
    setCustomSymptom('');
  };

  const handleSaveCustomSymptom = () => {
    if (customSymptom.trim() !== '') {
      onSaveSymptom(customSymptom);
      addCustomSymptom();
    } else {
      toast({
        title: "Invalid symptom",
        description: "Please enter a symptom name",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">Symptoms (optional)</p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSavedSymptoms(!showSavedSymptoms)}
            className="text-xs h-7 px-2"
          >
            {showSavedSymptoms ? 'Show All' : 'Show Saved'}
          </Button>
        </div>
      </div>
      
      {/* Symptom selection area */}
      <div className="flex flex-wrap gap-2 mb-3">
        {showSavedSymptoms ? (
          savedSymptoms.length > 0 ? (
            savedSymptoms.map((symptom) => (
              <div key={symptom} className="flex items-center">
                <button
                  onClick={() => onToggleSymptom(symptom)}
                  className={`px-3 py-1 text-sm rounded-l-full transition-colors ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-cycle-purple text-white'
                      : 'border-cycle-purple/40 border hover:bg-cycle-soft-purple'
                  }`}
                >
                  {symptom}
                </button>
                <button
                  onClick={() => onRemoveSavedSymptom(symptom)}
                  className="bg-cycle-soft-purple hover:bg-cycle-lavender/50 rounded-r-full h-7 w-7 flex items-center justify-center"
                  aria-label={`Remove ${symptom} from saved`}
                >
                  <StarOff size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">No saved symptoms yet. Star your common symptoms to save them.</p>
          )
        ) : (
          commonSymptoms.map((symptom) => (
            <div key={symptom} className="flex items-center">
              <button
                onClick={() => onToggleSymptom(symptom)}
                className={`px-3 py-1 text-sm rounded-l-full transition-colors ${
                  selectedSymptoms.includes(symptom)
                    ? 'bg-cycle-purple text-white'
                    : 'border-cycle-purple/40 border hover:bg-cycle-soft-purple'
                }`}
              >
                {symptom}
              </button>
              <button
                onClick={() => onSaveSymptom(symptom)}
                className={`${
                  savedSymptoms.includes(symptom) 
                    ? 'bg-cycle-lavender text-white' 
                    : 'bg-cycle-soft-purple hover:bg-cycle-lavender/50'
                } rounded-r-full h-7 w-7 flex items-center justify-center`}
                aria-label={`${savedSymptoms.includes(symptom) ? 'Saved' : 'Save'} ${symptom}`}
              >
                <Star size={14} />
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Custom symptom input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add custom symptom..."
          value={customSymptom}
          onChange={(e) => setCustomSymptom(e.target.value)}
          className="border-cycle-lavender/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomSymptom();
            }
          }}
        />
        <Button 
          onClick={addCustomSymptom}
          variant="outline"
          className="border-cycle-lavender/50 hover:bg-cycle-soft-purple"
        >
          Add
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-cycle-lavender/50 hover:bg-cycle-soft-purple px-2"
            >
              <Plus size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleSaveCustomSymptom}>
              <Save className="mr-2 h-4 w-4" /> Save symptom
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Selected symptoms display */}
      {selectedSymptoms.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium">Selected symptoms:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedSymptoms.map((symptom) => (
              <div key={symptom} className="bg-cycle-purple text-white px-3 py-1 text-sm rounded-full flex items-center gap-1">
                {symptom}
                <button 
                  onClick={() => onToggleSymptom(symptom)}
                  className="hover:bg-cycle-lavender/30 rounded-full h-4 w-4 flex items-center justify-center"
                  aria-label={`Remove ${symptom}`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomSelector;
