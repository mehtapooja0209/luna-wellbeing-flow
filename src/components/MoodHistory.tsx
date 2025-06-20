
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodEntry } from '@/lib/types';

interface MoodHistoryProps {
  entries: MoodEntry[];
}

const MoodHistory: React.FC<MoodHistoryProps> = ({ entries }) => {
  if (entries.length === 0) {
    return null;
  }
  
  // Sort entries by timestamp (newest first)
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  const getMoodEmoji = (rating: number) => {
    const emojis = ['😞', '😔', '😐', '🙂', '😊'];
    return emojis[rating - 1];
  };

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Today's Entries</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedEntries.map((entry) => (
          <div key={entry.id} className="border-b border-cycle-soft-purple pb-3 last:border-0">
            <div className="flex justify-between items-center mb-1">
              <div className="flex space-x-1">
                {/* If we have moodLabels, display those instead of the numeric mood */}
                {entry.moodLabels && entry.moodLabels.length > 0 ? (
                  <div className="flex space-x-1">
                    {entry.moodLabels.map((label, idx) => {
                      // Map mood labels back to their emojis
                      const moodLabels = [
                        'Very Sad', 'Sad', 'Neutral', 'Good', 'Happy', 'Very Happy', 'Loved', 'Crying', 'Angry', 'Tired', 
                        'Anxious', 'Overthinking', 'Exhausted', 'Annoyed', 'Excited', 'Nervous', 'Overwhelmed', 'Vulnerable', 'Peaceful', 'Nauseous'
                      ];
                      const moodEmojis = ['😞', '😔', '😐', '🙂', '😊', '😄', '🥰', '😭', '😡', '😴', '😰', '🤔', '😩', '🙄', '🥳', '😬', '🤯', '🥺', '😇', '🤢'];
                      const emojiIndex = moodLabels.findIndex(l => l === label);
                      return (
                        <span key={idx} className="text-2xl" title={label}>
                          {emojiIndex >= 0 ? moodEmojis[emojiIndex] : '😐'}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(entry.timestamp), 'h:mm a')}
              </span>
            </div>
            
            {entry.notes && (
              <p className="text-sm mb-2">{entry.notes}</p>
            )}
            
            {entry.symptoms && entry.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {entry.symptoms.map((symptom) => (
                  <span 
                    key={symptom}
                    className="bg-cycle-soft-purple/50 px-2 py-0.5 rounded-full text-xs"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MoodHistory;
