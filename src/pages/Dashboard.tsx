

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore, useLocationStore, useAlertStore, useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { PanicButton } from '@/components/ui/panic-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Clock,
  Battery,
  Wifi,
  WifiOff,
  CheckCircle,
  TrendingUp,
  Phone,
  Camera,
  Navigation,
  Bell,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { currentLocation, isTracking, trackingConsent, startTracking, stopTracking, setTrackingConsent } = useLocationStore();
  const { alerts, unreadCount } = useAlertStore();
  const { isOnline, language } = useAppStore();
  const { t } = useTranslation(language);
  
  const [safetyScore, setSafetyScore] = useState(85);
  const [digitalId] = useState('DTID-' + Date.now().toString().slice(-8));

  const isAuthority = user?.role === 'authority';

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate safety score changes
      setSafetyScore(prev => {
        const change = Math.random() * 6 - 3; // -3 to +3
        return Math.min(100, Math.max(60, prev + change));
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLocationToggle = (enabled: boolean) => {
    setTrackingConsent(enabled);
    if (enabled) {
      startTracking();
    } else {
      stopTracking();
    }
  };

  const getSafetyStatus = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: 'status-safe', icon: CheckCircle };
    if (score >= 75) return { text: 'Good', color: 'status-safe', icon: CheckCircle };
    if (score >= 60) return { text: 'Moderate', color: 'status-warning', icon: AlertTriangle };
    return { text: 'Low', color: 'status-danger', icon: AlertTriangle };
  };

  const safetyStatus = getSafetyStatus(safetyScore);
  const StatusIcon = safetyStatus.icon;

  if (isAuthority) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Authority Dashboard</h1>
            <p className="text-muted-foreground mt-2">Tourist safety monitoring and incident response</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Statistics Cards */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Tourists</p>
                    <p className="text-2xl font-bold text-foreground">1,247</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold text-emergency">23</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-emergency" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Safety Score</p>
                    <p className="text-2xl font-bold text-success">87%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold text-primary">4.2m</p>
                  </div>
                  <Clock className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest tourist safety alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, type: 'Panic', tourist: 'John Doe', location: 'Guwahati Central', time: '2 mins ago', severity: 'critical' },
                  { id: 2, type: 'Geo-fence', tourist: 'Sarah Wilson', location: 'Restricted Area', time: '15 mins ago', severity: 'high' },
                  { id: 3, type: 'Safety', tourist: 'Mike Chen', location: 'Tourism Zone', time: '1 hour ago', severity: 'medium' },
                ].map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.type}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{alert.tourist}</p>
                        <p className="text-xs text-muted-foreground">{alert.location} • {alert.time}</p>
                      </div>
                    </div>
                    <Button size="sm">Respond</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-xl md:text-3xl font-bold text-foreground mb-2">
            {t('dashboard.welcome')}, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Your safety is our priority. Current trip: {user?.currentTrip?.destination || 'Not set'}
          </p>
        </motion.div>

        {/* Status Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Safety Status */}
          <Card className="card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{t('dashboard.safetyStatus')}</h3>
                <StatusIcon className="w-5 h-5 text-success" />
              </div>
              <div className={cn("p-3 rounded-lg", safetyStatus.color)}>
                <div className="text-2xl font-bold text-white mb-1">{safetyScore}%</div>
                <div className="text-sm text-white/90">{safetyStatus.text}</div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Location Active:</span>
                  <span className="text-success">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Emergency Contacts:</span>
                  <span className="text-success">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Area Safety:</span>
                  <span className="text-success">Good</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Tracking */}
          <Card className="card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{t('dashboard.locationTracking')}</h3>
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Enable Tracking</span>
                <Switch
                  checked={trackingConsent && isTracking}
                  onCheckedChange={handleLocationToggle}
                />
              </div>
              {currentLocation ? (
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>Lat: {currentLocation.lat.toFixed(6)}</div>
                  <div>Lng: {currentLocation.lng.toFixed(6)}</div>
                  <div>Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}</div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Location tracking disabled
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">System Status</h3>
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-success" />
                ) : (
                  <WifiOff className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Connection:</span>
                  <span className={isOnline ? 'text-success' : 'text-destructive'}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Battery:</span>
                  <span className="text-success">89%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Sync:</span>
                  <span className="text-muted-foreground">Just now</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Section */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-emergency">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {t('common.emergency')} Response
              </CardTitle>
              <CardDescription>
                Quick access to emergency features and contacts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PanicButton size="lg" />
              
              {/* Emergency Response Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2 text-emergency border-emergency hover:bg-emergency hover:text-emergency-foreground"
                  onClick={() => {
                    // Mock photo capture
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                      navigator.mediaDevices.getUserMedia({ video: true })
                        .then(() => alert('Camera accessed for emergency documentation'))
                        .catch(() => alert('Camera access denied'));
                    } else {
                      alert('Camera not available');
                    }
                  }}
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-xs">Photo Evidence</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2 text-emergency border-emergency hover:bg-emergency hover:text-emergency-foreground"
                  onClick={() => {
                    // Mock voice recording
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                      navigator.mediaDevices.getUserMedia({ audio: true })
                        .then(() => alert('Voice recording started for emergency'))
                        .catch(() => alert('Microphone access denied'));
                    } else {
                      alert('Microphone not available');
                    }
                  }}
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-xs">Voice Record</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Digital ID QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Digital Tourist ID
              </CardTitle>
              <CardDescription>
                Your blockchain-verified tourist identification
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg">
                <QRCodeSVG 
                  value={`TOURIST_ID:${digitalId}:${user?.id}`}
                  size={120}
                  level="M"
                />
              </div>
              <div className="mt-3">
                <Badge variant="outline" className="text-xs">
                  ID: {digitalId}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Valid for current trip • Show to authorities when requested
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Recent Alerts
                </span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={cn(
                    "p-3 rounded-lg border-l-4",
                    alert.type === 'panic' ? 'zone-restricted' :
                    alert.severity === 'high' ? 'zone-warning' : 'zone-safe'
                  )}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm capitalize">{alert.type} Alert</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
                
                {alerts.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
                    <p className="text-sm">No alerts - You're safe!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-emergency hover:text-emergency-foreground hover:border-emergency"
                onClick={() => window.open('tel:100')}
              >
                <Phone className="w-6 h-6 mb-2" />
                <span className="text-xs">Emergency Call</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-warning hover:text-warning-foreground hover:border-warning"
                onClick={() => {
                  // Mock report issue
                  alert('Incident reporting feature activated. Authorities will be notified.');
                }}
              >
                <Camera className="w-6 h-6 mb-2" />
                <span className="text-xs">Report Issue</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-success hover:text-success-foreground hover:border-success"
                onClick={() => {
                  // Mock safe routes
                  alert('Calculating safest route to your destination...');
                }}
              >
                <Navigation className="w-6 h-6 mb-2" />
                <span className="text-xs">Safe Routes</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-primary hover:text-primary-foreground hover:border-primary"
                onClick={() => window.location.href = '/settings'}
              >
                <Settings className="w-6 h-6 mb-2" />
                <span className="text-xs">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;