
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { loadUserData } from '@/lib/dataStorage';
import { getDayInfo, getMoonPhaseEmoji } from '@/lib/cycleUtils';
import { getMoodEntriesForDate } from '@/lib/dataStorage';
import { Toaster } from '@/components/ui/toaster';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import AppHeader from '@/components/AppHeader';
import CyclePhaseIndicator from '@/components/CyclePhaseIndicator';
import DailySuggestion from '@/components/DailySuggestion';
import MoodLogger from '@/components/MoodLogger';
import MoodHistory from '@/components/MoodHistory';
import MoodGraph from '@/components/MoodGraph';
import CalendarView from '@/components/CalendarView';
import CycleSetupDialog from '@/components/CycleSetupDialog';
import ReminderManager from '@/components/ReminderManager';
import SymptomTracker from '@/components/SymptomTracker';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userData, setUserData] = useState(loadUserData());
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [moodEntries, setMoodEntries] = useState(getMoodEntriesForDate(selectedDate));
  const [activeTab, setActiveTab] = useState('daily');
  
  // Get day info for the selected date
  const dayInfo = getDayInfo(userData.cycleData, selectedDate);
  
  // Check if we need to show the setup dialog on first launch
  useEffect(() => {
    const isFirstTimeUser = !localStorage.getItem('cycle_app_user_data');
    if (isFirstTimeUser) {
      setIsSetupOpen(true);
    }
  }, []);
  
  // Update when date changes
  useEffect(() => {
    setMoodEntries(getMoodEntriesForDate(selectedDate));
  }, [selectedDate]);
  
  // Refresh data when needed
  const refreshData = () => {
    setUserData(loadUserData());
    setMoodEntries(getMoodEntriesForDate(selectedDate));
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="min-h-screen cycle-bg-gradient">
      <div className="container max-w-md mx-auto px-4 py-6">
        <AppHeader 
          date={selectedDate} 
          cycleData={userData.cycleData}
          onOpenSetup={() => setIsSetupOpen(true)}
        />
        
        <div className="space-y-6 animate-fade-in">
          <CyclePhaseIndicator 
            phase={dayInfo.phase} 
            dayOfCycle={dayInfo.dayOfCycle}
            className="mb-4"
          />
          
          <CalendarView 
            cycleData={userData.cycleData}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="mood">Mood</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="mt-4">
              <div className="space-y-6">
                <DailySuggestion 
                  phase={dayInfo.phase}
                  dayOfCycle={dayInfo.dayOfCycle}
                  detailedPhase={dayInfo.detailedPhase}
                  hormoneState={dayInfo.hormoneState}
                  cognition={dayInfo.cognition}
                  optimal={dayInfo.optimal}
                  avoid={dayInfo.avoid}
                />
                
                <MoodLogger onEntryAdded={refreshData} selectedDate={selectedDate} />
              </div>
            </TabsContent>
            
            <TabsContent value="mood" className="mt-4">
              <div className="space-y-6">
                <MoodGraph entries={userData.moodEntries} days={14} />
                <MoodHistory entries={moodEntries} />
              </div>
            </TabsContent>
            
            <TabsContent value="reminders" className="mt-4">
              <ReminderManager selectedDate={selectedDate} />
            </TabsContent>
            
            <TabsContent value="symptoms" className="mt-4">
              <SymptomTracker selectedDate={selectedDate} />
            </TabsContent>
          </Tabs>
        </div>
        
        <CycleSetupDialog 
          isOpen={isSetupOpen} 
          onClose={() => {
            setIsSetupOpen(false);
            refreshData();
          }} 
        />
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
