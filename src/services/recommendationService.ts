import { TouristSpot, UserPreferences, Recommendation } from '@/types/tourist';

export class RecommendationService {
  private static instance: RecommendationService;

  static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  generateRecommendations(
    currentLocation: { lat: number; lng: number },
    allSpots: TouristSpot[],
    preferences: UserPreferences,
    currentCrowdData: Map<string, string>
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    for (const spot of allSpots) {
      const distance = this.calculateDistance(currentLocation, spot.location);
      
      // Skip if too far
      if (distance > preferences.maxTravelDistance) continue;

      const currentCrowd = currentCrowdData.get(spot.id) || spot.crowdDensity;
      
      // Skip if crowd level is too high
      if (!this.isCrowdLevelAcceptable(currentCrowd, preferences.maxCrowdLevel)) continue;

      // Calculate score based on multiple factors
      let score = 0;
      let reasons: string[] = [];

      // Category preference
      if (preferences.categories.includes(spot.category)) {
        score += 30;
        reasons.push(`Matches your interest in ${spot.category}`);
      }

      // Crowd density bonus
      const crowdScore = this.getCrowdScore(currentCrowd);
      score += crowdScore;
      if (crowdScore > 15) {
        reasons.push('Low crowd density for peaceful visit');
      }

      // Rating bonus
      score += spot.rating * 10;

      // Distance penalty (closer is better)
      const distanceScore = Math.max(0, 50 - (distance * 10));
      score += distanceScore;

      // Visit time preference
      if (Math.abs(spot.estimatedVisitTime - preferences.preferredVisitTime) <= 30) {
        score += 20;
        reasons.push('Perfect visit duration for your schedule');
      }

      const estimatedTravelTime = Math.round(distance * 12); // Assume 5 km/h walking speed

      recommendations.push({
        spot,
        score,
        reason: reasons.join('. ') || 'Good match for your preferences',
        estimatedTravelTime
      });
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.degreesToRadians(point2.lat - point1.lat);
    const dLng = this.degreesToRadians(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(point1.lat)) * 
      Math.cos(this.degreesToRadians(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private isCrowdLevelAcceptable(current: string, max: string): boolean {
    const levels = ['low', 'medium', 'high', 'very-high'];
    return levels.indexOf(current) <= levels.indexOf(max);
  }

  private getCrowdScore(crowdLevel: string): number {
    switch (crowdLevel) {
      case 'low': return 25;
      case 'medium': return 15;
      case 'high': return 5;
      case 'very-high': return 0;
      default: return 10;
    }
  }
}