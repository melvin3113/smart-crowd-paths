import { TouristSpot } from '@/types/tourist';

export const mockTouristSpots: TouristSpot[] = [
  {
    id: '1',
    name: 'Central Park',
    description: 'Beautiful urban park perfect for walking and relaxation',
    category: 'park',
    location: { lat: 40.7829, lng: -73.9654 },
    crowdDensity: 'high',
    rating: 4.7,
    estimatedVisitTime: 120,
    openingHours: { open: '06:00', close: '23:00' },
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    tags: ['nature', 'walking', 'photography']
  },
  {
    id: '2',
    name: 'Museum of Modern Art',
    description: 'World-renowned modern art collection',
    category: 'museum',
    location: { lat: 40.7614, lng: -73.9776 },
    crowdDensity: 'medium',
    rating: 4.6,
    estimatedVisitTime: 180,
    openingHours: { open: '10:00', close: '18:00' },
    imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400',
    tags: ['art', 'culture', 'indoor']
  },
  {
    id: '3',
    name: 'Brooklyn Bridge',
    description: 'Iconic bridge with stunning city views',
    category: 'monument',
    location: { lat: 40.7061, lng: -73.9969 },
    crowdDensity: 'very-high',
    rating: 4.8,
    estimatedVisitTime: 60,
    openingHours: { open: '00:00', close: '23:59' },
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=400',
    tags: ['architecture', 'views', 'walking']
  },
  {
    id: '4',
    name: 'High Line Park',
    description: 'Elevated park built on former railway tracks',
    category: 'park',
    location: { lat: 40.7480, lng: -74.0048 },
    crowdDensity: 'low',
    rating: 4.5,
    estimatedVisitTime: 90,
    openingHours: { open: '07:00', close: '22:00' },
    imageUrl: 'https://images.unsplash.com/photo-1572204337004-14c0a1ff8e6b?w=400',
    tags: ['nature', 'unique', 'walking']
  },
  {
    id: '5',
    name: 'Times Square',
    description: 'Vibrant commercial and entertainment hub',
    category: 'entertainment',
    location: { lat: 40.7580, lng: -73.9855 },
    crowdDensity: 'very-high',
    rating: 4.0,
    estimatedVisitTime: 45,
    openingHours: { open: '00:00', close: '23:59' },
    imageUrl: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?w=400',
    tags: ['entertainment', 'shopping', 'nightlife']
  },
  {
    id: '6',
    name: 'The Frick Collection',
    description: 'Intimate art museum in historic mansion',
    category: 'museum',
    location: { lat: 40.7710, lng: -73.9674 },
    crowdDensity: 'low',
    rating: 4.4,
    estimatedVisitTime: 120,
    openingHours: { open: '10:00', close: '18:00' },
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    tags: ['art', 'historic', 'quiet']
  }
];