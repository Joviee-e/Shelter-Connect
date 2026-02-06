import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Phone, Users, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AddShelter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    shelter_type: 'all' as 'men' | 'women' | 'family' | 'all',
    capacity: '',
    available_beds: '',
    open_hours: '',
    is_24_hour: false,
    accessibility: false,
    pet_friendly: false,
    languages: 'English',
    phone: '',
    amenities: '',
    rules: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    
    // Mock save - in production this would save to Supabase
    setTimeout(() => {
      toast({
        title: 'Shelter added!',
        description: 'Your shelter has been added successfully.',
      });
      navigate('/dashboard/manage');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add New Shelter</h2>
        <p className="text-muted-foreground mt-1">
          Fill in the details to register a new shelter
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Shelter Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Hope Community Center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+1 (555) 000-0000"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shelter_type">Shelter Type *</Label>
              <select
                id="shelter_type"
                value={formData.shelter_type}
                onChange={(e) => setFormData({ ...formData, shelter_type: e.target.value as any })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="all">All Genders</option>
                <option value="men">Men Only</option>
                <option value="women">Women Only</option>
                <option value="family">Families</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                placeholder="123 Main Street"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                placeholder="New York"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  required
                  placeholder="40.7128"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  required
                  placeholder="-74.006"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capacity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Total Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                  min="0"
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available_beds">Available Beds *</Label>
                <Input
                  id="available_beds"
                  type="number"
                  value={formData.available_beds}
                  onChange={(e) => setFormData({ ...formData, available_beds: e.target.value })}
                  required
                  min="0"
                  placeholder="25"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_24_hour"
                checked={formData.is_24_hour}
                onChange={(e) => setFormData({ ...formData, is_24_hour: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="is_24_hour">Open 24 hours</Label>
            </div>

            {!formData.is_24_hour && (
              <div className="space-y-2">
                <Label htmlFor="open_hours">Operating Hours *</Label>
                <Input
                  id="open_hours"
                  value={formData.open_hours}
                  onChange={(e) => setFormData({ ...formData, open_hours: e.target.value })}
                  required={!formData.is_24_hour}
                  placeholder="6 PM - 8 AM"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accessibility & Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility & Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="accessibility"
                  checked={formData.accessibility}
                  onChange={(e) => setFormData({ ...formData, accessibility: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="accessibility">Wheelchair Accessible</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pet_friendly"
                  checked={formData.pet_friendly}
                  onChange={(e) => setFormData({ ...formData, pet_friendly: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="pet_friendly">Pet Friendly</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Supported Languages</Label>
              <Input
                id="languages"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                placeholder="English, Spanish, Mandarin"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities</Label>
              <Textarea
                id="amenities"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="Hot meals, Showers, Laundry, Medical services"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules">Shelter Rules</Label>
              <Textarea
                id="rules"
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                placeholder="No alcohol or drugs, Check-in by 9 PM, Respectful behavior required"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={submitting}>
          <Save className="w-4 h-4 mr-2" />
          {submitting ? 'Adding Shelter...' : 'Add Shelter'}
        </Button>
      </form>
    </div>
  );
};

export default AddShelter;
