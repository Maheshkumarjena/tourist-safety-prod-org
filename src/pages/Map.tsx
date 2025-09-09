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
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapLocation {
  lat: number;
  lng: number;
  type: 'current' | 'safe' | 'warning' | 'restricted' | 'tourist' | 'authority';
  title?: string;
  description?: string;
  timestamp?: number;
}

const MapPage = () => {
  const { user } = useAuthStore();
  const { currentLocation, locationHistory, isTracking } = useLocationStore();
  const { addAlert } = useAlertStore();
  const mapRef = useRef<HTMLDivElement>(null);
  
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showTourists, setShowTourists] = useState(user?.role === 'authority');
  const [mapCenter, setMapCenter] = useState({ lat: 26.1445, lng: 91.7362, timestamp: Date.now() }); // Guwahati

  // Mock locations for demo
  const mockLocations: MapLocation[] = [
    { lat: 26.1445, lng: 91.7362, type: 'current', title: 'Your Location', description: 'Current position' },
    { lat: 26.1500, lng: 91.7400, type: 'restricted', title: 'Military Zone', description: 'Restricted area - No entry' },
    { lat: 26.1400, lng: 91.7300, type: 'safe', title: 'Tourist Information Center', description: 'Safe zone with assistance' },
    { lat: 26.1480, lng: 91.7350, type: 'warning', title: 'Construction Zone', description: 'Exercise caution' },
    { lat: 26.1420, lng: 91.7380, type: 'tourist', title: 'Tourist Group', description: '15 tourists nearby' },
    { lat: 26.1460, lng: 91.7320, type: 'authority', title: 'Police Station', description: 'Local authorities' },
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
      setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng, timestamp: currentLocation.timestamp });
    }
  }, [currentLocation]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'current':
        return <Navigation className="w-4 h-4 text-primary" />;
      case 'safe':
        return <Shield className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'restricted':
        return <AlertTriangle className="w-4 h-4 text-emergency" />;
      case 'tourist':
        return <Users className="w-4 h-4 text-secondary" />;
      case 'authority':
        return <Shield className="w-4 h-4 text-primary" />;
      default:
        return <MapPin className="w-4 h-4 text-muted-foreground" />;
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
      default:
        return 'bg-muted border-muted-foreground';
    }
  };

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
      setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng, timestamp: currentLocation.timestamp });
    } else {
      // Request location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude, timestamp: Date.now() });
          },
          (error) => {
            console.error('Geolocation error:', error);
          }
        );
      }
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
                  {/* Mock Map Display */}
                  <div 
                    ref={mapRef}
                    className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg overflow-hidden"
                  >
                    {/* Map Grid Background */}
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                      </svg>
                    </div>

                    {/* Location Markers */}
                    {allLocations.map((location, index) => {
                      const x = ((location.lng - (mapCenter.lng - 0.02)) / 0.04) * 100;
                      const y = ((mapCenter.lat + 0.02 - location.lat) / 0.04) * 100;
                      
                      // Only show if within bounds and filters
                      if (x < 0 || x > 100 || y < 0 || y > 100) return null;
                      if (location.type === 'tourist' && !showTourists) return null;
                      if ((location.type === 'safe' || location.type === 'warning' || location.type === 'restricted') && !showSafeZones) return null;

                      return (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          style={{ left: `${x}%`, top: `${y}%` }}
                          onClick={() => handleLocationClick(location)}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110",
                            getLocationColor(location.type),
                            selectedLocation === location && "ring-2 ring-offset-2 ring-primary"
                          )}>
                            {getLocationIcon(location.type)}
                          </div>
                          
                          {location.type === 'current' && (
                            <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20"></div>
                          )}
                        </motion.div>
                      );
                    })}

                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 space-y-2">
                      <Button variant="outline" size="sm" className="bg-card/80 backdrop-blur">
                        <Route className="w-4 h-4" />
                      </Button>
                      <div className="flex flex-col space-y-1">
                        <Button variant="outline" size="sm" className="bg-card/80 backdrop-blur text-xs">
                          +
                        </Button>
                        <Button variant="outline" size="sm" className="bg-card/80 backdrop-blur text-xs">
                          -
                        </Button>
                      </div>
                    </div>

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
                              {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
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
                        {getLocationIcon(selectedLocation.type)}
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
                  {[
                    { type: 'current', label: 'Your Location', color: 'bg-primary' },
                    { type: 'safe', label: 'Safe Zone', color: 'bg-success' },
                    { type: 'warning', label: 'Caution Area', color: 'bg-warning' },
                    { type: 'restricted', label: 'Restricted', color: 'bg-emergency' },
                    { type: 'authority', label: 'Authorities', color: 'bg-primary' },
                    { type: 'tourist', label: 'Tourists', color: 'bg-secondary' },
                  ].map((item) => (
                    <div key={item.type} className="flex items-center space-x-2 text-sm">
                      <div className={cn("w-3 h-3 rounded-full", item.color)}></div>
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

          {/* Nearby Services Tab */}
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