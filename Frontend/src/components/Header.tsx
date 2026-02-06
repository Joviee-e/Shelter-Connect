import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
}

export function Header({ title, showBack = false, showHome = false }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 safe-area-top">
      <div className="container flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showBack && !isHome && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors touch-manipulation"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {title ? (
            <h1 className="font-semibold text-lg">{title}</h1>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">ShelterConnect</span>
            </div>
          )}
        </div>
        
        {showHome && !isHome && (
          <button
            onClick={() => navigate('/')}
            className="p-2 -mr-2 rounded-xl hover:bg-muted transition-colors touch-manipulation"
            aria-label="Go home"
          >
            <Home className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
