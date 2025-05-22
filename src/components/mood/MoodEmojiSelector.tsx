
import React from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { RollerCoaster } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Exported for reuse in other components
export const moodEmojis = ['😞', '😔', '😐', '🙂', '😊', '😄', '🥰', '😭', '😡', '😴', '😰', '🤔', '😩', '🙄', '🥳', '😬', '🤯', '🥺', '😇', '🤢'];
export const moodLabels = [
  'Very Sad', 'Sad', 'Neutral', 'Good', 'Happy', 'Very Happy', 'Loved', 'Crying', 'Angry', 'Tired', 
  'Anxious', 'Overthinking', 'Exhausted', 'Annoyed', 'Excited', 'Nervous', 'Overwhelmed', 'Vulnerable', 'Peaceful', 'Nauseous'
];

interface MoodEmojiSelectorProps {
  selectedMoods: number[];
  onMoodSelect: (moodIndex: number) => void;
}

const MoodEmojiSelector: React.FC<MoodEmojiSelectorProps> = ({ selectedMoods, onMoodSelect }) => {
  const handleMoodSelection = (moodIndex: number) => {
    // If already selected, remove it
    if (selectedMoods.includes(moodIndex)) {
      onMoodSelect(moodIndex);
      return;
    }
    
    // If 3 moods are already selected, show toast and return
    if (selectedMoods.length >= 3) {
      toast({
        title: "Maximum moods selected",
        description: "You can select up to 3 moods",
        variant: "destructive"
      });
      return;
    }
    
    // Add the new mood
    onMoodSelect(moodIndex);
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-1">
      <TooltipProvider>
        {moodEmojis.map((emoji, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleMoodSelection(index)}
                className={`text-2xl p-2 rounded-full transition-all ${
                  selectedMoods.includes(index) 
                    ? 'bg-cycle-lavender scale-110' 
                    : 'hover:bg-cycle-soft-purple'
                }`}
                aria-label={`Select mood ${moodLabels[index]}`}
              >
                {emoji}
                {moodLabels[index] === 'Overthinking' && (
                  <RollerCoaster className="inline ml-1" size={16} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {moodLabels[index]}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default MoodEmojiSelector;
