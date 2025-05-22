
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { addMoodEntry, getSavedSymptoms } from '@/lib/dataStorage';
import MoodEmojiSelector from './mood/MoodEmojiSelector';
import SymptomSelector from './mood/SymptomSelector';
import VoiceInput from './VoiceInput';
import { MoodRating } from '@/lib/types';

interface MoodLoggerProps {
  onEntryAdded?: () => void;
  selectedDate?: Date; // Optional, defaults to today if not provided
}

const MoodLogger: React.FC<MoodLoggerProps> = ({ 
  onEntryAdded,
  selectedDate = new Date() // Default to today
}) => {
  const [mood, setMood] = useState<MoodRating | null>(null);
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [showSymptoms, setShowSymptoms] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const isBackdated = selectedDate.toDateString() !== new Date().toDateString();

  const handleVoiceInput = (text: string) => {
    setNotes(text);
  };
  
  const handleSubmit = () => {
    if (mood === null) {
      toast({
        title: "Missing Information",
        description: "Please select a mood before saving.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAdding(true);
    
    try {
      // Use date from selectedDate but keep current time
      const timestamp = isBackdated
        ? `${format(selectedDate, 'yyyy-MM-dd')}T${format(new Date(), 'HH:mm:ss.SSS')}Z`
        : undefined;
      
      addMoodEntry(mood, notes, symptoms.length > 0 ? symptoms : undefined, undefined, timestamp);
      
      toast({
        title: "Entry Saved",
        description: isBackdated 
          ? `Entry added for ${format(selectedDate, 'MMMM d')}` 
          : "Your mood entry has been saved!",
      });
      
      setMood(null);
      setNotes('');
      setSymptoms([]);
      setShowSymptoms(false);
      
      if (onEntryAdded) {
        onEntryAdded();
      }
    } catch (error) {
      console.error("Error saving mood entry:", error);
      toast({
        title: "Error",
        description: "Unable to save your mood entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          {isBackdated 
            ? `Log Mood for ${format(selectedDate, 'MMMM d')}` 
            : "How are you feeling today?"}
          {isBackdated && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Past Date</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <MoodEmojiSelector selectedMood={mood as number | null} onSelect={setMood} />
          
          <Textarea 
            placeholder="Add notes about how you're feeling..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
            rows={3}
          />
          
          <VoiceInput 
            onTranscript={handleVoiceInput} 
            placeholder="Or use voice input to describe how you feel"
            buttonLabel="Speak to describe how you feel"
          />

          {!showSymptoms ? (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setShowSymptoms(true)}
            >
              Add Symptoms
            </Button>
          ) : (
            <SymptomSelector
              selectedSymptoms={symptoms}
              onSelect={(selected) => setSymptoms(selected)}
              availableSymptoms={getSavedSymptoms()}
            />
          )}
          
          <Button
            className="w-full"
            disabled={mood === null || isAdding}
            onClick={handleSubmit}
          >
            {isAdding ? "Saving..." : isBackdated ? "Save Backdated Entry" : "Save Entry"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodLogger;
