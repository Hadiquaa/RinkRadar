
export const mockRinks = [
  {
    id: '1',
    name: 'Rideau Canal Skateway',
    location: {
      address: '90 Colonel By Dr',
      city: 'Ottawa',
      province: 'Ontario',
      latitude: 45.4215,
      longitude: -75.6972
    },
    currentTemperature: -8,
    photos: [
      'https://readdy.ai/api/search-image?query=Historic%20Rideau%20Canal%20ice%20skating%20rink%20in%20Ottawa%20with%20Parliament%20buildings%20in%20background%2C%20winter%20scene%20with%20snow%2C%20people%20skating%2C%20Canadian%20winter%20landscape%2C%20clear%20blue%20sky%2C%20historic%20architecture%2C%20pristine%20ice%20surface%2C%20winter%20tourism%2C%20natural%20outdoor%20rink&width=800&height=400&seq=1&orientation=landscape'
    ],
    temperatureHistory: [
      { temperature: -5, timestamp: '2024-01-15T10:00:00Z', notes: 'Perfect skating conditions' },
      { temperature: -8, timestamp: '2024-01-16T10:00:00Z', notes: 'Ice is solid and smooth' },
      { temperature: -12, timestamp: '2024-01-17T10:00:00Z', notes: 'Very cold but excellent ice quality' }
    ],
    userId: '1',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '2',
    name: 'Bowness Park Lagoon',
    location: {
      address: '8900 48 Ave NW',
      city: 'Calgary',
      province: 'Alberta',
      latitude: 51.0918,
      longitude: -114.2278
    },
    currentTemperature: -15,
    photos: [
      'https://readdy.ai/api/search-image?query=Beautiful%20outdoor%20ice%20skating%20rink%20at%20Bowness%20Park%20Calgary%20surrounded%20by%20snow%20covered%20trees%2C%20winter%20wonderland%20scene%2C%20families%20skating%2C%20mountain%20backdrop%2C%20Alberta%20winter%20landscape%2C%20frozen%20lagoon%2C%20pristine%20white%20snow%2C%20community%20recreation&width=800&height=400&seq=2&orientation=landscape'
    ],
    temperatureHistory: [
      { temperature: -10, timestamp: '2024-01-15T10:00:00Z', notes: 'Good skating weather' },
      { temperature: -15, timestamp: '2024-01-16T10:00:00Z', notes: 'Cold but great ice conditions' },
      { temperature: -18, timestamp: '2024-01-17T10:00:00Z', notes: 'Very cold, dress warmly' }
    ],
    userId: '1',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '3',
    name: 'Assiniboine Riverwalk',
    location: {
      address: 'Assiniboine Ave',
      city: 'Winnipeg',
      province: 'Manitoba',
      latitude: 49.8844,
      longitude: -97.1711
    },
    currentTemperature: -22,
    photos: [
      'https://readdy.ai/api/search-image?query=Frozen%20Assiniboine%20River%20skating%20trail%20in%20Winnipeg%20with%20city%20skyline%20in%20background%2C%20winter%20scene%20with%20heavy%20snow%2C%20people%20skating%20on%20river%2C%20Manitoba%20winter%20landscape%2C%20urban%20winter%20recreation%2C%20cold%20weather%20activities%2C%20river%20ice%20skating&width=800&height=400&seq=3&orientation=landscape'
    ],
    temperatureHistory: [
      { temperature: -18, timestamp: '2024-01-15T10:00:00Z', notes: 'River ice is thick and safe' },
      { temperature: -22, timestamp: '2024-01-16T10:00:00Z', notes: 'Extremely cold, limited skating time recommended' },
      { temperature: -25, timestamp: '2024-01-17T10:00:00Z', notes: 'Dangerously cold, rink may close' }
    ],
    userId: '2',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    name: 'Lake Louise Ice Rink',
    location: {
      address: 'Lake Louise Dr',
      city: 'Lake Louise',
      province: 'Alberta',
      latitude: 51.4254,
      longitude: -116.1773
    },
    currentTemperature: -12,
    photos: [
      'https://readdy.ai/api/search-image?query=Spectacular%20Lake%20Louise%20ice%20skating%20rink%20with%20majestic%20Rocky%20Mountains%20backdrop%2C%20turquoise%20frozen%20lake%2C%20snow%20covered%20peaks%2C%20pristine%20winter%20wilderness%2C%20Canadian%20Rockies%2C%20world%20class%20natural%20ice%20rink%2C%20luxury%20mountain%20resort%20setting&width=800&height=400&seq=4&orientation=landscape'
    ],
    temperatureHistory: [
      { temperature: -8, timestamp: '2024-01-15T10:00:00Z', notes: 'Mountain air, perfect conditions' },
      { temperature: -12, timestamp: '2024-01-16T10:00:00Z', notes: 'Crisp mountain weather, excellent visibility' },
      { temperature: -15, timestamp: '2024-01-17T10:00:00Z', notes: 'Cold but stunning mountain views' }
    ],
    userId: '2',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '5',
    name: 'Nathan Phillips Square',
    location: {
      address: '100 Queen St W',
      city: 'Toronto',
      province: 'Ontario',
      latitude: 45.4636,
      longitude: -79.3832
    },
    currentTemperature: -3,
    photos: [
      'https://readdy.ai/api/search-image?query=Nathan%20Phillips%20Square%20ice%20skating%20rink%20in%20downtown%20Toronto%20with%20Toronto%20sign%2C%20city%20hall%20architecture%2C%20urban%20winter%20scene%2C%20people%20skating%2C%20city%20lights%2C%20modern%20architecture%2C%20winter%20festival%20atmosphere%2C%20metropolitan%20ice%20rink&width=800&height=400&seq=5&orientation=landscape'
    ],
    temperatureHistory: [
      { temperature: -1, timestamp: '2024-01-15T10:00:00Z', notes: 'Mild weather, good for beginners' },
      { temperature: -3, timestamp: '2024-01-16T10:00:00Z', notes: 'Cool but comfortable skating' },
      { temperature: -5, timestamp: '2024-01-17T10:00:00Z', notes: 'Perfect temperature for outdoor skating' }
    ],
    userId: '3',
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '6',
    name: 'Confederation Park',
    location: {
      address: '1 Confederation Park',
      city: 'Calgary',
      province: 'Alberta',
      latitude: 51.0447,
      longitude: -114.0719
    },
    currentTemperature: -18,
    photos: [
      'https://readdy.ai/api/search-image?query=Community%20ice%20skating%20rink%20at%20Confederation%20Park%20Calgary%20with%20families%20enjoying%20winter%20activities%2C%20snow%20covered%20park%20setting%2C%20community%20recreation%2C%20prairie%20winter%20landscape%2C%20outdoor%20leisure%2C%20neighborhood%20gathering%20place%2C%20winter%20sports&width=800&height=400&seq=6&orientation=landscape'
    ],
    temperatureHistory: [
      { temperature: -12, timestamp: '2024-01-15T10:00:00Z', notes: 'Community rink in great condition' },
      { temperature: -18, timestamp: '2024-01-16T10:00:00Z', notes: 'Cold prairie weather, bundle up' },
      { temperature: -20, timestamp: '2024-01-17T10:00:00Z', notes: 'Very cold, shorter skating sessions recommended' }
    ],
    userId: '3',
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  }
];
