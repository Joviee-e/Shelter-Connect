import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Users,
  Navigation,
  Share2,
  CheckCircle
} from 'lucide-react';

import { Header } from '@/components/Header';
import { OfflineBanner } from '@/components/OfflineBanner';
import RequestShelterModal from '@/components/RequestShelterModal';

const ShelterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [shelter, setShelter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH SHELTER FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/api/public/shelters")
      .then(res => res.json())
      .then(data => {
        setShelter(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching shelter:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <Header title="Loading Shelter..." showBack showHome />
      </div>
    );
  }

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
      } catch { }
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
          <h1 className="text-xl font-bold mb-2">{shelter.name}</h1>

          <div className="flex items-start gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 mt-0.5" />
            <span>{shelter.address}</span>
          </div>

          <div className="rounded-xl p-4 bg-accent/10">
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

        <RequestShelterModal
          open={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          shelter={shelter}
        />

        <p className="text-center text-xs text-muted-foreground pt-4">
          Last updated: {lastUpdated}
        </p>
      </main>
    </div>
  );
};

export default ShelterDetail;
