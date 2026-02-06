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
import { addShelter } from '@/lib/api';

const AddShelter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const QUICK_AMENITIES = [
    'Hot meals',
    'Showers',
    'Laundry',
    'Medical services',
    'Mental health support',
    'Case management',
    'Free WiFi',
    'Family friendly',
    'Women only',
    'Children services',
  ];
  const toggleAmenity = (amenity: string) => {
    const current = formData.amenities
      ? formData.amenities.split(',').map(a => a.trim())
      : [];

    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];

    setFormData({
      ...formData,
      amenities: updated.join(', '),
    });
  };

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
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

  // Geocode address to get coordinates
  const geocodeAddress = async () => {
    if (!formData.address || !formData.city || !formData.pincode) {
      toast({
        title: 'Missing information',
        description: 'Please enter address, city, and pincode first.',
        variant: 'destructive',
      });
      return;
    }

    setGeocoding(true);

    try {
      // Try multiple query formats for better results, including pincode if available
      const baseAddress = formData.pincode
        ? `${formData.address}, ${formData.city}, ${formData.pincode}`
        : `${formData.address}, ${formData.city}`;

      const queries = [
        `${baseAddress}, India`,
        `${formData.pincode || formData.city}, Maharashtra, India`,
        baseAddress
      ];

      let foundLocation = null;

      for (const query of queries) {
        console.log('🔍 Trying geocoding query:', query);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
          {
            headers: {
              'User-Agent': 'ShelterConnect/1.0'
            }
          }
        );

        const data = await response.json();
        console.log('📍 Geocoding response:', data);

        if (data && data.length > 0) {
          foundLocation = data[0];
          break;
        }
      }

      if (foundLocation) {
        setFormData({
          ...formData,
          latitude: foundLocation.lat,
          longitude: foundLocation.lon,
        });

        toast({
          title: 'Coordinates found!',
          description: foundLocation.display_name,
        });
      } else {
        toast({
          title: 'Address not found',
          description: 'Try being more specific (e.g., add landmarks or area name). You can also enter coordinates manually.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch coordinates. Please try again or enter manually.',
        variant: 'destructive',
      });
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate coordinates
    if (!formData.latitude || !formData.longitude) {
      toast({
        title: 'Missing coordinates',
        description: 'Please click "Auto-fill Coordinates" button to get location coordinates.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Prepare shelter data with field mapping for backend
      const shelterData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        gender: formData.shelter_type,  // Backend uses "gender"
        total_beds: parseInt(formData.capacity),  // Backend uses "total_beds"
        available_beds: parseInt(formData.available_beds),
        opening_hours: formData.is_24_hour ? '24/7' : formData.open_hours,
        accessibility: formData.accessibility,
        pet_friendly: formData.pet_friendly,
        languages: formData.languages.split(',').map(l => l.trim()),
        phone: formData.phone,
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
        rules: formData.rules.split(',').map(r => r.trim()).filter(Boolean),
      };

      console.log('📤 Submitting shelter data:', shelterData);

      // Call backend API
      await addShelter(shelterData);

      toast({
        title: 'Shelter added!',
        description: 'Your shelter has been saved to the database.',
      });

      navigate('/dashboard/manage');
    } catch (error) {
      console.error('Error adding shelter:', error);
      toast({
        title: 'Error',
        description: 'Failed to add shelter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
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
                placeholder="Mumbai"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
                placeholder="400708"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Including pincode improves geocoding accuracy
              </p>
            </div>

            {/* Auto-fill Coordinates Button */}
            <Button
              type="button"
              variant="outline"
              onClick={geocodeAddress}
              disabled={geocoding || !formData.address || !formData.city || !formData.pincode}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {geocoding ? 'Finding location...' : 'Auto-fill Coordinates from Address'}
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  required
                  placeholder="19.0760"
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  required
                  placeholder="72.8777"
                  className="bg-muted"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              💡 Tip: Include landmarks, area name, or pincode for better results (e.g., "Sector 8A, Airoli, Navi Mumbai")
            </p>
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
        {/* Accessibility & Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility & Amenities</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Accessibility checkboxes */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="accessibility"
                  checked={formData.accessibility}
                  onChange={(e) =>
                    setFormData({ ...formData, accessibility: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="accessibility">Wheelchair Accessible</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pet_friendly"
                  checked={formData.pet_friendly}
                  onChange={(e) =>
                    setFormData({ ...formData, pet_friendly: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="pet_friendly">Pet Friendly</Label>
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label htmlFor="languages">Supported Languages</Label>
              <Input
                id="languages"
                value={formData.languages}
                onChange={(e) =>
                  setFormData({ ...formData, languages: e.target.value })
                }
                placeholder="English, Spanish, Mandarin"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>

            {/* 🔥 QUICK ADD AMENITIES */}
            <div className="space-y-2">
              <Label>Quick Add Amenities</Label>

              <div className="flex flex-wrap gap-2">
                {[
                  'Hot meals',
                  'Showers',
                  'Laundry',
                  'Medical services',
                  'Mental health support',
                  'Case management',
                  'Free WiFi',
                  'Family friendly',
                  'Women only',
                  'Children services',
                ].map((amenity) => {
                  const selected = formData.amenities
                    ?.split(',')
                    .map(a => a.trim())
                    .includes(amenity);

                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => {
                        const current = formData.amenities
                          ? formData.amenities.split(',').map(a => a.trim())
                          : [];

                        const updated = current.includes(amenity)
                          ? current.filter(a => a !== amenity)
                          : [...current, amenity];

                        setFormData({
                          ...formData,
                          amenities: updated.join(', '),
                        });
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition
                ${selected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted hover:bg-muted/80 border-border'
                        }`}
                    >
                      <span>{amenity}</span>
                      <span className="font-bold">{selected ? '×' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amenities textarea (UNCHANGED) */}
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities</Label>
              <Textarea
                id="amenities"
                value={formData.amenities}
                onChange={(e) =>
                  setFormData({ ...formData, amenities: e.target.value })
                }
                placeholder="Hot meals, Showers, Laundry, Medical services"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>

            {/* Rules */}
            <div className="space-y-2">
              <Label htmlFor="rules">Shelter Rules</Label>
              <Textarea
                id="rules"
                value={formData.rules}
                onChange={(e) =>
                  setFormData({ ...formData, rules: e.target.value })
                }
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
