
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, Plus, X, Clock } from 'lucide-react';
import { Reminder } from '@/lib/types';
import { addReminder, getRemindersForDate, updateReminder, removeReminder } from '@/lib/dataStorage';
import { toast } from '@/components/ui/sonner';

interface ReminderManagerProps {
  selectedDate: Date;
}

const ReminderManager: React.FC<ReminderManagerProps> = ({ selectedDate }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDescription, setNewDescription] = useState('');
  
  // Load reminders for selected date
  useEffect(() => {
    const dateReminders = getRemindersForDate(selectedDate);
    setReminders(dateReminders);
  }, [selectedDate]);
  
  const handleAddReminder = () => {
    if (!newTitle.trim()) {
      toast("Please enter a title for the reminder");
      return;
    }
    
    const reminder = addReminder(selectedDate, {
      title: newTitle,
      description: newDescription || undefined,
      time: newTime || undefined,
      isCompleted: false
    });
    
    setReminders([...reminders, reminder]);
    setNewTitle('');
    setNewTime('');
    setNewDescription('');
    toast("Reminder added successfully");
  };
  
  const toggleReminderCompletion = (reminderId: string, isCompleted: boolean) => {
    const success = updateReminder(selectedDate, reminderId, { isCompleted });
    
    if (success) {
      setReminders(reminders.map(r => 
        r.id === reminderId ? { ...r, isCompleted } : r
      ));
    }
  };
  
  const deleteReminder = (reminderId: string) => {
    const success = removeReminder(selectedDate, reminderId);
    
    if (success) {
      setReminders(reminders.filter(r => r.id !== reminderId));
      toast("Reminder removed");
    }
  };
  
  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Reminders for {format(selectedDate, 'MMMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {reminders.length > 0 ? (
              reminders.map(reminder => (
                <div 
                  key={reminder.id}
                  className="flex items-start gap-2 p-2 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <Button
                    variant={reminder.isCompleted ? "default" : "outline"}
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => toggleReminderCompletion(reminder.id, !reminder.isCompleted)}
                  >
                    {reminder.isCompleted && <Check className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${reminder.isCompleted ? 'line-through text-gray-500' : ''}`}>
                        {reminder.title}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {reminder.time && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{reminder.time}</span>
                      </div>
                    )}
                    {reminder.description && (
                      <p className="text-sm text-gray-600">{reminder.description}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-2">No reminders for this day</p>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="font-medium">Add Reminder</h3>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Reminder title"
              className="mb-2"
            />
            <div className="flex gap-2 mb-2">
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="Time (optional)"
                className="w-1/2"
              />
            </div>
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)"
              className="mb-2"
            />
            <Button 
              onClick={handleAddReminder} 
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Reminder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderManager;
