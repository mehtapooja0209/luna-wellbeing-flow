
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMoodEntry } from '@/lib/dataStorage';
import { toast } from '@/hooks/use-toast';

const PMDDTracker: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedPhysical, setSelectedPhysical] = useState<string[]>([]);
  const [selectedBehavioral, setSelectedBehavioral] = useState<string[]>([]);
  const [severity, setSeverity] = useState('');

  // Comprehensive PMDD symptoms based on the mood chart
  const moodSymptoms = [
    'Depressed/Sad', 'Hopeless', 'Worthless', 'Guilty', 'Anxious/Tense',
    'Mood Swings', 'Sudden Sad/Tearful', 'Increased Rejection Sensitivity',
    'Anger/Irritability', 'Increased Interpersonal Conflicts', 'Decreased Interest in Activities',
    'Difficulty Concentrating', 'Fatigue/Lack of Energy', 'Appetite Changes/Food Cravings',
    'Sleep Disturbance', 'Feeling Overwhelmed/Out of Control'
  ];

  const physicalSymptoms = [
    'Breast Tenderness/Swelling', 'Headaches', 'Joint/Muscle Pain',
    'Bloating/Weight Gain', 'Swelling of Extremities', 'Hot Flashes',
    'Nausea', 'Dizziness', 'Acne Flare-ups', 'Changes in Libido',
    'Increased Urination', 'Constipation', 'Diarrhea'
  ];

  const behavioralSymptoms = [
    'Social Withdrawal', 'Increased Arguments', 'Decreased Productivity',
    'Procrastination', 'Emotional Eating', 'Substance Use Changes',
    'Sleep Pattern Changes', 'Exercise Avoidance', 'Isolation from Family/Friends',
    'Increased Sensitivity to Noise/Light', 'Compulsive Behaviors'
  ];

  const severityLevels = [
    { value: 'none', label: 'None (1)' },
    { value: 'mild', label: 'Mild (2)' },
    { value: 'moderate', label: 'Moderate (3)' },
    { value: 'severe', label: 'Severe (4)' },
    { value: 'extreme', label: 'Extreme (5)' }
  ];

  const toggleSymptom = (symptom: string, category: string) => {
    const setters = {
      mood: setSelectedMoods,
      physical: setSelectedPhysical,
      behavioral: setSelectedBehavioral
    };
    
    const getters = {
      mood: selectedMoods,
      physical: selectedPhysical,
      behavioral: selectedBehavioral
    };

    const setter = setters[category as keyof typeof setters];
    const getter = getters[category as keyof typeof getters];
    
    setter(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    const allSymptoms = [...selectedMoods, ...selectedPhysical, ...selectedBehavioral];
    
    if (allSymptoms.length === 0 && !notes.trim() && !severity) {
      toast({
        title: "No data to log",
        description: "Please select symptoms, severity level, or add notes",
        variant: "destructive"
      });
      return;
    }

    // Convert severity to mood rating
    const moodRating = severity === 'none' ? 1 : 
                      severity === 'mild' ? 2 :
                      severity === 'moderate' ? 3 :
                      severity === 'severe' ? 4 : 5;

    addMoodEntry(
      moodRating,
      `PMDD Tracking - Severity: ${severity || 'Not specified'}\nNotes: ${notes || 'None'}`,
      allSymptoms,
      ['PMDD Tracking']
    );

    // Reset form
    setSelectedMoods([]);
    setSelectedPhysical([]);
    setSelectedBehavioral([]);
    setNotes('');
    setSeverity('');

    toast({
      title: "PMDD symptoms logged",
      description: "Your comprehensive PMDD tracking data has been saved",
    });
  };

  const SymptomSection = ({ title, symptoms, selectedSymptoms, category }: {
    title: string;
    symptoms: string[];
    selectedSymptoms: string[];
    category: string;
  }) => (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">{title}:</h4>
      <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto text-xs">
        {symptoms.map((symptom) => (
          <div key={symptom} className="flex items-center space-x-2">
            <Checkbox
              id={`${category}-${symptom}`}
              checked={selectedSymptoms.includes(symptom)}
              onCheckedChange={() => toggleSymptom(symptom, category)}
              className="h-3 w-3"
            />
            <label 
              htmlFor={`${category}-${symptom}`} 
              className="text-xs cursor-pointer leading-tight"
            >
              {symptom}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">PMDD Comprehensive Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Track PMDD symptoms with detailed mood, physical, and behavioral assessments</p>
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

        <SymptomSection 
          title="Mood & Emotional Symptoms"
          symptoms={moodSymptoms}
          selectedSymptoms={selectedMoods}
          category="mood"
        />

        <SymptomSection 
          title="Physical Symptoms"
          symptoms={physicalSymptoms}
          selectedSymptoms={selectedPhysical}
          category="physical"
        />

        <SymptomSection 
          title="Behavioral Changes"
          symptoms={behavioralSymptoms}
          selectedSymptoms={selectedBehavioral}
          category="behavioral"
        />
        
        <Textarea
          placeholder="Additional notes: triggers, coping strategies, medications, daily functioning impact..."
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
          Log PMDD Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PMDDTracker;
