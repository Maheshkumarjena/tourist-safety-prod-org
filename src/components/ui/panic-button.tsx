'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useLocationStore, useAlertStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { alertAPI } from '@/lib/api';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Camera, 
  Mic, 
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PanicButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PanicButton({ className, size = 'lg' }: PanicButtonProps) {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isAlertSent, setIsAlertSent] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout>();
  const longPressRef = useRef<NodeJS.Timeout>();

  const { user } = useAuthStore();
  const { currentLocation } = useLocationStore();
  const { addAlert } = useAlertStore();
  const { t } = useTranslation();

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
      if (longPressRef.current) clearTimeout(longPressRef.current);
    };
  }, []);

  const startCountdown = () => {
    setIsActivated(true);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sendEmergencyAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    countdownRef.current = timer;
  };

  const cancelCountdown = () => {
    setIsActivated(false);
    setCountdown(0);
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
    }
  };

  const sendEmergencyAlert = async () => {
    setIsAlertSent(true);
    setIsActivated(false);

    // Ensure we have a location; backend requires coordinates
    if (!currentLocation || typeof currentLocation.lat !== 'number' || typeof currentLocation.lng !== 'number') {
      // Inform user that location is unavailable
      addAlert({
        type: 'panic',
        severity: 'critical',
        message: 'Unable to send SOS: current location unavailable',
        location: currentLocation || undefined,
        isRead: false,
      });
      setIsAlertSent(false);
      return;
    }

    // Prepare minimal payload expected by backend validation: coordinates object with exact keys
    const alertData = {
      coordinates: { latitude: currentLocation.lat, longitude: currentLocation.lng }
    } as const;

    try {
      // Send to backend
  const res = await alertAPI.sendPanicAlert(alertData);
  const returnedAlert = res?.alert || res?.data || res;
      // If backend returned an id, include it in local display
      const backendAlertId = returnedAlert?.id || returnedAlert?.alertId || null;
      
      // Add to local store (include backend id when available)
      addAlert({
        type: 'panic',
        severity: 'critical',
        message: backendAlertId ? `Emergency alert sent (id: ${backendAlertId})` : 'Emergency alert sent successfully',
        location: currentLocation,
        isRead: false,
      });

      // Vibrate device if supported
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }

      // Play alert sound (if available)
      playAlertSound();

      // Reset after 5 seconds
      setTimeout(() => {
        setIsAlertSent(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      // If offline or server error, queue the request in localStorage for later sync
      try {
        const queuedRaw = localStorage.getItem('queued-requests');
        const queued = queuedRaw ? JSON.parse(queuedRaw) : [];
        queued.unshift({
          id: 'queued-' + Date.now(),
          endpoint: '/alerts/panic',
          method: 'POST',
          data: alertData,
          timestamp: Date.now(),
          retries: 0,
          status: 'pending'
        });
        localStorage.setItem('queued-requests', JSON.stringify(queued.slice(0, 200)));
      } catch (e) {
        // ignore storage errors
      }

      // Also add a local alert to inform the user that the SOS was queued
      addAlert({
        type: 'panic',
        severity: 'critical',
        message: 'Emergency alert queued (no network). It will be sent when online.',
        location: currentLocation,
        isRead: false,
      });
    }
  };

  const playAlertSound = () => {
    // Create audio context for alert sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const handleLongPressStart = () => {
    longPressRef.current = setTimeout(() => {
      startCountdown();
    }, 1000); // 1 second long press
  };

  const handleLongPressEnd = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
    }
  };

  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-24 h-24 text-base', 
    lg: 'w-32 h-32 text-lg',
  };

  if (isAlertSent) {
    return (
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-success-foreground" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-success">
            {t('panic.alertSent')}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t('panic.helpOnWay')}
          </p>
        </div>
        
        {/* Emergency Info */}
        <Card className="text-left">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Alert ID:</span>
              <Badge variant="outline">EMRG-{Date.now().toString().slice(-6)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Time:</span>
              <span className="text-sm">{new Date().toLocaleTimeString()}</span>
            </div>
            {currentLocation && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm">
                  {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-4 pt-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Call Help
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                Contacts
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className={cn("text-center space-y-4", className)}>
      {/* Main Panic Button */}
      <div className="relative">
        <motion.button
          className={cn(
            "btn-emergency rounded-full font-bold tracking-wide",
            "flex flex-col items-center justify-center space-y-1",
            "relative overflow-hidden",
            isActivated ? "animate-pulse-emergency" : "hover:scale-105",
            sizeClasses[size]
          )}
          onMouseDown={handleLongPressStart}
          onMouseUp={handleLongPressEnd}
          onMouseLeave={handleLongPressEnd}
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
          onClick={isActivated ? cancelCountdown : undefined}
          disabled={isAlertSent}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <AlertTriangle className="w-8 h-8" />
          <span className="font-bold">
            {isActivated ? 'CANCEL' : 'SOS'}
          </span>
          
          {/* Countdown Overlay */}
          <AnimatePresence>
            {isActivated && countdown > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute inset-0 bg-emergency-dark/90 rounded-full flex flex-col items-center justify-center"
              >
                <Clock className="w-6 h-6 text-emergency-foreground mb-1" />
                <span className="text-2xl font-bold text-emergency-foreground">
                  {countdown}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Instruction text */}
        <p className="text-xs text-muted-foreground mt-2">
          {isActivated 
            ? `${t('panic.countdown')} ${countdown}s` 
            : 'Hold for 1 second to activate'
          }
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
          onClick={() => setIsRecording(!isRecording)}
        >
          <Mic className={cn(
            "w-4 h-4",
            isRecording && "text-emergency animate-pulse"
          )} />
          <span className="text-xs">Voice</span>
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Camera className="w-4 h-4" />
          <span className="text-xs">Photo</span>
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span className="text-xs">Location</span>
        </Button>
      </div>

      {/* Emergency Contacts */}
      <Card className="text-left">
        <CardContent className="p-3">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Quick Dial
          </h4>
          <div className="space-y-1">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              🚔 Police: 100
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              🚑 Medical: 108
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              👤 Emergency Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}