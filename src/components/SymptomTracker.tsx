
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  getChronicConditions, 
  getSavedSymptoms,
  getSymptomsForDate,
  trackSymptomForDate, 
  removeSymptomFromDate, 
  addChronicCondition,
  removeChronicCondition
} from '@/lib/dataStorage';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import VoiceInput from './VoiceInput';

interface SymptomTrackerProps {
  selectedDate: Date;
}

const SymptomTracker: React.FC<SymptomTrackerProps> = ({ selectedDate }) => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [savedSymptoms, setSavedSymptoms] = useState<string[]>([]);
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [newCondition, setNewCondition] = useState('');

  // Load data
  useEffect(() => {
    const dateSymptoms = getSymptomsForDate(selectedDate);
    const userSavedSymptoms = getSavedSymptoms();
    const userChronicConditions = getChronicConditions();
    
    setSymptoms(dateSymptoms);
    setSavedSymptoms(userSavedSymptoms);
    setChronicConditions(userChronicConditions);
  }, [selectedDate]);

  // Add a new symptom for the selected date
  const handleAddSymptom = (symptom: string) => {
    if (!symptom.trim()) return;
    
    trackSymptomForDate(selectedDate, symptom);
    setSymptoms([...symptoms, symptom]);
    setNewSymptom('');
    toast(`Symptom "${symptom}" logged for ${format(selectedDate, 'MMMM d')}`);
  };

  // Remove a symptom from the selected date
  const handleRemoveSymptom = (symptom: string) => {
    removeSymptomFromDate(selectedDate, symptom);
    setSymptoms(symptoms.filter(s => s !== symptom));
    toast(`Removed "${symptom}" from tracked symptoms`);
  };

  // Add a new chronic condition
  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    
    const updated = addChronicCondition(newCondition);
    setChronicConditions(updated);
    setNewCondition('');
    toast(`Added "${newCondition}" to chronic conditions`);
  };

  // Remove a chronic condition
  const handleRemoveCondition = (condition: string) => {
    const updated = removeChronicCondition(condition);
    setChronicConditions(updated);
    toast(`Removed "${condition}" from chronic conditions`);
  };

  // Handle voice input
  const handleVoiceTranscript = (text: string) => {
    setNewSymptom(text);
    // Optionally auto-add the symptom after voice input
    handleAddSymptom(text);
  };

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Symptom Tracker for {format(selectedDate, 'MMMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Today's symptoms */}
          <div>
            <h3 className="font-medium mb-2">Today's Symptoms</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {symptoms.length > 0 ? (
                symptoms.map(symptom => (
                  <Badge key={symptom} variant="secondary" className="px-3 py-1">
                    {symptom}
                    <button 
                      onClick={() => handleRemoveSymptom(symptom)}
                      className="ml-2 text-xs hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No symptoms tracked for today</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                placeholder="Enter a symptom"
                className="flex-1"
              />
              <Button 
                onClick={() => handleAddSymptom(newSymptom)}
                disabled={!newSymptom.trim()}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            <div className="mt-2">
              <VoiceInput 
                onTranscript={handleVoiceTranscript}
                placeholder="Or use voice input to record your symptom"
                buttonLabel="Speak to record your symptom"
              />
            </div>
          </div>

          <Separator />

          {/* Saved symptoms for quick selection */}
          <div>
            <h3 className="font-medium mb-2">Saved Symptoms</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {savedSymptoms.length > 0 ? (
                savedSymptoms.map(symptom => (
                  <Badge 
                    key={symptom} 
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => handleAddSymptom(symptom)}
                  >
                    {symptom}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No saved symptoms yet</p>
              )}
            </div>
            <p className="text-xs text-gray-500">Click on a symptom to add it to today</p>
          </div>

          <Separator />

          {/* Chronic conditions */}
          <div>
            <h3 className="font-medium mb-2">Chronic Conditions</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {chronicConditions.length > 0 ? (
                chronicConditions.map(condition => (
                  <Badge key={condition} className="px-3 py-1">
                    {condition}
                    <button 
                      onClick={() => handleRemoveCondition(condition)}
                      className="ml-2 text-xs hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No chronic conditions tracked</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Enter a chronic condition"
                className="flex-1"
              />
              <Button 
                onClick={handleAddCondition}
                disabled={!newCondition.trim()}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomTracker;
