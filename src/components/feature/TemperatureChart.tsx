
import { useEffect, useState, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, addDays } from 'date-fns';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

interface TemperatureChartProps {
  rinkId: string;
  rinkName: string;
}

interface TemperatureReading {
  id: string;
  temperature: number;
  recorded_at: string;
  year: number;
  notes: string;
}

interface ChartDataPoint {
  date: string;
  temperature: number;
  displayDate: string;
  isSample?: boolean;
}

export default function TemperatureChart({ rinkId, rinkName }: TemperatureChartProps) {
  const { supabase } = useSupabaseAuth();
  const [temperatureReadings, setTemperatureReadings] = useState<TemperatureReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);

  // Fetch temperature readings for the rink
  const fetchTemperatureReadings = useCallback(async () => {
    if (!rinkId || !supabase) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('temperature_readings')
        .select('id, temperature, recorded_at, year, notes')
        .eq('rink_id', rinkId)
        .order('recorded_at', { ascending: true });

      if (error) {
        console.error('Error fetching temperature readings:', error);
        setError('Failed to load temperature data');
        return;
      }

      setTemperatureReadings(data || []);
    } catch (error) {
      console.error('Error fetching temperature readings:', error);
      setError('Failed to load temperature data');
    } finally {
      setLoading(false);
    }
  }, [rinkId, supabase]);

  // Generate synthetic data for demo purposes
  const generateSyntheticData = useCallback((): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const startDate = subDays(new Date(), 120); // Last 4 months
    const endDate = new Date();
    
    let currentDate = startDate;
    let baseTemp = -5; // Starting temperature
    
    while (currentDate <= endDate) {
      // Create realistic winter temperature pattern
      const dayOfYear = currentDate.getDate();
      const month = currentDate.getMonth();
      
      // Seasonal variation (colder in Dec-Feb, warmer in Nov and Mar)
      let seasonalOffset = 0;
      if (month === 10) seasonalOffset = 2; // November - mild
      else if (month === 11) seasonalOffset = -8; // December - cold
      else if (month === 0) seasonalOffset = -10; // January - coldest
      else if (month === 1) seasonalOffset = -6; // February - cold
      else if (month === 2) seasonalOffset = -2; // March - warming
      
      // Add some random daily variation
      const dailyVariation = (Math.random() - 0.5) * 8;
      
      // Add weekly pattern (slightly warmer on weekends for human activity)
      const dayOfWeek = currentDate.getDay();
      const weekendOffset = (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : 0;
      
      const temperature = Math.round((baseTemp + seasonalOffset + dailyVariation + weekendOffset) * 10) / 10;
      
      data.push({
        date: currentDate.toISOString(),
        temperature: Math.max(-25, Math.min(10, temperature)), // Clamp between -25 and 10
        displayDate: format(currentDate, 'MMM dd'),
        isSample: true
      });
      
      currentDate = addDays(currentDate, 3); // Every 3 days
    }
    
    return data;
  }, []);

  // Process chart data
  const chartData = useMemo((): ChartDataPoint[] => {
    if (temperatureReadings.length === 0) {
      setIsSampleData(true);
      return generateSyntheticData();
    }
    
    setIsSampleData(false);
    return temperatureReadings.map(reading => ({
      date: reading.recorded_at,
      temperature: reading.temperature,
      displayDate: format(new Date(reading.recorded_at), 'MMM dd, yyyy'),
      isSample: false
    }));
  }, [temperatureReadings, generateSyntheticData]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (chartData.length === 0) return null;
    
    const temperatures = chartData.map(d => d.temperature);
    const average = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
    const min = Math.min(...temperatures);
    const max = Math.max(...temperatures);
    
    return {
      average: Math.round(average * 10) / 10,
      min,
      max,
      readingCount: temperatures.length
    };
  }, [chartData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900">{data.displayDate}</p>
          <p className={`text-lg font-bold ${
            data.temperature < -10 ? 'text-blue-600' :
            data.temperature < 0 ? 'text-cyan-600' : 'text-orange-600'
          }`}>
            {data.temperature}°C
          </p>
          {data.isSample && (
            <p className="text-xs text-gray-500 mt-1">Sample Data</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Initial data fetch
  useEffect(() => {
    fetchTemperatureReadings();
  }, [fetchTemperatureReadings]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <p className="text-gray-600 text-lg">Loading temperature data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <i className="ri-error-warning-line text-6xl text-red-300 mb-6"></i>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={fetchTemperatureReadings}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-refresh-line mr-2"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Temperature Trends - {rinkName}
        </h3>
        <p className="text-sm text-gray-600">
          {isSampleData ? 'Sample temperature data showing seasonal patterns' : 'Historical temperature readings'}
        </p>
        {isSampleData && (
          <div className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs mt-2">
            <i className="ri-information-line mr-1"></i>
            Sample Data - Add real readings in Dashboard
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="displayDate"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke={isSampleData ? "#9CA3AF" : "#3B82F6"}
                strokeWidth={3}
                dot={{ 
                  fill: isSampleData ? "#9CA3AF" : "#1E40AF", 
                  strokeWidth: 2, 
                  r: 4 
                }}
                activeDot={{ 
                  r: 6, 
                  fill: isSampleData ? "#6B7280" : "#1E40AF",
                  strokeWidth: 2 
                }}
                name={isSampleData ? "Sample Temperature" : "Temperature"}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${isSampleData ? 'bg-gray-50' : 'bg-blue-50'} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${isSampleData ? 'text-gray-600' : 'text-blue-600'}`}>
              {statistics.average}°C
            </div>
            <div className={`text-sm font-medium ${isSampleData ? 'text-gray-700' : 'text-blue-800'}`}>
              Average
            </div>
          </div>
          <div className={`${isSampleData ? 'bg-gray-50' : 'bg-green-50'} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${isSampleData ? 'text-gray-600' : 'text-green-600'}`}>
              {statistics.min}°C
            </div>
            <div className={`text-sm font-medium ${isSampleData ? 'text-gray-700' : 'text-green-800'}`}>
              Minimum
            </div>
          </div>
          <div className={`${isSampleData ? 'bg-gray-50' : 'bg-orange-50'} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${isSampleData ? 'text-gray-600' : 'text-orange-600'}`}>
              {statistics.max}°C
            </div>
            <div className={`text-sm font-medium ${isSampleData ? 'text-gray-700' : 'text-orange-800'}`}>
              Maximum
            </div>
          </div>
          <div className={`${isSampleData ? 'bg-gray-50' : 'bg-purple-50'} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${isSampleData ? 'text-gray-600' : 'text-purple-600'}`}>
              {statistics.readingCount}
            </div>
            <div className={`text-sm font-medium ${isSampleData ? 'text-gray-700' : 'text-purple-800'}`}>
              {isSampleData ? 'Sample Points' : 'Readings'}
            </div>
          </div>
        </div>
      )}

      {/* Temperature Guide */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-center mb-3">
          <h4 className="font-semibold text-gray-900">Temperature Guide for Ice Quality</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center justify-center p-2 rounded bg-white">
            <div className="w-3 h-3 bg-blue-900 rounded-full mr-2"></div>
            <span>Excellent (&lt; -15°C)</span>
          </div>
          <div className="flex items-center justify-center p-2 rounded bg-white">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            <span>Good (-15° to -10°C)</span>
          </div>
          <div className="flex items-center justify-center p-2 rounded bg-white">
            <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
            <span>Fair (-10° to -5°C)</span>
          </div>
          <div className="flex items-center justify-center p-2 rounded bg-white">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Marginal (-5° to 0°C)</span>
          </div>
          <div className="flex items-center justify-center p-2 rounded bg-white">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span>Poor (0° to 5°C)</span>
          </div>
          <div className="flex items-center justify-center p-2 rounded bg-white">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>No Ice (&gt; 5°C)</span>
          </div>
        </div>
      </div>

      {/* Data Information */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <i className="ri-information-line text-blue-500 mr-2 mt-0.5"></i>
          <div className="text-sm text-blue-800">
            {isSampleData ? (
              <>
                <p className="font-medium mb-1">Showing Sample Data</p>
                <p>This chart displays realistic temperature patterns for demonstration. Visit the Dashboard to add real temperature readings for this rink.</p>
              </>
            ) : (
              <>
                <p className="font-medium mb-1">Real Data from {rinkName}</p>
                <p>This chart shows actual temperature readings submitted by users. Data helps track climate impact on outdoor ice conditions.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
