
import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CycleData } from '@/lib/types';
import { getDayInfo, getPhaseColorClass, getMoonPhaseEmoji } from '@/lib/cycleUtils';
import { stringToDate } from '@/lib/dateUtils';

interface CalendarViewProps {
  cycleData: CycleData;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  cycleData, 
  onSelectDate,
  selectedDate 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create calendar days with proper formatting
  const calendarDays = daysInMonth.map(day => {
    const dayInfo = getDayInfo(cycleData, day);
    const isToday = isSameDay(day, new Date());
    const isSelected = isSameDay(day, selectedDate);
    
    return {
      date: day,
      dayOfMonth: format(day, 'd'),
      isCurrentMonth: isSameMonth(day, currentMonth),
      isToday,
      isSelected,
      ...dayInfo
    };
  });
  
  // Organize in weeks for rendering
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prevMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {daysOfWeek.map(day => (
            <div key={day} className="font-medium text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const phaseColorClass = getPhaseColorClass(day.phase);
            return (
              <button
                key={i}
                onClick={() => onSelectDate(day.date)}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded 
                  text-sm relative p-1 transition-all
                  ${day.isToday ? 'font-bold' : ''}
                  ${day.isSelected ? 'ring-2 ring-cycle-lavender' : ''}
                  ${phaseColorClass} hover:opacity-80
                `}
                title={day.detailedPhase ? `${day.detailedPhase}: ${day.cognition}` : ''}
              >
                <span>{day.dayOfMonth}</span>
                <span className="text-xs">
                  {getMoonPhaseEmoji(cycleData, day.date)}
                </span>
                {day.isMenstruation && (
                  <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
