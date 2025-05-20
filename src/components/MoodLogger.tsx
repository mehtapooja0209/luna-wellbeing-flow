
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addMoodEntry } from '@/lib/dataStorage';
import { toast } from '@/components/ui/use-toast';

const MoodLogger: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  const commonSymptoms = [
    'Headache', 'Cramps', 'Bloating', 'Fatigue', 
    'Backache', 'Breast Tenderness', 'Nausea'
  ];
  
  const moodEmojis = ['😞', '😔', '😐', '🙂', '😊'];
  
  const handleMoodSelection = (mood: number) => {
    setSelectedMood(mood);
  };
  
  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };
  
  const handleSubmit = () => {
    if (selectedMood === null) {
      toast({
        title: "Mood required",
        description: "Please select a mood before saving",
        variant: "destructive"
      });
      return;
    }
    
    addMoodEntry(
      selectedMood + 1,  // Convert 0-4 index to 1-5 rating
      notes,
      selectedSymptoms.length > 0 ? selectedSymptoms : undefined
    );
    
    // Reset form
    setSelectedMood(null);
    setNotes('');
    setSelectedSymptoms([]);
    
    toast({
      title: "Mood logged",
      description: "Your mood entry has been saved",
    });
  };

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          {moodEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleMoodSelection(index)}
              className={`text-3xl p-2 rounded-full transition-all ${
                selectedMood === index 
                  ? 'bg-cycle-lavender scale-110' 
                  : 'hover:bg-cycle-soft-purple'
              }`}
              aria-label={`Select mood ${index + 1}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        
        <Textarea
          placeholder="Add notes about how you feel today... (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[80px] border-cycle-lavender/50"
        />
        
        <div>
          <p className="mb-2 text-sm font-medium">Symptoms (optional)</p>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedSymptoms.includes(symptom)
                    ? 'bg-cycle-purple text-white'
                    : 'border-cycle-purple/40 hover:bg-cycle-soft-purple'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-cycle-lavender hover:bg-cycle-purple"
        >
          Save Entry
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MoodLogger;
