import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

// Placeholder component to show while the real map component loads
const MapPlaceholder = ({ type, loading, error }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`flex flex-col items-center justify-center h-96 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl transition-colors duration-200`}>
      {loading ? (
        <>
          <FaSpinner className={`h-10 w-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'} animate-spin mb-4 transition-colors duration-200`} />
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>Loading map...</p>
        </>
      ) : error ? (
        <>
          <FaMapMarkerAlt className="text-red-500 h-12 w-12 mb-4" />
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg transition-colors duration-200`}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={`mt-4 px-4 py-2 ${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition-colors duration-200`}
          >
            Try Again
          </button>
        </>
      ) : (
        <>
          <FaMapMarkerAlt className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} h-12 w-12 mb-4 transition-colors duration-200`} />
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>Finding nearby {type}...</p>
        </>
      )}
    </div>
  );
};

// Mock data for faster development
const MOCK_LOCATIONS = {
  hospitals: [
    { id: 1, name: "Memorial Hospital", vicinity: "123 Main St", rating: 4.5, open_now: true },
    { id: 2, name: "General Hospital", vicinity: "456 Oak Ave", rating: 4.2, open_now: true },
    { id: 3, name: "St. Mary's Medical Center", vicinity: "789 Pine Blvd", rating: 4.8, open_now: false },
    { id: 4, name: "University Hospital", vicinity: "101 College Rd", rating: 4.0, open_now: true }
  ],
  pharmacies: [
    { id: 1, name: "City Pharmacy", vicinity: "222 Market St", rating: 4.3, open_now: true },
    { id: 2, name: "Health Plus Pharmacy", vicinity: "333 Liberty Ave", rating: 4.1, open_now: true },
    { id: 3, name: "MediCare Pharmacy", vicinity: "444 Harbor Dr", rating: 4.6, open_now: false },
    { id: 4, name: "Quick Rx", vicinity: "555 Central Pkwy", rating: 3.9, open_now: true }
  ]
};

const Map = ({ type }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [nearby, setNearby] = useState([]);
  const [useDevMode, setUseDevMode] = useState(false); // Change this to false when ready for production
  const { darkMode } = useTheme();

  useEffect(() => {
    // In development mode, use mock data to avoid API calls
    if (useDevMode) {
      setTimeout(() => {
        setNearby(MOCK_LOCATIONS[type === 'hospitals' ? 'hospitals' : 'pharmacies']);
        setLoading(false);
        setMapLoaded(true);
      }, 1500); // Simulate loading delay
      return;
    }

    // Production mode - load real map
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        setLoading(false);
        return;
      }
      
      const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''; // Use environment variable
      
      if (!API_KEY) {
        setError('Google Maps API key is missing. Please check your environment configuration.');
        setLoading(false);
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setMapLoaded(true);
        initializeMap();
      };
      
      script.onerror = () => {
        setError('Failed to load Google Maps API. Check your internet connection and API key.');
        setLoading(false);
      };
      
      document.head.appendChild(script);
    };
    
    loadGoogleMapsScript();
  }, [type, useDevMode]);
  
  const initializeMap = () => {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Initialize the map with the user's location
          const mapElement = document.getElementById('google-map');
          if (!mapElement) {
            setError('Map container not found');
            setLoading(false);
            return;
          }
          
          const map = new window.google.maps.Map(mapElement, {
            center: userLocation,
            zoom: 14,
            mapTypeControl: false,
            streetViewControl: false,
            styles: darkMode ? [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
              },
              {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
              },
              {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
              },
              {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
              },
            ] : []
          });
          
          // Add marker for user's location
          new window.google.maps.Marker({
            position: userLocation,
            map,
            title: 'Your Location'
          });
          
          // Search for nearby places
          const service = new window.google.maps.places.PlacesService(map);
          service.nearbySearch(
            {
              location: userLocation,
              radius: 3000,
              type: type === 'hospitals' ? 'hospital' : 'pharmacy'
            },
            (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setNearby(results.slice(0, 8)); // Limit to 8 results
                
                // Add markers for places
                results.slice(0, 8).forEach((place) => {
                  new window.google.maps.Marker({
                    position: place.geometry.location,
                    map,
                    title: place.name
                  });
                });
              } else {
                setError(`No ${type} found nearby`);
              }
              setLoading(false);
            }
          );
        },
        (err) => {
          setError(`Error getting your location: ${err.message}`);
          setLoading(false);
        },
        { timeout: 10000 }
      );
    } catch (err) {
      setError(`Error initializing map: ${err.message}`);
      setLoading(false);
    }
  };
  
  // If we're still loading, show a placeholder
  if (loading || !mapLoaded) {
    return <MapPlaceholder type={type} loading={loading} />;
  }
  
  // If there was an error, show an error message
  if (error) {
    return <MapPlaceholder type={type} error={error} />;
  }
  
  return (
    <div>
      {/* The actual map container */}
      {!useDevMode && (
        <div id="google-map" className="h-96 w-full rounded-xl shadow-md mb-6"></div>
      )}
      
      {/* Development mode message */}
      {useDevMode && (
        <div className={`${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-400'} border-l-4 p-4 mb-6 rounded-lg transition-colors duration-200`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'} transition-colors duration-200`}>
                Development mode: Using mock data instead of Google Maps API.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* List of nearby places */}
      <div>
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-200`}>Nearby {type}</h3>
        {nearby.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearby.map((place, index) => (
              <div 
                key={place.id || place.place_id || index} 
                className={`${darkMode ? 'bg-dark-card' : 'bg-white'} p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <h4 className={`font-medium text-lg ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{place.name}</h4>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm transition-colors duration-200`}>{place.vicinity}</p>
                <div className="flex items-center mt-2">
                  {place.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm transition-colors duration-200`}>{place.rating}</span>
                    </div>
                  )}
                  {(place.opening_hours || place.open_now !== undefined) && (
                    <span className={`ml-auto text-sm ${
                      (place.opening_hours?.open_now || place.open_now) 
                        ? darkMode ? 'text-green-400' : 'text-green-600' 
                        : darkMode ? 'text-red-400' : 'text-red-600'
                    } transition-colors duration-200`}>
                      {(place.opening_hours?.open_now || place.open_now) ? 'Open' : 'Closed'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>No {type} found nearby.</p>
        )}
      </div>
    </div>
  );
};

export default Map; 