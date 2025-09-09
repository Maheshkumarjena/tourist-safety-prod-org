import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle,
  Cloud,
  CloudOff
} from 'lucide-react';

export function OfflineIndicator() {
  const { isOnline, setOnlineStatus } = useAppStore();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      setShowOfflineMessage(false);
      setShowOnlineMessage(true);
      setTimeout(() => setShowOnlineMessage(false), 3000);
    };

    const handleOffline = () => {
      setOnlineStatus(false);
      setShowOnlineMessage(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize based on current status
    if (!navigator.onLine) {
      setOnlineStatus(false);
      setShowOfflineMessage(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return (
    <>
      {/* Persistent offline indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-40 bg-warning/90 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-center space-x-2 text-warning-foreground">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Offline Mode - Emergency features still available
                </span>
                <Badge variant="outline" className="border-warning-foreground/30 text-warning-foreground">
                  Limited Connectivity
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Temporary offline message */}
      <AnimatePresence>
        {showOfflineMessage && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
          >
            <Card className="border-warning/20 bg-warning/10">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CloudOff className="w-4 h-4 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-warning text-sm mb-1">
                      Connection Lost
                    </h4>
                    <p className="text-xs text-warning/80 mb-2">
                      You're now in offline mode. Core safety features remain available.
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-success" />
                        <span className="text-success">Emergency SOS</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-success" />
                        <span className="text-success">Local Location Data</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <AlertTriangle className="w-3 h-3 text-warning" />
                        <span className="text-warning/80">Real-time Alerts Disabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Temporary online message */}
      <AnimatePresence>
        {showOnlineMessage && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
          >
            <Card className="border-success/20 bg-success/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                    <Cloud className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <h4 className="font-medium text-success text-sm mb-1">
                      Back Online
                    </h4>
                    <p className="text-xs text-success/80">
                      Connection restored. All features available.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Network status component for dashboard
export function NetworkStatus() {
  const { isOnline } = useAppStore();

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
      <span className="text-sm text-muted-foreground">
        {isOnline ? 'Online' : 'Offline'}
      </span>
      {isOnline ? (
        <Wifi className="w-4 h-4 text-success" />
      ) : (
        <WifiOff className="w-4 h-4 text-warning" />
      )}
    </div>
  );
}