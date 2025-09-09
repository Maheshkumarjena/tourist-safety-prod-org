import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Smartphone, 
  X, 
  CheckCircle,
  Shield,
  Zap,
  Wifi,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install banner after a delay if not dismissed recently
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
      if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
        setTimeout(() => {
          setShowInstallBanner(true);
        }, 3000); // Show after 3 seconds
      }
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    
    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowInstallBanner(false);
      } else {
        console.log('User dismissed the install prompt');
        handleDismiss();
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install prompt failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      return {
        browser: 'Safari',
        steps: [
          'Tap the Share button at the bottom',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to install the app'
        ]
      };
    } else if (userAgent.includes('chrome')) {
      return {
        browser: 'Chrome',
        steps: [
          'Tap the menu (⋮) in the top right',
          'Tap "Add to Home screen"',
          'Tap "Add" to install the app'
        ]
      };
    } else {
      return {
        browser: 'Browser',
        steps: [
          'Look for "Add to Home Screen" option',
          'Follow your browser\'s installation prompts',
          'Add the app to your home screen'
        ]
      };
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  const features = [
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Secure offline access to emergency features'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Launch directly from your home screen'
    },
    {
      icon: Wifi,
      title: 'Works Offline',
      description: 'Core safety features work without internet'
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Receive emergency alerts even when app is closed'
    }
  ];

  return (
    <AnimatePresence>
      {showInstallBanner && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
        >
          <Card className="border-primary/20 bg-card/95 backdrop-blur shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Install Safety App</h3>
                    <Badge variant="secondary" className="text-xs">PWA</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleDismiss}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Install for faster access and enhanced offline safety features
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <feature.icon className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {deferredPrompt ? (
                <Button
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full"
                  size="sm"
                >
                  {isInstalling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Install App
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium">Manual Installation ({getInstallInstructions().browser}):</p>
                  <ol className="text-xs text-muted-foreground space-y-1">
                    {getInstallInstructions().steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Component for showing installation success
export function PWAInstallSuccess() {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleAppInstalled = () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);

  return (
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium text-success text-sm">App Installed Successfully!</p>
                <p className="text-xs text-success/80">You can now access the app from your home screen</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}