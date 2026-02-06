import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Navigation, 
  Phone, 
  Share2, 
  MapPin, 
  Clock, 
  Users,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { OfflineBanner } from '@/components/OfflineBanner';
import { shelters, calculateDistance, isShelterOpen, formatDistance } from '@/data/shelters';
import { useGeolocation } from '@/hooks/useGeolocation';

const Emergency = () => {
  const navigate = useNavigate();
  const { coordinates, requestLocation, useDefaultLocation, latitude, longitude } = useGeolocation();

  // Auto-detect location on mount
  useEffect(() => {
    if (latitude === null) {
      requestLocation();
      const timeout = setTimeout(() => {
        if (latitude === null) {
          useDefaultLocation();
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [latitude, requestLocation, useDefaultLocation]);

  // Find top 3 nearest available shelters
  const nearestShelters = useMemo(() => {
    return shelters
      .filter(s => isShelterOpen(s) && s.available_beds > 0)
      .map(shelter => ({
        shelter,
        distance: calculateDistance(
          coordinates.latitude,
          coordinates.longitude,
          shelter.latitude,
          shelter.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [coordinates]);

  // Best shelter = nearest one
  const bestShelter = nearestShelters[0] || null;

  const handleNavigate = () => {
    if (!bestShelter) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bestShelter.shelter.latitude},${bestShelter.shelter.longitude}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    if (!bestShelter) return;
    window.location.href = `tel:${bestShelter.shelter.phone}`;
  };

  const handleShareLocation = async () => {
    const shareData = {
      title: 'My Location - ShelterConnect',
      text: `I need help finding shelter. My location: ${coordinates.latitude}, ${coordinates.longitude}`,
      url: `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareData.text);
      alert('Location copied to clipboard!');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="page-container bg-emergency/5 min-h-screen">
      <OfflineBanner />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-emergency safe-area-top">
        <div className="container flex items-center h-14 px-4">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl text-emergency-foreground/80 hover:text-emergency-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <AlertTriangle className="w-5 h-5 text-emergency-foreground" />
            <span className="font-bold text-emergency-foreground">Emergency Mode</span>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 flex flex-col min-h-[calc(100vh-3.5rem)]">
        {bestShelter ? (
          <>
            {/* Best Shelter */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Best shelter for you right now
                </p>
              </div>

              <div className="bg-card rounded-3xl p-6 shadow-xl border border-border/50 mb-6">
                <h1 className="text-2xl font-bold text-center mb-4">
                  {bestShelter.shelter.name}
                </h1>

                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{bestShelter.shelter.address}</span>
                </div>

                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {formatDistance(bestShelter.distance)}
                    </div>
                    <div className="text-sm text-muted-foreground">away</div>
                  </div>

                  <div className="w-px h-12 bg-border" />

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-accent">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">Open</span>
                    </div>
                    <div className="text-sm text-muted-foreground">now</div>
                  </div>

                  <div className="w-px h-12 bg-border" />

                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Users className="w-5 h-5 text-accent" />
                      <span className="font-bold text-accent">
                        {bestShelter.shelter.available_beds}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">beds</div>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  {bestShelter.shelter.open_hours}
                </p>
              </div>
            </div>

            {/* Other Nearby Shelters */}
            {nearestShelters.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3 text-center">
                  Other nearby shelters
                </h3>

                <div className="space-y-3">
                  {nearestShelters.slice(1).map(({ shelter, distance }) => (
                    <div
                      key={shelter.id}
                      className="bg-card rounded-xl p-4 border border-border/50 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{shelter.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistance(distance)} away • {shelter.available_beds} beds
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`,
                            '_blank'
                          )
                        }
                        className="text-primary text-sm font-semibold"
                      >
                        Navigate
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleNavigate}
                className="w-full py-5 text-lg font-bold rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-3"
              >
                <Navigation className="w-6 h-6" />
                Navigate Now
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleCall}
                  className="flex-1 py-4 rounded-xl bg-accent text-accent-foreground flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Shelter
                </button>

                <button
                  onClick={handleShareLocation}
                  className="flex-1 py-4 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share Location
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-10 h-10 text-emergency mb-4" />
            <h2 className="text-xl font-bold mb-2">No Available Shelters</h2>
            <p className="text-muted-foreground mb-6">
              All nearby shelters are currently full or closed.
            </p>
            <a
              href="tel:911"
              className="py-4 px-6 rounded-xl bg-emergency text-emergency-foreground font-bold"
            >
              Call 911
            </a>
          </div>
        )}

        <div className="text-center pt-6 pb-4">
          <p className="text-xs text-muted-foreground">
            Stay calm • Help is near
          </p>
        </div>
      </main>
    </div>
  );
};

export default Emergency;
