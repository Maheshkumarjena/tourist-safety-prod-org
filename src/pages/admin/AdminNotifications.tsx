import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  AlertTriangle, 
  MessageSquare, 
  Settings, 
  Clock,
  CheckCircle,
  XCircle,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Users,
  Shield,
  Activity,
  MapPin,
  FileText
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

const AdminNotifications = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [notificationSettings, setNotificationSettings] = useState({
    emergencyAlerts: true,
    touristUpdates: true,
    systemAlerts: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    soundEnabled: true
  });

  const [notifications] = useState([
    {
      id: '1',
      type: 'emergency',
      title: 'Panic Button Activated',
      message: 'Tourist Sarah Johnson activated panic button at Red Fort, Delhi',
      timestamp: '2 minutes ago',
      isRead: false,
      severity: 'critical',
      location: 'Red Fort, Delhi',
      icon: AlertTriangle
    },
    {
      id: '2',
      type: 'system',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance window from 2:00 AM - 4:00 AM tomorrow',
      timestamp: '15 minutes ago',
      isRead: false,
      severity: 'info',
      icon: Settings
    },
    {
      id: '3',
      type: 'tourist',
      title: 'Tourist Check-in',
      message: '24 tourists checked into Taj Mahal guided tour',
      timestamp: '1 hour ago',
      isRead: true,
      severity: 'low',
      location: 'Taj Mahal, Agra',
      icon: Users
    },
    {
      id: '4',
      type: 'security',
      title: 'Security Alert',
      message: 'Unusual activity detected in Connaught Place area',
      timestamp: '2 hours ago',
      isRead: true,
      severity: 'medium',
      location: 'Connaught Place, Delhi',
      icon: Shield
    },
    {
      id: '5',
      type: 'incident',
      title: 'Incident Report Filed',
      message: 'Medical assistance incident report #IR-2024-0089',
      timestamp: '3 hours ago',
      isRead: true,
      severity: 'medium',
      icon: FileText
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'info': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/admin/auth/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Notification Center</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage alerts, messages, and notification preferences
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Bell className="h-3 w-3" />
              <span className="text-xs">{unreadCount} Unread</span>
            </Badge>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">System notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                Tourist Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Tourist activity notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-500" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications" className="text-xs md:text-sm">All Notifications</TabsTrigger>
            <TabsTrigger value="emergency" className="text-xs md:text-sm">Emergency</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs md:text-sm">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Recent Notifications</CardTitle>
                    <CardDescription>Latest system alerts and messages</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div 
                        key={notification.id} 
                        className={`p-3 md:p-4 border rounded-lg transition-colors ${
                          !notification.isRead ? 'bg-muted/30' : ''
                        } ${getSeverityColor(notification.severity)}`}
                      >
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="p-2 rounded-full bg-white/50 flex-shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h4 className="font-semibold text-sm md:text-base truncate">
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                {!notification.isRead && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0">
                                    New
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {notification.timestamp}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            {notification.location && (
                              <p className="text-xs text-muted-foreground flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {notification.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Alerts
                </CardTitle>
                <CardDescription>Critical alerts requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.filter(n => n.severity === 'critical').map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div key={notification.id} className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-red-100 flex-shrink-0">
                            <Icon className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h4 className="font-semibold text-red-900">{notification.title}</h4>
                              <Button size="sm" variant="destructive">
                                Respond Now
                              </Button>
                            </div>
                            <p className="text-sm text-red-700">{notification.message}</p>
                            {notification.location && (
                              <p className="text-sm text-red-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {notification.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Alert Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm md:text-base">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Emergency Alerts
                      </Label>
                      <Switch
                        checked={notificationSettings.emergencyAlerts}
                        onCheckedChange={(checked) => handleSettingChange('emergencyAlerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm md:text-base">
                        <Users className="h-4 w-4 text-blue-500" />
                        Tourist Updates
                      </Label>
                      <Switch
                        checked={notificationSettings.touristUpdates}
                        onCheckedChange={(checked) => handleSettingChange('touristUpdates', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm md:text-base">
                        <Settings className="h-4 w-4 text-gray-500" />
                        System Alerts
                      </Label>
                      <Switch
                        checked={notificationSettings.systemAlerts}
                        onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Delivery Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm md:text-base">
                        <Mail className="h-4 w-4" />
                        Email Notifications
                      </Label>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm md:text-base">
                        <MessageSquare className="h-4 w-4" />
                        SMS Notifications
                      </Label>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm md:text-base">
                        <Smartphone className="h-4 w-4" />
                        Push Notifications
                      </Label>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Audio Settings</h4>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm md:text-base">
                      {notificationSettings.soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                      Sound Notifications
                    </Label>
                    <Switch
                      checked={notificationSettings.soundEnabled}
                      onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full sm:w-auto">
                    Save Preferences
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

export default AdminNotifications;