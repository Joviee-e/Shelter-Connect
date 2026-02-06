export interface Shelter {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  open_hours: string;
  is_24_hour: boolean;
  capacity: number;
  available_beds: number;
  gender: 'all' | 'men' | 'women' | 'family';
  pet_friendly: boolean;
  accessibility: boolean;
  languages: string[];
  phone: string;
  amenities: string[];
  rules: string[];
  last_updated: string;
}

export const shelters: Shelter[] = [
  {
    id: "1",
    name: "Harbor Haven Shelter",
    address: "123 Main Street, Downtown",
    latitude: 40.7128,
    longitude: -74.006,
    open_hours: "24 hours",
    is_24_hour: true,
    capacity: 150,
    available_beds: 23,
    gender: "all",
    pet_friendly: true,
    accessibility: true,
    languages: ["English", "Spanish", "Mandarin"],
    phone: "+1 (555) 123-4567",
    amenities: ["Hot meals", "Showers", "Laundry", "Medical services", "Case management"],
    rules: ["No alcohol or drugs", "Check-in by 9 PM", "Respectful behavior required"],
    last_updated: "2024-01-15T14:30:00Z"
  },
  {
    id: "2",
    name: "Sunrise Family Center",
    address: "456 Oak Avenue, Midtown",
    latitude: 40.7282,
    longitude: -73.994,
    open_hours: "6 PM - 8 AM",
    is_24_hour: false,
    capacity: 80,
    available_beds: 12,
    gender: "family",
    pet_friendly: false,
    accessibility: true,
    languages: ["English", "Spanish"],
    phone: "+1 (555) 234-5678",
    amenities: ["Hot meals", "Children's area", "Family rooms", "Counseling"],
    rules: ["Families only", "Quiet hours 10 PM - 6 AM", "No visitors"],
    last_updated: "2024-01-15T12:00:00Z"
  },
  {
    id: "3",
    name: "Safe Harbor Women's Shelter",
    address: "789 Elm Street, Eastside",
    latitude: 40.7195,
    longitude: -73.987,
    open_hours: "24 hours",
    is_24_hour: true,
    capacity: 60,
    available_beds: 8,
    gender: "women",
    pet_friendly: true,
    accessibility: true,
    languages: ["English", "Spanish", "French"],
    phone: "+1 (555) 345-6789",
    amenities: ["Private rooms", "Childcare", "Job training", "Legal aid", "Therapy"],
    rules: ["Women and children only", "Confidential location", "No male visitors"],
    last_updated: "2024-01-15T16:45:00Z"
  },
  {
    id: "4",
    name: "Downtown Men's Mission",
    address: "321 River Road, Financial District",
    latitude: 40.7074,
    longitude: -74.0113,
    open_hours: "5 PM - 9 AM",
    is_24_hour: false,
    capacity: 200,
    available_beds: 45,
    gender: "men",
    pet_friendly: false,
    accessibility: true,
    languages: ["English"],
    phone: "+1 (555) 456-7890",
    amenities: ["Hot meals", "Showers", "Chapel services", "AA meetings"],
    rules: ["Men 18+ only", "Check-in by 8 PM", "Attend orientation"],
    last_updated: "2024-01-15T10:15:00Z"
  },
  {
    id: "5",
    name: "Hope Community Center",
    address: "567 Park Boulevard, Westside",
    latitude: 40.7352,
    longitude: -74.0186,
    open_hours: "24 hours",
    is_24_hour: true,
    capacity: 100,
    available_beds: 31,
    gender: "all",
    pet_friendly: true,
    accessibility: false,
    languages: ["English", "Spanish", "Portuguese"],
    phone: "+1 (555) 567-8901",
    amenities: ["Hot meals", "Showers", "Computer lab", "Phone charging"],
    rules: ["ID required", "Maximum 30-day stay", "Participate in programs"],
    last_updated: "2024-01-15T08:00:00Z"
  },
  {
    id: "6",
    name: "Beacon Light Shelter",
    address: "890 Harbor View, Waterfront",
    latitude: 40.6892,
    longitude: -74.0445,
    open_hours: "6 PM - 10 AM",
    is_24_hour: false,
    capacity: 75,
    available_beds: 0,
    gender: "all",
    pet_friendly: false,
    accessibility: true,
    languages: ["English", "Spanish"],
    phone: "+1 (555) 678-9012",
    amenities: ["Hot meals", "Showers", "Storage lockers"],
    rules: ["First come first served", "No reservations", "Clean and sober"],
    last_updated: "2024-01-15T18:00:00Z"
  },
  {
    id: "7",
    name: "Unity House",
    address: "234 Liberty Lane, Uptown",
    latitude: 40.7484,
    longitude: -73.9857,
    open_hours: "24 hours",
    is_24_hour: true,
    capacity: 50,
    available_beds: 7,
    gender: "family",
    pet_friendly: true,
    accessibility: true,
    languages: ["English", "Spanish", "Arabic", "Urdu"],
    phone: "+1 (555) 789-0123",
    amenities: ["Private rooms", "Kitchen access", "Playground", "ESL classes"],
    rules: ["Families with children only", "30-day minimum stay", "Case plan required"],
    last_updated: "2024-01-15T11:30:00Z"
  },
  {
    id: "8",
    name: "New Beginnings Center",
    address: "678 Fresh Start Way, Northside",
    latitude: 40.7549,
    longitude: -73.9840,
    open_hours: "5 PM - 8 AM",
    is_24_hour: false,
    capacity: 120,
    available_beds: 18,
    gender: "all",
    pet_friendly: false,
    accessibility: true,
    languages: ["English", "Korean", "Mandarin"],
    phone: "+1 (555) 890-1234",
    amenities: ["Hot meals", "Showers", "Job placement", "Mental health services"],
    rules: ["Check-in by 7 PM", "Mandatory morning meeting", "Weekly case review"],
    last_updated: "2024-01-15T09:45:00Z"
  },
  {
    id: "9",
    name: "Mercy House",
    address: "901 Grace Street, Historic District",
    latitude: 40.7023,
    longitude: -73.9871,
    open_hours: "24 hours",
    is_24_hour: true,
    capacity: 45,
    available_beds: 3,
    gender: "women",
    pet_friendly: false,
    accessibility: false,
    languages: ["English", "Spanish"],
    phone: "+1 (555) 901-2345",
    amenities: ["Meals", "Counseling", "Substance abuse programs", "GED classes"],
    rules: ["Women 18+ only", "Sobriety required", "Program participation mandatory"],
    last_updated: "2024-01-15T13:20:00Z"
  },
  {
    id: "10",
    name: "St. Vincent's Emergency Shelter",
    address: "432 Cathedral Plaza, Midtown East",
    latitude: 40.7411,
    longitude: -73.9897,
    open_hours: "7 PM - 7 AM",
    is_24_hour: false,
    capacity: 180,
    available_beds: 55,
    gender: "all",
    pet_friendly: false,
    accessibility: true,
    languages: ["English", "Spanish", "French", "Haitian Creole"],
    phone: "+1 (555) 012-3456",
    amenities: ["Cots", "Blankets", "Light breakfast", "Referral services"],
    rules: ["Emergency overflow only", "One night maximum", "No belongings storage"],
    last_updated: "2024-01-15T19:00:00Z"
  },
  {
    id: "11",
    name: "Rainbow Youth Shelter",
    address: "555 Pride Avenue, Village",
    latitude: 40.7336,
    longitude: -74.0027,
    open_hours: "24 hours",
    is_24_hour: true,
    capacity: 35,
    available_beds: 11,
    gender: "all",
    pet_friendly: true,
    accessibility: true,
    languages: ["English", "Spanish"],
    phone: "+1 (555) 123-7890",
    amenities: ["Private rooms", "Counseling", "Life skills", "LGBTQ+ affirming"],
    rules: ["Ages 16-24 only", "Respectful environment", "Curfew 11 PM"],
    last_updated: "2024-01-15T15:10:00Z"
  },
  {
    id: "12",
    name: "Veteran's Haven",
    address: "777 Honor Road, Memorial Park",
    latitude: 40.7180,
    longitude: -74.0152,
    open_hours: "24 hours",
    is_24_hour: true,
    capacity: 65,
    available_beds: 14,
    gender: "all",
    pet_friendly: true,
    accessibility: true,
    languages: ["English"],
    phone: "+1 (555) 234-8901",
    amenities: ["Private rooms", "VA liaison", "PTSD support", "Job training"],
    rules: ["Veterans only", "DD-214 required", "Service animals welcome"],
    last_updated: "2024-01-15T07:30:00Z"
  },
  {
    id: "13",
    name: "Open Door Shelter",
    address: "888 Welcome Way, Southside",
    latitude: 40.6945,
    longitude: -73.9864,
    open_hours: "6 PM - 9 AM",
    is_24_hour: false,
    capacity: 90,
    available_beds: 22,
    gender: "men",
    pet_friendly: false,
    accessibility: false,
    languages: ["English", "Spanish", "Russian"],
    phone: "+1 (555) 345-9012",
    amenities: ["Dinner and breakfast", "Showers", "Clothing closet"],
    rules: ["Men 21+ only", "No intoxication", "Lottery-based entry"],
    last_updated: "2024-01-15T17:45:00Z"
  },
  {
    id: "14",
    name: "Cornerstone Family Residence",
    address: "159 Foundation Street, Suburbs",
    latitude: 40.7589,
    longitude: -73.9851,
    open_hours: "24 hours",
    is_24_hour: true,
    capacity: 40,
    available_beds: 0,
    gender: "family",
    pet_friendly: false,
    accessibility: true,
    languages: ["English", "Spanish", "Bengali"],
    phone: "+1 (555) 456-0123",
    amenities: ["Apartments", "Kitchen", "After-school program", "Parent workshops"],
    rules: ["Families with children only", "Income verification", "6-month program"],
    last_updated: "2024-01-15T14:00:00Z"
  },
  {
    id: "15",
    name: "Nightwatch Emergency Beds",
    address: "246 Safety Lane, Central",
    latitude: 40.7265,
    longitude: -73.9898,
    open_hours: "8 PM - 6 AM",
    is_24_hour: false,
    capacity: 50,
    available_beds: 8,
    gender: "all",
    pet_friendly: false,
    accessibility: true,
    languages: ["English"],
    phone: "+1 (555) 567-1234",
    amenities: ["Mats", "Blankets", "Hot beverages", "Warming center"],
    rules: ["Cold weather overflow", "No reservations", "First come first served"],
    last_updated: "2024-01-15T20:30:00Z"
  }
];

// Helper function to check if shelter is currently open
export function isShelterOpen(shelter: Shelter): boolean {
  if (shelter.is_24_hour) return true;
  
  const now = new Date();
  const hours = now.getHours();
  
  // Simple heuristic for demo - evening shelters typically open 5-8 PM and close 6-10 AM
  if (shelter.open_hours.includes("PM") && shelter.open_hours.includes("AM")) {
    const openHour = parseInt(shelter.open_hours.split(" ")[0]);
    const closeHour = parseInt(shelter.open_hours.split("-")[1].trim().split(" ")[0]);
    
    // Evening to morning shelters
    if (openHour >= 12) {
      return hours >= openHour || hours < closeHour;
    }
  }
  
  return true; // Default to open for demo
}

// Calculate distance between two points in kilometers
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

// Get availability status
export function getAvailabilityStatus(shelter: Shelter): 'high' | 'low' | 'none' {
  const ratio = shelter.available_beds / shelter.capacity;
  if (shelter.available_beds === 0) return 'none';
  if (ratio > 0.2) return 'high';
  return 'low';
}
