import { MapPin, Users, Dog, Accessibility, Clock } from 'lucide-react';
import { Shelter, isShelterOpen, formatDistance, getAvailabilityStatus } from '@/data/shelters';
import { useNavigate } from 'react-router-dom';

interface ShelterCardProps {
  shelter: Shelter;
  distance: number;
}

export function ShelterCard({ shelter, distance }: ShelterCardProps) {
  const navigate = useNavigate();
  const isOpen = isShelterOpen(shelter);
  const availability = getAvailabilityStatus(shelter);

  const handleClick = () => {
    navigate(`/shelter/${shelter.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="shelter-card w-full text-left animate-fade-in"
      style={{ animationDelay: '0.1s' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg leading-tight truncate">
            {shelter.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-sm truncate">{shelter.address}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-lg font-semibold text-primary">
            {formatDistance(distance)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={isOpen ? 'status-open' : 'status-closed'}>
            <Clock className="w-3.5 h-3.5" />
            {isOpen ? 'Open' : 'Closed'}
          </span>
          
          {shelter.pet_friendly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              <Dog className="w-3 h-3" />
              Pets
            </span>
          )}
          
          {shelter.accessibility && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              <Accessibility className="w-3 h-3" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className={
            availability === 'high' ? 'text-accent font-medium' :
            availability === 'low' ? 'text-warning font-medium' :
            'text-emergency font-medium'
          }>
            {shelter.available_beds === 0 ? 'Full' : `${shelter.available_beds} beds`}
          </span>
        </div>
      </div>
    </button>
  );
}
