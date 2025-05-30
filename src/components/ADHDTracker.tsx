
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMoodEntry } from '@/lib/dataStorage';
import { toast } from '@/hooks/use-toast';

const ADHDTracker: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [cyclePhaseImpact, setCyclePhaseImpact] = useState('');

  const adhdSymptoms = [
    'Difficulty concentrating', 'Easily distracted', 'Forgetfulness',
    'Hyperactivity', 'Restlessness', 'Impulsivity',
    'Difficulty organizing tasks', 'Procrastination', 'Time management issues',
    'Emotional dysregulation', 'Rejection sensitivity', 'Mood swings',
    'Hyperfocus episodes', 'Executive dysfunction', 'Working memory issues',
    'Sensory sensitivities', 'Sleep difficulties', 'Appetite changes',
    'Medication side effects', 'Social difficulties', 'Low self-esteem'
  ];

  const cyclePhaseOptions = [
    { value: 'menstrual', label: 'Menstrual - Symptoms worse' },
    { value: 'menstrual_better', label: 'Menstrual - Symptoms better' },
    { value: 'follicular', label: 'Follicular - Symptoms worse' },
    { value: 'follicular_better', label: 'Follicular - Symptoms better' },
    { value: 'ovulation', label: 'Ovulation - Symptoms worse' },
    { value: 'ovulation_better', label: 'Ovulation - Symptoms better' },
    { value: 'luteal', label: 'Luteal - Symptoms worse' },
    { value: 'luteal_better', label: 'Luteal - Symptoms better' },
    { value: 'no_change', label: 'No noticeable change' }
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length === 0 && !notes.trim() && !cyclePhaseImpact) {
      toast({
        title: "No data to log",
        description: "Please select symptoms, cycle impact, or add notes",
        variant: "destructive"
      });
      return;
    }

    // Default mood rating for ADHD tracking
    const moodRating = 3;

    addMoodEntry(
      moodRating,
      `ADHD & Hormone Tracking\nCycle Impact: ${cyclePhaseImpact || 'Not specified'}\nNotes: ${notes || 'None'}`,
      selectedSymptoms,
      ['ADHD Tracking']
    );

    setSelectedSymptoms([]);
    setNotes('');
    setCyclePhaseImpact('');

    toast({
      title: "ADHD symptoms logged",
      description: "Your ADHD and hormone tracking data has been saved",
    });
  };

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">ADHD & Hormone Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Track how your menstrual cycle affects ADHD symptoms</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Cycle Phase Impact:</label>
          <Select value={cyclePhaseImpact} onValueChange={setCyclePhaseImpact}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="How does your cycle affect ADHD symptoms?" />
            </SelectTrigger>
            <SelectContent>
              {cyclePhaseOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium mb-3">ADHD Symptoms (select all that apply):</h4>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {adhdSymptoms.map((symptom) => (
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
          placeholder="Notes: medication timing, productivity levels, coping strategies, energy levels..."
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
          Log ADHD Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ADHDTracker;
