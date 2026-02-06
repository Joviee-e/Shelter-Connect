import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Map } from 'lucide-react';
import { Header } from '@/components/Header';
import { OfflineBanner } from '@/components/OfflineBanner';
import { ShelterCard } from '@/components/ShelterCard';
import { ShelterMap } from '@/components/ShelterMap';
import { FilterBar, FilterType } from '@/components/FilterBar';
import { shelters, Shelter, calculateDistance, isShelterOpen } from '@/data/shelters';
import { useGeolocation } from '@/hooks/useGeolocation';

const ShelterList = () => {
  const navigate = useNavigate();
  const { coordinates } = useGeolocation();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [selectedShelterId, setSelectedShelterId] = useState<string | undefined>();

  // Calculate distances and filter shelters
  const processedShelters = useMemo(() => {
    let result = shelters.map(shelter => ({
      shelter,
      distance: calculateDistance(
        coordinates.latitude,
        coordinates.longitude,
        shelter.latitude,
        shelter.longitude
      ),
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
    return result.sort((a, b) => a.distance - b.distance);
  }, [coordinates, activeFilters]);

  const handleShelterClick = (shelter: Shelter) => {
    navigate(`/shelter/${shelter.id}`);
  };

  const handleMapShelterClick = (shelter: Shelter) => {
    setSelectedShelterId(shelter.id);
  };

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
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                viewMode === 'map' 
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
