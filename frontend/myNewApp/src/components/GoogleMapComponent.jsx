import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaSpinner, FaSearch, FaPlus, FaMinus, FaLocationArrow, FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

// Use environment variable for API key
// For security, make sure to add key restrictions in Google Cloud Console
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

// Note: Create a .env file in frontend/myNewApp folder with: VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY

const GoogleMapComponent = ({ type, onPlaceSelect, onPlacesFound, autoSelectOnMarkerClick = false }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [mapZoom, setMapZoom] = useState(15);
  const [apiError, setApiError] = useState(false);
  const { darkMode } = useTheme();
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const searchSessionRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  
  // When places change, notify parent component if callback is provided
  useEffect(() => {
    if (onPlacesFound && places.length > 0) {
      onPlacesFound(places);
    }
  }, [places, onPlacesFound]);
  
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
      
      // Determine place type based on the type prop
      let placeType;
      if (type === 'hospitals') {
        placeType = 'hospital';
      } else if (type === 'pharmacies') {
        placeType = 'pharmacy';
      } else if (type === 'diagnostic') {
        // For diagnostic centers, we'll use a broader search
        placeType = ['hospital', 'health', 'doctor'];
      }
      
      // Use Nearby Search from Places Library
      const request = {
        location: location,
        radius: 5000, // 5 km radius
        type: placeType,
        keyword: type === 'diagnostic' ? 'diagnostic center' : undefined
      };
      
      const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
      // Create a separate service for detailed place lookups
      const placesService = new window.google.maps.places.PlacesService(mapInstanceRef.current);
      
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Process results to get more detailed information including opening hours
          const detailedPlacesPromises = results.map(place => {
            return new Promise((resolve) => {
              // Use getDetails to get opening hours for each place
              placesService.getDetails(
                {
                  placeId: place.place_id,
                  fields: ['opening_hours', 'business_status', 'utc_offset_minutes']
                },
                (detailedPlace, detailStatus) => {
                  if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                    // Calculate opening status
                    let isOpenNow = null;
                    
                    // First check - is place temporarily or permanently closed
                    if (detailedPlace.business_status === 'CLOSED_TEMPORARILY' || 
                        detailedPlace.business_status === 'CLOSED_PERMANENTLY') {
                      isOpenNow = false;
                    }
                    // For hospitals, always set to open unless explicitly marked as closed
                    else if (type === 'hospitals' || place.types?.includes('hospital')) {
                      isOpenNow = true;
                      console.log(`Setting hospital ${place.name} as OPEN`);
                    }
                    // Next check - use opening_hours if available
                    else if (detailedPlace.opening_hours) {
                      if (typeof detailedPlace.opening_hours.isOpen === 'function') {
                        try {
                          isOpenNow = detailedPlace.opening_hours.isOpen();
                        } catch (error) {
                          console.error("Error with isOpen function:", error);
                          isOpenNow = detailedPlace.opening_hours.open_now !== undefined ? 
                            detailedPlace.opening_hours.open_now : null;
                        }
                      } else {
                        isOpenNow = detailedPlace.opening_hours.open_now !== undefined ? 
                          detailedPlace.opening_hours.open_now : null;
                      }
                    }
                    
                    // Enhance the original place object with detailed information
                    resolve({
                      ...place,
                      opening_hours: detailedPlace.opening_hours || place.opening_hours,
                      business_status: detailedPlace.business_status,
                      isOpenNow: isOpenNow,
                      types: place.types || []
                    });
                  } else {
                    // If we couldn't get details, assume hospitals are open by default
                    const defaultOpenNow = type === 'hospitals' || place.types?.includes('hospital') ? true : null;
                    
                    // Resolve with the original place plus our default assumption
                    resolve({
                      ...place,
                      isOpenNow: place.opening_hours?.open_now !== undefined ? place.opening_hours.open_now : defaultOpenNow,
                      types: place.types || []
                    });
                  }
                }
              );
            });
          });
          
          // Wait for all detailed place information before updating state
          Promise.all(detailedPlacesPromises)
            .then(enhancedPlaces => {
              setPlaces(enhancedPlaces);
              
              // Notify parent component with enhanced places data
              if (onPlacesFound) {
                onPlacesFound(enhancedPlaces);
              }
              
              // Add markers for the places (using original results to maintain mapping)
              addMarkersToMap(results, location);
              
              setLoading(false);
            })
            .catch(err => {
              console.error("Error enhancing places with details:", err);
              // Fallback to basic place information if enhancement fails
              setPlaces(results);
              if (onPlacesFound) {
                onPlacesFound(results);
              }
              addMarkersToMap(results, location);
              setLoading(false);
            });
        } else if (status === 'UNKNOWN_ERROR' || status === 'ERROR') {
          handleApiError("Google Maps API error: " + status);
        } else {
          setPlaces([]);
          console.error('Error finding places:', status);
          setLoading(false);
        }
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
      
      // Get place service for detailed information
      const placesService = new window.google.maps.places.PlacesService(mapInstanceRef.current);
      
      // Add markers for places
      places.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: mapInstanceRef.current,
          title: place.name,
          icon: {
            url: type === 'hospitals' 
              ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' 
              : type === 'diagnostic'
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });
        
        marker.addListener('click', () => {
          // Show loading in info window first
          infoWindow.setContent(`
            <div style="padding: 8px; max-width: 300px; text-align: center;">
              <p>Loading details...</p>
            </div>
          `);
          infoWindow.open(mapInstanceRef.current, marker);
          
          // Request detailed place information
          placesService.getDetails(
            {
              placeId: place.place_id,
              fields: [
                'name', 'formatted_address', 'formatted_phone_number', 
                'opening_hours', 'website', 'price_level', 'rating',
                'review', 'types', 'vicinity', 'url', 'business_status'
              ]
            },
            (detailedPlace, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // Get current open/closed status - correctly handle issues with opening_hours
                const isOpenNow = detailedPlace.opening_hours ? 
                  (typeof detailedPlace.opening_hours.isOpen === 'function' ? 
                    detailedPlace.opening_hours.isOpen() : detailedPlace.opening_hours.open_now)
                  : null;
                
                // Create content for info window with detailed information
                const content = `
                  <div style="padding: 8px; max-width: 300px;">
                    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: bold;">${detailedPlace.name}</h3>
                    <p style="margin: 0 0 8px; font-size: 14px;">${detailedPlace.formatted_address || detailedPlace.vicinity || ''}</p>
                    ${detailedPlace.formatted_phone_number ? 
                      `<p style="margin: 0 0 8px; font-size: 14px;">📞 ${detailedPlace.formatted_phone_number}</p>` : ''}
                    ${detailedPlace.rating ? 
                      `<p style="margin: 0 0 8px; font-size: 14px;">⭐ ${detailedPlace.rating}/5 ${
                        detailedPlace.price_level ? '- ' + '💲'.repeat(detailedPlace.price_level) : ''
                      }</p>` : ''}
                    ${isOpenNow !== null ? 
                      `<p style="margin: 0 0 8px; font-size: 14px; color: ${isOpenNow ? 'green' : 'red'}">
                        ${isOpenNow ? '✓ Open Now' : '✗ Closed'}
                      </p>` : ''}
                    ${detailedPlace.business_status === 'CLOSED_TEMPORARILY' ? 
                      `<p style="margin: 0 0 8px; font-size: 14px; color: #f59e0b;">⚠️ Temporarily Closed</p>` : ''}
                    ${detailedPlace.business_status === 'CLOSED_PERMANENTLY' ? 
                      `<p style="margin: 0 0 8px; font-size: 14px; color: #ef4444;">⚠️ Permanently Closed</p>` : ''}
                    ${detailedPlace.website ? 
                      `<p style="margin: 0 0 8px; font-size: 14px;"><a href="${detailedPlace.website}" target="_blank" style="color: #1976d2;">Visit Website</a></p>` : ''}
                    ${detailedPlace.url ? 
                      `<p style="margin: 0 0 8px; font-size: 14px;"><a href="${detailedPlace.url}" target="_blank" style="color: #1976d2;">View on Google Maps</a></p>` : ''}
                    <button 
                      style="margin-top: 8px; padding: 4px 8px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;"
                      onclick="window.selectPlace('${detailedPlace.place_id}', '${detailedPlace.name.replace(/'/g, "\\'")}')"
                    >
                      Select
                    </button>
                  </div>
                `;
                
                infoWindow.setContent(content);
                
                // Add method to window object to handle the select button click
                window.selectPlace = (placeId, placeName) => {
                  if (onPlaceSelect) {
                    // Calculate isOpenNow to ensure consistency
                    let calculatedIsOpen = null;
                    
                    // First check - is place temporarily or permanently closed
                    if (detailedPlace.business_status === 'CLOSED_TEMPORARILY' || 
                        detailedPlace.business_status === 'CLOSED_PERMANENTLY') {
                      calculatedIsOpen = false;
                    }
                    // For hospitals, always set to open unless explicitly marked as closed
                    else if (type === 'hospitals' || detailedPlace.types?.includes('hospital')) {
                      calculatedIsOpen = true;
                      console.log(`Setting selected hospital ${placeName} as OPEN`);
                    }
                    // Next check - use most reliable indicator of open status
                    else if (detailedPlace.opening_hours) {
                      if (typeof detailedPlace.opening_hours.isOpen === 'function') {
                        try {
                          calculatedIsOpen = detailedPlace.opening_hours.isOpen();
                        } catch (error) {
                          console.error("Error with isOpen function:", error);
                          calculatedIsOpen = detailedPlace.opening_hours.open_now !== undefined ? 
                            detailedPlace.opening_hours.open_now : null;
                        }
                      } else {
                        calculatedIsOpen = detailedPlace.opening_hours.open_now !== undefined ? 
                          detailedPlace.opening_hours.open_now : null;
                      }
                    }
                    
                    // Pass comprehensive data to parent component
                    onPlaceSelect({
                      id: placeId,
                      place_id: placeId, // Additional reference for consistency
                      name: placeName,
                      formatted_address: detailedPlace.formatted_address,
                      vicinity: detailedPlace.vicinity,
                      formatted_phone_number: detailedPlace.formatted_phone_number,
                      website: detailedPlace.website,
                      url: detailedPlace.url, // Direct Google Maps URL
                      rating: detailedPlace.rating,
                      opening_hours: detailedPlace.opening_hours,
                      price_level: detailedPlace.price_level,
                      types: detailedPlace.types,
                      geometry: place.geometry,
                      // Add business status information
                      business_status: detailedPlace.business_status,
                      // Store pre-calculated open status to ensure consistency
                      isOpenNow: calculatedIsOpen,
                      // Include original detailed place object for completeness
                      details: detailedPlace
                    });
                  }
                  infoWindow.close();
                };

                // Auto-select this place if requested
                if (autoSelectOnMarkerClick) {
                  window.selectPlace(detailedPlace.place_id, detailedPlace.name);
                }
              } else {
                // If detailed place fetch fails, show basic info
                const content = `
                  <div style="padding: 8px; max-width: 300px;">
                    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: bold;">${place.name}</h3>
                    <p style="margin: 0 0 8px; font-size: 14px;">${place.vicinity || ''}</p>
                    ${place.rating ? `<p style="margin: 0; font-size: 14px;">Rating: ${place.rating}/5</p>` : ''}
                    ${place.opening_hours ? `<p style="margin: 0; font-size: 14px; color: ${place.opening_hours.open_now ? 'green' : 'red'}">
                      ${place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                    </p>` : ''}
                    <p style="color: #d32f2f; font-size: 12px; margin: 8px 0;">Could not load additional details</p>
                    <button 
                      style="margin-top: 8px; padding: 4px 8px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;"
                      onclick="window.selectPlace('${place.place_id}', '${place.name.replace(/'/g, "\\'")}')"
                    >
                      Select
                    </button>
                  </div>
                `;
                
                infoWindow.setContent(content);
                
                // Add method to window object to handle the select button click with basic info
                window.selectPlace = (placeId, placeName) => {
                  if (onPlaceSelect) {
                    // Calculate open status from the basic place data we have
                    let basicOpenStatus = null;
                    
                    // First check if business status indicates closure
                    if (place.business_status === 'CLOSED_TEMPORARILY' || 
                        place.business_status === 'CLOSED_PERMANENTLY') {
                      basicOpenStatus = false;
                    }
                    // For hospitals, always set to open unless explicitly marked as closed
                    else if (type === 'hospitals' || place.types?.includes('hospital')) {
                      basicOpenStatus = true;
                      console.log(`Setting fallback hospital ${placeName} as OPEN`);
                    }
                    // Otherwise use opening_hours if available
                    else if (place.opening_hours && place.opening_hours.open_now !== undefined) {
                      basicOpenStatus = place.opening_hours.open_now;
                    }
                    
                    onPlaceSelect({
                      id: placeId,
                      place_id: placeId,
                      name: placeName,
                      vicinity: place.vicinity,
                      rating: place.rating,
                      opening_hours: place.opening_hours,
                      geometry: place.geometry,
                      // Add basic open status information
                      isOpenNow: basicOpenStatus,
                      // Include original place object for completeness
                      place: place,
                      types: place.types || []
                    });
                  }
                  infoWindow.close();
                };
              }
            }
          );
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
    <div className={`error-container rounded-lg p-6 text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <FaExclamationTriangle size={24} className={`mx-auto mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
      <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Google Maps API Error</h3>
      <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error || "An error occurred loading Google Maps. Please try again later."}</p>
      <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}>
        <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-amber-700'} mb-1`}>Possible causes:</p>
        <ul className={`text-sm text-left list-disc pl-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <li>Invalid API key</li>
          <li>Daily API quota exceeded</li>
          <li>API key restrictions (domain, IP, etc.)</li>
          <li>Required APIs not enabled in Google Cloud Console</li>
        </ul>
      </div>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
        Note: If this error persists, please contact support or try again later.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-all`}
      >
        Try Again
      </button>
    </div>
  );

  // Render instructions when no places are found
  const renderNoPlacesMessage = () => (
    <div className={`flex flex-col items-center justify-center py-6 px-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg mb-4`}>
      <FaMapMarkerAlt size={24} className={`mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      <h4 className={`text-lg font-medium mb-2 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        No {type === 'hospitals' ? 'hospitals' : type === 'diagnostic' ? 'diagnostic centers' : 'pharmacies'} found
      </h4>
      <p className={`text-sm text-center mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Click on the map to search in that area or try another location.
      </p>
      <button
        onClick={() => getUserLocation()}
        className={`flex items-center px-3 py-1.5 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm`}
      >
        <FaLocationArrow className="mr-2" /> Use My Location
      </button>
    </div>
  );

  return (
    <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} p-4 rounded-lg shadow-md`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {type === 'hospitals' ? 'Nearby Hospitals' : type === 'diagnostic' ? 'Diagnostic Centers' : 'Nearby Pharmacies'}
      </h2>

      <div className="relative flex flex-col md:flex-row gap-4">
        {/* Map container */}
        <div className="w-full md:w-3/5 relative" style={{ height: '550px' }}>
          {apiError ? (
            renderApiErrorMessage()
          ) : (
            <>
              <div 
                ref={mapRef} 
                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
              />
              
              {/* Search bar */}
              <div className="absolute top-3 left-3 right-3 z-5">
                <div className="flex bg-white rounded-md shadow-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search for ${type === 'diagnostic' ? 'diagnostic centers' : type}...`}
                    className="flex-1 px-4 py-2 rounded-l-md border-0 focus:ring-2 focus:ring-blue-500 text-gray-700"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 z-5 flex flex-col gap-2">
                <button 
                  onClick={zoomIn}
                  className="w-10 h-10 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Zoom in"
                >
                  <FaPlus className="text-gray-700" />
                </button>
                <button 
                  onClick={zoomOut}
                  className="w-10 h-10 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Zoom out"
                >
                  <FaMinus className="text-gray-700" />
                </button>
                <button 
                  onClick={centerOnUser}
                  className="w-10 h-10 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Center on my location"
                >
                  <FaLocationArrow className="text-gray-700" />
                </button>
              </div>
              
              {/* Loading indicator */}
              {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                  <div className={`p-4 bg-white rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <FaSpinner size={24} className={`animate-spin mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <p className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Loading...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Places List (Now properly positioned beside the map) */}
        <div className="w-full md:w-2/5 h-550px">
          <div className={`p-4 rounded-lg h-full ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-y-auto`} style={{ maxHeight: '550px' }}>
            <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {type === 'hospitals' ? 'Hospitals' : type === 'diagnostic' ? 'Diagnostic Centers' : 'Pharmacies'} List
            </h3>
            
            {places.length > 0 ? (
              <div className="space-y-3">
                {places.map((place) => (
                  <div 
                    key={place.place_id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-white hover:bg-gray-100'
                    } shadow-sm`}
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
                    <div className="flex items-start">
                      <FaMapMarkerAlt className={`mt-1 mr-3 flex-shrink-0 ${
                        type === 'hospitals' 
                          ? darkMode ? 'text-blue-400' : 'text-blue-600' 
                          : type === 'diagnostic'
                            ? darkMode ? 'text-green-400' : 'text-green-600'
                            : darkMode ? 'text-red-400' : 'text-red-600'
                      }`} />
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{place.name}</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{place.vicinity}</p>
                        <div className="flex items-center mt-1">
                          {place.rating && (
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-1">★</span>
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{place.rating}</span>
                            </div>
                          )}
                          {place.opening_hours && (
                            <span className={`ml-auto text-xs ${
                              place.opening_hours.open_now 
                                ? darkMode ? 'text-green-400' : 'text-green-600' 
                                : darkMode ? 'text-red-400' : 'text-red-600'
                            }`}>
                              {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && renderNoPlacesMessage()
            )}
          </div>
        </div>
      </div>

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
          border-radius: 8px;
        }

        /* Custom scrollbar for the list */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: ${darkMode ? '#2d3748' : '#f1f1f1'};
          border-radius: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#4a5568' : '#cbd5e0'};
          border-radius: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#718096' : '#a0aec0'};
        }
      `}</style>
    </div>
  );
};

export default GoogleMapComponent;