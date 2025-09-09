import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Shield, 
  Database, 
  Globe, 
  Bell, 
  MapPin,
  Clock,
  Key,
  Monitor,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'Tourist Safety Management System',
    adminEmail: user?.email || '',
    timeZone: 'Asia/Kolkata',
    language: 'en',
    maintenanceMode: false,
    debugMode: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    ipWhitelist: '',
    auditLogging: true,
    encryptionEnabled: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    emergencyAlerts: true,
    weeklyReports: true,
    systemMaintenance: true
  });

  const [locationSettings, setLocationSettings] = useState({
    trackingEnabled: true,
    geoFencing: true,
    realTimeUpdates: true,
    locationHistory: 30, // days
    accuracyThreshold: 10 // meters
  });

  const [apiSettings, setApiSettings] = useState({
    googleMapsKey: '••••••••••••••••••••••••••••••••',
    smsGateway: 'enabled',
    emailService: 'enabled',
    backupFrequency: 'daily'
  });

  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/admin/auth/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSaveSettings = async (settingsType: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: `${settingsType} settings have been updated successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportSettings = () => {
    const settings = {
      general: generalSettings,
      security: securitySettings,
      notifications: notificationSettings,
      location: locationSettings,
      api: apiSettings
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-settings.json';
    link.click();
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Configure system preferences and administrative settings
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="outline" size="sm" onClick={handleExportSettings}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">System Status</p>
                  <p className="text-xs text-muted-foreground">Online & Healthy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Database className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Monitor className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Last Backup</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="general" className="text-xs md:text-sm">
              <Settings className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs md:text-sm">
              <Shield className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs md:text-sm">
              <Bell className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="location" className="text-xs md:text-sm">
              <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Location
            </TabsTrigger>
            <TabsTrigger value="api" className="text-xs md:text-sm">
              <Key className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              API & Integration
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Configuration</CardTitle>
                <CardDescription>Basic system settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">System Name</Label>
                    <Input
                      id="systemName"
                      value={generalSettings.systemName}
                      onChange={(e) => setGeneralSettings(prev => ({
                        ...prev,
                        systemName: e.target.value
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Administrator Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={(e) => setGeneralSettings(prev => ({
                        ...prev,
                        adminEmail: e.target.value
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <Input
                      id="timeZone"
                      value={generalSettings.timeZone}
                      onChange={(e) => setGeneralSettings(prev => ({
                        ...prev,
                        timeZone: e.target.value
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Input
                      id="language"
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings(prev => ({
                        ...prev,
                        language: e.target.value
                      }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable maintenance mode to restrict access</p>
                    </div>
                    <Switch
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => setGeneralSettings(prev => ({
                        ...prev,
                        maintenanceMode: checked
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
                    </div>
                    <Switch
                      checked={generalSettings.debugMode}
                      onCheckedChange={(checked) => setGeneralSettings(prev => ({
                        ...prev,
                        debugMode: checked
                      }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings('General')} 
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save General Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Configuration</CardTitle>
                <CardDescription>Manage authentication and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({
                        ...prev,
                        twoFactorAuth: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">Log all administrative actions</p>
                    </div>
                    <Switch
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({
                        ...prev,
                        auditLogging: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">Encrypt sensitive data at rest</p>
                    </div>
                    <Switch
                      checked={securitySettings.encryptionEnabled}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({
                        ...prev,
                        encryptionEnabled: checked
                      }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        sessionTimeout: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordPolicy">Password Policy</Label>
                    <Input
                      id="passwordPolicy"
                      value={securitySettings.passwordPolicy}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: e.target.value
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                  <Input
                    id="ipWhitelist"
                    placeholder="Enter IP addresses separated by commas"
                    value={securitySettings.ipWhitelist}
                    onChange={(e) => setSecuritySettings(prev => ({
                      ...prev,
                      ipWhitelist: e.target.value
                    }))}
                  />
                </div>

                <Button 
                  onClick={() => handleSaveSettings('Security')} 
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when notifications are sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">Send important alerts via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        emailAlerts: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        pushNotifications: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Emergency Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">Critical emergency notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emergencyAlerts}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        emergencyAlerts: checked
                      }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings('Notification')} 
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Settings */}
          <TabsContent value="location" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Location & Tracking Settings</CardTitle>
                <CardDescription>Configure location tracking and geofencing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Location Tracking</Label>
                      <p className="text-sm text-muted-foreground">Enable real-time location tracking for tourists</p>
                    </div>
                    <Switch
                      checked={locationSettings.trackingEnabled}
                      onCheckedChange={(checked) => setLocationSettings(prev => ({
                        ...prev,
                        trackingEnabled: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Geofencing</Label>
                      <p className="text-sm text-muted-foreground">Alert when tourists enter/exit defined areas</p>
                    </div>
                    <Switch
                      checked={locationSettings.geoFencing}
                      onCheckedChange={(checked) => setLocationSettings(prev => ({
                        ...prev,
                        geoFencing: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Real-time Updates</Label>
                      <p className="text-sm text-muted-foreground">Live location updates on the dashboard</p>
                    </div>
                    <Switch
                      checked={locationSettings.realTimeUpdates}
                      onCheckedChange={(checked) => setLocationSettings(prev => ({
                        ...prev,
                        realTimeUpdates: checked
                      }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationHistory">Location History (days)</Label>
                    <Input
                      id="locationHistory"
                      type="number"
                      value={locationSettings.locationHistory}
                      onChange={(e) => setLocationSettings(prev => ({
                        ...prev,
                        locationHistory: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accuracyThreshold">Accuracy Threshold (meters)</Label>
                    <Input
                      id="accuracyThreshold"
                      type="number"
                      value={locationSettings.accuracyThreshold}
                      onChange={(e) => setLocationSettings(prev => ({
                        ...prev,
                        accuracyThreshold: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings('Location')} 
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Location Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API & Integration Settings</CardTitle>
                <CardDescription>Configure external service integrations and API keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="googleMapsKey">Google Maps API Key</Label>
                    <div className="relative">
                      <Input
                        id="googleMapsKey"
                        type={showPassword ? "text" : "password"}
                        value={apiSettings.googleMapsKey}
                        onChange={(e) => setApiSettings(prev => ({
                          ...prev,
                          googleMapsKey: e.target.value
                        }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smsGateway">SMS Gateway</Label>
                      <Input
                        id="smsGateway"
                        value={apiSettings.smsGateway}
                        onChange={(e) => setApiSettings(prev => ({
                          ...prev,
                          smsGateway: e.target.value
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailService">Email Service</Label>
                      <Input
                        id="emailService"
                        value={apiSettings.emailService}
                        onChange={(e) => setApiSettings(prev => ({
                          ...prev,
                          emailService: e.target.value
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Input
                      id="backupFrequency"
                      value={apiSettings.backupFrequency}
                      onChange={(e) => setApiSettings(prev => ({
                        ...prev,
                        backupFrequency: e.target.value
                      }))}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => handleSaveSettings('API')} 
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save API Settings'}
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Connections
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;