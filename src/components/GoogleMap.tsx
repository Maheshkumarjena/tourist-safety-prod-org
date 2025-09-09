import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle, Polygon } from '@react-google-maps/api';
import { useLocationStore, useAlertStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Phone,
  Navigation,
  Crosshair
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapLocation {
  lat: number;
  lng: number;
  type: 'current' | 'safe' | 'warning' | 'restricted' | 'tourist' | 'authority' | 'emergency';
  title?: string;
  description?: string;
  timestamp?: number;
  id?: string;
}

interface GoogleMapComponentProps {
  height?: string;
  showControls?: boolean;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  markersData?: MapLocation[];
  className?: string;
}

const libraries: ("places" | "geometry" | "drawing")[] = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 26.1445,
  lng: 91.7362 // Guwahati, Assam
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
};

export function GoogleMapComponent({ 
  height = '600px', 
  showControls = true,
  onLocationSelect,
  markersData = [],
  className 
}: GoogleMapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const { currentLocation, addLocation } = useLocationStore();
  const { addAlert } = useAlertStore();
  const mapRef = useRef<HTMLDivElement>(null);

  // Default safety zones and locations for demo
  const defaultLocations: MapLocation[] = [
    {
      id: 'safe-1',
      lat: 26.1400,
      lng: 91.7300,
      type: 'safe',
      title: 'Tourist Information Center',
      description: 'Government tourist assistance center with 24/7 support'
    },
    {
      id: 'restricted-1',
      lat: 26.1500,
      lng: 91.7400,
      type: 'restricted',
      title: 'Military Zone',
      description: 'Restricted military area - No civilian entry'
    },
    {
      id: 'warning-1',
      lat: 26.1480,
      lng: 91.7350,
      type: 'warning',
      title: 'Construction Zone',
      description: 'Active construction area - Exercise caution'
    },
    {
      id: 'authority-1',
      lat: 26.1460,
      lng: 91.7320,
      type: 'authority',
      title: 'Guwahati Police Station',
      description: 'Local police station - Emergency assistance available'
    },
    {
      id: 'tourist-1',
      lat: 26.1420,
      lng: 91.7380,
      type: 'tourist',
      title: 'Tourist Group',
      description: '15 registered tourists in this area'
    },
    ...markersData
  ];

  // Add current location if available
  const allMarkers = currentLocation 
    ? [
        {
          id: 'current',
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          type: 'current' as const,
          title: 'Your Current Location',
          description: 'Real-time GPS location',
          timestamp: currentLocation.timestamp
        },
        ...defaultLocations.filter(loc => loc.id !== 'current')
      ]
    : defaultLocations;

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng && onLocationSelect) {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      onLocationSelect(location);
    }
  }, [onLocationSelect]);

  const handleMarkerClick = (marker: MapLocation) => {
    setSelectedMarker(marker);
    
    // Trigger alert for restricted areas
    if (marker.type === 'restricted') {
      addAlert({
        type: 'geo_fence',
        severity: 'high',
        message: `Warning: You are near a restricted area - ${marker.title}`,
        location: { lat: marker.lat, lng: marker.lng, timestamp: Date.now() },
        isRead: false
      });
    }
  };

  const centerOnCurrentLocation = () => {
    if (currentLocation && map) {
      map.panTo({ lat: currentLocation.lat, lng: currentLocation.lng });
      map.setZoom(16);
    } else {
      // Request user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: Date.now(),
              accuracy: position.coords.accuracy
            };
            setUserLocation(location);
            addLocation(location);
            if (map) {
              map.panTo(location);
              map.setZoom(16);
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            addAlert({
              type: 'safety',
              severity: 'medium',
              message: 'Unable to access your location. Please enable GPS for better safety features.',
              isRead: false
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      }
    }
  };

  const getMarkerIcon = (type: string) => {
    const baseStyle = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      strokeWeight: 2,
    };

    switch (type) {
      case 'current':
        return {
          ...baseStyle,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#1e40af',
          scale: 10,
        };
      case 'safe':
        return {
          ...baseStyle,
          fillColor: '#10b981',
          fillOpacity: 0.8,
          strokeColor: '#059669',
        };
      case 'warning':
        return {
          ...baseStyle,
          fillColor: '#f59e0b',
          fillOpacity: 0.8,
          strokeColor: '#d97706',
        };
      case 'restricted':
        return {
          ...baseStyle,
          fillColor: '#ef4444',
          fillOpacity: 0.8,
          strokeColor: '#dc2626',
        };
      case 'authority':
        return {
          ...baseStyle,
          fillColor: '#8b5cf6',
          fillOpacity: 0.8,
          strokeColor: '#7c3aed',
        };
      case 'tourist':
        return {
          ...baseStyle,
          fillColor: '#06b6d4',
          fillOpacity: 0.8,
          strokeColor: '#0891b2',
        };
      default:
        return {
          ...baseStyle,
          fillColor: '#6b7280',
          fillOpacity: 0.8,
          strokeColor: '#4b5563',
        };
    }
  };

  if (!isLoaded) {
    return (
      <div className={cn("flex items-center justify-center bg-muted rounded-lg", className)} style={{ height }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <GoogleMap
        mapContainerStyle={{ ...mapContainerStyle, height }}
        center={currentLocation ? { lat: currentLocation.lat, lng: currentLocation.lng } : defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {/* Markers */}
        {allMarkers.map((marker) => (
          <Marker
            key={marker.id || `${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={getMarkerIcon(marker.type)}
            onClick={() => handleMarkerClick(marker)}
            title={marker.title}
          />
        ))}

        {/* Safety Zones (Circles) */}
        {allMarkers
          .filter(marker => marker.type === 'safe')
          .map((marker) => (
            <Circle
              key={`safe-zone-${marker.id}`}
              center={{ lat: marker.lat, lng: marker.lng }}
              radius={200} // 200 meters
              options={{
                fillColor: '#10b981',
                fillOpacity: 0.1,
                strokeColor: '#10b981',
                strokeOpacity: 0.3,
                strokeWeight: 2,
              }}
            />
          ))
        }

        {/* Restricted Zones (Circles) */}
        {allMarkers
          .filter(marker => marker.type === 'restricted')
          .map((marker) => (
            <Circle
              key={`restricted-zone-${marker.id}`}
              center={{ lat: marker.lat, lng: marker.lng }}
              radius={150} // 150 meters
              options={{
                fillColor: '#ef4444',
                fillOpacity: 0.2,
                strokeColor: '#ef4444',
                strokeOpacity: 0.5,
                strokeWeight: 2,
              }}
            />
          ))
        }

        {/* Info Window */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <Card className="border-0 shadow-none max-w-xs">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{selectedMarker.title}</h4>
                    <Badge 
                      variant={
                        selectedMarker.type === 'restricted' ? 'destructive' :
                        selectedMarker.type === 'warning' ? 'secondary' :
                        'default'
                      }
                      className="text-xs"
                    >
                      {selectedMarker.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedMarker.description}</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Lat: {selectedMarker.lat.toFixed(6)}</p>
                    <p>Lng: {selectedMarker.lng.toFixed(6)}</p>
                  </div>
                  {selectedMarker.type === 'authority' && (
                    <Button size="sm" className="w-full mt-2">
                      <Phone className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-card/80 backdrop-blur"
            onClick={centerOnCurrentLocation}
          >
            <Crosshair className="w-4 h-4 mr-2" />
            My Location
          </Button>
        </div>
      )}

      {/* Current Location Status */}
      {currentLocation && (
        <div className="absolute bottom-4 left-4">
          <Card className="bg-card/80 backdrop-blur">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="font-medium">Live Location</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Accuracy: ±{currentLocation.accuracy?.toFixed(0) || '0'}m
              </div>
              <div className="text-xs text-muted-foreground">
                Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}