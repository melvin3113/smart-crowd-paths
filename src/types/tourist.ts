export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  category: 'monument' | 'museum' | 'park' | 'restaurant' | 'shopping' | 'entertainment';
  location: {
    lat: number;
    lng: number;
  };
  crowdDensity: 'low' | 'medium' | 'high' | 'very-high';
  rating: number;
  estimatedVisitTime: number; // in minutes
  openingHours: {
    open: string;
    close: string;
  };
  imageUrl?: string;
  tags: string[];
}

export interface UserPreferences {
  categories: string[];
  maxCrowdLevel: 'low' | 'medium' | 'high' | 'very-high';
  maxTravelDistance: number; // in km
  preferredVisitTime: number; // in minutes
}

export interface Recommendation {
  spot: TouristSpot;
  score: number;
  reason: string;
  estimatedTravelTime: number;
}