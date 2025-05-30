
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { CycleData } from '@/lib/types';
import { getDayInfo } from '@/lib/cycleUtils';
import { format, subDays } from 'date-fns';

interface HormoneGraphProps {
  cycleData: CycleData;
}

const HormoneGraph: React.FC<HormoneGraphProps> = ({ cycleData }) => {
  // Generate hormone data for the past 28 days
  const generateHormoneData = () => {
    const data = [];
    for (let i = 27; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayInfo = getDayInfo(cycleData, date);
      
      // Simulate hormone levels based on cycle phase
      let estradiol = 50; // baseline
      let progesterone = 1; // baseline
      
      switch (dayInfo.phase) {
        case 'menstrual':
          estradiol = 30 + Math.random() * 20;
          progesterone = 1 + Math.random() * 2;
          break;
        case 'follicular':
          estradiol = 50 + (dayInfo.dayOfCycle * 10) + Math.random() * 20;
          progesterone = 1 + Math.random() * 2;
          break;
        case 'ovulation':
          estradiol = 200 + Math.random() * 100;
          progesterone = 2 + Math.random() * 3;
          break;
        case 'luteal':
          estradiol = 150 - (dayInfo.dayOfCycle - 14) * 5 + Math.random() * 30;
          progesterone = 5 + (dayInfo.dayOfCycle - 14) * 2 + Math.random() * 5;
          break;
      }
      
      data.push({
        date: format(date, 'MMM dd'),
        estradiol: Math.round(estradiol),
        progesterone: Math.round(progesterone),
        phase: dayInfo.phase
      });
    }
    return data;
  };

  const data = generateHormoneData();

  const config = {
    estradiol: {
      label: "Estradiol (pg/mL)",
      theme: {
        light: "#ff6b9d",
        dark: "#ff6b9d",
      },
    },
    progesterone: {
      label: "Progesterone (ng/mL)",
      theme: {
        light: "#4ecdc4",
        dark: "#4ecdc4",
      },
    },
  };

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Hormone Levels</CardTitle>
        <p className="text-sm text-muted-foreground">Estimated levels based on cycle phase</p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ChartContainer config={config}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-md border bg-background p-2 shadow-md">
                        <p className="text-sm font-semibold">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="estradiol"
                stroke="var(--color-estradiol)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Estradiol"
              />
              <Line
                type="monotone"
                dataKey="progesterone"
                stroke="var(--color-progesterone)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Progesterone"
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HormoneGraph;
