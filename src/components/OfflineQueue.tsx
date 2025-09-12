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
import { offlineAPI } from '@/lib/api';

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

  // Load queued requests from offline API when offline
  useEffect(() => {
    let cancelled = false;
    const loadStatus = async () => {
      if (!isOnline) {
        // Attempt to read queued requests from server/local store via API
        try {
          const status = await offlineAPI.getOfflineStatus();
          // Expecting { queuedRequests: number, lastSync: string } or a list - normalize
          if (!cancelled) {
            // If API returns a list of requests, use it; otherwise keep empty placeholder
            const requests: QueuedRequest[] = Array.isArray((status as any).requests)
              ? (status as any).requests
              : [];
            setQueuedRequests(requests.map((r: any, idx: number) => ({
              id: r.id || `req-${idx}`,
              endpoint: r.endpoint || r.url || '/unknown',
              method: r.method || 'POST',
              data: r.data,
              timestamp: r.timestamp || Date.now(),
              retries: r.retries || 0,
              status: r.status || 'pending'
            })));
          }
        } catch (error) {
          // Ignore - keep queue empty
        }
      }
    };

    loadStatus();

    return () => { cancelled = true; };
  }, [isOnline]);

  const syncQueuedRequests = async () => {
    if (!isOnline || queuedRequests.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);

    try {
      const pendingRequests = queuedRequests.filter(req => req.status === 'pending');
      if (pendingRequests.length === 0) return;

      // Send requests to offline API for processing
      const res = await offlineAPI.processOfflineRequests(pendingRequests.map(r => ({
        endpoint: r.endpoint,
        method: r.method as any,
        data: r.data,
      })));

      // Expectation: res contains processed count or per-request results
      // For now, mark all as synced on success
      setQueuedRequests(prev => prev.map(req => ({ ...req, status: 'synced' })));

      setSyncProgress(100);
      toast({ title: 'Sync completed', description: `${pendingRequests.length} requests processed` });

      // Clear synced requests after short delay
      setTimeout(() => setQueuedRequests([]), 1500);
    } catch (error) {
      toast({ title: 'Sync failed', description: 'Please try again', variant: 'destructive' });
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