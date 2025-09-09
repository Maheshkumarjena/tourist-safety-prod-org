import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Eye, 
  MapPin, 
  Bell, 
  Database, 
  Calendar,
  Clock,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
// import { consentAPI } from '@/lib/api';
// Temporarily disabled to isolate error
const consentAPI = {
  getConsentHistory: async () => ({ consents: [] }),
  recordConsent: async (data: any) => ({ success: true }),
  revokeConsent: async (data: any) => ({ success: true })
};

interface ConsentItem {
  type: 'location' | 'notifications' | 'analytics' | 'emergency';
  granted: boolean;
  purpose: string;
  version: string;
  timestamp: string;
  expiresAt: string;
  required?: boolean;
}

export const ConsentManager = () => {
  const [consents, setConsents] = useState<ConsentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const consentTypes = [
    {
      type: 'location' as const,
      title: 'Location Tracking',
      description: 'Allow real-time location monitoring for safety and emergency response',
      icon: MapPin,
      required: true,
      details: [
        'Real-time GPS tracking',
        'Location history storage',
        'Geo-fencing alerts',
        'Emergency location sharing'
      ]
    },
    {
      type: 'notifications' as const,
      title: 'Push Notifications',
      description: 'Receive safety alerts, weather updates, and emergency notifications',
      icon: Bell,
      required: true,
      details: [
        'Emergency alerts',
        'Weather warnings',
        'Area advisories',
        'System notifications'
      ]
    },
    {
      type: 'analytics' as const,
      title: 'Usage Analytics',
      description: 'Help improve the app by sharing anonymous usage data',
      icon: Database,
      required: false,
      details: [
        'App usage statistics',
        'Feature usage tracking',
        'Performance analytics',
        'Crash reporting'
      ]
    },
    {
      type: 'emergency' as const,
      title: 'Emergency Data Sharing',
      description: 'Share profile and health data with emergency responders when needed',
      icon: Shield,
      required: true,
      details: [
        'Medical information',
        'Emergency contacts',
        'Current location',
        'Safety status'
      ]
    }
  ];

  useEffect(() => {
    loadConsentHistory();
  }, []);

  const loadConsentHistory = async () => {
    try {
      setIsLoading(true);
      const response = await consentAPI.getConsentHistory();
      
      // Initialize with default consents if none exist
      const existingConsents = response.consents || [];
      const initializedConsents = consentTypes.map(type => {
        const existing = existingConsents.find(c => c.type === type.type);
        return existing || {
          type: type.type,
          granted: type.required, // Required consents default to true
          purpose: type.description,
          version: '1.0',
          timestamp: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          required: type.required
        };
      });
      
      setConsents(initializedConsents);
    } catch (error) {
      toast({
        title: "Failed to load consent settings",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsent = async (type: string, granted: boolean) => {
    const consentType = consentTypes.find(c => c.type === type);
    if (consentType?.required && !granted) {
      toast({
        title: "Required consent",
        description: "This consent is required for the app to function properly",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const consentData = {
        type: type as 'location' | 'notifications',
        granted,
        purpose: consentType?.description || '',
        version: '1.0',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };

      if (granted) {
        await consentAPI.recordConsent(consentData);
      } else {
        await consentAPI.revokeConsent({
          type: type as 'location' | 'notifications',
          purpose: consentData.purpose,
          version: consentData.version
        });
      }

      // Update local state
      setConsents(prev => prev.map(consent => 
        consent.type === type 
          ? { 
              ...consent, 
              granted, 
              timestamp: new Date().toISOString(),
              expiresAt: consentData.expiresAt
            }
          : consent
      ));

      toast({
        title: granted ? "Consent granted" : "Consent revoked",
        description: `${consentType?.title} has been ${granted ? 'enabled' : 'disabled'}`,
      });

    } catch (error) {
      toast({
        title: "Failed to update consent",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getConsentIcon = (type: string) => {
    const consentType = consentTypes.find(c => c.type === type);
    const IconComponent = consentType?.icon || Shield;
    return <IconComponent className="w-5 h-5" />;
  };

  const getExpiryStatus = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 30) {
      return { status: 'warning', text: `Expires in ${daysUntilExpiry} days`, color: 'text-yellow-600' };
    } else if (daysUntilExpiry <= 0) {
      return { status: 'expired', text: 'Expired', color: 'text-red-600' };
    }
    return { status: 'valid', text: `Valid for ${daysUntilExpiry} days`, color: 'text-green-600' };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Consent Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Shield className="w-6 h-6" />
            Data Consent & Privacy
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your data sharing preferences and privacy settings. Your consent helps us provide better safety services.
          </p>
        </CardHeader>
      </Card>

      {/* Consent Items */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {consents.map((consent, index) => {
            const consentType = consentTypes.find(c => c.type === consent.type);
            const expiryStatus = getExpiryStatus(consent.expiresAt);
            
            return (
              <motion.div
                key={consent.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`transition-all duration-200 ${consent.granted ? 'border-green-200 bg-green-50/30 dark:bg-green-950/30' : 'border-muted'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${consent.granted ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                          {getConsentIcon(consent.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{consentType?.title}</h3>
                            {consentType?.required && (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            )}
                            {consent.granted ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {consent.purpose}
                          </p>

                          {/* Details */}
                          {consentType?.details && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-muted-foreground mb-2">This includes:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {consentType.details.map((detail, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Metadata */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Updated: {new Date(consent.timestamp).toLocaleDateString()}
                            </div>
                            <div className={`flex items-center gap-1 ${expiryStatus.color}`}>
                              <Calendar className="w-3 h-3" />
                              {expiryStatus.text}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`consent-${consent.type}`}
                          checked={consent.granted}
                          onCheckedChange={(checked) => updateConsent(consent.type, checked)}
                          disabled={isSaving || (consentType?.required && consent.granted)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Your Privacy Rights
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                <p>• You can withdraw consent at any time for non-essential features</p>
                <p>• Essential safety features require certain consents to function</p>
                <p>• All data is encrypted and stored securely</p>
                <p>• Data is only shared with authorized emergency responders when needed</p>
                <p>• You can request data deletion by contacting support</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Links */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Button variant="link" className="text-muted-foreground p-0 h-auto">
              Privacy Policy
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="link" className="text-muted-foreground p-0 h-auto">
              Terms of Service
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="link" className="text-muted-foreground p-0 h-auto">
              Data Protection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};