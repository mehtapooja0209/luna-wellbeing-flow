import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { addMoodEntry, getSavedSymptoms, addSavedSymptom, removeSavedSymptom } from '@/lib/dataStorage';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RollerCoaster, Plus, X, Save, Star, StarOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const MoodLogger: React.FC = () => {
  const [selectedMoods, setSelectedMoods] = useState<number[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [savedSymptoms, setSavedSymptoms] = useState<string[]>([]);
  const [showSavedSymptoms, setShowSavedSymptoms] = useState(true);
  
  // Common symptoms list
  const commonSymptoms = [
    'Headache', 'Cramps', 'Bloating', 'Fatigue', 
    'Backache', 'Breast Tenderness', 'Nausea', 'Insomnia',
    'Acne', 'Mood Swings', 'Anxiety', 'Cravings',
    'Dizziness', 'Hot Flashes', 'Joint Pain', 'Low Energy',
    'Brain Fog', 'Irritability', 'Depression', 'Restlessness',
    'Sleep Disturbance', 'Constipation', 'Diarrhea', 'Indigestion',
    'Swelling', 'Weight Gain', 'Skin Changes', 'Hair Changes',
    'Libido Changes', 'Concentration Issues'
  ];
  
  // Load saved symptoms on component mount
  useEffect(() => {
    setSavedSymptoms(getSavedSymptoms());
  }, []);
  
  // Extended emoji options for more expressive mood logging
  const moodEmojis = ['😞', '😔', '😐', '🙂', '😊', '😄', '🥰', '😭', '😡', '😴', '😰', '🤔', '😩', '🙄', '🥳', '😬', '🤯', '🥺', '😇', '🤢'];
  const moodLabels = [
    'Very Sad', 'Sad', 'Neutral', 'Good', 'Happy', 'Very Happy', 'Loved', 'Crying', 'Angry', 'Tired', 
    'Anxious', 'Overthinking', 'Exhausted', 'Annoyed', 'Excited', 'Nervous', 'Overwhelmed', 'Vulnerable', 'Peaceful', 'Nauseous'
  ];
  
  const handleMoodSelection = (moodIndex: number) => {
    // If already selected, remove it
    if (selectedMoods.includes(moodIndex)) {
      setSelectedMoods(selectedMoods.filter(index => index !== moodIndex));
      return;
    }
    
    // If 3 moods are already selected, show toast and return
    if (selectedMoods.length >= 3) {
      toast({
        title: "Maximum moods selected",
        description: "You can select up to 3 moods",
        variant: "destructive"
      });
      return;
    }
    
    // Add the new mood
    setSelectedMoods([...selectedMoods, moodIndex]);
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
    
    // If the symptom was selected, keep it selected
    if (selectedSymptoms.includes(symptom)) {
      // No need to remove it from selected
    }
    
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
        <div className="flex flex-wrap justify-between items-center gap-1">
          <TooltipProvider>
            {moodEmojis.map((emoji, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleMoodSelection(index)}
                    className={`text-2xl p-2 rounded-full transition-all ${
                      selectedMoods.includes(index) 
                        ? 'bg-cycle-lavender scale-110' 
                        : 'hover:bg-cycle-soft-purple'
                    }`}
                    aria-label={`Select mood ${moodLabels[index]}`}
                  >
                    {emoji}
                    {moodLabels[index] === 'Overthinking' && (
                      <RollerCoaster className="inline ml-1" size={16} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {moodLabels[index]}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        
        <Textarea
          placeholder="Add notes about how you feel today... (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[80px] border-cycle-lavender/50"
        />
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Symptoms (optional)</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSavedSymptoms(!showSavedSymptoms)}
                className="text-xs h-7 px-2"
              >
                {showSavedSymptoms ? 'Show All' : 'Show Saved'}
              </Button>
            </div>
          </div>
          
          {/* Symptom selection area */}
          <div className="flex flex-wrap gap-2 mb-3">
            {showSavedSymptoms ? (
              savedSymptoms.length > 0 ? (
                savedSymptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center">
                    <button
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-3 py-1 text-sm rounded-l-full transition-colors ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-cycle-purple text-white'
                          : 'border-cycle-purple/40 border hover:bg-cycle-soft-purple'
                      }`}
                    >
                      {symptom}
                    </button>
                    <button
                      onClick={() => handleRemoveSavedSymptom(symptom)}
                      className="bg-cycle-soft-purple hover:bg-cycle-lavender/50 rounded-r-full h-7 w-7 flex items-center justify-center"
                      aria-label={`Remove ${symptom} from saved`}
                    >
                      <StarOff size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No saved symptoms yet. Star your common symptoms to save them.</p>
              )
            ) : (
              commonSymptoms.map((symptom) => (
                <div key={symptom} className="flex items-center">
                  <button
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-3 py-1 text-sm rounded-l-full transition-colors ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-cycle-purple text-white'
                        : 'border-cycle-purple/40 border hover:bg-cycle-soft-purple'
                    }`}
                  >
                    {symptom}
                  </button>
                  <button
                    onClick={() => handleSaveSymptom(symptom)}
                    className={`${
                      savedSymptoms.includes(symptom) 
                        ? 'bg-cycle-lavender text-white' 
                        : 'bg-cycle-soft-purple hover:bg-cycle-lavender/50'
                    } rounded-r-full h-7 w-7 flex items-center justify-center`}
                    aria-label={`${savedSymptoms.includes(symptom) ? 'Saved' : 'Save'} ${symptom}`}
                  >
                    <Star size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
          
          {/* Custom symptom input */}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-cycle-lavender/50 hover:bg-cycle-soft-purple px-2"
                >
                  <Plus size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => {
                    if (customSymptom.trim() !== '') {
                      handleSaveSymptom(customSymptom);
                      addCustomSymptom();
                    } else {
                      toast({
                        title: "Invalid symptom",
                        description: "Please enter a symptom name",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  <Save className="mr-2 h-4 w-4" /> Save symptom
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Selected symptoms display */}
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
                      <X size={12} />
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
