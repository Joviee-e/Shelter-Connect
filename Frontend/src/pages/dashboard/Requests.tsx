import { useState } from 'react';
import { Bell, Check, X, MapPin, Clock, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Request {
  id: string;
  shelter_id: string;
  shelter_name: string;
  user_name: string | null;
  user_phone: string | null;
  user_location_lat: number | null;
  user_location_lng: number | null;
  message: string | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

// Mock data for demo
const mockRequests: Request[] = [
  {
    id: '1',
    shelter_id: 's1',
    shelter_name: 'Harbor Haven Shelter',
    user_name: 'John Doe',
    user_phone: '+1 555-0123',
    user_location_lat: 40.7128,
    user_location_lng: -74.006,
    message: 'Need shelter for tonight, arriving around 6 PM',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    shelter_id: 's1',
    shelter_name: 'Harbor Haven Shelter',
    user_name: 'Jane Smith',
    user_phone: null,
    user_location_lat: 40.7282,
    user_location_lng: -73.994,
    message: null,
    status: 'pending',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    shelter_id: 's2',
    shelter_name: 'Sunrise Family Center',
    user_name: 'Mike Johnson',
    user_phone: '+1 555-0456',
    user_location_lat: 40.7195,
    user_location_lng: -73.987,
    message: 'Family of 4 looking for shelter',
    status: 'accepted',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const Requests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [loading] = useState(false);

  const handleRequest = (id: string, status: 'accepted' | 'declined') => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status } : r
    ));

    toast({
      title: status === 'accepted' ? 'Request accepted' : 'Request declined',
      description: status === 'accepted' 
        ? 'Available beds have been updated' 
        : 'The request has been declined',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-accent/20 text-accent">Accepted</Badge>;
      case 'declined':
        return <Badge className="bg-destructive/20 text-destructive">Declined</Badge>;
      default:
        return <Badge className="bg-warning/20 text-warning">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Requests</h2>
        <p className="text-muted-foreground mt-1">
          {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
            <p className="text-muted-foreground">
              Requests from users will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Pending Requests</h3>
              {pendingRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-warning">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {request.shelter_name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(request.created_at)}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {request.user_name && (
                        <p className="text-sm flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {request.user_name}
                        </p>
                      )}
                      {request.user_location_lat && request.user_location_lng && (
                        <p className="text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          Approx. location: {request.user_location_lat.toFixed(3)}, {request.user_location_lng.toFixed(3)}
                        </p>
                      )}
                      {request.message && (
                        <p className="text-sm text-muted-foreground">
                          "{request.message}"
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRequest(request.id, 'accepted')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequest(request.id, 'declined')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Processed Requests */}
          {processedRequests.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Past Requests</h3>
              {processedRequests.map((request) => (
                <Card key={request.id} className="opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {request.shelter_name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(request.created_at)}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Requests;
