
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';

export interface DbRink {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  current_temperature: number;
  photos: string[];
  photo_reference?: string; // Added for caching Google Places photo references
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TemperatureReading {
  id: string;
  rink_id: string;
  temperature: number;
  notes: string;
  recorded_at: string;
  user_id: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  preferred_units: string;
  notification_preferences: any;
  location_city: string;
  location_province: string;
  created_at: string;
  updated_at: string;
}

export function useSupabaseData() {
  const { supabase, user } = useSupabaseAuth();
  const [rinks, setRinks] = useState<DbRink[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all rinks
  const fetchRinks = async () => {
    try {
      const { data, error } = await supabase
        .from('rinks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRinks(data || []);
    } catch (error) {
      console.error('Error fetching rinks:', error);
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Create or update user profile
  const upsertUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error) throw error;
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Add new rink
  const addRink = async (rinkData: Omit<DbRink, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Must be logged in');

    try {
      const { data, error } = await supabase
        .from('rinks')
        .insert({
          ...rinkData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Add initial temperature reading
      await addTemperatureReading(data.id, rinkData.current_temperature, '');
      
      setRinks([data, ...rinks]);
      return data;
    } catch (error) {
      console.error('Error adding rink:', error);
      throw error;
    }
  };

  // Update rink with better error handling
  const updateRink = async (rinkId: string, updates: Partial<DbRink>) => {
    try {
      // First check if the rink exists
      const { data: existingRink, error: checkError } = await supabase
        .from('rinks')
        .select('id')
        .eq('id', rinkId)
        .single();

      if (checkError || !existingRink) {
        console.warn(`Rink with ID ${rinkId} not found, skipping update`);
        return null;
      }

      // Perform the update
      const { data, error } = await supabase
        .from('rinks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', rinkId)
        .select()
        .single();

      if (error) throw error;
      
      // Only update local state if we have the rink in our current list
      setRinks(prevRinks => 
        prevRinks.map(rink => rink.id === rinkId ? { ...rink, ...data } : rink)
      );
      return data;
    } catch (error) {
      console.error('Error updating rink:', error);
      // Don't throw the error, just return null to prevent crashes
      return null;
    }
  };

  // Add temperature reading
  const addTemperatureReading = async (rinkId: string, temperature: number, notes: string) => {
    if (!user) throw new Error('Must be logged in');

    try {
      const currentDate = new Date();
      const { data, error } = await supabase
        .from('temperature_readings')
        .insert({
          rink_id: rinkId,
          temperature,
          notes,
          user_id: user.id,
          year: currentDate.getFullYear(), // Add the year field
          reading_date: currentDate.toISOString().split('T')[0], // Add reading_date
          recorded_at: currentDate.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update rink's current temperature
      await updateRink(rinkId, { current_temperature: temperature });
      
      return data;
    } catch (error) {
      console.error('Error adding temperature reading:', error);
      throw error;
    }
  };

  // Get temperature readings for a rink with enhanced filtering
  const getTemperatureReadings = async (rinkId: string, yearRange: number = 5) => {
    try {
      // Calculate date range for winter seasons (last 5 years by default)
      const currentDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(currentDate.getFullYear() - yearRange);
      
      const { data, error } = await supabase
        .from('temperature_readings')
        .select('*')
        .eq('rink_id', rinkId)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching temperature readings:', error);
      return [];
    }
  };

  // Get winter temperature readings (October to March) - Fixed query
  const getWinterTemperatureReadings = async (rinkId: string, yearRange: number = 5) => {
    try {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - yearRange;
      
      // Simplified approach: get data for the year range and filter winter months in JavaScript
      const startDate = new Date(startYear - 1, 9, 1).toISOString(); // October 1st of start year - 1
      const endDate = new Date(currentYear, 2, 31).toISOString(); // March 31st of current year
      
      const { data, error } = await supabase
        .from('temperature_readings')
        .select('*')
        .eq('rink_id', rinkId)
        .gte('recorded_at', startDate)
        .lte('recorded_at', endDate)
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      
      // Filter for winter months (October = 9, November = 10, December = 11, January = 0, February = 1, March = 2)
      const winterReadings = (data || []).filter(reading => {
        const date = new Date(reading.recorded_at);
        const month = date.getMonth();
        return month >= 9 || month <= 2; // Oct, Nov, Dec, Jan, Feb, Mar
      });
      
      return winterReadings;
    } catch (error) {
      console.error('Error fetching winter temperature readings:', error);
      return [];
    }
  };

  // Get temperature readings grouped by winter seasons
  const getTemperatureReadingsBySeason = async (rinkId: string, yearRange: number = 5) => {
    try {
      const readings = await getWinterTemperatureReadings(rinkId, yearRange);
      
      // Group readings by winter season
      const seasonGroups: Record<string, any[]> = {};
      
      readings.forEach(reading => {
        const date = new Date(reading.recorded_at);
        const month = date.getMonth();
        const year = date.getFullYear();
        
        // Determine winter season year (Oct-Dec belongs to next year's season)
        const seasonYear = month >= 9 ? year + 1 : year;
        const seasonKey = `${seasonYear - 1}-${seasonYear}`;
        
        if (!seasonGroups[seasonKey]) {
          seasonGroups[seasonKey] = [];
        }
        seasonGroups[seasonKey].push(reading);
      });
      
      return seasonGroups;
    } catch (error) {
      console.error('Error fetching seasonal temperature readings:', error);
      return {};
    }
  };

  useEffect(() => {
    // Always fetch rinks, regardless of user authentication
    fetchRinks().finally(() => {
      if (!user) {
        setLoading(false);
      }
    });
    
    // Only fetch user profile if user is logged in
    if (user) {
      fetchUserProfile().finally(() => setLoading(false));
    }
  }, [user]);

  return {
    rinks,
    userProfile,
    loading,
    addRink,
    updateRink,
    addTemperatureReading,
    getTemperatureReadings,
    getWinterTemperatureReadings,
    getTemperatureReadingsBySeason,
    upsertUserProfile,
    fetchRinks
  };
}
