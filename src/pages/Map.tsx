import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore, useLocationStore, useAlertStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin,
  Navigation,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Crosshair,
  Route,
  Clock,
  Users,
  Info,
  Hospital,
  Building,
  Phone,
  Star,
  Zap,
  Camera,
  Mountain,
  TreePine,
  School,
  ShoppingBag,
  Castle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Leaflet imports
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polygon, Rectangle } from 'react-leaflet';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapLocation {
  lat: number;
  lng: number;
  type: 'current' | 'safe' | 'warning' | 'restricted' | 'tourist' | 'authority' | 'landmark' | 'shopping' | 'natural';
  title?: string;
  description?: string;
  timestamp?: number;
}

interface ZoneArea {
  id: string;
  type: 'safe' | 'warning' | 'restricted' | 'tourist' | 'natural' | 'cultural' | 'commercial';
  name: string;
  description: string;
  coordinates: [number, number][]; // For polygons
  bounds?: [number, number][]; // For rectangles [southWest, northEast]
  radius?: number; // For circles
  color: string;
  fillColor: string;
  fillOpacity: number;
}

// Custom icons for different location types
const createCustomIcon = (type: string) => {
  const iconColor = getIconColor(type);
  const iconHtml = `
    <div style="
      background-color: ${iconColor};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      ${getIconSvg(type)}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const getIconColor = (type: string) => {
  switch (type) {
    case 'current': return '#3b82f6'; // blue-500
    case 'safe': return '#10b981'; // emerald-500
    case 'warning': return '#f59e0b'; // amber-500
    case 'restricted': return '#ef4444'; // red-500
    case 'tourist': return '#8b5cf6'; // violet-500
    case 'authority': return '#3b82f6'; // blue-500
    case 'landmark': return '#f97316'; // orange-500
    case 'shopping': return '#ec4899'; // pink-500
    case 'natural': return '#22c55e'; // green-500
    default: return '#6b7280'; // gray-500
  }
};

const getIconSvg = (type: string) => {
  switch (type) {
    case 'current': return '📍';
    case 'safe': return '🛡️';
    case 'warning': return '⚠️';
    case 'restricted': return '🚫';
    case 'tourist': return '👥';
    case 'authority': return '👮';
    case 'landmark': return '🏛️';
    case 'shopping': return '🛍️';
    case 'natural': return '🌲';
    default: return '📌';
  }
};

// Component to handle map center changes
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const MapPage = () => {
  const { user } = useAuthStore();
  const { currentLocation, locationHistory, isTracking } = useLocationStore();
  const { addAlert } = useAlertStore();
  
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showTourists, setShowTourists] = useState(user?.role === 'authority');
  const [showZones, setShowZones] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([26.1445, 91.7362]); // Guwahati
  const [zoomLevel, setZoomLevel] = useState(13);

  // Mock locations for demo
  const mockLocations: MapLocation[] = [
    { lat: 26.1445, lng: 91.7362, type: 'current', title: 'Your Location', description: 'Current position' },
    { lat: 26.1500, lng: 91.7400, type: 'restricted', title: 'Military Zone', description: 'Restricted area - No entry' },
    { lat: 26.1400, lng: 91.7300, type: 'safe', title: 'Tourist Information Center', description: 'Safe zone with assistance' },
    { lat: 26.1480, lng: 91.7350, type: 'warning', title: 'Construction Zone', description: 'Exercise caution' },
    { lat: 26.1420, lng: 91.7380, type: 'tourist', title: 'Tourist Group', description: '15 tourists nearby' },
    { lat: 26.1460, lng: 91.7320, type: 'authority', title: 'Police Station', description: 'Local authorities' },
    { lat: 26.1520, lng: 91.7280, type: 'landmark', title: 'Kamakhya Temple', description: 'Famous Hindu temple' },
    { lat: 26.1380, lng: 91.7420, type: 'shopping', title: 'Fancy Bazaar', description: 'Local market area' },
    { lat: 26.1360, lng: 91.7260, type: 'natural', title: 'Deepor Beel Lake', description: 'Bird sanctuary and wetland' },
  ];

  // Zone areas with different types
  const zoneAreas: ZoneArea[] = [
    {
      id: 'safe-1',
      type: 'safe',
      name: 'Tourist Safe Zone',
      description: 'Area with high security and tourist facilities',
      coordinates: [
        [26.142, 91.728],
        [26.142, 91.738],
        [26.148, 91.738],
        [26.148, 91.728],
      ],
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.2
    },
    {
      id: 'restricted-1',
      type: 'restricted',
      name: 'Military Restricted Area',
      description: 'No entry without special permission',
      bounds: [
        [26.149, 91.739] as [number, number],
        [26.152, 91.743] as [number, number]
      ],
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.2
    },
    {
      id: 'warning-1',
      type: 'warning',
      name: 'Construction Zone',
      description: 'Heavy construction ongoing - proceed with caution',
      radius: 400,
      coordinates: [[26.147, 91.734]],
      color: '#f59e0b',
      fillColor: '#f59e0b',
      fillOpacity: 0.2
    },
    {
      id: 'natural-1',
      type: 'natural',
      name: 'Protected Natural Area',
      description: 'Wildlife sanctuary - do not disturb animals',
      coordinates: [
        [26.134, 91.724],
        [26.134, 91.732],
        [26.140, 91.732],
        [26.140, 91.724],
      ],
      color: '#22c55e',
      fillColor: '#22c55e',
      fillOpacity: 0.2
    },
    {
      id: 'cultural-1',
      type: 'cultural',
      name: 'Heritage Cultural Zone',
      description: 'Historical monuments and cultural sites',
      coordinates: [
        [26.150, 91.725],
        [26.150, 91.735],
        [26.156, 91.735],
        [26.156, 91.725],
      ],
      color: '#f97316',
      fillColor: '#f97316',
      fillOpacity: 0.2
    },
    {
      id: 'commercial-1',
      type: 'commercial',
      name: 'Commercial District',
      description: 'Shopping and business area with high traffic',
      bounds: [
        [26.136, 91.740] as [number, number],
        [26.142, 91.746] as [number, number]
      ],
      color: '#ec4899',
      fillColor: '#ec4899',
      fillOpacity: 0.2
    },
    {
      id: 'tourist-1',
      type: 'tourist',
      name: 'Tourist Hub',
      description: 'Popular area with many tourist attractions',
      radius: 500,
      coordinates: [[26.144, 91.736]],
      color: '#8b5cf6',
      fillColor: '#8b5cf6',
      fillOpacity: 0.15
    },
  ];

  // Nearby services data
  const nearbyServices = {
    police: [
      { name: 'Guwahati Police Station', distance: '0.5 km', phone: '+91-361-2540238', address: 'Pan Bazaar', rating: 4.2 },
      { name: 'Traffic Police Station', distance: '0.8 km', phone: '+91-361-2567890', address: 'G.S. Road', rating: 4.0 },
      { name: 'Railway Police Station', distance: '1.2 km', phone: '+91-361-2345678', address: 'Railway Station', rating: 3.8 }
    ],
    hospitals: [
      { name: 'Gauhati Medical College', distance: '1.0 km', phone: '+91-361-2528242', address: 'Bhangagarh', rating: 4.5 },
      { name: 'Nemcare Hospital', distance: '0.7 km', phone: '+91-361-2345678', address: 'G.S. Road', rating: 4.3 },
      { name: 'Apollo Clinic', distance: '1.5 km', phone: '+91-361-2567890', address: 'Rehabari', rating: 4.1 }
    ],
    hotels: [
      { name: 'Hotel Dynasty', distance: '0.3 km', phone: '+91-361-2540001', address: 'S.S. Road', rating: 4.4 },
      { name: 'Brahmaputra Grand', distance: '0.6 km', phone: '+91-361-2540002', address: 'M.G. Road', rating: 4.2 },
      { name: 'Kiranshree Portico', distance: '0.9 km', phone: '+91-361-2540003', address: 'G.S. Road', rating: 4.0 }
    ],
    safePlaces: [
      { name: 'Tourist Information Center', distance: '0.4 km', phone: '+91-361-2540100', address: 'Station Road', rating: 4.6 },
      { name: 'Kamakhya Temple Complex', distance: '2.0 km', phone: '+91-361-2540200', address: 'Kamakhya Hill', rating: 4.8 },
      { name: 'Assam State Museum', distance: '1.8 km', phone: '+91-361-2540300', address: 'Dighalipukhuri', rating: 4.3 }
    ]
  };

  // Add current location if available
  const allLocations = currentLocation 
    ? [
        { ...currentLocation, type: 'current' as const, title: 'Your Location', description: 'Current position' },
        ...mockLocations.filter(loc => loc.type !== 'current')
      ]
    : mockLocations;

  useEffect(() => {
    if (currentLocation) {
      setMapCenter([currentLocation.lat, currentLocation.lng]);
    }
  }, [currentLocation]);

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
    
    // Trigger alerts for restricted areas
    if (location.type === 'restricted') {
      addAlert({
        type: 'geo_fence',
        severity: 'high',
        message: `You are near a restricted area: ${location.title}`,
        location: { lat: location.lat, lng: location.lng, timestamp: Date.now() },
        isRead: false
      });
    }
  };

  const centerOnCurrentLocation = () => {
    if (currentLocation) {
      setMapCenter([currentLocation.lat, currentLocation.lng]);
      setZoomLevel(15);
    } else {
      // Request location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setMapCenter([position.coords.latitude, position.coords.longitude]);
            setZoomLevel(15);
          },
          (error) => {
            console.error('Geolocation error:', error);
          }
        );
      }
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'current':
        return 'bg-primary border-primary-dark';
      case 'safe':
        return 'bg-success border-success-dark';
      case 'warning':
        return 'bg-warning border-warning-dark';
      case 'restricted':
        return 'bg-emergency border-emergency-dark';
      case 'tourist':
        return 'bg-secondary border-secondary-dark';
      case 'authority':
        return 'bg-primary border-primary-dark';
      case 'landmark':
        return 'bg-orange-500 border-orange-600';
      case 'shopping':
        return 'bg-pink-500 border-pink-600';
      case 'natural':
        return 'bg-green-500 border-green-600';
      default:
        return 'bg-muted border-muted-foreground';
    }
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'safe': return <Shield className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'restricted': return <Camera className="w-4 h-4" />;
      case 'tourist': return <Users className="w-4 h-4" />;
      case 'natural': return <TreePine className="w-4 h-4" />;
      case 'cultural': return <Castle className="w-4 h-4" />;
      case 'commercial': return <ShoppingBag className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <MapPin className="w-8 h-8" />
                Location & Safety
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time location tracking and nearby services
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={centerOnCurrentLocation}
              >
                <Crosshair className="w-4 h-4 mr-2" />
                Center on Me
              </Button>
            </div>
          </div>

          <Tabs defaultValue="map" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="services">Nearby Services</TabsTrigger>
            </TabsList>

            {/* Map Tab */}
            <TabsContent value="map" className="space-y-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Map Container */}
                <div className="lg:col-span-3">
                  <Card className="h-[600px]">
                    <CardContent className="p-0 h-full">
                      <MapContainer
                        center={mapCenter}
                        zoom={zoomLevel}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                      >
                        <ChangeView center={mapCenter} zoom={zoomLevel} />
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {/* Render zone areas */}
                        {showZones && zoneAreas.map((zone) => {
                          if (zone.bounds) {
                            return (
                              <Rectangle
                                key={zone.id}
                                bounds={zone.bounds}
                                pathOptions={{
                                  color: zone.color,
                                  fillColor: zone.fillColor,
                                  fillOpacity: zone.fillOpacity,
                                  weight: 2
                                }}
                                eventHandlers={{
                                  click: () => {
                                    setSelectedLocation({
                                      lat: (zone.bounds![0][0] + zone.bounds![1][0]) / 2,
                                      lng: (zone.bounds![0][1] + zone.bounds![1][1]) / 2,
                                      type: zone.type as any,
                                      title: zone.name,
                                      description: zone.description
                                    });
                                  }
                                }}
                              />
                            );
                          } else if (zone.radius && zone.coordinates) {
                            return (
                              <Circle
                                key={zone.id}
                                center={zone.coordinates[0]}
                                radius={zone.radius}
                                pathOptions={{
                                  color: zone.color,
                                  fillColor: zone.fillColor,
                                  fillOpacity: zone.fillOpacity,
                                  weight: 2
                                }}
                                eventHandlers={{
                                  click: () => {
                                    setSelectedLocation({
                                      lat: zone.coordinates[0][0],
                                      lng: zone.coordinates[0][1],
                                      type: zone.type as any,
                                      title: zone.name,
                                      description: zone.description
                                    });
                                  }
                                }}
                              />
                            );
                          } else {
                            return (
                              <Polygon
                                key={zone.id}
                                positions={zone.coordinates}
                                pathOptions={{
                                  color: zone.color,
                                  fillColor: zone.fillColor,
                                  fillOpacity: zone.fillOpacity,
                                  weight: 2
                                }}
                                eventHandlers={{
                                  click: () => {
                                    // Calculate center of polygon
                                    const latSum = zone.coordinates.reduce((sum, coord) => sum + coord[0], 0);
                                    const lngSum = zone.coordinates.reduce((sum, coord) => sum + coord[1], 0);
                                    const centerLat = latSum / zone.coordinates.length;
                                    const centerLng = lngSum / zone.coordinates.length;
                                    
                                    setSelectedLocation({
                                      lat: centerLat,
                                      lng: centerLng,
                                      type: zone.type as any,
                                      title: zone.name,
                                      description: zone.description
                                    });
                                  }
                                }}
                              />
                            );
                          }
                        })}
                        
                        {/* Render location markers */}
                        {allLocations.map((location, index) => {
                          // Only show if within filters
                          if (location.type === 'tourist' && !showTourists) return null;
                          if ((location.type === 'safe' || location.type === 'warning' || location.type === 'restricted') && !showSafeZones) return null;

                          return (
                            <Marker
                              key={index}
                              position={[location.lat, location.lng]}
                              icon={createCustomIcon(location.type)}
                              eventHandlers={{
                                click: () => handleLocationClick(location),
                              }}
                            >
                              <Popup>
                                <div className="p-2">
                                  <h3 className="font-semibold">{location.title}</h3>
                                  <p className="text-sm">{location.description}</p>
                                  <Badge className="mt-2" variant={
                                    location.type === 'restricted' ? 'destructive' :
                                    location.type === 'warning' ? 'secondary' :
                                    'default'
                                  }>
                                    {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                                  </Badge>
                                </div>
                              </Popup>
                            </Marker>
                          );
                        })}
                      </MapContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Map Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Map Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Zone Areas</label>
                        <Switch
                          checked={showZones}
                          onCheckedChange={setShowZones}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Safe Zones</label>
                        <Switch
                          checked={showSafeZones}
                          onCheckedChange={setShowSafeZones}
                        />
                      </div>
                      
                      {user?.role === 'authority' && (
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Tourist Locations</label>
                          <Switch
                            checked={showTourists}
                            onCheckedChange={setShowTourists}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Location Details */}
                  {selectedLocation && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            {selectedLocation.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {selectedLocation.description}
                          </p>
                          
                          <div className="text-xs text-muted-foreground">
                            <p>Lat: {selectedLocation.lat.toFixed(6)}</p>
                            <p>Lng: {selectedLocation.lng.toFixed(6)}</p>
                          </div>

                          <Badge variant={
                            selectedLocation.type === 'restricted' ? 'destructive' :
                            selectedLocation.type === 'warning' ? 'secondary' :
                            'default'
                          }>
                            {selectedLocation.type.charAt(0).toUpperCase() + selectedLocation.type.slice(1)}
                          </Badge>

                          {selectedLocation.type === 'restricted' && (
                            <div className="p-2 bg-emergency-light/20 rounded text-xs text-emergency">
                              <AlertTriangle className="w-3 h-3 inline mr-1" />
                              Restricted area - maintain safe distance
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Legend */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Map Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm font-medium mb-2">Location Types</div>
                      {[
                        { type: 'current', label: 'Your Location', color: 'bg-primary' },
                        { type: 'safe', label: 'Safe Zone', color: 'bg-success' },
                        { type: 'warning', label: 'Caution Area', color: 'bg-warning' },
                        { type: 'restricted', label: 'Restricted', color: 'bg-emergency' },
                        { type: 'authority', label: 'Authorities', color: 'bg-primary' },
                        { type: 'tourist', label: 'Tourists', color: 'bg-secondary' },
                        { type: 'landmark', label: 'Landmarks', color: 'bg-orange-500' },
                        { type: 'shopping', label: 'Shopping', color: 'bg-pink-500' },
                        { type: 'natural', label: 'Natural', color: 'bg-green-500' },
                      ].map((item) => (
                        <div key={item.type} className="flex items-center space-x-2 text-sm">
                          <div className={cn("w-3 h-3 rounded-full", item.color)}></div>
                          <span>{item.label}</span>
                        </div>
                      ))}
                      
                      <div className="text-sm font-medium mt-4 mb-2">Zone Areas</div>
                      {[
                        { type: 'safe', label: 'Safe Zone', color: 'bg-success/30 border-l-4 border-success' },
                        { type: 'warning', label: 'Warning Zone', color: 'bg-warning/30 border-l-4 border-warning' },
                        { type: 'restricted', label: 'Restricted Zone', color: 'bg-emergency/30 border-l-4 border-emergency' },
                        { type: 'tourist', label: 'Tourist Zone', color: 'bg-secondary/30 border-l-4 border-secondary' },
                        { type: 'natural', label: 'Natural Zone', color: 'bg-green-500/30 border-l-4 border-green-500' },
                        { type: 'cultural', label: 'Cultural Zone', color: 'bg-orange-500/30 border-l-4 border-orange-500' },
                        { type: 'commercial', label: 'Commercial Zone', color: 'bg-pink-500/30 border-l-4 border-pink-500' },
                      ].map((item) => (
                        <div key={item.type} className="flex items-center space-x-2 text-sm py-1">
                          <div className={cn("w-3 h-3 rounded-sm", item.color)}></div>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Location History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {locationHistory.slice(-5).reverse().map((location, index) => (
                          <div key={index} className="text-xs p-2 bg-muted/50 rounded">
                            <div className="font-medium">
                              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                            </div>
                            <div className="text-muted-foreground">
                              {new Date(location.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                        
                        {locationHistory.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            No location history available
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Card */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="font-medium">Tracking Status</p>
                          <p className="text-muted-foreground">
                            {isTracking ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          isTracking ? "bg-success animate-pulse" : "bg-muted"
                        )}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Nearby Services Tab - Remains the same as before */}
            <TabsContent value="services" className="space-y-6">
              <div className="grid gap-6">
                {/* Police Stations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Police Stations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {nearbyServices.police.map((station, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{station.name}</h4>
                          <p className="text-sm text-muted-foreground">{station.address}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-primary font-medium">{station.distance}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-warning fill-current" />
                              <span className="text-xs">{station.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Navigation className="w-3 h-3 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Hospitals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hospital className="w-5 h-5 text-emergency" />
                      Hospitals & Medical Centers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {nearbyServices.hospitals.map((hospital, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{hospital.name}</h4>
                          <p className="text-sm text-muted-foreground">{hospital.address}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-emergency font-medium">{hospital.distance}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-warning fill-current" />
                              <span className="text-xs">{hospital.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Navigation className="w-3 h-3 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Hotels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-secondary" />
                      Hotels & Accommodation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {nearbyServices.hotels.map((hotel, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{hotel.name}</h4>
                          <p className="text-sm text-muted-foreground">{hotel.address}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-secondary font-medium">{hotel.distance}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-warning fill-current" />
                              <span className="text-xs">{hotel.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Navigation className="w-3 h-3 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Safe Places */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-success" />
                      Safe Places & Tourist Centers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {nearbyServices.safePlaces.map((place, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{place.name}</h4>
                          <p className="text-sm text-muted-foreground">{place.address}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-success font-medium">{place.distance}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-warning fill-current" />
                              <span className="text-xs">{place.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Navigation className="w-3 h-3 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default MapPage;