
import React from 'react';
import { format, subDays, parseISO, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodEntry } from '@/lib/types';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

interface MoodGraphProps {
  entries: MoodEntry[];
  days?: number;
}

// Map mood labels to a numerical value for charting
const getMoodValue = (label: string): number => {
  const moodValues: Record<string, number> = {
    'Very Sad': 1, 'Sad': 2, 'Neutral': 3, 'Good': 4, 'Happy': 5,
    'Very Happy': 6, 'Loved': 6, 'Crying': 1, 'Angry': 2, 'Tired': 3,
    'Anxious': 2, 'Overthinking': 3, 'Exhausted': 2, 'Annoyed': 2, 
    'Excited': 5, 'Nervous': 3, 'Overwhelmed': 2, 'Vulnerable': 2, 
    'Peaceful': 5, 'Nauseous': 2
  };
  return moodValues[label] || 3; // Default to neutral for unknown labels
};

const MoodGraph: React.FC<MoodGraphProps> = ({ entries, days = 7 }) => {
  // Generate empty data for last 7 days
  const generateEmptyData = () => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'MMM dd'),
        value: null
      });
    }
    return data;
  };

  // Process entries to get data points
  const processEntriesData = () => {
    const emptyData = generateEmptyData();
    
    // Process entries and merge with empty data
    entries.forEach(entry => {
      const entryDate = parseISO(entry.timestamp);
      const dateStr = format(entryDate, 'yyyy-MM-dd');
      
      // Find if we already have this date in our data
      const existingDataPoint = emptyData.find(d => d.date === dateStr);
      
      if (existingDataPoint) {
        // If we have mood labels, use the average of their values
        if (entry.moodLabels && entry.moodLabels.length > 0) {
          const moodValues = entry.moodLabels.map(getMoodValue);
          const avgMood = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
          
          // If multiple entries for same day, take the average
          if (existingDataPoint.value !== null) {
            existingDataPoint.value = (existingDataPoint.value + avgMood) / 2;
          } else {
            existingDataPoint.value = avgMood;
          }
        } else {
          // Use legacy mood value
          existingDataPoint.value = entry.mood;
        }
        
        // Add emoji representation
        if (entry.moodLabels && entry.moodLabels.length > 0) {
          existingDataPoint.moods = entry.moodLabels;
        }
      }
    });
    
    return emptyData;
  };

  const data = processEntriesData();

  // Determine if we have any data to show
  const hasData = data.some(d => d.value !== null);
  
  if (!hasData) {
    return null;
  }

  const config = {
    mood: {
      label: "Mood",
      theme: {
        light: "#8a63d2",  // Using the cycle-lavender color
        dark: "#a78bdf",
      },
    },
  };

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ChartContainer config={config}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <XAxis 
                dataKey="displayDate" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => {
                  const labels = ['', 'Very Sad', 'Sad', 'Neutral', 'Good', 'Happy', 'Very Happy'];
                  return value >= 1 && value <= 6 ? labels[value] : '';
                }}
                domain={[1, 6]}
                ticks={[1, 2, 3, 4, 5, 6]}
                strokeOpacity={0.4}
                fontSize={10}
              />
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-md border bg-background p-2 shadow-md">
                        <div className="text-xs font-semibold">{data.displayDate}</div>
                        {data.value !== null ? (
                          <div className="text-xs">
                            {data.moods ? (
                              <div className="flex flex-col gap-1">
                                {data.moods.map((mood: string, index: number) => (
                                  <span key={index}>{mood}</span>
                                ))}
                              </div>
                            ) : (
                              <span>
                                {data.value <= 1 ? 'Very Sad' : 
                                 data.value <= 2 ? 'Sad' :
                                 data.value <= 3 ? 'Neutral' :
                                 data.value <= 4 ? 'Good' :
                                 data.value <= 5 ? 'Happy' : 'Very Happy'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">No data</div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-mood)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
              <ReferenceLine y={3} stroke="#888888" strokeDasharray="3 3" strokeOpacity={0.4} />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodGraph;
