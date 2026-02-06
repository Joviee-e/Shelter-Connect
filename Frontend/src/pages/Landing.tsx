import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, AlertTriangle, Navigation, Loader2, Building2 } from 'lucide-react';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const navigate = useNavigate();
  const { 
    loading, 
    error, 
    permissionDenied, 
    latitude, 
    longitude,
    requestLocation, 
    useDefaultLocation 
  } = useGeolocation();
  
  const [manualCity, setManualCity] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const handleFindShelters = () => {
    if (latitude && longitude) {
      navigate('/shelters');
    } else if (permissionDenied) {
      setShowManualInput(true);
    } else {
      requestLocation();
    }
  };

  const handleEmergencyMode = () => {
    if (latitude && longitude) {
      navigate('/emergency');
    } else {
      // Use default location for emergency mode
      useDefaultLocation();
      setTimeout(() => navigate('/emergency'), 100);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, use default NYC location
    useDefaultLocation();
    navigate('/shelters');
  };

  const hasLocation = latitude !== null && longitude !== null;

  return (
    <div className="min-h-screen bg-sky-100/60 backdrop-blur-xl">




      <OfflineBanner />
      
      {/* Custom Header with NGO Login */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 safe-area-top">
        <div className="w-full flex items-center justify-between h-14 px-4">
<div className="flex items-center gap-2">
  <img
    src="/icons/logo - Copy.png"
    alt="ShelterConnect Logo"
    className="w-8 h-8 object-contain"
  />
  <span className="font-bold text-lg">ShelterConnect</span>
</div>

          <Button variant="outline" size="sm" asChild>
            <Link to="/auth" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">NGO / Shelter Login</span>
              <span className="sm:hidden">NGO Login</span>
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="container px-4 py-8 flex flex-col min-h-[calc(100vh-3.5rem)]">
        {/* Hero Section */}
<div
  className="
    flex-1 flex flex-col justify-center items-center text-center
    max-w-md mx-auto
    px-8 py-10
  "
>


          <div className="animate-fade-in">
 {/* Logo */}
<div className="w-200 h-200 mx-auto mb-6 flex items-center justify-center">
  <img
    src="/icons/logo.png"
    alt="ShelterConnect Logo"
    className="w-full h-full object-contain"
  />
</div>


            <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">

            </h1>
            <p className="text-base text-muted-foreground mb-10">
              Find safe shelter near you in seconds
            </p>  
          </div>

          {/* Location Status */}
          <div className="w-full mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-accent py-3">
  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />

                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Getting your location...</span>
              </div>
            ) : hasLocation ? (
              <div className="flex items-center justify-center gap-2 text-accent py-3">
                <Navigation className="w-5 h-5" />
                <span className="font-medium">Location ready</span>
              </div>
            ) : error ? (
              <div className="bg-warning/10  rounded-xl p-3">
                <p className="text-sm text-warning">{error}</p>
              </div>
            ) : null}
          </div>

          {/* Manual City Input */}
          {showManualInput && (
            <form onSubmit={handleManualSubmit} className="w-full mb-6 animate-scale-in">
              <div className="relative">
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  placeholder="Enter your city or zip code"
                  className="w-full px-4 py-4 pr-24 rounded-xl border-2 border-border bg-background 
                           text-foreground placeholder:text-muted-foreground
                           focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 
                           px-4 py-2 rounded-lg bg-primary text-primary-foreground
                           font-medium text-sm"
                >
                  Search
                </button>
              </div>
            </form>
          )}
          {/* Action Buttons */}
          <div className="w-full space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={handleFindShelters}
              className="btn-primary-large flex items-center justify-center gap-3"
            >
              <MapPin className="w-6 h-6" />
              Find Shelters
            </button>

            <button
              onClick={handleEmergencyMode}
              className="btn-emergency flex items-center justify-center gap-3"
            >
              <AlertTriangle className="w-6 h-6" />
              Emergency Mode
            </button>
          </div>

          {/* Denied permission helper */}
          {permissionDenied && !showManualInput && (
            <button
              onClick={() => setShowManualInput(true)}
              className="mt-4 text-sm text-muted-foreground underline"
            >
              Enter location manually
            </button>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 pb-4">
          <p className="text-xs text-muted-foreground">
            Works offline • No account needed
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
