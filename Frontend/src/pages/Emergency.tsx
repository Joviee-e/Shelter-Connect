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
      // Use default if location not available after 3 seconds
      const timeout = setTimeout(() => {
        if (latitude === null) {
          useDefaultLocation();
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [latitude, requestLocation, useDefaultLocation]);

  // Find the best available shelter
  const bestShelter = useMemo(() => {
    const available = shelters
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
      .sort((a, b) => a.distance - b.distance);

    return available[0] || null;
  }, [coordinates]);

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
      } catch (err) {
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
      
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 bg-emergency safe-area-top">
        <div className="container flex items-center h-14 px-4">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl text-emergency-foreground/80 hover:text-emergency-foreground transition-colors touch-manipulation"
            aria-label="Go back"
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
            {/* Best Shelter Card */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-6 animate-fade-in">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Best shelter for you right now
                </p>
              </div>

              <div className="bg-card rounded-3xl p-6 shadow-xl border border-border/50 mb-6 animate-scale-in">
                <h1 className="text-2xl font-bold text-foreground mb-4 text-center">
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
                    <div className="flex items-center justify-center gap-1 text-accent">
                      <Clock className="w-5 h-5" />
                      <span className="text-lg font-semibold">Open</span>
                    </div>
                    <div className="text-sm text-muted-foreground">now</div>
                  </div>
                  
                  <div className="w-px h-12 bg-border" />
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-5 h-5 text-accent" />
                      <span className="text-lg font-bold text-accent">
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

            {/* Action Buttons - Large and accessible */}
            <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={handleNavigate}
                className="w-full py-5 px-6 text-lg font-bold rounded-2xl 
                         bg-primary text-primary-foreground shadow-lg
                         flex items-center justify-center gap-3
                         active:scale-[0.98] transition-transform touch-manipulation"
              >
                <Navigation className="w-6 h-6" />
                Navigate Now
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleCall}
                  className="flex-1 py-4 px-4 text-base font-semibold rounded-xl 
                           bg-accent text-accent-foreground shadow-md
                           flex items-center justify-center gap-2
                           active:scale-[0.98] transition-transform touch-manipulation"
                >
                  <Phone className="w-5 h-5" />
                  Call Shelter
                </button>

                <button
                  onClick={handleShareLocation}
                  className="flex-1 py-4 px-4 text-base font-semibold rounded-xl 
                           bg-secondary text-secondary-foreground shadow-md
                           flex items-center justify-center gap-2
                           active:scale-[0.98] transition-transform touch-manipulation"
                >
                  <Share2 className="w-5 h-5" />
                  Share Location
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No shelters available */
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emergency/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-emergency" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              No Available Shelters
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xs">
              All nearby shelters are currently full or closed. Please try calling emergency services.
            </p>
            <a
              href="tel:911"
              className="w-full max-w-xs py-4 px-6 text-lg font-bold rounded-xl 
                       bg-emergency text-emergency-foreground shadow-lg
                       flex items-center justify-center gap-3
                       active:scale-[0.98] transition-transform touch-manipulation"
            >
              <Phone className="w-6 h-6" />
              Call 911
            </a>
          </div>
        )}

        {/* Help text */}
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
