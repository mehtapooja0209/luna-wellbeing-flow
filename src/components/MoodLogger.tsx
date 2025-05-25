
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addMoodEntry, getSavedSymptoms, addSavedSymptom, removeSavedSymptom } from '@/lib/dataStorage';
import { toast } from '@/hooks/use-toast';
import MoodEmojiSelector, { moodLabels } from './mood/MoodEmojiSelector';
import SymptomSelector from './mood/SymptomSelector';

const MoodLogger: React.FC = () => {
  const [selectedMoods, setSelectedMoods] = useState<number[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [savedSymptoms, setSavedSymptoms] = useState<string[]>([]);
  
  // Load saved symptoms on component mount
  useEffect(() => {
    setSavedSymptoms(getSavedSymptoms());
  }, []);
  
  const handleMoodSelection = (moodIndex: number) => {
    setSelectedMoods(prev => 
      prev.includes(moodIndex) 
        ? prev.filter(index => index !== moodIndex)
        : [...prev, moodIndex]
    );
  };
  
  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };
  
  const handleSaveSymptom = (symptom: string) => {
    const updatedSavedSymptoms = addSavedSymptom(symptom);
    setSavedSymptoms(updatedSavedSymptoms);
    
    toast({
      title: "Symptom saved",
      description: `"${symptom}" added to your saved symptoms`,
    });
  };
  
  const handleRemoveSavedSymptom = (symptom: string) => {
    const updatedSavedSymptoms = removeSavedSymptom(symptom);
    setSavedSymptoms(updatedSavedSymptoms);
    
    toast({
      title: "Symptom removed",
      description: `"${symptom}" removed from your saved symptoms`,
    });
  };
  
  const handleSubmit = () => {
    if (selectedMoods.length === 0) {
      toast({
        title: "Mood required",
        description: "Please select at least one mood before saving",
        variant: "destructive"
      });
      return;
    }
    
    // Get the primary mood (first selected) for backward compatibility
    const primaryMoodValue = Math.min(5, selectedMoods[0] + 1);
    
    // Create an array of all selected mood labels
    const selectedMoodLabels = selectedMoods.map(index => moodLabels[index]);
    
    addMoodEntry(
      primaryMoodValue,  // Convert 0-9 index to 1-5 rating (capped at 5 for compatibility)
      notes,
      selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
      selectedMoodLabels // Pass the mood labels
    );
    
    // Reset form
    setSelectedMoods([]);
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
        <p className="text-sm text-muted-foreground">Select up to 3 moods that represent how you feel</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <MoodEmojiSelector 
          selectedMoods={selectedMoods} 
          onMoodSelect={handleMoodSelection} 
        />
        
        <Textarea
          placeholder="Add notes about how you feel today... (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[80px] border-cycle-lavender/50"
        />
        
        <SymptomSelector 
          selectedSymptoms={selectedSymptoms}
          savedSymptoms={savedSymptoms}
          onToggleSymptom={toggleSymptom}
          onSaveSymptom={handleSaveSymptom}
          onRemoveSavedSymptom={handleRemoveSavedSymptom}
        />
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
