
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMoodEntry } from '@/lib/dataStorage';
import { toast } from '@/hooks/use-toast';

const PCOSTracker: React.FC = () => {
  const [reproductiveSymptoms, setReproductiveSymptoms] = useState<Record<string, number>>({});
  const [metabolicSymptoms, setMetabolicSymptoms] = useState<Record<string, number>>({});
  const [cosmeticSymptoms, setCosmeticSymptoms] = useState<Record<string, number>>({});
  const [reproductiveNotes, setReproductiveNotes] = useState('');
  const [metabolicNotes, setMetabolicNotes] = useState('');
  const [cosmeticNotes, setCosmeticNotes] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');

  const reproductiveSymptomsList = [
    'Irregular periods', 'Heavy menstrual bleeding', 'Missed periods',
    'Light/scanty periods', 'Painful periods', 'Ovulation pain',
    'Fertility issues', 'Pelvic pain', 'Enlarged ovaries'
  ];

  const metabolicSymptomsList = [
    'Weight gain', 'Difficulty losing weight', 'Insulin resistance',
    'Pre-diabetes/diabetes', 'High cholesterol', 'High blood pressure',
    'Fatigue', 'Sleep apnea', 'Cravings for carbs/sugar',
    'Energy crashes', 'Night sweats', 'Depression/anxiety'
  ];

  const cosmeticSymptomsList = [
    'Excess hair growth (hirsutism)', 'Male-pattern baldness', 'Hair thinning',
    'Acne', 'Dark patches of skin', 'Skin tags',
    'Oily skin', 'Dry skin', 'Voice changes',
    'Body shape changes', 'Stretch marks'
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
    category: 'reproductive' | 'metabolic' | 'cosmetic'
  ) => {
    const setters = {
      reproductive: setReproductiveSymptoms,
      metabolic: setMetabolicSymptoms,
      cosmetic: setCosmeticSymptoms
    };
    
    setters[category](prev => ({ ...prev, [symptom]: rating }));
  };

  const handleSubmit = () => {
    const allSymptoms = Object.keys({...reproductiveSymptoms, ...metabolicSymptoms, ...cosmeticSymptoms});
    const hasData = allSymptoms.length > 0 || reproductiveNotes || metabolicNotes || cosmeticNotes || generalNotes;
    
    if (!hasData) {
      toast({
        title: "No data to log",
        description: "Please rate symptoms or add notes",
        variant: "destructive"
      });
      return;
    }

    const ratings = Object.values({...reproductiveSymptoms, ...metabolicSymptoms, ...cosmeticSymptoms});
    const avgRating = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length) : 3;

    const symptomData = {
      reproductive: reproductiveSymptoms,
      metabolic: metabolicSymptoms,
      cosmetic: cosmeticSymptoms
    };

    const notesData = {
      reproductiveNotes: reproductiveNotes || 'None',
      metabolicNotes: metabolicNotes || 'None',
      cosmeticNotes: cosmeticNotes || 'None',
      generalNotes: generalNotes || 'None'
    };

    addMoodEntry(
      Math.min(5, Math.max(1, avgRating)) as 1 | 2 | 3 | 4 | 5,
      `PCOS Detailed Tracking\n${JSON.stringify(symptomData, null, 2)}\nNotes: ${JSON.stringify(notesData, null, 2)}`,
      allSymptoms,
      ['PCOS Tracking']
    );

    // Reset form
    setReproductiveSymptoms({});
    setMetabolicSymptoms({});
    setCosmeticSymptoms({});
    setReproductiveNotes('');
    setMetabolicNotes('');
    setCosmeticNotes('');
    setGeneralNotes('');

    toast({
      title: "PCOS assessment logged",
      description: "Your detailed PCOS tracking data has been saved",
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
    category: 'reproductive' | 'metabolic' | 'cosmetic';
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
        <CardTitle className="text-lg">🩺 PCOS Comprehensive Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Track PCOS symptoms across reproductive, metabolic, and cosmetic categories</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <SymptomSection 
          title="🌸 Reproductive Symptoms"
          symptoms={reproductiveSymptomsList}
          selectedSymptoms={reproductiveSymptoms}
          category="reproductive"
          notes={reproductiveNotes}
          setNotes={setReproductiveNotes}
        />

        <SymptomSection 
          title="⚡ Metabolic Symptoms"
          symptoms={metabolicSymptomsList}
          selectedSymptoms={metabolicSymptoms}
          category="metabolic"
          notes={metabolicNotes}
          setNotes={setMetabolicNotes}
        />

        <SymptomSection 
          title="💄 Cosmetic/Physical Symptoms"
          symptoms={cosmeticSymptomsList}
          selectedSymptoms={cosmeticSymptoms}
          category="cosmetic"
          notes={cosmeticNotes}
          setNotes={setCosmeticNotes}
        />
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">📝 General Notes:</h4>
          <Textarea
            placeholder="Overall notes: medications, diet changes, exercise, blood work results, treatments, supplements..."
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
          Log PCOS Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PCOSTracker;
