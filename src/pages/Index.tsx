import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, MapPin, Clock, Star, Users, Navigation } from 'lucide-react';
import { toast } from 'sonner';

import Map from '@/components/GoogleMap';
import RecommendationPanel from '@/components/RecommendationPanel';
import UserPreferences from '@/components/UserPreferences';

import { TouristSpot, UserPreferences as UserPreferencesType, Recommendation } from '@/types/tourist';
import { mockTouristSpots } from '@/data/mockTouristSpots';
import { CrowdAnalysisService } from '@/services/crowdAnalysisService';
import { RecommendationService } from '@/services/recommendationService';

const Index = () => {
  const [spots] = useState<TouristSpot[]>(mockTouristSpots);
  const [crowdData, setCrowdData] = useState(new Map<string, string>());
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferencesType>({
    categories: ['park', 'museum'],
    maxCrowdLevel: 'medium',
    maxTravelDistance: 5,
    preferredVisitTime: 120
  });
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const crowdService = CrowdAnalysisService.getInstance();
  const recommendationService = RecommendationService.getInstance();

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ lat: 40.7589, lng: -73.9851 });
          toast.info('Using default location.');
        }
      );
    } else {
      setUserLocation({ lat: 40.7589, lng: -73.9851 });
    }
  }, []);

  // Initialize crowd analysis
  useEffect(() => {
    const analyzeCrowds = async () => {
      const newCrowdData = new Map<string, string>();
      
      for (const spot of spots) {
        const density = await crowdService.analyzeCrowdDensity(spot);
        newCrowdData.set(spot.id, density);
      }
      
      setCrowdData(newCrowdData);
      setLastUpdate(new Date());
    };

    analyzeCrowds();
  }, [spots]);

  // Generate recommendations
  useEffect(() => {
    if (!userLocation || crowdData.size === 0) return;

    setIsLoadingRecommendations(true);
    
    const recs = recommendationService.generateRecommendations(
      userLocation,
      spots,
      preferences,
      crowdData
    );
    
    setRecommendations(recs);
    setIsLoadingRecommendations(false);
  }, [userLocation, preferences, crowdData, spots]);

  const handleSpotClick = (spot: TouristSpot) => {
    setSelectedSpot(spot);
  };

  const handleSpotSelect = (spotId: string) => {
    const spot = spots.find(s => s.id === spotId);
    if (spot) {
      setSelectedSpot(spot);
    }
  };

  const handleRefreshCrowdData = async () => {
    toast.info('Refreshing...');
    const newCrowdData = new Map<string, string>();
    
    for (const spot of spots) {
      const density = await crowdService.analyzeCrowdDensity(spot);
      newCrowdData.set(spot.id, density);
    }
    
    setCrowdData(newCrowdData);
    setLastUpdate(new Date());
    toast.success('Updated!');
  };

  return (
    <div className="h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">SmartCrowd</h1>
            <p className="text-sm text-muted-foreground">
              AI-powered tourist recommendations
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshCrowdData}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Map */}
        <div className="flex-1 relative">
          <Map
            spots={spots}
            crowdData={crowdData}
            onSpotClick={handleSpotClick}
            userLocation={userLocation}
          />
        </div>

        {/* Recommendations Panel */}
        <div className="w-96 border-l border-border bg-card">
          <RecommendationPanel
            recommendations={recommendations}
            onSpotSelect={handleSpotSelect}
            isLoading={isLoadingRecommendations}
          />
        </div>
      </div>

      {/* User Preferences */}
      <UserPreferences
        preferences={preferences}
        onPreferencesChange={setPreferences}
        isOpen={preferencesOpen}
        onToggle={() => setPreferencesOpen(!preferencesOpen)}
      />
    </div>
  );
};

export default Index;