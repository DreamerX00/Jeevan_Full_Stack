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
  const searchSessionRef = useRef(null);
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
    if (apiError) return;
    
    setLoading(true);
    
    try {
      const location = new window.google.maps.LatLng(latitude, longitude);
      
      // Using the new Places API via LocalContextMapView
      if (searchSessionRef.current) {
        searchSessionRef.current = null;
      }
      
      const placeType = type === 'hospitals' ? 'hospital' : 'pharmacy';
      
      // Use Nearby Search from Places Library
      const request = {
        location: location,
        radius: 5000, // 5 km radius
        type: placeType
      };
      
      const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
      
      service.nearbySearch(request, (results, status) => {
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
              <button 
                style="margin-top: 8px; padding: 4px 8px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;"
                onclick="window.selectPlace('${place.place_id}', '${place.name.replace(/'/g, "\\'")}')"
              >
                Select
              </button>
            </div>
          `;
          
          infoWindow.setContent(content);
          infoWindow.open(mapInstanceRef.current, marker);
          
          // Add method to window object to handle the select button click
          window.selectPlace = (placeId, placeName) => {
            if (onPlaceSelect) {
              onPlaceSelect({ id: placeId, name: placeName });
            }
            infoWindow.close();
          };
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
      console.error('Error adding markers:', err);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (!searchQuery.trim() || !mapInstanceRef.current || apiError) return;
    
    setLoading(true);
    
    try {
      const request = {
        query: `${searchQuery} ${type}`,
        fields: ['name', 'geometry']
      };
      
      const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
      
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
          const place = results[0];
          const location = place.geometry.location;
          
          // Center the map on the search result
          mapInstanceRef.current.setCenter(location);
          
          // Search for places near this location
          searchPlacesNear(location.lat(), location.lng());
        } else {
          alert('No results found for your search.');
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Error in handleSearch:', err);
      handleApiError("Error searching for places: " + err.message);
      setLoading(false);
    }
  };

  // Map zoom controls
  const zoomIn = () => {
    if (!mapInstanceRef.current) return;
    const newZoom = Math.min(mapZoom + 1, 20);
    setMapZoom(newZoom);
    mapInstanceRef.current.setZoom(newZoom);
  };
  
  const zoomOut = () => {
    if (!mapInstanceRef.current) return;
    const newZoom = Math.max(mapZoom - 1, 1);
    setMapZoom(newZoom);
    mapInstanceRef.current.setZoom(newZoom);
  };
  
  // Center map on user's location
  const centerOnUser = () => {
    if (!mapInstanceRef.current || !userLocation) return;
    mapInstanceRef.current.setCenter(userLocation);
  };
  
  // Render API error message
  const renderApiErrorMessage = () => (
    <div className="error-container">
      <FaExclamationTriangle size={24} color="#D32F2F" />
      <h3>Google Maps API Error</h3>
      <p>{error || "An error occurred loading Google Maps. Please try again later."}</p>
      <p className="error-note">Note: This might be due to an invalid API key or Daily API quota exceeded.</p>
    </div>
  );

  return (
    <div className="map-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
      {apiError ? (
        renderApiErrorMessage()
      ) : (
        <>
          <div 
            ref={mapRef} 
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          />
          
          {/* Search bar */}
          <div className="search-box" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 5 }}>
            <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for ${type}...`}
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  border: 'none',
                  borderRadius: '4px 0 0 4px',
                  outline: 'none',
                  fontSize: '14px'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                style={{ 
                  padding: '10px 15px',
                  background: '#1976d2', 
                  border: 'none',
                  borderRadius: '0 4px 4px 0',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaSearch />
              </button>
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="map-controls" style={{ position: 'absolute', bottom: '20px', right: '10px', zIndex: 5 }}>
            <button 
              onClick={zoomIn}
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: 'white', 
                border: 'none',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <FaPlus />
            </button>
            <button 
              onClick={zoomOut}
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: 'white', 
                border: 'none',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <FaMinus />
            </button>
            <button 
              onClick={centerOnUser}
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: 'white', 
                border: 'none',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <FaLocationArrow />
            </button>
          </div>
          
          {/* Places List */}
          <div className="places-list" style={{ 
            position: 'absolute', 
            bottom: '20px', 
            left: '10px', 
            zIndex: 5,
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            maxHeight: '200px',
            width: '280px',
            overflowY: 'auto',
            display: places.length > 0 ? 'block' : 'none'
          }}>
            <h3 style={{ padding: '10px', margin: 0, borderBottom: '1px solid #eee', fontSize: '16px' }}>
              Nearby {type === 'hospitals' ? 'Hospitals' : 'Pharmacies'}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {places.map((place) => (
                <li 
                  key={place.place_id}
                  style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }}
                  onClick={() => {
                    // Center map on this place
                    mapInstanceRef.current.setCenter(place.geometry.location);
                    
                    // Find the marker and click it to open info window
                    const marker = markersRef.current.find(
                      m => m.getPosition().equals(place.geometry.location)
                    );
                    if (marker) {
                      window.google.maps.event.trigger(marker, 'click');
                    }
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <FaMapMarkerAlt style={{ marginRight: '8px', color: type === 'hospitals' ? '#1976d2' : '#d32f2f' }} />
                    <div>
                      <strong>{place.name}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>{place.vicinity}</div>
                      {place.opening_hours && (
                        <div style={{ 
                          fontSize: '12px', 
                          color: place.opening_hours.open_now ? 'green' : 'red',
                          marginTop: '2px'
                        }}>
                          {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Loading indicator */}
          {loading && (
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(255,255,255,0.7)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 10
            }}>
              <FaSpinner size={40} color="#1976d2" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}
        </>
      )}
      
      <style jsx="true">{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          background-color: #f8f8f8;
          border-radius: 8px;
        }
        
        .error-container h3 {
          margin: 10px 0;
          color: #D32F2F;
        }
        
        .error-note {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default GoogleMapComponent; 