
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMoodEntry } from '@/lib/dataStorage';
import { toast } from '@/hooks/use-toast';

const ADHDTracker: React.FC = () => {
  const [cognitiveSymptoms, setCognitiveSymptoms] = useState<Record<string, number>>({});
  const [emotionalSymptoms, setEmotionalSymptoms] = useState<Record<string, number>>({});
  const [physicalSymptoms, setPhysicalSymptoms] = useState<Record<string, number>>({});
  const [cognitiveNotes, setCognitiveNotes] = useState('');
  const [emotionalNotes, setEmotionalNotes] = useState('');
  const [physicalNotes, setPhysicalNotes] = useState('');
  const [cyclePhaseImpact, setCyclePhaseImpact] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');

  const cognitiveSymptomsList = [
    'Difficulty concentrating', 'Easily distracted', 'Forgetfulness',
    'Difficulty organizing tasks', 'Procrastination', 'Time management issues',
    'Executive dysfunction', 'Working memory issues', 'Hyperfocus episodes',
    'Task switching difficulty', 'Planning problems', 'Decision paralysis'
  ];

  const emotionalSymptomsList = [
    'Emotional dysregulation', 'Rejection sensitivity', 'Mood swings',
    'Impatience', 'Frustration tolerance', 'Anxiety',
    'Depression', 'Low self-esteem', 'Overwhelm',
    'Emotional outbursts', 'Social difficulties', 'Impulse control'
  ];

  const physicalSymptomsList = [
    'Hyperactivity', 'Restlessness', 'Fidgeting',
    'Sleep difficulties', 'Appetite changes', 'Sensory sensitivities',
    'Medication side effects', 'Energy fluctuations', 'Motor coordination',
    'Tension/stress symptoms', 'Headaches', 'Digestive issues'
  ];

  const scaleOptions = [
    { value: 0, label: 'None (0)' },
    { value: 1, label: 'Mild (1)' },
    { value: 2, label: 'Moderate (2)' },
    { value: 3, label: 'Severe (3)' },
    { value: 4, label: 'Very Severe (4)' },
    { value: 5, label: 'Extreme (5)' }
  ];

  const cyclePhaseOptions = [
    { value: 'menstrual_worse', label: 'Menstrual - Symptoms worse' },
    { value: 'menstrual_better', label: 'Menstrual - Symptoms better' },
    { value: 'follicular_worse', label: 'Follicular - Symptoms worse' },
    { value: 'follicular_better', label: 'Follicular - Symptoms better' },
    { value: 'ovulation_worse', label: 'Ovulation - Symptoms worse' },
    { value: 'ovulation_better', label: 'Ovulation - Symptoms better' },
    { value: 'luteal_worse', label: 'Luteal - Symptoms worse' },
    { value: 'luteal_better', label: 'Luteal - Symptoms better' },
    { value: 'no_change', label: 'No noticeable change' }
  ];

  const updateSymptomRating = (
    symptom: string, 
    rating: number, 
    category: 'cognitive' | 'emotional' | 'physical'
  ) => {
    const setters = {
      cognitive: setCognitiveSymptoms,
      emotional: setEmotionalSymptoms,
      physical: setPhysicalSymptoms
    };
    
    setters[category](prev => ({ ...prev, [symptom]: rating }));
  };

  const handleSubmit = () => {
    const allSymptoms = Object.keys({...cognitiveSymptoms, ...emotionalSymptoms, ...physicalSymptoms});
    const hasData = allSymptoms.length > 0 || cognitiveNotes || emotionalNotes || physicalNotes || generalNotes || cyclePhaseImpact;
    
    if (!hasData) {
      toast({
        title: "No data to log",
        description: "Please rate symptoms, cycle impact, or add notes",
        variant: "destructive"
      });
      return;
    }

    const ratings = Object.values({...cognitiveSymptoms, ...emotionalSymptoms, ...physicalSymptoms});
    const avgRating = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length) : 3;

    const symptomData = {
      cognitive: cognitiveSymptoms,
      emotional: emotionalSymptoms,
      physical: physicalSymptoms
    };

    const notesData = {
      cyclePhaseImpact: cyclePhaseImpact || 'Not specified',
      cognitiveNotes: cognitiveNotes || 'None',
      emotionalNotes: emotionalNotes || 'None',
      physicalNotes: physicalNotes || 'None',
      generalNotes: generalNotes || 'None'
    };

    addMoodEntry(
      Math.min(5, Math.max(1, avgRating)) as 1 | 2 | 3 | 4 | 5,
      `ADHD & Hormone Detailed Tracking\n${JSON.stringify(symptomData, null, 2)}\nNotes: ${JSON.stringify(notesData, null, 2)}`,
      allSymptoms,
      ['ADHD Tracking']
    );

    // Reset form
    setCognitiveSymptoms({});
    setEmotionalSymptoms({});
    setPhysicalSymptoms({});
    setCognitiveNotes('');
    setEmotionalNotes('');
    setPhysicalNotes('');
    setCyclePhaseImpact('');
    setGeneralNotes('');

    toast({
      title: "ADHD assessment logged",
      description: "Your detailed ADHD and hormone tracking data has been saved",
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
    category: 'cognitive' | 'emotional' | 'physical';
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
        <CardTitle className="text-lg">🧠 ADHD & Hormone Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Track how your menstrual cycle affects ADHD symptoms across different categories</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">🔄 Cycle Phase Impact:</label>
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

        <SymptomSection 
          title="🎯 Cognitive Symptoms"
          symptoms={cognitiveSymptomsList}
          selectedSymptoms={cognitiveSymptoms}
          category="cognitive"
          notes={cognitiveNotes}
          setNotes={setCognitiveNotes}
        />

        <SymptomSection 
          title="💭 Emotional Symptoms"
          symptoms={emotionalSymptomsList}
          selectedSymptoms={emotionalSymptoms}
          category="emotional"
          notes={emotionalNotes}
          setNotes={setEmotionalNotes}
        />

        <SymptomSection 
          title="⚡ Physical Symptoms"
          symptoms={physicalSymptomsList}
          selectedSymptoms={physicalSymptoms}
          category="physical"
          notes={physicalNotes}
          setNotes={setPhysicalNotes}
        />
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">📝 General Notes:</h4>
          <Textarea
            placeholder="Overall notes: medication timing, productivity levels, coping strategies, energy levels, focus techniques..."
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
          Log ADHD Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ADHDTracker;
