import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaSpinner, FaSearch, FaPlus, FaMinus, FaLocationArrow, FaExclamationTriangle } from 'react-icons/fa';

// Google Maps API Key from Android app
const GOOGLE_MAPS_API_KEY = 'AIzaSyCzdG6W3NuCNElD4ZOFBS6iWX_SHirxr9A';

const GoogleMapComponent = ({ type, onPlaceSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [mapZoom, setMapZoom] = useState(15);
  const [apiError, setApiError] = useState(false);
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  
  // Load the Google Maps script
  useEffect(() => {
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Check if the API loaded with errors
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        handleApiError("Google Maps API failed to initialize properly");
      }
    };
    
    script.onerror = () => {
      handleApiError("Failed to load Google Maps API");
    };
    
    // Add global error handler for Google Maps API errors
    window.gm_authFailure = () => {
      handleApiError("Google Maps API key authentication failed - API key may be invalid or restrictions may be in place");
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup markers when component unmounts
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
      
      // Remove global error handler
      window.gm_authFailure = null;
    };
  }, []);
  
  const handleApiError = (message) => {
    console.error("Google Maps API Error:", message);
    setApiError(true);
    setError(message);
    setLoading(false);
  };

  // Initialize map once the script is loaded
  const initializeMap = () => {
    if (!mapRef.current) return;
    
    try {
      // Create the map instance
      const mapOptions = {
        zoom: mapZoom,
        center: { lat: 19.0760, lng: 72.8777 }, // Default center (Mumbai)
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false, // We'll add our own zoom controls
      };
      
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
      
      // Check if the map was initialized properly
      if (!mapInstanceRef.current) {
        handleApiError("Map instance failed to initialize");
        return;
      }
      
      try {
        placesServiceRef.current = new window.google.maps.places.PlacesService(mapInstanceRef.current);
      } catch (err) {
        handleApiError("Places Service failed to initialize. Google Maps API key may not have Places API enabled.");
        return;
      }
      
      // Get user's current location
      getUserLocation();
      
      // Create InfoWindow for displaying place details on marker click
      const infoWindow = new window.google.maps.InfoWindow();
      
      // Add click listener to the map
      mapInstanceRef.current.addListener('click', (event) => {
        searchPlacesNear(event.latLng.lat(), event.latLng.lng());
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      handleApiError("Error initializing map: " + err.message);
    }
  };

  // Get the user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(userLoc);
          
          // Move map to user location
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(userLoc);
            
            // Add a marker for user location
            if (userMarkerRef.current) {
              userMarkerRef.current.setPosition(userLoc);
            } else {
              try {
                userMarkerRef.current = new window.google.maps.Marker({
                  position: userLoc,
                  map: mapInstanceRef.current,
                  title: 'Your Location',
                  icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 8
                  },
                  zIndex: 1000
                });
              } catch (err) {
                console.error('Error creating user marker:', err);
              }
            }
            
            // Search for places near user location
            searchPlacesNear(userLoc.lat, userLoc.lng);
          }
        },
        (err) => {
          console.error('Error getting location:', err);
          searchPlacesNear(19.0760, 72.8777); // Default to Mumbai
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      searchPlacesNear(19.0760, 72.8777); // Default to Mumbai
    }
  };

  // Search for places near a specific location
  const searchPlacesNear = (latitude, longitude) => {
    if (!placesServiceRef.current || apiError) return;
    
    setLoading(true);
    
    try {
      const location = new window.google.maps.LatLng(latitude, longitude);
      
      const request = {
        location: location,
        radius: 5000, // 5 km radius
        type: type === 'hospitals' ? 'hospital' : 'pharmacy'
      };
      
      placesServiceRef.current.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results);
          addMarkersToMap(results, location);
        } else if (status === 'UNKNOWN_ERROR' || status === 'ERROR') {
          handleApiError("Google Maps API error: " + status);
        } else {
          setPlaces([]);
          console.error('Error finding places:', status);
        }
        setLoading(false);
      });
    } catch (err) {
      console.error('Error in searchPlacesNear:', err);
      handleApiError("Error searching for places: " + err.message);
    }
  };

  // Add markers to the map for places
  const addMarkersToMap = (places, userLocation) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Ensure map instance exists
    if (!mapInstanceRef.current || apiError) return;
    
    try {
      // Create an info window for displaying place details
      const infoWindow = new window.google.maps.InfoWindow();
      
      // Add markers for places
      places.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: mapInstanceRef.current,
          title: place.name,
          icon: {
            url: type === 'hospitals' 
              ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' 
              : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });
        
        marker.addListener('click', () => {
          // Create content for info window
          const content = `
            <div style="padding: 8px; max-width: 300px;">
              <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: bold;">${place.name}</h3>
              <p style="margin: 0 0 8px; font-size: 14px;">${place.vicinity || ''}</p>
              ${place.rating ? `<p style="margin: 0; font-size: 14px;">Rating: ${place.rating}/5</p>` : ''}
              ${place.opening_hours ? `<p style="margin: 0; font-size: 14px; color: ${place.opening_hours.open_now ? 'green' : 'red'}">
                ${place.opening_hours.open_now ? 'Open Now' : 'Closed'}
              </p>` : ''}
            </div>
          `;
          
          infoWindow.setContent(content);
          infoWindow.open(mapInstanceRef.current, marker);
          
          // Notify parent component
          if (onPlaceSelect) {
            onPlaceSelect(place);
          }
        });
        
        markersRef.current.push(marker);
      });
      
      // Calculate bounds to encompass all markers plus user location
      const bounds = new window.google.maps.LatLngBounds();
      
      // Add user location to bounds
      if (userLocation) {
        bounds.extend(userLocation);
      }
      
      // Add all place markers to bounds
      places.forEach(place => {
        bounds.extend(place.geometry.location);
      });
      
      // Adjust map to show all markers
      mapInstanceRef.current.fitBounds(bounds);
      
      // Don't zoom in too close if there's only one point
      if (mapInstanceRef.current.getZoom() > 16) {
        mapInstanceRef.current.setZoom(16);
      }
    } catch (err) {
      console.error('Error adding markers to map:', err);
      handleApiError("Error displaying locations on map: " + err.message);
    }
  };

  // Handle search by query
  const handleSearch = () => {
    if (!searchQuery.trim() || apiError) return;
    
    try {
      const geocoder = new window.google.maps.Geocoder();
      
      setLoading(true);
      
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          
          // Move map to the searched location
          mapInstanceRef.current.setCenter(location);
          
          // Search for places near this location
          searchPlacesNear(location.lat(), location.lng());
        } else {
          setError('Location not found');
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Error in handleSearch:', err);
      handleApiError("Error searching for location: " + err.message);
    }
  };

  // Zoom controls
  const zoomIn = () => {
    if (mapInstanceRef.current && !apiError) {
      const newZoom = Math.min(mapInstanceRef.current.getZoom() + 1, 20);
      mapInstanceRef.current.setZoom(newZoom);
      setMapZoom(newZoom);
    }
  };
  
  const zoomOut = () => {
    if (mapInstanceRef.current && !apiError) {
      const newZoom = Math.max(mapInstanceRef.current.getZoom() - 1, 1);
      mapInstanceRef.current.setZoom(newZoom);
      setMapZoom(newZoom);
    }
  };

  // Center on user location
  const centerOnUser = () => {
    if (mapInstanceRef.current && userLocation && !apiError) {
      mapInstanceRef.current.setCenter(userLocation);
      mapInstanceRef.current.setZoom(15);
    } else if (!apiError) {
      getUserLocation();
    }
  };

  // Show error message with fix instructions
  const renderApiErrorMessage = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <FaExclamationTriangle className="text-amber-500 h-6 w-6 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Google Maps API Error</h3>
      </div>
      
      <p className="text-gray-700 mb-4">
        The Google Maps functionality is not working because the API key requires activation or billing setup.
      </p>
      
      <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">Error Details:</h4>
        <p className="text-sm text-gray-600 mb-2">
          {error || "API key authentication failed"}
        </p>
        <p className="text-sm text-gray-600">
          API Key: {GOOGLE_MAPS_API_KEY}
        </p>
      </div>
      
      <div className="space-y-2 mb-6">
        <h4 className="font-medium text-gray-800">To fix this issue:</h4>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 pl-2">
          <li>Go to the <a href="https://console.cloud.google.com/google/maps-apis/overview" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
          <li>Ensure the API key is valid and has not expired</li>
          <li>Enable the following APIs for your project:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Maps JavaScript API</li>
              <li>Places API</li>
              <li>Geocoding API</li>
            </ul>
          </li>
          <li>Set up billing for your Google Cloud account</li>
          <li>Check API key restrictions to ensure the domains are properly configured</li>
        </ol>
      </div>
      
      <p className="text-sm text-gray-500 italic mb-4">
        Note: You can temporarily replace the API key in the GoogleMapComponent.jsx file with a valid key for testing purposes.
      </p>
      
      <div className="flex justify-end">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Map Container */}
      <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-md">
        {apiError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            {renderApiErrorMessage()}
          </div>
        ) : (
          <>
            <div 
              ref={mapRef} 
              className="w-full h-full"
              style={{ borderRadius: '12px' }}
            ></div>
            
            {/* Loading indicator */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white p-4 rounded-full">
                  <FaSpinner className="text-blue-500 animate-spin h-8 w-8" />
                </div>
              </div>
            )}
            
            {/* Error message (non-API errors) */}
            {error && !apiError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-20">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                  <FaMapMarkerAlt className="text-red-500 h-12 w-12 mb-4 mx-auto" />
                  <p className="text-gray-800 text-center mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-3">
              {/* Zoom in */}
              <button 
                onClick={zoomIn}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                title="Zoom In"
              >
                <FaPlus className="text-gray-700" />
              </button>
              
              {/* Zoom out */}
              <button 
                onClick={zoomOut}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                title="Zoom Out"
              >
                <FaMinus className="text-gray-700" />
              </button>
              
              {/* Center on user location */}
              <button 
                onClick={centerOnUser}
                className="bg-blue-500 p-2 rounded-full shadow-md hover:bg-blue-600 focus:outline-none mt-3"
                title="My Location"
              >
                <FaLocationArrow className="text-white" />
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-3xl">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search for ${type}`}
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
                  >
                    <FaSearch className="h-5 w-5" />
                  </button>
                </div>
                
                {places.length > 0 && (
                  <p className="text-sm text-blue-600 mt-2 text-center">
                    Found {places.length} {type} nearby
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleMapComponent; 