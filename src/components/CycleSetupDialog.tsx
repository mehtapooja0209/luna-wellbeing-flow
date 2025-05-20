
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateCycleData } from '@/lib/dataStorage';

interface CycleSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CycleSetupDialog: React.FC<CycleSetupDialogProps> = ({ isOpen, onClose }) => {
  const [lastPeriod, setLastPeriod] = useState<Date>(startOfDay(new Date()));
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  
  const handleSave = () => {
    updateCycleData(
      format(lastPeriod, 'yyyy-MM-dd'),
      cycleLength,
      periodLength
    );
    onClose();
  };
  
  const handleCycleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 21 && value <= 40) {
      setCycleLength(value);
    }
  };
  
  const handlePeriodLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 2 && value <= 10) {
      setPeriodLength(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cycle Setup</DialogTitle>
          <DialogDescription>
            Help us personalize your experience by providing some information about your cycle.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="last-period">First day of your last period</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="last-period"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !lastPeriod && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lastPeriod ? format(lastPeriod, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={lastPeriod}
                  onSelect={(date) => date && setLastPeriod(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cycle-length">Average cycle length (days)</Label>
            <Input
              id="cycle-length"
              type="number"
              min={21}
              max={40}
              value={cycleLength}
              onChange={handleCycleLengthChange}
            />
            <p className="text-xs text-muted-foreground">
              A typical cycle is between 21-40 days long
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="period-length">Average period length (days)</Label>
            <Input
              id="period-length"
              type="number"
              min={2}
              max={10}
              value={periodLength}
              onChange={handlePeriodLengthChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSave}
            className="bg-cycle-lavender hover:bg-cycle-purple"
          >
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CycleSetupDialog;
