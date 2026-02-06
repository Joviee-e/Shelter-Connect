import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useGeolocation';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="offline-banner">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>Offline mode: showing last saved data</span>
      </div>
    </div>
  );
}
