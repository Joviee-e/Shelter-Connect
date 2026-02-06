import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Map } from 'lucide-react';

import { Header } from '@/components/Header';
import { OfflineBanner } from '@/components/OfflineBanner';
import { ShelterCard } from '@/components/ShelterCard';
import { ShelterMap } from '@/components/ShelterMap';
import { FilterBar, FilterType } from '@/components/FilterBar';
import { calculateDistance, isShelterOpen } from '@/data/shelters';
import { useGeolocation } from '@/hooks/useGeolocation';

const ShelterList = () => {
  const navigate = useNavigate();
  const { coordinates } = useGeolocation();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [selectedShelterId, setSelectedShelterId] = useState<string | undefined>();

  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH SHELTERS FROM BACKEND
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/public/shelters")
      .then(res => res.json())
      .then(data => {
        const formatted = data.data.map((shelter: any) => ({
          // Map backend fields to frontend interface
          id: shelter._id,
          capacity: shelter.total_beds || 0,           // ✅ Map total_beds → capacity
          available_beds: shelter.available_beds || 0,
          open_hours: shelter.opening_hours || "24/7", // ✅ Map opening_hours → open_hours
          is_24_hour: shelter.opening_hours === "24/7",// ✅ Derive from opening_hours
          last_updated: shelter.updated_at,            // ✅ Map updated_at → last_updated

          // Copy other fields with defaults
          name: shelter.name,
          address: shelter.address,
          latitude: shelter.latitude,
          longitude: shelter.longitude,
          gender: shelter.gender || 'all',
          pet_friendly: shelter.pet_friendly || false,
          accessibility: shelter.accessibility || false,
          languages: shelter.languages || ["English"],
          phone: shelter.phone || "",
          amenities: shelter.amenities || [],
          rules: shelter.rules || []
        }));


        setShelters(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching shelters:", err);
        setLoading(false);
      });
  }, []);

  // Calculate distances and filter shelters
  const processedShelters = useMemo(() => {
    let result = shelters.map(shelter => ({
      shelter,
      distance: coordinates?.latitude
        ? calculateDistance(
          coordinates.latitude,
          coordinates.longitude,
          shelter.latitude,
          shelter.longitude
        )
        : 0
    }));

    // Apply filters
    if (activeFilters.length > 0) {
      result = result.filter(({ shelter }) => {
        return activeFilters.every(filter => {
          switch (filter) {
            case 'open_now':
              return isShelterOpen(shelter);
            case 'family':
              return shelter.gender === 'family';
            case 'accessibility':
              return shelter.accessibility;
            case 'pet_friendly':
              return shelter.pet_friendly;
            default:
              return true;
          }
        });
      });
    }

    // Sort by distance
    return result.sort((a, b) => (a.distance || 0) - (b.distance || 0));

  }, [coordinates, activeFilters, shelters]);

  const handleShelterClick = (shelter: any) => {
    navigate(`/shelter/${shelter.id}`);
  };

  const handleMapShelterClick = (shelter: any) => {
    setSelectedShelterId(shelter.id);
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header title="Loading Shelters..." showBack showHome />
      </div>
    );
  }

  return (
    <div className="page-container bg-background">
      <OfflineBanner />
      <Header title="Find Shelters" showBack showHome />

      <main className="container px-4 py-4">
        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {processedShelters.length} shelters nearby
          </h2>
          <div className="flex rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${viewMode === 'map'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
            >
              <Map className="w-4 h-4" />
              <span className="text-sm font-medium">Map</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterBar activeFilters={activeFilters} onFilterChange={setActiveFilters} />
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="mb-4">
            <ShelterMap
              shelters={processedShelters.map(p => p.shelter)}
              userLocation={coordinates}
              onShelterClick={handleMapShelterClick}
              selectedShelterId={selectedShelterId}
            />
          </div>
        )}

        {/* Shelter List */}
        <div className="space-y-3 pb-4">
          {processedShelters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No shelters match your filters
              </p>
              <button
                onClick={() => setActiveFilters([])}
                className="mt-2 text-primary font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            processedShelters.map(({ shelter, distance }, index) => (
              <div
                key={shelter.id}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleShelterClick(shelter)}
              >
                <ShelterCard shelter={shelter} distance={distance} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ShelterList;
