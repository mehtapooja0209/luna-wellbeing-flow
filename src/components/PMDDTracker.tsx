
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { addMoodEntry } from '@/lib/dataStorage';
import { toast } from '@/hooks/use-toast';

const PMDDTracker: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const pmddSymptoms = [
    'Mood swings',
    'Irritability',
    'Anger',
    'Depression',
    'Anxiety',
    'Feeling overwhelmed',
    'Difficulty concentrating',
    'Fatigue',
    'Food cravings',
    'Sleep changes',
    'Breast tenderness',
    'Bloating',
    'Headaches',
    'Joint pain',
    'Feeling out of control',
    'Social withdrawal',
    'Decreased interest in activities',
    'Panic attacks',
    'Crying spells',
    'Suicidal thoughts'
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length === 0 && !notes.trim()) {
      toast({
        title: "No data to log",
        description: "Please select symptoms or add notes",
        variant: "destructive"
      });
      return;
    }

    // Log as a neutral mood entry with PMDD symptoms
    addMoodEntry(
      3, // Neutral mood
      notes || "PMDD symptom tracking",
      selectedSymptoms,
      ['PMDD Tracking']
    );

    // Reset form
    setSelectedSymptoms([]);
    setNotes('');

    toast({
      title: "PMDD symptoms logged",
      description: "Your PMDD tracking data has been saved",
    });
  };

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">PMDD Symptom Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Track your PMDD symptoms for better pattern recognition</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">Symptoms (select all that apply):</h4>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {pmddSymptoms.map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2">
                <Checkbox
                  id={symptom}
                  checked={selectedSymptoms.includes(symptom)}
                  onCheckedChange={() => toggleSymptom(symptom)}
                />
                <label 
                  htmlFor={symptom} 
                  className="text-sm cursor-pointer"
                >
                  {symptom}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <Textarea
          placeholder="Additional notes about your symptoms, triggers, or coping strategies..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[80px] border-cycle-lavender/50"
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-cycle-lavender hover:bg-cycle-purple"
        >
          Log PMDD Symptoms
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PMDDTracker;
