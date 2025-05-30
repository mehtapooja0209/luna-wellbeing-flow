
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMoodEntry } from '@/lib/dataStorage';
import { toast } from '@/hooks/use-toast';

const PCOSTracker: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState('');

  const pcosSymptoms = [
    'Irregular periods', 'Heavy menstrual bleeding', 'Missed periods',
    'Excess hair growth (hirsutism)', 'Male-pattern baldness', 'Acne',
    'Weight gain', 'Difficulty losing weight', 'Insulin resistance',
    'Dark patches of skin', 'Mood swings', 'Depression',
    'Anxiety', 'Fatigue', 'Sleep apnea',
    'High cholesterol', 'High blood pressure', 'Fertility issues',
    'Cravings for carbs/sugar', 'Hair thinning', 'Skin tags'
  ];

  const severityLevels = [
    { value: 'none', label: 'None (1)' },
    { value: 'mild', label: 'Mild (2)' },
    { value: 'moderate', label: 'Moderate (3)' },
    { value: 'severe', label: 'Severe (4)' },
    { value: 'extreme', label: 'Extreme (5)' }
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length === 0 && !notes.trim() && !severity) {
      toast({
        title: "No data to log",
        description: "Please select symptoms, severity level, or add notes",
        variant: "destructive"
      });
      return;
    }

    const moodRating = severity === 'none' ? 1 : 
                      severity === 'mild' ? 2 :
                      severity === 'moderate' ? 3 :
                      severity === 'severe' ? 4 : 5;

    addMoodEntry(
      moodRating,
      `PCOS Tracking - Severity: ${severity || 'Not specified'}\nNotes: ${notes || 'None'}`,
      selectedSymptoms,
      ['PCOS Tracking']
    );

    setSelectedSymptoms([]);
    setNotes('');
    setSeverity('');

    toast({
      title: "PCOS symptoms logged",
      description: "Your PCOS tracking data has been saved",
    });
  };

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">PCOS Symptom Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Track PCOS symptoms and management</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Overall Severity Level:</label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select severity level" />
            </SelectTrigger>
            <SelectContent>
              {severityLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium mb-3">PCOS Symptoms (select all that apply):</h4>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {pcosSymptoms.map((symptom) => (
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
          placeholder="Notes: medications, diet changes, exercise, blood work results, treatments..."
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
          Log PCOS Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PCOSTracker;
