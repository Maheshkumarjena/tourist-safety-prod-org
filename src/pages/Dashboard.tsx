

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore, useLocationStore, useAlertStore, useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { PanicButton } from '@/components/ui/panic-button';
import { userAPI, alertAPI, notificationAPI, blockchainAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  const [digitalId, setDigitalId] = useState<string | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  // Emergency UI state
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [contactForm, setContactForm] = useState<{ id?: string; name: string; phone: string; relationship?: string }>({ name: '', phone: '', relationship: '' });
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = (null as unknown) as HTMLVideoElement | null;
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const isAuthority = user?.role === 'authority';

  // Load real data from backend on mount
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Profile (includes safetyScore and currentTrip)
        const profile = await userAPI.getProfile();
        if (!mounted) return;
        if (profile?.safetyScore) setSafetyScore(profile.safetyScore);

        // Alerts
        try {
          const alertsRes = await alertAPI.getAlerts();
          if (!mounted) return;
          // support array or { alerts }
          const alertsList = Array.isArray(alertsRes) ? alertsRes : alertsRes?.alerts || [];
          setRecentAlerts(alertsList.slice(0, 10));
        } catch (err) {
          // ignore alerts error, keep empty
        }

        // Notifications (for count)
        try {
          const notRes = await notificationAPI.getNotifications(10, 1);
          if (!mounted) return;
          setNotificationsCount(notRes?.total || (Array.isArray(notRes?.notifications) ? notRes.notifications.length : 0));
        } catch (err) {
          // ignore
        }

        // Blockchain digital ID (attempt to fetch or issue)
        try {
          // If backend provides a get QR endpoint for the user, prefer that. Otherwise, issue a digital ID.
          const bc = await blockchainAPI.issueDigitalID({
            userId: user?.id || '12345',
            idData: user?.isKYCVerified ? 'verified-kyc-data' : 'pending-verification',
            expiryDate: user?.currentTrip?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
          if (!mounted) return;
          setDigitalId(bc?.digitalId || null);
        } catch (err) {
          // ignore blockchain errors
        }
      } catch (err) {
        // top-level load error - keep UI functional
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadData();

    return () => { mounted = false; };
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

  const { emergencyContacts, addEmergencyContact, updateEmergencyContact, removeEmergencyContact } = useAppStore();
  const { addAlert } = useAlertStore();

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
                {recentAlerts.length > 0 ? recentAlerts.map((alert: any) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.type}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{alert.tourist || alert.userName || alert.reportedBy}</p>
                        <p className="text-xs text-muted-foreground">{alert.location?.name || alert.location || ''} • {new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <Button size="sm">Respond</Button>
                  </div>
                )) : (
                  <div className="text-muted-foreground p-4">No recent alerts</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Camera Dialog */}
          <Dialog open={isCameraOpen} onOpenChange={(open) => {
            setIsCameraOpen(open);
            if (!open && videoStream) {
              videoStream.getTracks().forEach(t => t.stop());
              setVideoStream(null);
            }
          }}>
            <DialogContent className="max-w-xl mx-4">
              <DialogHeader>
                <DialogTitle>Photo Evidence</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <div className="bg-black rounded overflow-hidden">
                  {videoStream ? (
                    // @ts-ignore - simple video attach via ref in effect
                    <video autoPlay playsInline ref={(el) => { if (el && videoStream) { try { el.srcObject = videoStream; } catch(e){} } }} className="w-full h-64 object-cover" />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center text-muted-foreground">Camera initializing...</div>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" onClick={() => { if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); setVideoStream(null); } setIsCameraOpen(false); }}>Close</Button>
                  <Button onClick={() => {
                    if (!videoStream) return alert('Camera not ready');
                    const track = videoStream.getVideoTracks()[0];
                    const imageCapture = new (window as any).ImageCapture(track);
                    imageCapture.takePhoto().then((blob: Blob) => {
                      addAlert({ type: 'panic', severity: 'high', message: 'Photo evidence captured', location: currentLocation, isRead: false });
                      // stop and close
                      videoStream.getTracks().forEach(t => t.stop());
                      setVideoStream(null);
                      setIsCameraOpen(false);
                    }).catch(() => {
                      // fallback to canvas capture
                      const videoEl = document.querySelector('video');
                      if (!videoEl) return alert('Capture failed');
                      const canvas = document.createElement('canvas');
                      canvas.width = (videoEl as HTMLVideoElement).videoWidth || 640;
                      canvas.height = (videoEl as HTMLVideoElement).videoHeight || 480;
                      const ctx = canvas.getContext('2d');
                      if (ctx) ctx.drawImage(videoEl as HTMLVideoElement, 0, 0, canvas.width, canvas.height);
                      canvas.toBlob((blob) => {
                        addAlert({ type: 'panic', severity: 'high', message: 'Photo evidence captured', location: currentLocation, isRead: false });
                      });
                      videoStream.getTracks().forEach(t => t.stop());
                      setVideoStream(null);
                      setIsCameraOpen(false);
                    });
                  }}>Capture</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Audio Dialog */}
          <Dialog open={isAudioOpen} onOpenChange={(open) => { if (!open) { setIsAudioOpen(false); if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop(); } }}>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>Voice Record</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Record an audio clip to attach to your emergency alert.</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      if (!mediaRecorder) return alert('Microphone not ready');
                      if (mediaRecorder.state === 'recording') return;
                      setRecordedChunks([]);
                      mediaRecorder.start();
                      mediaRecorder.ondataavailable = (e) => setRecordedChunks((c) => [...c, e.data]);
                    }}>Start</Button>
                    <Button variant="outline" onClick={() => { if (!mediaRecorder) return; if (mediaRecorder.state === 'recording') mediaRecorder.stop(); }}>Stop</Button>
                    <Button onClick={() => {
                      if (recordedChunks.length === 0) return alert('No recording');
                      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                      addAlert({ type: 'panic', severity: 'high', message: 'Voice evidence uploaded', location: currentLocation, isRead: false });
                      setIsAudioOpen(false);
                    }}>Upload</Button>
                  </div>
                  {recordedChunks.length > 0 && (
                    <audio controls src={URL.createObjectURL(new Blob(recordedChunks))}></audio>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Contacts Dialog */}
          <Dialog open={isContactsOpen} onOpenChange={setIsContactsOpen}>
            <DialogContent className="max-w-lg mx-4">
              <DialogHeader>
                <DialogTitle>Emergency Contacts</DialogTitle>
              </DialogHeader>
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  {emergencyContacts.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.relationship} • {c.phone}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingContactId(c.id); setContactForm({ id: c.id, name: c.name, phone: c.phone, relationship: c.relationship }); }}>Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => removeEmergencyContact(c.id)}>Delete</Button>
                        <Button size="sm" onClick={() => window.open(`tel:${c.phone}`)}>Call</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">Add / Edit Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                    <Input placeholder="Phone" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
                    <Input placeholder="Relationship" value={contactForm.relationship} onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })} />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" onClick={() => { setContactForm({ name: '', phone: '', relationship: '' }); setEditingContactId(null); }}>Clear</Button>
                    <Button onClick={() => {
                      if (!contactForm.name || !contactForm.phone) return alert('Name & phone required');
                      if (editingContactId) {
                        updateEmergencyContact(editingContactId, { name: contactForm.name, phone: contactForm.phone, relationship: contactForm.relationship });
                      } else {
                        addEmergencyContact({ name: contactForm.name, phone: contactForm.phone, relationship: contactForm.relationship });
                      }
                      setContactForm({ name: '', phone: '', relationship: '' });
                      setEditingContactId(null);
                    }}>{editingContactId ? 'Update' : 'Add'}</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                    // open camera dialog
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                      setIsCameraOpen(true);
                      navigator.mediaDevices.getUserMedia({ video: true })
                        .then((s) => setVideoStream(s))
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
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                      setIsAudioOpen(true);
                      navigator.mediaDevices.getUserMedia({ audio: true })
                        .then((stream) => {
                          try {
                            const mr = new MediaRecorder(stream as MediaStream);
                            setRecordedChunks([]);
                            setMediaRecorder(mr);
                          } catch (e) {
                            alert('Unable to start recorder');
                          }
                        })
                        .catch(() => alert('Microphone access denied'));
                    } else {
                      alert('Microphone not available');
                    }
                  }}
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-xs">Voice Record</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 flex-col gap-2 text-emergency border-emergency hover:bg-emergency hover:text-emergency-foreground"
                  onClick={() => setIsContactsOpen(true)}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Contacts</span>
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