
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { loadUserData } from '@/lib/dataStorage';
import { getDayInfo, getMoonPhaseEmoji } from '@/lib/cycleUtils';
import { getMoodEntriesForDate } from '@/lib/dataStorage';
import { Toaster } from '@/components/ui/toaster';

import AppHeader from '@/components/AppHeader';
import CyclePhaseIndicator from '@/components/CyclePhaseIndicator';
import DailySuggestion from '@/components/DailySuggestion';
import MoodLogger from '@/components/MoodLogger';
import MoodHistory from '@/components/MoodHistory';
import MoodGraph from '@/components/MoodGraph';
import CalendarView from '@/components/CalendarView';
import CycleSetupDialog from '@/components/CycleSetupDialog';
import HormoneGraph from '@/components/HormoneGraph';
import TrackingSelector from '@/components/TrackingSelector';
import PMDDTracker from '@/components/PMDDTracker';
import PCOSTracker from '@/components/PCOSTracker';
import ADHDTracker from '@/components/ADHDTracker';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userData, setUserData] = useState(loadUserData());
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [moodEntries, setMoodEntries] = useState(getMoodEntriesForDate(selectedDate));
  const [trackingType, setTrackingType] = useState('general');
  
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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const renderTrackingComponent = () => {
    switch (trackingType) {
      case 'pmdd':
        return <PMDDTracker />;
      case 'pcos':
        return <PCOSTracker />;
      case 'adhd':
        return <ADHDTracker />;
      default:
        return <MoodLogger />;
    }
  };
  
  return (
    <div className="min-h-screen cycle-bg-gradient">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <AppHeader 
          date={selectedDate} 
          cycleData={userData.cycleData}
          onOpenSetup={() => setIsSetupOpen(true)}
        />
        
        <div className="animate-fade-in">
          {/* Top section - always full width */}
          <div className="space-y-6 mb-6">
            <CyclePhaseIndicator 
              phase={dayInfo.phase} 
              dayOfCycle={dayInfo.dayOfCycle}
            />
            
            <DailySuggestion 
              phase={dayInfo.phase}
              dayOfCycle={dayInfo.dayOfCycle}
              detailedPhase={dayInfo.detailedPhase}
              hormoneState={dayInfo.hormoneState}
              cognition={dayInfo.cognition}
              optimal={dayInfo.optimal}
              avoid={dayInfo.avoid}
            />

            <HormoneGraph cycleData={userData.cycleData} />
          </div>

          {/* Responsive layout - side by side on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-6">
              <CalendarView 
                cycleData={userData.cycleData}
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
              />
              
              <MoodGraph entries={userData.moodEntries} days={14} />
            </div>
            
            <div className="space-y-6">
              <TrackingSelector onTrackingChange={setTrackingType} />
              {renderTrackingComponent()}
            </div>
          </div>

          {/* Bottom section - mood history */}
          <div className="space-y-6">
            <MoodHistory entries={moodEntries} />
          </div>
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
