
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMoodEntry } from '@/lib/dataStorage';
import { toast } from '@/hooks/use-toast';

const PMDDTracker: React.FC = () => {
  const [physicalSymptoms, setPhysicalSymptoms] = useState<Record<string, number>>({});
  const [behavioralSymptoms, setBehavioralSymptoms] = useState<Record<string, number>>({});
  const [cognitiveSymptoms, setCognitiveSymptoms] = useState<Record<string, number>>({});
  const [physicalNotes, setPhysicalNotes] = useState('');
  const [behavioralNotes, setBehavioralNotes] = useState('');
  const [cognitiveNotes, setCognitiveNotes] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');

  const physicalSymptomsList = [
    'Breast tenderness', 'Bloating', 'Weight gain', 'Headaches',
    'Hot flashes', 'Joint/muscle aches', 'Fatigue', 'Sleep problems',
    'Appetite changes', 'Food cravings', 'Acne', 'Swelling'
  ];

  const behavioralSymptomsList = [
    'Mood swings', 'Irritability', 'Anger/rage', 'Crying spells',
    'Depression', 'Anxiety', 'Panic attacks', 'Social withdrawal',
    'Decreased interest', 'Feeling overwhelmed', 'Hopelessness',
    'Suicidal thoughts'
  ];

  const cognitiveSymptomsList = [
    'Confusion', 'Difficulty concentrating', 'Forgetfulness',
    'Indecisiveness', 'Brain fog', 'Easily distracted',
    'Mental fatigue', 'Word-finding difficulty'
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
    category: 'physical' | 'behavioral' | 'cognitive'
  ) => {
    const setters = {
      physical: setPhysicalSymptoms,
      behavioral: setBehavioralSymptoms,
      cognitive: setCognitiveSymptoms
    };
    
    setters[category](prev => ({ ...prev, [symptom]: rating }));
  };

  const handleSubmit = () => {
    const allSymptoms = Object.keys({...physicalSymptoms, ...behavioralSymptoms, ...cognitiveSymptoms});
    const hasData = allSymptoms.length > 0 || physicalNotes || behavioralNotes || cognitiveNotes || generalNotes;
    
    if (!hasData) {
      toast({
        title: "No data to log",
        description: "Please rate symptoms or add notes",
        variant: "destructive"
      });
      return;
    }

    const ratings = Object.values({...physicalSymptoms, ...behavioralSymptoms, ...cognitiveSymptoms});
    const avgRating = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length) : 3;

    const symptomData = {
      physical: physicalSymptoms,
      behavioral: behavioralSymptoms,
      cognitive: cognitiveSymptoms
    };

    const notesData = {
      physicalNotes: physicalNotes || 'None',
      behavioralNotes: behavioralNotes || 'None',
      cognitiveNotes: cognitiveNotes || 'None',
      generalNotes: generalNotes || 'None'
    };

    addMoodEntry(
      Math.min(5, Math.max(1, avgRating)) as 1 | 2 | 3 | 4 | 5,
      `PMDD Tracking\n${JSON.stringify(symptomData, null, 2)}\nNotes: ${JSON.stringify(notesData, null, 2)}`,
      allSymptoms,
      ['PMDD']
    );

    // Reset form
    setPhysicalSymptoms({});
    setBehavioralSymptoms({});
    setCognitiveSymptoms({});
    setPhysicalNotes('');
    setBehavioralNotes('');
    setCognitiveNotes('');
    setGeneralNotes('');

    toast({
      title: "PMDD assessment logged",
      description: "Your PMDD tracking data has been saved",
    });
  };

  const SymptomSection = ({ 
    title, 
    emoji,
    symptoms, 
    selectedSymptoms, 
    category,
    notes,
    setNotes 
  }: {
    title: string;
    emoji: string;
    symptoms: string[];
    selectedSymptoms: Record<string, number>;
    category: 'physical' | 'behavioral' | 'cognitive';
    notes: string;
    setNotes: (notes: string) => void;
  }) => (
    <div className="space-y-3 border-b pb-4">
      <h4 className="font-medium text-sm flex items-center gap-2">
        <span>{emoji}</span>
        {title}:
      </h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {symptoms.map((symptom) => (
          <div key={symptom} className="flex items-center justify-between text-xs gap-2">
            <label className="flex-1 cursor-pointer text-left">{symptom}</label>
            <Select 
              value={selectedSymptoms[symptom]?.toString() || ''} 
              onValueChange={(value) => updateSymptomRating(symptom, parseInt(value), category)}
            >
              <SelectTrigger className="w-24 h-8 text-xs">
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
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm h-fit">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">🌙 PMDD Symptom Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Track your PMDD symptoms with detailed ratings</p>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
        <SymptomSection 
          title="Physical Symptoms"
          emoji="🩺"
          symptoms={physicalSymptomsList}
          selectedSymptoms={physicalSymptoms}
          category="physical"
          notes={physicalNotes}
          setNotes={setPhysicalNotes}
        />

        <SymptomSection 
          title="Behavioral & Mood Changes"
          emoji="💭"
          symptoms={behavioralSymptomsList}
          selectedSymptoms={behavioralSymptoms}
          category="behavioral"
          notes={behavioralNotes}
          setNotes={setBehavioralNotes}
        />

        <SymptomSection 
          title="Cognitive Changes"
          emoji="🧠"
          symptoms={cognitiveSymptomsList}
          selectedSymptoms={cognitiveSymptoms}
          category="cognitive"
          notes={cognitiveNotes}
          setNotes={setCognitiveNotes}
        />
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <span>📝</span>
            General Notes:
          </h4>
          <Textarea
            placeholder="Overall notes: medications, treatments, triggers, coping strategies..."
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
