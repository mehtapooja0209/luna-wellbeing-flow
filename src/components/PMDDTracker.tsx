
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMoodEntry } from '@/lib/dataStorage';
import { toast } from '@/hooks/use-toast';

const PMDDTracker: React.FC = () => {
  const [moodSymptoms, setMoodSymptoms] = useState<Record<string, number>>({});
  const [physicalSymptoms, setPhysicalSymptoms] = useState<Record<string, number>>({});
  const [behavioralSymptoms, setBehavioralSymptoms] = useState<Record<string, number>>({});
  const [moodNotes, setMoodNotes] = useState('');
  const [physicalNotes, setPhysicalNotes] = useState('');
  const [behavioralNotes, setBehavioralNotes] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');

  const moodSymptomsList = [
    'Depressed/Sad', 'Hopeless', 'Worthless', 'Guilty', 'Anxious/Tense',
    'Mood Swings', 'Sudden Sad/Tearful', 'Increased Rejection Sensitivity',
    'Anger/Irritability', 'Increased Interpersonal Conflicts', 'Decreased Interest in Activities',
    'Difficulty Concentrating', 'Fatigue/Lack of Energy', 'Appetite Changes/Food Cravings',
    'Sleep Disturbance', 'Feeling Overwhelmed/Out of Control'
  ];

  const physicalSymptomsList = [
    'Breast Tenderness/Swelling', 'Headaches', 'Joint/Muscle Pain',
    'Bloating/Weight Gain', 'Swelling of Extremities', 'Hot Flashes',
    'Nausea', 'Dizziness', 'Acne Flare-ups', 'Changes in Libido',
    'Increased Urination', 'Constipation', 'Diarrhea'
  ];

  const behavioralSymptomsList = [
    'Social Withdrawal', 'Increased Arguments', 'Decreased Productivity',
    'Procrastination', 'Emotional Eating', 'Substance Use Changes',
    'Sleep Pattern Changes', 'Exercise Avoidance', 'Isolation from Family/Friends',
    'Increased Sensitivity to Noise/Light', 'Compulsive Behaviors'
  ];

  const scaleOptions = [
    { value: 0, label: 'None (0)' },
    { value: 1, label: 'Mild (1)' },
    { value: 2, label: 'Moderate (2)' },
    { value: 3, label: 'Severe (3)' },
    { value: 4, label: 'Very Severe (4)' },
    { value: 5, label: 'Extreme (5)' }
  ];

  const updateSymptomRating = (
    symptom: string, 
    rating: number, 
    category: 'mood' | 'physical' | 'behavioral'
  ) => {
    const setters = {
      mood: setMoodSymptoms,
      physical: setPhysicalSymptoms,
      behavioral: setBehavioralSymptoms
    };
    
    setters[category](prev => ({ ...prev, [symptom]: rating }));
  };

  const handleSubmit = () => {
    const allSymptoms = Object.keys({...moodSymptoms, ...physicalSymptoms, ...behavioralSymptoms});
    const hasData = allSymptoms.length > 0 || moodNotes || physicalNotes || behavioralNotes || generalNotes;
    
    if (!hasData) {
      toast({
        title: "No data to log",
        description: "Please rate symptoms or add notes",
        variant: "destructive"
      });
      return;
    }

    // Calculate average mood rating
    const ratings = Object.values({...moodSymptoms, ...physicalSymptoms, ...behavioralSymptoms});
    const avgRating = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length) : 3;

    const symptomData = {
      mood: moodSymptoms,
      physical: physicalSymptoms,
      behavioral: behavioralSymptoms
    };

    const notesData = {
      moodNotes: moodNotes || 'None',
      physicalNotes: physicalNotes || 'None',
      behavioralNotes: behavioralNotes || 'None',
      generalNotes: generalNotes || 'None'
    };

    addMoodEntry(
      Math.min(5, Math.max(1, avgRating)) as 1 | 2 | 3 | 4 | 5,
      `PMDD Detailed Tracking\n${JSON.stringify(symptomData, null, 2)}\nNotes: ${JSON.stringify(notesData, null, 2)}`,
      allSymptoms,
      ['PMDD Tracking']
    );

    // Reset form
    setMoodSymptoms({});
    setPhysicalSymptoms({});
    setBehavioralSymptoms({});
    setMoodNotes('');
    setPhysicalNotes('');
    setBehavioralNotes('');
    setGeneralNotes('');

    toast({
      title: "PMDD assessment logged",
      description: "Your detailed PMDD tracking data has been saved",
    });
  };

  const SymptomSection = ({ 
    title, 
    symptoms, 
    selectedSymptoms, 
    category,
    notes,
    setNotes 
  }: {
    title: string;
    symptoms: string[];
    selectedSymptoms: Record<string, number>;
    category: 'mood' | 'physical' | 'behavioral';
    notes: string;
    setNotes: (notes: string) => void;
  }) => (
    <div className="space-y-3 border-b pb-4">
      <h4 className="font-medium text-sm">{title}:</h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {symptoms.map((symptom) => (
          <div key={symptom} className="flex items-center justify-between text-xs">
            <label className="flex-1 cursor-pointer">{symptom}</label>
            <Select 
              value={selectedSymptoms[symptom]?.toString() || ''} 
              onValueChange={(value) => updateSymptomRating(symptom, parseInt(value), category)}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue placeholder="Rate" />
              </SelectTrigger>
              <SelectContent>
                {scaleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <Textarea
        placeholder={`Notes for ${title.toLowerCase()}...`}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[60px] border-cycle-lavender/50 text-xs"
      />
    </div>
  );

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">📋 PMDD Detailed Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Rate each symptom from 0-5 and add notes for each section</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <SymptomSection 
          title="😔 Mood & Emotional Symptoms"
          symptoms={moodSymptomsList}
          selectedSymptoms={moodSymptoms}
          category="mood"
          notes={moodNotes}
          setNotes={setMoodNotes}
        />

        <SymptomSection 
          title="🤕 Physical Symptoms"
          symptoms={physicalSymptomsList}
          selectedSymptoms={physicalSymptoms}
          category="physical"
          notes={physicalNotes}
          setNotes={setPhysicalNotes}
        />

        <SymptomSection 
          title="🔄 Behavioral Changes"
          symptoms={behavioralSymptomsList}
          selectedSymptoms={behavioralSymptoms}
          category="behavioral"
          notes={behavioralNotes}
          setNotes={setBehavioralNotes}
        />
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">📝 General Notes:</h4>
          <Textarea
            placeholder="Overall notes: triggers, coping strategies, medications, daily functioning impact..."
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            className="min-h-[80px] border-cycle-lavender/50"
          />
        </div>
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
