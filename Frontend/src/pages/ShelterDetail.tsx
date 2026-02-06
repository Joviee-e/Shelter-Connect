import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  Dog, 
  Accessibility, 
  Globe, 
  Navigation,
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/Header';
import { OfflineBanner } from '@/components/OfflineBanner';
import { shelters, isShelterOpen, getAvailabilityStatus } from '@/data/shelters';
import RequestShelterModal from '@/components/RequestShelterModal';

const ShelterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  const shelter = shelters.find(s => s.id === id);
  
  if (!shelter) {
    return (
      <div className="page-container bg-background">
        <Header title="Shelter Not Found" showBack showHome />
        <main className="container px-4 py-8 text-center">
          <p className="text-muted-foreground">This shelter could not be found.</p>
          <button
            onClick={() => navigate('/shelters')}
            className="mt-4 btn-primary-large"
          >
            Back to Shelters
          </button>
        </main>
      </div>
    );
  }

  const isOpen = isShelterOpen(shelter);
  const availability = getAvailabilityStatus(shelter);

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${shelter.phone}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: shelter.name,
      text: `${shelter.name} - ${shelter.address}. ${shelter.available_beds} beds available.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${shareData.url}`
      );
      alert('Shelter info copied to clipboard!');
    }
  };

  const lastUpdated = new Date(shelter.last_updated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="page-container bg-background">
      <OfflineBanner />
      <Header title="Shelter Details" showBack showHome />
      
      <main className="container px-4 py-4 pb-8">
        {/* Header Card */}
        <div className="bg-card rounded-2xl p-5 shadow-md border border-border/50 mb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h1 className="text-xl font-bold">{shelter.name}</h1>
            <span className={isOpen ? 'status-open' : 'status-closed'}>
              <Clock className="w-3.5 h-3.5" />
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>

          <div className="flex items-start gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 mt-0.5" />
            <span>{shelter.address}</span>
          </div>

          <div className={`rounded-xl p-4 ${
            availability === 'high' ? 'bg-accent/10' :
            availability === 'low' ? 'bg-warning/10' :
            'bg-emergency/10'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5" />
              <span className="font-semibold">
                {shelter.available_beds} beds available
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              of {shelter.capacity} total capacity
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-4">
          <button onClick={handleNavigate} className="btn-action flex gap-2">
            <Navigation className="w-5 h-5" /> Navigate
          </button>

          <button onClick={handleCall} className="btn-action flex gap-2">
            <Phone className="w-5 h-5" /> Call
          </button>

          <button onClick={handleShare} className="btn-secondary-action flex gap-2">
            <Share2 className="w-5 h-5" /> Share
          </button>

          <button
            onClick={() => setShowRequestModal(true)}
            className="btn-secondary-action flex gap-2"
          >
            <CheckCircle className="w-5 h-5" /> Request
          </button>
        </div>

        {/* Modal */}
        <RequestShelterModal
          open={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          shelter={shelter}
          isOpen={isOpen}
        />

        <p className="text-center text-xs text-muted-foreground pt-4">
          Last updated: {lastUpdated}
        </p>
      </main>
    </div>
  );
};

export default ShelterDetail;
