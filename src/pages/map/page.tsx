import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import AuthModal from '../../components/feature/AuthModal';
import TemperatureChart from '../../components/feature/TemperatureChart';
import Modal from '../../components/base/Modal';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { useSupabaseData } from '../../hooks/useSupabaseData';

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
    selectRinkFromMap: (rinkId: string) => void;
  }
}

export default function Map() {
  const { user, signIn, signUp, signOut } = useSupabaseAuth();
  const { rinks, loading, updateRink } = useSupabaseData();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });
  const [selectedRink, setSelectedRink] = useState<any | null>(null);
  const [chartModal, setChartModal] = useState<{ isOpen: boolean; rink: any | null }>({
    isOpen: false,
    rink: null
  });
  const [temperatureFilter, setTemperatureFilter] = useState<[number, number]>([-30, 10]);
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [markersLoaded, setMarkersLoaded] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const markerClusterer = useRef<any>(null);
  const placesService = useRef<any>(null);
  const [rinkPhotos, setRinkPhotos] = useState<Record<string, string>>({});
  const [loadingPhotos, setLoadingPhotos] = useState<Record<string, boolean>>({});
  const [visibleRinks, setVisibleRinks] = useState<any[]>([]);
  const [currentBounds, setCurrentBounds] = useState<any>(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // Enhanced climate facts about ice rinks and global warming
  const climateFacts = [
    {
      icon: "ri-thermometer-line",
      title: "Canada's Accelerating Warmth",
      fact: "Canada has warmed twice as fast as the global average since 1948, with winter temperatures rising 3.3°C in northern regions and 2.2°C in southern areas.",
      impact: "Outdoor skating seasons now end 2-3 weeks earlier than in the 1950s, fundamentally changing winter recreation traditions."
    },
    {
      icon: "ri-calendar-line",
      title: "Shrinking Ice Season",
      fact: "Outdoor skating seasons have shortened by 5-10 days per decade across Canada since the 1950s, with some regions losing up to 6 weeks of reliable ice.",
      impact: "Community hockey leagues are forced to move indoors earlier, increasing costs and reducing accessibility for families."
    },
    {
      icon: "ri-water-percent-line",
      title: "Dangerous Ice Conditions",
      fact: "Freeze-thaw cycles have increased by 40% in southern Canada, creating unpredictable ice thickness and dangerous skating conditions that claim lives annually.",
      impact: "More accidents occur as communities struggle to determine safe ice conditions amid increasingly erratic weather patterns."
    },
    {
      icon: "ri-map-2-line",
      title: "Geographic Climate Shift",
      fact: "Reliable outdoor skating zones are moving 65km northward per decade in North America, abandoning traditional hockey communities to unreliable winters.",
      impact: "Historic outdoor rinks in Toronto, Montreal, and Ottawa may become unusable within 20-30 years without artificial cooling."
    },
    {
      icon: "ri-time-line",
      title: "2050 Climate Projections",
      fact: "By 2050, outdoor skating may only be reliable north of 55°N latitude under current emission trends, affecting 60% of existing community rinks.",
      impact: "Cities like Winnipeg, Edmonton, and Calgary could lose their outdoor hockey culture entirely, transforming Canadian winter identity."
    },
    {
      icon: "ri-team-line",
      title: "Cultural Heritage at Risk",
      fact: "Over 2.8 million Canadians participate in outdoor hockey annually - a $4.2 billion tradition threatened by climate change and warming winters.",
      impact: "Loss of outdoor rinks means losing community gathering spaces, childhood memories, and a fundamental part of Canadian cultural identity."
    },
    {
      icon: "ri-alert-line",
      title: "Economic Impact Warning",
      fact: "Winter tourism dependent on outdoor ice activities generates $2.7 billion annually in Canada, with 78% of this revenue at severe risk by 2040.",
      impact: "Rural communities that rely on winter sports tourism face economic devastation as reliable outdoor ice becomes increasingly rare."
    },
    {
      icon: "ri-snowflake-line",
      title: "Arctic Ice Loss Connection",
      fact: "Arctic sea ice loss has disrupted polar vortex patterns, bringing more frequent warm winter air masses to traditional skating regions across North America.",
      impact: "Sudden January thaws and February heat waves now regularly destroy months of careful ice preparation and community investment."
    },
    {
      icon: "ri-global-line",
      title: "Global Warming Acceleration",
      fact: "The last decade included 8 of the 10 warmest years on record globally, with winter warming occurring 3x faster than summer warming in northern regions.",
      impact: "What once were rare warm spells are becoming normal winter weather, making outdoor ice maintenance nearly impossible in many areas."
    },
    {
      icon: "ri-leaf-line",
      title: "Hope Through Action",
      fact: "Rapid decarbonization and local climate action can still preserve some outdoor skating traditions, but the window for action closes each winter season.",
      impact: "Community-led initiatives combining renewable energy, efficient refrigeration, and climate advocacy offer the last hope for saving outdoor hockey culture."
    }
  ];

  // Get unique provinces from rinks data
  const provinces = [...new Set(rinks.map(rink => rink.province).filter(Boolean))].sort();

  // Enhanced filter function with search functionality
  const filteredRinks = rinks.filter(rink => {
    const tempInRange = rink.current_temperature >= temperatureFilter[0] && 
                       rink.current_temperature <= temperatureFilter[1];
    const provinceMatch = provinceFilter === 'all' || rink.province === provinceFilter;
    
    // Search functionality - check name, city, and province with null safety
    const searchMatch = searchQuery === '' || 
      (rink.name && rink.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rink.city && rink.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rink.province && rink.province.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return tempInRange && provinceMatch && searchMatch;
  });

  // Clear search function
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchQuery('');
    setProvinceFilter('all');
    setTemperatureFilter([-30, 10]);
  };

  // Loading overlay management with timeout
  useEffect(() => {
    const maxTimeout = setTimeout(() => {
      setShowLoadingOverlay(false);
    }, 15000); // 15 second maximum

    if (!loading && mapLoaded && markersLoaded) {
      setTimeout(() => {
        setShowLoadingOverlay(false);
        clearTimeout(maxTimeout);
      }, 1000); // Small delay to ensure smooth transition
    }

    return () => clearTimeout(maxTimeout);
  }, [loading, mapLoaded, markersLoaded]);

  // Rotating climate facts slideshow
  useEffect(() => {
    if (showLoadingOverlay) {
      const interval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % climateFacts.length);
      }, 4000); // 4 seconds per fact
      
      return () => clearInterval(interval);
    }
  }, [showLoadingOverlay, climateFacts.length]);

  // Enhanced Google Maps API loading with MarkerClusterer
  useEffect(() => {
    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    if (googleMapsLoaded) return;

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setGoogleMapsLoaded(true));
      return;
    }

    // Load Google Maps with MarkerClusterer
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCc2iN7aydNT2ffmJd1pxEMom1moPsuijA&libraries=places&loading=async&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    window.initGoogleMaps = () => {
      // Load MarkerClusterer after Google Maps
      const clustererScript = document.createElement('script');
      clustererScript.src = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
      clustererScript.onload = () => {
        setGoogleMapsLoaded(true);
      };
      document.head.appendChild(clustererScript);
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
    };
    
    document.head.appendChild(script);
  }, []);

  // Simplified photo fetching function
  const fetchPlacePhoto = async (rink: any): Promise<string | null> => {
    if (!placesService.current) return null;

    return new Promise((resolve) => {
      const request = {
        location: new window.google.maps.LatLng(rink.latitude, rink.longitude),
        radius: 200,
        type: ['establishment']
      };

      placesService.current.nearbySearch(request, (results: any[], status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length > 0) {
          const placeWithPhotos = results.find(place => place.photos?.length > 0);
          
          if (placeWithPhotos?.photos?.[0]?.photo_reference) {
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${placeWithPhotos.photos[0].photo_reference}&key=AIzaSyCc2iN7aydNT2ffmJd1pxEMom1moPsuijA`;
            resolve(photoUrl);
            return;
          }
        }
        resolve(null);
      });
    });
  };

  // Function to get rinks within bounds with initial limit
  const getRinksInBounds = (bounds: any, allRinks: any[], isInitialLoad = false) => {
    if (isInitialLoad) {
      return allRinks.slice(0, 15);
    }
    
    if (!bounds) return allRinks.slice(0, 50);

    return allRinks.filter(rink => {
      const position = new window.google.maps.LatLng(rink.latitude, rink.longitude);
      return bounds.contains(position);
    });
  };

  // Enhanced map initialization
  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current || rinks.length === 0 || mapInstance.current) return;

    const initialRinks = filteredRinks.slice(0, 15);
    
    let center = { lat: 56.1304, lng: -106.3468 }; // Canada center
    
    if (initialRinks.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      initialRinks.forEach(rink => {
        bounds.extend({ lat: rink.latitude, lng: rink.longitude });
      });
      center = bounds.getCenter().toJSON();
    }

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: initialRinks.length > 0 ? 6 : 4,
      center: center,
      mapTypeId: 'roadmap',
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      gestureHandling: 'greedy',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'simplified' }]
        }
      ]
    });

    placesService.current = new window.google.maps.places.PlacesService(mapInstance.current);
    setVisibleRinks(initialRinks);

    // Add bounds change listener
    let boundsTimeout: NodeJS.Timeout;
    mapInstance.current.addListener('bounds_changed', () => {
      const bounds = mapInstance.current.getBounds();
      
      clearTimeout(boundsTimeout);
      boundsTimeout = setTimeout(() => {
        setCurrentBounds(bounds);
        const rinksInBounds = getRinksInBounds(bounds, filteredRinks, false);
        setVisibleRinks(rinksInBounds);
      }, 500);
    });

    // Add zoom change listener
    mapInstance.current.addListener('zoom_changed', () => {
      const zoom = mapInstance.current.getZoom();
      if (zoom < 6) {
        setVisibleRinks(filteredRinks.slice(0, 20));
      }
    });

    window.selectRinkFromMap = (rinkId: string) => {
      const rink = rinks.find(r => r.id === rinkId);
      if (rink) {
        setSelectedRink(rink);
      }
    };

    setMapLoaded(true);
  }, [googleMapsLoaded, rinks.length]);

  // Update visible rinks when filters change
  useEffect(() => {
    if (mapInstance.current && currentBounds) {
      const rinksInBounds = getRinksInBounds(currentBounds, filteredRinks, false);
      setVisibleRinks(rinksInBounds);
    } else if (!mapLoaded) {
      setVisibleRinks(filteredRinks.slice(0, 15));
    } else {
      setVisibleRinks(filteredRinks.slice(0, 50));
    }
  }, [filteredRinks, currentBounds, mapLoaded]);

  // Load photos for initial visible rinks
  useEffect(() => {
    if (!placesService.current || visibleRinks.length === 0) return;

    const loadPhotos = async () => {
      const rinksToLoad = visibleRinks.slice(0, 15);
      
      for (const rink of rinksToLoad) {
        if (!rinkPhotos[rink.id] && !loadingPhotos[rink.id]) {
          setLoadingPhotos(prev => ({ ...prev, [rink.id]: true }));
          
          try {
            const photoUrl = await fetchPlacePhoto(rink);
            if (photoUrl) {
              setRinkPhotos(prev => ({ ...prev, [rink.id]: photoUrl }));
            }
          } catch (error) {
            console.error('Error loading photo for:', rink.name, error);
          } finally {
            setLoadingPhotos(prev => ({ ...prev, [rink.id]: false }));
          }
          
          // Delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    };

    loadPhotos();
  }, [placesService.current, visibleRinks]);

  // Marker updates with photo integration
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current || !googleMapsLoaded || !window.markerClusterer) return;

    const currentMarkerIds = new Set(markersRef.current.map(m => m.rinkId));
    const newRinkIds = new Set(visibleRinks.slice(0, 200).map(r => r.id));
    
    const hasChanges = currentMarkerIds.size !== newRinkIds.size || 
                       [...currentMarkerIds].some(id => !newRinkIds.has(id)) ||
                       [...newRinkIds].some(id => !currentMarkerIds.has(id));
    
    if (!hasChanges && markersRef.current.length > 0) {
      setMarkersLoaded(true);
      return;
    }

    // Clear existing markers
    if (markerClusterer.current) {
      markerClusterer.current.clearMarkers();
    }
    markersRef.current.forEach(marker => {
      if (marker.infoWindow) {
        marker.infoWindow.close();
      }
      marker.setMap(null);
    });
    markersRef.current = [];

    const displayRinks = visibleRinks.slice(0, 200);

    const markers = displayRinks.map(rink => {
      const marker = new window.google.maps.Marker({
        position: { lat: rink.latitude, lng: rink.longitude },
        title: rink.name,
        optimized: true,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#1E40AF" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
          anchor: new window.google.maps.Point(12, 12)
        }
      });

      (marker as any).rinkId = rink.id;

      // Create info window content
      const createInfoWindowContent = () => {
        const photoUrl = rinkPhotos[rink.id];
        const isLoadingPhoto = loadingPhotos[rink.id];
        
        let photoHtml = '';
        if (photoUrl) {
          photoHtml = `
            <div style="margin-bottom: 8px;">
              <img src="${photoUrl}" alt="Nearby place photo" 
                   style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px;" 
                   loading="lazy" />
            </div>
          `;
        } else if (isLoadingPhoto) {
          photoHtml = `
            <div style="margin-bottom: 8px; height: 80px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
              <div style="color: #6b7280; font-size: 12px; text-align: center;">
                <div style="width: 16px; height: 16px; border: 2px solid #3B82F6; border-top: 2px solid transparent; border-radius: 50%; display: inline-block; margin-right: 8px; animation: spin 1s linear infinite;"></div>
                Searching nearby places...
              </div>
            </div>
          `;
        }

        return `
          <div style="max-width: 200px; padding: 8px;">
            ${photoHtml}
            <h3 style="margin: 0 0 6px 0; color: #1F2937; font-size: 14px; font-weight: bold;">${rink.name}</h3>
            <p style="margin: 0 0 6px 0; color: #6B7280; font-size: 12px;">
              <strong>Location:</strong> ${rink.city}${rink.province ? `, ${rink.province}` : ''}
            </p>
            <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 12px;">
              <strong>Temperature:</strong> <span style="color: ${
                rink.current_temperature < -10 ? '#2563EB' :
                rink.current_temperature < 0 ? '#059669' : '#DC2626'
              }; font-weight: bold;">${rink.current_temperature}°C</span>
            </p>
            <div style="margin-top: 8px;">
              <button onclick="window.selectRinkFromMap('${rink.id}')" 
                      style="background: #3B82F6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                View Details
              </button>
            </div>
          </div>
        `;
      };

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(),
        maxWidth: 220
      });

      marker.addListener('click', async () => {
        // Close other info windows
        markersRef.current.forEach(m => {
          if (m.infoWindow) {
            m.infoWindow.close();
          }
        });

        // Try to fetch photo if not already loaded
        if (!rinkPhotos[rink.id] && !loadingPhotos[rink.id]) {
          setLoadingPhotos(prev => ({ ...prev, [rink.id]: true }));
          
          try {
            const photoUrl = await fetchPlacePhoto(rink);
            if (photoUrl) {
              setRinkPhotos(prev => ({ ...prev, [rink.id]: photoUrl }));
            }
          } catch (error) {
            console.error('Error fetching photo on click:', error);
          } finally {
            setLoadingPhotos(prev => ({ ...prev, [rink.id]: false }));
          }
        }

        infoWindow.setContent(createInfoWindowContent());
        infoWindow.open(mapInstance.current, marker);
      });

      marker.infoWindow = infoWindow;
      return marker;
    });

    markersRef.current = markers;

    // Initialize MarkerClusterer
    if (window.markerClusterer && markers.length > 0) {
      markerClusterer.current = new window.markerClusterer.MarkerClusterer({
        map: mapInstance.current,
        markers: markers,
        gridSize: 60,
        maxZoom: 15,
        minimumClusterSize: 3,
        styles: [{
          textColor: 'white',
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
            </svg>
          `),
          height: 40,
          width: 40,
          textSize: 12
        }]
      });
    }

    if (markers.length > 1 && markers.length < 100) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      mapInstance.current.fitBounds(bounds, { padding: 50 });
    }

    setMarkersLoaded(true);
  }, [mapLoaded, visibleRinks, rinkPhotos, loadingPhotos]);

  const handleAuthSubmit = async (email: string, password: string) => {
    if (authModal.mode === 'login') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogin={() => setAuthModal({ isOpen: true, mode: 'login' })}
        onSignUp={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        onLogout={signOut}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {showLoadingOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
          >
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-white/20 text-2xl"
                    initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: -50,
                      rotate: 0 
                    }}
                    animate={{ 
                      y: window.innerHeight + 50,
                      rotate: 360 
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "linear"
                    }}
                  >
                    ❄
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12"
              >
                <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
                <h1 className="text-4xl font-bold text-white mb-4">Loading RinkRadar</h1>
                <p className="text-xl text-blue-200">Mapping climate impact on outdoor ice rinks</p>
              </motion.div>

              <div className="relative h-80 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFactIndex}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-md rounded-2xl p-8 border border-red-400/30 max-w-3xl mx-auto"
                  >
                    <div className="flex items-start space-x-6">
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-red-400/50"
                      >
                        <i className={`${climateFacts[currentFactIndex].icon} text-3xl text-red-400`}></i>
                      </motion.div>
                      <div className="flex-1 text-left">
                        <motion.h3
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-2xl font-bold text-white mb-4"
                        >
                          {climateFacts[currentFactIndex].title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-lg text-gray-200 mb-4 leading-relaxed"
                        >
                          {climateFacts[currentFactIndex].fact}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                          className="flex items-start text-orange-300 bg-orange-500/10 rounded-lg p-3 border border-orange-400/30"
                        >
                          <i className="ri-alert-line mr-2 text-xl flex-shrink-0 mt-0.5"></i>
                          <span className="font-medium">{climateFacts[currentFactIndex].impact}</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex justify-center space-x-3 mt-8 mb-6"
              >
                {climateFacts.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index === currentFactIndex ? 'bg-blue-400' : 'bg-white/30'
                    }`}
                    animate={index === currentFactIndex ? { scale: 1.2 } : { scale: 1 }}
                  />
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="max-w-md mx-auto"
              >
                <div className="bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </div>
                <p className="text-sm text-blue-200">
                  Loading map, markers, and searching for nearby place photos...
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Interactive Rink Map</h1>
          <p className="text-lg text-gray-600">
            Explore ice rinks across Canada with real-time temperature data and Google Places photos
          </p>
        </div>

        {/* Enhanced Search and Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Search & Filter Rinks</h2>
            {(searchQuery || provinceFilter !== 'all' || temperatureFilter[0] !== -30 || temperatureFilter[1] !== 10) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer flex items-center"
              >
                <i className="ri-refresh-line mr-1"></i>
                Clear All Filters
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Rinks
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400 text-sm"></i>
              </div>
              <input
                type="text"
                placeholder="Search by rink name, city, or province..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  <i className="ri-close-line text-gray-400 hover:text-gray-600 text-sm"></i>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                <i className="ri-information-line mr-1"></i>
                Searching in rink names, cities, and provinces
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature Range (°C)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="-30"
                  max="10"
                  value={temperatureFilter[0]}
                  onChange={(e) => setTemperatureFilter([parseInt(e.target.value), temperatureFilter[1]])}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12">{temperatureFilter[0]}°C</span>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <input
                  type="range"
                  min="-30"
                  max="10"
                  value={temperatureFilter[1]}
                  onChange={(e) => setTemperatureFilter([temperatureFilter[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12">{temperatureFilter[1]}°C</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Province
              </label>
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
              >
                <option value="all">All Provinces</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <div className="flex items-center mb-1">
                  <i className="ri-map-pin-line text-blue-500 mr-1"></i>
                  <span>Displaying {visibleRinks.length} of {filteredRinks.length} rinks</span>
                </div>
                {searchQuery && (
                  <div className="flex items-center text-green-600">
                    <i className="ri-search-line mr-1"></i>
                    <span>Search active: "{searchQuery}"</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || provinceFilter !== 'all' || temperatureFilter[0] !== -30 || temperatureFilter[1] !== 10) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: "{searchQuery}"
                    <button onClick={clearSearch} className="ml-1 cursor-pointer">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}
                
                {provinceFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Province: {provinceFilter}
                    <button onClick={() => setProvinceFilter('all')} className="ml-1 cursor-pointer">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}
                
                {(temperatureFilter[0] !== -30 || temperatureFilter[1] !== 10) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Temp: {temperatureFilter[0]}°C to {temperatureFilter[1]}°C
                    <button onClick={() => setTemperatureFilter([-30, 10])} className="ml-1 cursor-pointer">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {filteredRinks.length === 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <i className="ri-search-line text-yellow-600 mr-2"></i>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">No rinks found</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Try adjusting your search terms or filters to find more results.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Google Map */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Google Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 bg-gray-100 relative">
                {!googleMapsLoaded ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading map with photo integration...</p>
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} className="w-full h-full" />
                )}
              </div>
            </div>

            {/* Rink Cards Grid */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {visibleRinks.slice(0, 20).map(rink => (
                <div
                  key={rink.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => setSelectedRink(rink)}
                >
                  <div className="h-48 bg-gray-200 relative">
                    {rinkPhotos[rink.id] ? (
                      <img
                        src={rinkPhotos[rink.id]}
                        alt={`${rink.name} area photo`}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : loadingPhotos[rink.id] ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-xs text-gray-500">Loading photo...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <div className="text-center">
                          <i className="ri-map-pin-line text-4xl text-blue-300 mb-2"></i>
                          <p className="text-sm text-blue-600 font-medium">{rink.name}</p>
                          <p className="text-xs text-blue-500 mt-1">{rink.city}, {rink.province}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{rink.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {rink.city}{rink.province && `, ${rink.province}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="ri-thermometer-line text-blue-500 mr-1"></i>
                        <span className={`text-lg font-semibold ${
                          rink.current_temperature < -10 ? 'text-blue-600' :
                          rink.current_temperature < 0 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {rink.current_temperature}°C
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {rinkPhotos[rink.id] && (
                          <i className="ri-camera-line text-green-500 mr-1" title="Photo loaded"></i>
                        )}
                        Click for details
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rink Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              {selectedRink ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{selectedRink.name}</h2>
                    <button
                      onClick={() => setSelectedRink(null)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>

                  <div className="mb-4">
                    {rinkPhotos[selectedRink.id] ? (
                      <img
                        src={rinkPhotos[selectedRink.id]}
                        alt={`${selectedRink.name} area photo`}
                        className="w-full h-48 object-cover object-center rounded-lg"
                      />
                    ) : loadingPhotos[selectedRink.id] ? (
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-xs text-gray-500">Finding nearby photos...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <i className="ri-map-pin-line text-4xl text-blue-300 mb-2"></i>
                          <p className="text-sm text-blue-600 font-medium">{selectedRink.name}</p>
                          <p className="text-xs text-blue-500 mt-1">{selectedRink.city}, {selectedRink.province}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                      <p className="text-gray-600 text-sm">
                        {selectedRink.city}{selectedRink.province && `, ${selectedRink.province}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedRink.latitude.toFixed(6)}, {selectedRink.longitude.toFixed(6)}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Current Temperature</h3>
                      <div className="flex items-center">
                        <i className="ri-thermometer-line text-blue-500 mr-2"></i>
                        <span className={`text-2xl font-bold ${
                          selectedRink.current_temperature < -10 ? 'text-blue-600' :
                          selectedRink.current_temperature < 0 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {selectedRink.current_temperature}°C
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => setChartModal({ isOpen: true, rink: selectedRink })}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-line-chart-line mr-2"></i>
                        View Temperature Trends
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="ri-map-pin-line text-4xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Rink</h3>
                  <p className="text-gray-600 mb-4">
                    Click on any rink marker or card to view details and photos from nearby places.
                  </p>
                  <div className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3">
                    <i className="ri-camera-line mr-1"></i>
                    Photos are automatically fetched from Google Places within 200m of each rink
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Temperature Chart Modal */}
      <Modal
        isOpen={chartModal.isOpen}
        onClose={() => setChartModal({ isOpen: false, rink: null })}
        title="Temperature Trends"
        size="lg"
      >
        {chartModal.rink && (
          <TemperatureChart 
            rinkId={chartModal.rink.id} 
            rinkName={chartModal.rink.name}
          />
        )}
      </Modal>

      <Footer user={user} />

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        mode={authModal.mode}
        onSubmit={handleAuthSubmit}
      />
    </div>
  );
}
