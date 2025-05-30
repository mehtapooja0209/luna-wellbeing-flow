
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TrackingSelectorProps {
  onTrackingChange: (type: string) => void;
}

const TrackingSelector: React.FC<TrackingSelectorProps> = ({ onTrackingChange }) => {
  const [selectedTracking, setSelectedTracking] = useState('general');

  const handleTrackingChange = (value: string) => {
    setSelectedTracking(value);
    onTrackingChange(value);
  };

  return (
    <Card className="shadow-md border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Health Tracking</CardTitle>
        <p className="text-sm text-muted-foreground">Choose what you'd like to track</p>
      </CardHeader>
      <CardContent>
        <Select value={selectedTracking} onValueChange={handleTrackingChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tracking type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Cycle Tracking</SelectItem>
            <SelectItem value="pmdd">PMDD Symptoms</SelectItem>
            <SelectItem value="pcos">PCOS Management</SelectItem>
            <SelectItem value="adhd">ADHD & Hormones</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default TrackingSelector;
