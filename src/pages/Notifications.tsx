import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlertStore, useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell,
  AlertTriangle,
  MapPin,
  Shield,
  CheckCircle,
  Clock,
  Filter,
  Trash2,
  Info,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Notifications = () => {
  const { alerts, unreadCount, markAsRead, markAllAsRead, clearAlerts } = useAlertStore();
  const { language } = useAppStore();
  const { t } = useTranslation(language);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock additional notifications for demo
  const demoNotifications = [
    {
      id: 'notif-1',
      type: 'advisory' as const,
      severity: 'medium' as const,
      title: 'Weather Advisory',
      message: 'Heavy rainfall expected in Guwahati area. Exercise caution while traveling.',
      timestamp: Date.now() - 3600000,
      isRead: false,
      icon: 'weather',
      location: { lat: 26.1445, lng: 91.7362 }
    },
    {
      id: 'notif-2',
      type: 'safety' as const,
      severity: 'low' as const,
      title: 'Safety Tip',
      message: 'Remember to carry emergency contact information when visiting remote areas.',
      timestamp: Date.now() - 7200000,
      isRead: true,
      icon: 'tip'
    },
    {
      id: 'notif-3',
      type: 'geo_fence' as const,
      severity: 'high' as const,
      title: 'Area Alert',
      message: 'You are approaching a restricted military zone. Please maintain safe distance.',
      timestamp: Date.now() - 10800000,
      isRead: false,
      icon: 'restricted',
      location: { lat: 26.1500, lng: 91.7400 }
    }
  ];

  const allNotifications = [...alerts, ...demoNotifications].sort((a, b) => b.timestamp - a.timestamp);

  const filteredNotifications = allNotifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const getNotificationIcon = (type: string, severity: string) => {
    switch (type) {
      case 'panic':
        return <AlertTriangle className="w-5 h-5 text-emergency" />;
      case 'geo_fence':
        return <MapPin className="w-5 h-5 text-warning" />;
      case 'safety':
        return <Shield className="w-5 h-5 text-success" />;
      case 'advisory':
        return <Info className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-emergency bg-emergency-light/20';
      case 'high':
        return 'border-l-warning bg-warning-light/20';
      case 'medium':
        return 'border-l-primary bg-primary/5';
      case 'low':
        return 'border-l-success bg-success-light/20';
      default:
        return 'border-l-muted bg-muted/20';
    }
  };

  const handleMarkAsRead = (notifId: string) => {
    markAsRead(notifId);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <Bell className="w-6 h-6 md:w-8 md:h-8" />
                {t('settings.notifications')}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-2">
                Safety alerts, updates, and important messages
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </Button>
              
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsRead()}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => clearAlerts()}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <Card>
            <CardContent className="p-4">
              <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All ({allNotifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread ({allNotifications.filter(n => !n.isRead).length})
                  </TabsTrigger>
                  <TabsTrigger value="read">
                    Read ({allNotifications.filter(n => n.isRead).length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={cn(
                      "border-l-4 transition-all duration-200 hover:shadow-md",
                      getSeverityColor(notification.severity),
                      !notification.isRead && "ring-1 ring-primary/20"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type, notification.severity)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={cn(
                                "font-medium text-sm",
                                !notification.isRead && "text-foreground font-semibold"
                              )}>
                                {(notification as any).title || `${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)} Alert`}
                              </h3>
                              
                              <Badge 
                                variant={notification.severity === 'critical' ? 'destructive' : 'secondary'} 
                                className="text-xs"
                              >
                                {notification.severity}
                              </Badge>

                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                            
                            <p className={cn(
                              "text-sm mb-2",
                              notification.isRead ? "text-muted-foreground" : "text-foreground"
                            )}>
                              {notification.message}
                            </p>

                            {notification.location && (
                              <div className="flex items-center text-xs text-muted-foreground mb-2">
                                <MapPin className="w-3 h-3 mr-1" />
                                Location: {notification.location.lat.toFixed(4)}, {notification.location.lng.toFixed(4)}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(notification.timestamp).toLocaleString()}
                              </div>

                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  Mark as Read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredNotifications.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Bell className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {filter === 'unread' ? 'No unread notifications' : 
                   filter === 'read' ? 'No read notifications' : 'No notifications'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {filter === 'all' 
                    ? "You'll receive safety alerts and updates here" 
                    : `Switch to other tabs to see ${filter === 'unread' ? 'read' : 'unread'} notifications`
                  }
                </p>
              </motion.div>
            )}
          </div>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-emergency-light/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-emergency mx-auto mb-1" />
                  <p className="text-xs font-medium">Emergency</p>
                  <p className="text-xs text-muted-foreground">Always On</p>
                </div>
                <div className="text-center p-3 bg-warning-light/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-warning mx-auto mb-1" />
                  <p className="text-xs font-medium">Location</p>
                  <p className="text-xs text-muted-foreground">Enabled</p>
                </div>
                <div className="text-center p-3 bg-success-light/20 rounded-lg">
                  <Shield className="w-6 h-6 text-success mx-auto mb-1" />
                  <p className="text-xs font-medium">Safety Tips</p>
                  <p className="text-xs text-muted-foreground">Enabled</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <Info className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs font-medium">General</p>
                  <p className="text-xs text-muted-foreground">Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;