import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TouristSpot } from '@/types/tourist';

interface MapProps {
  spots: TouristSpot[];
  crowdData: Map<string, string>;
  onSpotClick: (spot: TouristSpot) => void;
  userLocation?: { lat: number; lng: number };
}

const Map: React.FC<MapProps> = ({ 
  spots, 
  crowdData, 
  onSpotClick, 
  userLocation 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Using a demo Mapbox token (you'll need to replace with your own for production)
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: userLocation ? [userLocation.lng, userLocation.lat] : [-73.9851, 40.7589], // NYC default
      zoom: 13,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => map.current?.remove();
  }, [userLocation]);

  // Add user location marker
  useEffect(() => {
    if (!mapLoaded || !userLocation || !map.current) return;

    const userMarker = new mapboxgl.Marker({ color: '#4285F4' })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setText('Your Location'))
      .addTo(map.current);

    return () => {
      userMarker.remove();
    };
  }, [mapLoaded, userLocation]);

  // Update markers when spots or crowd data changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    spots.forEach(spot => {
      const crowdLevel = crowdData.get(spot.id) || spot.crowdDensity;
      const color = getCrowdColor(crowdLevel);
      
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = color;
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '14px';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      el.innerHTML = getCategoryIcon(spot.category);

      el.addEventListener('click', () => onSpotClick(spot));

      const marker = new mapboxgl.Marker(el)
        .setLngLat([spot.location.lng, spot.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-3 max-w-xs">
                <h3 class="font-semibold text-lg mb-1">${spot.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${spot.description}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs px-2 py-1 rounded" style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}40">
                    ${crowdLevel.replace('-', ' ').toUpperCase()} CROWD
                  </span>
                  <span class="text-sm font-medium">⭐ ${spot.rating}</span>
                </div>
              </div>
            `)
        )
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, spots, crowdData, onSpotClick]);

  if (!mapLoaded) {
    return (
      <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />;
};

const getCrowdColor = (crowdLevel: string): string => {
  switch (crowdLevel) {
    case 'low': return '#22c55e';
    case 'medium': return '#eab308';
    case 'high': return '#f97316';
    case 'very-high': return '#ef4444';
    default: return '#6b7280';
  }
};

const getCategoryIcon = (category: string): string => {
  const icons = {
    monument: '🏛️',
    museum: '🖼️',
    park: '🌳',
    restaurant: '🍽️',
    shopping: '🛍️',
    entertainment: '🎭'
  };
  return icons[category as keyof typeof icons] || '📍';
};

export default Map;