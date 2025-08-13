import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Settings, MapPin, Clock, Users } from 'lucide-react';
import { UserPreferences as UserPreferencesType } from '@/types/tourist';

interface UserPreferencesProps {
  preferences: UserPreferencesType;
  onPreferencesChange: (preferences: UserPreferencesType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const categories = [
  { id: 'monument', label: 'Monuments', icon: '🏛️' },
  { id: 'museum', label: 'Museums', icon: '🖼️' },
  { id: 'park', label: 'Parks', icon: '🌳' },
  { id: 'restaurant', label: 'Restaurants', icon: '🍽️' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎭' }
];

const crowdLevels = [
  { id: 'low', label: 'Low Crowds', icon: '🟢' },
  { id: 'medium', label: 'Medium Crowds', icon: '🟡' },
  { id: 'high', label: 'High Crowds', icon: '🟠' },
  { id: 'very-high', label: 'Very High Crowds', icon: '🔴' }
];

const UserPreferences: React.FC<UserPreferencesProps> = ({
  preferences,
  onPreferencesChange,
  isOpen,
  onToggle
}) => {
  const [localPreferences, setLocalPreferences] = useState(preferences);

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = localPreferences.categories.includes(categoryId)
      ? localPreferences.categories.filter(c => c !== categoryId)
      : [...localPreferences.categories, categoryId];
    
    setLocalPreferences({
      ...localPreferences,
      categories: newCategories
    });
  };

  const handleCrowdLevelChange = (level: string) => {
    setLocalPreferences({
      ...localPreferences,
      maxCrowdLevel: level as any
    });
  };

  const handleDistanceChange = (distance: number[]) => {
    setLocalPreferences({
      ...localPreferences,
      maxTravelDistance: distance[0]
    });
  };

  const handleVisitTimeChange = (time: number[]) => {
    setLocalPreferences({
      ...localPreferences,
      preferredVisitTime: time[0]
    });
  };

  const handleSave = () => {
    onPreferencesChange(localPreferences);
    onToggle();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 shadow-lg"
      >
        <Settings className="w-4 h-4 mr-2" />
        Preferences
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 right-4 w-80 z-50 shadow-xl max-h-[90vh] overflow-y-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5 text-primary" />
            Your Preferences
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <Label className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4" />
            Interested Categories
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={localPreferences.categories.includes(category.id) ? 'default' : 'outline'}
                className="cursor-pointer p-2 justify-center hover:bg-primary/20"
                onClick={() => handleCategoryToggle(category.id)}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Max Crowd Level */}
        <div>
          <Label className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4" />
            Maximum Crowd Level
          </Label>
          <div className="space-y-2">
            {crowdLevels.map((level) => (
              <div
                key={level.id}
                className={`p-2 rounded border cursor-pointer transition-colors ${
                  localPreferences.maxCrowdLevel === level.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => handleCrowdLevelChange(level.id)}
              >
                <div className="flex items-center gap-2">
                  <span>{level.icon}</span>
                  <span className="text-sm">{level.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Max Travel Distance */}
        <div>
          <Label className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4" />
            Max Travel Distance: {localPreferences.maxTravelDistance}km
          </Label>
          <Slider
            value={[localPreferences.maxTravelDistance]}
            onValueChange={handleDistanceChange}
            max={10}
            min={0.5}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.5km</span>
            <span>10km</span>
          </div>
        </div>

        {/* Preferred Visit Time */}
        <div>
          <Label className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" />
            Preferred Visit Time: {localPreferences.preferredVisitTime}min
          </Label>
          <Slider
            value={[localPreferences.preferredVisitTime]}
            onValueChange={handleVisitTimeChange}
            max={300}
            min={30}
            step={15}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>30min</span>
            <span>5hrs</span>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;