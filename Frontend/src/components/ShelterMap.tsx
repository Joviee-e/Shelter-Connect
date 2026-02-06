import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shelter, isShelterOpen, getAvailabilityStatus } from '@/data/shelters';

interface ShelterMapProps {
  shelters: Shelter[];
  userLocation: { latitude: number; longitude: number };
  onShelterClick?: (shelter: Shelter) => void;
  selectedShelterId?: string;
}

// Custom marker icons
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    html: `
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 11.25 14.5 23.25 15.09 23.75a1.5 1.5 0 001.82 0C17.5 39.25 32 27.25 32 16c0-8.837-7.163-16-16-16z" fill="${color}"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <path d="M16 10l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5L16 10z" fill="${color}"/>
      </svg>
    `,
    className: 'custom-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

const userIcon = L.divIcon({
  html: `
    <div style="
      width: 20px; 
      height: 20px; 
      background: hsl(187, 70%, 42%); 
      border: 3px solid white;
      border-radius: 50%; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  className: 'user-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function ShelterMap({ shelters, userLocation, onShelterClick, selectedShelterId }: ShelterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [userLocation.latitude, userLocation.longitude],
      zoom: 13,
      zoomControl: true,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Create markers layer group
    markersRef.current = L.layerGroup().addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when shelters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    // Add user location marker
    L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
      .addTo(markersRef.current)
      .bindPopup('<strong>You are here</strong>');

    // Add shelter markers
    shelters.forEach((shelter) => {
      const isOpen = isShelterOpen(shelter);
      const availability = getAvailabilityStatus(shelter);
      
      let color = 'hsl(160, 55%, 40%)'; // Green - available
      if (!isOpen || availability === 'none') {
        color = 'hsl(0, 75%, 60%)'; // Red - closed/full
      } else if (availability === 'low') {
        color = 'hsl(38, 92%, 50%)'; // Orange - low availability
      }

      const marker = L.marker([shelter.latitude, shelter.longitude], {
        icon: createMarkerIcon(color),
      });

      marker.bindPopup(`
        <div style="min-width: 150px;">
          <strong style="font-size: 14px;">${shelter.name}</strong>
          <div style="color: ${isOpen ? 'hsl(160, 55%, 40%)' : 'hsl(0, 75%, 60%)'}; font-size: 12px; margin-top: 4px;">
            ${isOpen ? '● Open' : '● Closed'}
          </div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">
            ${shelter.available_beds} beds available
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onShelterClick) {
          onShelterClick(shelter);
        }
      });

      marker.addTo(markersRef.current!);
    });

    // Fit bounds to show all markers
    if (shelters.length > 0) {
      const bounds = L.latLngBounds([
        [userLocation.latitude, userLocation.longitude],
        ...shelters.map(s => [s.latitude, s.longitude] as [number, number]),
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [shelters, userLocation, onShelterClick]);

  // Center on selected shelter
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedShelterId) return;

    const shelter = shelters.find(s => s.id === selectedShelterId);
    if (shelter) {
      mapInstanceRef.current.setView([shelter.latitude, shelter.longitude], 15);
    }
  }, [selectedShelterId, shelters]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md"
      style={{ zIndex: 0 }}
    />
  );
}
