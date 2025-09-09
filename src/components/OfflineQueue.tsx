import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Upload, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Database
} from 'lucide-react';
// import { offlineAPI } from '@/lib/api';
// Temporarily disabled to isolate error

interface QueuedRequest {
  id: string;
  endpoint: string;
  method: string;
  data?: any;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}

interface OfflineQueueProps {
  isOnline: boolean;
}

export const OfflineQueue = ({ isOnline }: OfflineQueueProps) => {
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const { toast } = useToast();

  // Mock queued requests for demo
  useEffect(() => {
    if (!isOnline) {
      // Simulate adding requests to queue when offline
      const mockRequests: QueuedRequest[] = [
        {
          id: 'req-1',
          endpoint: '/location/ping',
          method: 'POST',
          data: { latitude: 26.1445, longitude: 91.7362 },
          timestamp: Date.now() - 30000,
          retries: 0,
          status: 'pending'
        },
        {
          id: 'req-2',
          endpoint: '/alerts/panic',
          method: 'POST',
          data: { message: 'Emergency alert', coordinates: { lat: 26.1445, lng: 91.7362 } },
          timestamp: Date.now() - 60000,
          retries: 1,
          status: 'pending'
        }
      ];
      setQueuedRequests(mockRequests);
    }
  }, [isOnline]);

  const syncQueuedRequests = async () => {
    if (!isOnline || queuedRequests.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);

    try {
      const pendingRequests = queuedRequests.filter(req => req.status === 'pending');
      
      for (let i = 0; i < pendingRequests.length; i++) {
        const request = pendingRequests[i];
        
        // Update status to syncing
        setQueuedRequests(prev => 
          prev.map(req => 
            req.id === request.id ? { ...req, status: 'syncing' } : req
          )
        );

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mark as synced
          setQueuedRequests(prev => 
            prev.map(req => 
              req.id === request.id ? { ...req, status: 'synced' } : req
            )
          );

          setSyncProgress(((i + 1) / pendingRequests.length) * 100);
        } catch (error) {
          // Mark as failed and increment retries
          setQueuedRequests(prev => 
            prev.map(req => 
              req.id === request.id 
                ? { ...req, status: 'failed', retries: req.retries + 1 } 
                : req
            )
          );
        }
      }

      // Remove synced requests after a delay
      setTimeout(() => {
        setQueuedRequests(prev => prev.filter(req => req.status !== 'synced'));
      }, 2000);

      toast({
        title: "Sync completed",
        description: `${pendingRequests.length} requests processed`,
      });

    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const clearQueue = () => {
    setQueuedRequests([]);
    toast({
      title: "Queue cleared",
      description: "All queued requests have been removed",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Database className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      case 'synced':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (queuedRequests.length === 0 && isOnline) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-24 right-4 w-80 max-w-[calc(100vw-2rem)] z-50"
    >
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              Offline Queue
              <Badge variant="secondary" className="ml-2">
                {queuedRequests.filter(req => req.status === 'pending').length}
              </Badge>
            </CardTitle>
            
            {isOnline && queuedRequests.some(req => req.status === 'pending') && (
              <Button
                size="sm"
                onClick={syncQueuedRequests}
                disabled={isSyncing}
                className="text-xs"
              >
                <Upload className="w-3 h-3 mr-1" />
                Sync
              </Button>
            )}
          </div>
          
          {isSyncing && (
            <div className="space-y-2">
              <Progress value={syncProgress} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Syncing... {Math.round(syncProgress)}%
              </p>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="max-h-60 overflow-y-auto space-y-2">
          <AnimatePresence mode="popLayout">
            {queuedRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getStatusIcon(request.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {request.method} {request.endpoint}
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(request.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {request.retries > 0 && (
                    <span className="text-xs text-muted-foreground">
                      Retry {request.retries}
                    </span>
                  )}
                  <Badge 
                    className={`text-xs ${getStatusColor(request.status)}`}
                  >
                    {request.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {queuedRequests.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No queued requests</p>
            </div>
          )}
        </CardContent>
        
        {queuedRequests.length > 0 && (
          <div className="p-3 border-t">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {isOnline 
                  ? "Connected - ready to sync" 
                  : "Offline - requests will sync when online"
                }
              </p>
              {queuedRequests.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearQueue}
                  className="text-xs h-6"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};