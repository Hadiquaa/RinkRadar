
export interface Rink {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
  };
  currentTemperature: number;
  photos: string[];
  temperatureHistory: TemperatureReading[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemperatureReading {
  temperature: number;
  timestamp: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface MapFilter {
  temperatureRange: [number, number];
  provinces: string[];
}
