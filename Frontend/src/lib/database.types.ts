export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          ngo_name: string
          email: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          ngo_name: string
          email: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_name?: string
          email?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'ngo'
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'ngo'
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'ngo'
        }
      }
      shelters: {
        Row: {
          id: string
          ngo_id: string
          name: string
          address: string
          city: string
          latitude: number
          longitude: number
          shelter_type: 'men' | 'women' | 'family' | 'all'
          capacity: number
          available_beds: number
          open_hours: string
          is_24_hour: boolean
          accessibility: boolean
          pet_friendly: boolean
          languages: string[]
          phone: string
          amenities: string[]
          rules: string[]
          is_active: boolean
          is_full: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          name: string
          address: string
          city: string
          latitude: number
          longitude: number
          shelter_type: 'men' | 'women' | 'family' | 'all'
          capacity?: number
          available_beds?: number
          open_hours: string
          is_24_hour?: boolean
          accessibility?: boolean
          pet_friendly?: boolean
          languages?: string[]
          phone: string
          amenities?: string[]
          rules?: string[]
          is_active?: boolean
          is_full?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          name?: string
          address?: string
          city?: string
          latitude?: number
          longitude?: number
          shelter_type?: 'men' | 'women' | 'family' | 'all'
          capacity?: number
          available_beds?: number
          open_hours?: string
          is_24_hour?: boolean
          accessibility?: boolean
          pet_friendly?: boolean
          languages?: string[]
          phone?: string
          amenities?: string[]
          rules?: string[]
          is_active?: boolean
          is_full?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shelter_requests: {
        Row: {
          id: string
          shelter_id: string
          user_location_lat: number | null
          user_location_lng: number | null
          user_name: string | null
          user_phone: string | null
          message: string | null
          status: 'pending' | 'accepted' | 'declined'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shelter_id: string
          user_location_lat?: number | null
          user_location_lng?: number | null
          user_name?: string | null
          user_phone?: string | null
          message?: string | null
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shelter_id?: string
          user_location_lat?: number | null
          user_location_lng?: number | null
          user_name?: string | null
          user_phone?: string | null
          message?: string | null
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      app_role: 'admin' | 'ngo'
    }
  }
}
