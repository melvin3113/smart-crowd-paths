import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star, Users } from 'lucide-react';
import { Recommendation } from '@/types/tourist';

interface RecommendationPanelProps {
  recommendations: Recommendation[];
  onSpotSelect: (spotId: string) => void;
  isLoading?: boolean;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendations,
  onSpotSelect,
  isLoading = false
}) => {
  const getCrowdColor = (crowdLevel: string): string => {
    switch (crowdLevel) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'very-high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCrowdIcon = (crowdLevel: string): string => {
    switch (crowdLevel) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'very-high': return '🔴';
      default: return '⚪';
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-primary" />
          Smart Recommendations
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on crowd analysis and your preferences
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {recommendations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recommendations available</p>
              <p className="text-sm">Try adjusting your preferences</p>
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {recommendations.map((rec, index) => (
                <Card 
                  key={rec.spot.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/20"
                  onClick={() => onSpotSelect(rec.spot.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">
                          #{index + 1} {rec.spot.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {rec.spot.description}
                        </p>
                      </div>
                      {rec.spot.imageUrl && (
                        <img 
                          src={rec.spot.imageUrl} 
                          alt={rec.spot.name}
                          className="w-12 h-12 rounded object-cover ml-3"
                        />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCrowdColor(rec.spot.crowdDensity)}`}
                      >
                        {getCrowdIcon(rec.spot.crowdDensity)} {rec.spot.crowdDensity.replace('-', ' ')}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {rec.spot.category}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{rec.spot.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{rec.estimatedTravelTime}min walk</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {rec.reason}
                    </p>

                    <Button 
                      size="sm" 
                      className="w-full text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpotSelect(rec.spot.id);
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationPanel;