import { useState } from 'react';
import { Building2, Trash2, Eye, EyeOff, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Shelter {
  id: string;
  name: string;
  address: string;
  city: string;
  shelter_type: string;
  capacity: number;
  available_beds: number;
  is_active: boolean;
  is_full: boolean;
}

// Mock data for demo
const mockShelters: Shelter[] = [
  {
    id: '1',
    name: 'Harbor Haven Shelter',
    address: '123 Main Street',
    city: 'Downtown',
    shelter_type: 'all',
    capacity: 150,
    available_beds: 23,
    is_active: true,
    is_full: false,
  },
  {
    id: '2',
    name: 'Sunrise Family Center',
    address: '456 Oak Avenue',
    city: 'Midtown',
    shelter_type: 'family',
    capacity: 80,
    available_beds: 12,
    is_active: true,
    is_full: false,
  },
  {
    id: '3',
    name: 'Hope Community Center',
    address: '567 Park Boulevard',
    city: 'Westside',
    shelter_type: 'all',
    capacity: 100,
    available_beds: 0,
    is_active: false,
    is_full: true,
  },
];

const ManageShelters = () => {
  const { toast } = useToast();
  const [shelters, setShelters] = useState<Shelter[]>(mockShelters);
  const [loading] = useState(false);

  const toggleActive = (id: string, currentStatus: boolean) => {
    setShelters(shelters.map(s => 
      s.id === id ? { ...s, is_active: !currentStatus } : s
    ));
    toast({
      title: currentStatus ? 'Shelter deactivated' : 'Shelter activated',
      description: `Shelter is now ${!currentStatus ? 'visible' : 'hidden'} to the public.`,
    });
  };

  const toggleFull = (id: string, currentStatus: boolean) => {
    setShelters(shelters.map(s => 
      s.id === id ? { ...s, is_full: !currentStatus, available_beds: !currentStatus ? 0 : s.available_beds } : s
    ));
    toast({
      title: !currentStatus ? 'Marked as full' : 'Marked as available',
    });
  };

  const updateBeds = (id: string, beds: number) => {
    setShelters(shelters.map(s => 
      s.id === id ? { ...s, available_beds: beds, is_full: beds === 0 } : s
    ));
    toast({
      title: 'Beds updated',
    });
  };

  const deleteShelter = (id: string) => {
    if (!confirm('Are you sure you want to delete this shelter?')) return;
    setShelters(shelters.filter(s => s.id !== id));
    toast({
      title: 'Shelter deleted',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Shelters</h2>
          <p className="text-muted-foreground mt-1">
            {shelters.length} shelter{shelters.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Button asChild>
          <a href="/dashboard/add-shelter">Add Shelter</a>
        </Button>
      </div>

      {shelters.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No shelters yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first shelter to start receiving requests
            </p>
            <Button asChild>
              <a href="/dashboard/add-shelter">Add Shelter</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {shelters.map((shelter) => (
            <Card key={shelter.id} className={!shelter.is_active ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {shelter.name}
                      {!shelter.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      {shelter.is_full && (
                        <Badge variant="destructive">Full</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {shelter.address}, {shelter.city}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {shelter.shelter_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{shelter.available_beds}</strong> / {shelter.capacity} beds
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={shelter.available_beds}
                      onChange={(e) => updateBeds(shelter.id, parseInt(e.target.value) || 0)}
                      min="0"
                      max={shelter.capacity}
                      className="w-20 h-8 px-2 text-sm border rounded"
                    />
                    <span className="text-xs text-muted-foreground">Update beds</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(shelter.id, shelter.is_active)}
                  >
                    {shelter.is_active ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFull(shelter.id, shelter.is_full)}
                  >
                    {shelter.is_full ? 'Mark Available' : 'Mark Full'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteShelter(shelter.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageShelters;
