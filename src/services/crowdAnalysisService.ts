import { TouristSpot } from '@/types/tourist';

export class CrowdAnalysisService {
  private static instance: CrowdAnalysisService;
  private crowdData: Map<string, { density: string; lastUpdated: Date }> = new Map();

  static getInstance(): CrowdAnalysisService {
    if (!CrowdAnalysisService.instance) {
      CrowdAnalysisService.instance = new CrowdAnalysisService();
    }
    return CrowdAnalysisService.instance;
  }

  // Simulate crowd analysis based on time of day and day of week
  analyzeCrowdDensity(spot: TouristSpot): Promise<'low' | 'medium' | 'high' | 'very-high'> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const hour = now.getHours();
        const dayOfWeek = now.getDay();
        
        let baseDensity = spot.crowdDensity;
        
        // Peak hours (10-16) increase crowd density
        if (hour >= 10 && hour <= 16) {
          baseDensity = this.increaseDensity(baseDensity);
        }
        
        // Weekends increase crowd density
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          baseDensity = this.increaseDensity(baseDensity);
        }
        
        // Add some randomness to simulate real-time changes
        if (Math.random() > 0.7) {
          baseDensity = Math.random() > 0.5 
            ? this.increaseDensity(baseDensity) 
            : this.decreaseDensity(baseDensity);
        }
        
        this.crowdData.set(spot.id, {
          density: baseDensity,
          lastUpdated: now
        });
        
        resolve(baseDensity);
      }, Math.random() * 1000 + 500); // Simulate API delay
    });
  }

  private increaseDensity(density: 'low' | 'medium' | 'high' | 'very-high'): 'low' | 'medium' | 'high' | 'very-high' {
    const levels: ('low' | 'medium' | 'high' | 'very-high')[] = ['low', 'medium', 'high', 'very-high'];
    const currentIndex = levels.indexOf(density);
    return levels[Math.min(currentIndex + 1, levels.length - 1)];
  }

  private decreaseDensity(density: 'low' | 'medium' | 'high' | 'very-high'): 'low' | 'medium' | 'high' | 'very-high' {
    const levels: ('low' | 'medium' | 'high' | 'very-high')[] = ['low', 'medium', 'high', 'very-high'];
    const currentIndex = levels.indexOf(density);
    return levels[Math.max(currentIndex - 1, 0)];
  }

  getCachedDensity(spotId: string): { density: string; lastUpdated: Date } | null {
    return this.crowdData.get(spotId) || null;
  }

  // Simulate real-time updates
  startRealTimeUpdates(spots: TouristSpot[], callback: (updates: Map<string, string>) => void): () => void {
    const interval = setInterval(async () => {
      const updates = new Map<string, string>();
      
      // Update a random subset of spots
      const spotsToUpdate = spots.filter(() => Math.random() > 0.7);
      
      for (const spot of spotsToUpdate) {
        const newDensity = await this.analyzeCrowdDensity(spot);
        updates.set(spot.id, newDensity);
      }
      
      if (updates.size > 0) {
        callback(updates);
      }
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }
}