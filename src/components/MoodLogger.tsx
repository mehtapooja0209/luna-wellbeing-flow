
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { addMoodEntry } from '@/lib/dataStorage';
import { toast } from '@/components/ui/use-toast';

const MoodLogger: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  
  const commonSymptoms = [
    'Headache', 'Cramps', 'Bloating', 'Fatigue', 
    'Backache', 'Breast Tenderness', 'Nausea', 'Insomnia',
    'Acne', 'Mood Swings', 'Anxiety', 'Cravings',
    'Dizziness', 'Hot Flashes', 'Joint Pain', 'Low Energy'
  ];
  
  // Extended emoji options for more expressive mood logging
  const moodEmojis = ['😞', '😔', '😐', '🙂', '😊', '😄', '🥰', '😭', '😡', '😴'];
  const moodLabels = ['Very Sad', 'Sad', 'Neutral', 'Good', 'Happy', 'Very Happy', 'Loved', 'Crying', 'Angry', 'Tired'];
  
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
  
  const addCustomSymptom = () => {
    if (customSymptom.trim() === '') return;
    
    if (!selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom]);
    }
    setCustomSymptom('');
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
      Math.min(5, selectedMood + 1),  // Convert 0-9 index to 1-5 rating (capped at 5 for compatibility)
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
        <div className="flex flex-wrap justify-between items-center gap-1">
          {moodEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleMoodSelection(index)}
              className={`text-2xl p-2 rounded-full transition-all ${
                selectedMood === index 
                  ? 'bg-cycle-lavender scale-110' 
                  : 'hover:bg-cycle-soft-purple'
              }`}
              aria-label={`Select mood ${moodLabels[index]}`}
              title={moodLabels[index]}
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
          <div className="flex flex-wrap gap-2 mb-3">
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
          </div>
          
          {selectedSymptoms.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium">Selected symptoms:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedSymptoms.map((symptom) => (
                  <div key={symptom} className="bg-cycle-purple text-white px-3 py-1 text-sm rounded-full flex items-center gap-1">
                    {symptom}
                    <button 
                      onClick={() => toggleSymptom(symptom)}
                      className="hover:bg-cycle-lavender/30 rounded-full h-4 w-4 flex items-center justify-center"
                      aria-label={`Remove ${symptom}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
