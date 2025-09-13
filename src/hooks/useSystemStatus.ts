import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

export interface SystemStatus {
  isOnline: boolean;
  batteryLevel: number | null; // 0-100
  charging: boolean | null;
  hasCamera: boolean;
  hasMicrophone: boolean;
  geolocationPermission: PermissionState | 'unknown';
  cameraPermission: PermissionState | 'unknown';
  microphonePermission: PermissionState | 'unknown';
  effectiveType?: string | null;
}

export function useSystemStatus() {
  const setOnline = useAppStore((s) => s.setOnlineStatus);
  const [status, setStatus] = useState<SystemStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    batteryLevel: null,
    charging: null,
    hasCamera: false,
    hasMicrophone: false,
    geolocationPermission: 'unknown',
    cameraPermission: 'unknown',
    microphonePermission: 'unknown',
    effectiveType: (navigator as any)?.connection?.effectiveType ?? null,
  });

  useEffect(() => {
    // Online/offline handlers
    const handleOnline = () => { setOnline(true); setStatus(s => ({ ...s, isOnline: true })); };
    const handleOffline = () => { setOnline(false); setStatus(s => ({ ...s, isOnline: false })); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Battery
    let batteryManager: any = null;
    if ((navigator as any).getBattery) {
      (navigator as any).getBattery().then((bm: any) => {
        batteryManager = bm;
        const updateBattery = () => setStatus(s => ({ ...s, batteryLevel: Math.round(bm.level * 100), charging: !!bm.charging }));
        updateBattery();
        bm.addEventListener('levelchange', updateBattery);
        bm.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    }

    // Devices (camera/mic)
    const updateDevices = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCamera = devices.some(d => d.kind === 'videoinput');
          const hasMicrophone = devices.some(d => d.kind === 'audioinput');
          setStatus(s => ({ ...s, hasCamera, hasMicrophone }));
        }
      } catch (e) {}
    };
    updateDevices();

    // Permissions (best-effort)
    const tryPermission = async (name: string) => {
      try {
        // TS: PermissionName is not exhaustive for 'camera' in some engines, so use any
        const p = await (navigator as any).permissions.query({ name });
        return p.state as PermissionState;
      } catch (e) {
        return 'unknown' as PermissionState | 'unknown';
      }
    };

    (async () => {
      const geo = await tryPermission('geolocation');
      const cam = await tryPermission('camera');
      const mic = await tryPermission('microphone');
      setStatus(s => ({ ...s, geolocationPermission: geo, cameraPermission: cam, microphonePermission: mic }));
    })();

    // Listen for changes on network effectiveType (if available)
    const conn = (navigator as any).connection;
    const handleConn = () => setStatus(s => ({ ...s, effectiveType: conn?.effectiveType ?? null }));
    if (conn && conn.addEventListener) conn.addEventListener('change', handleConn);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (batteryManager) {
        try { batteryManager.removeEventListener('levelchange', () => {}); } catch {}
        try { batteryManager.removeEventListener('chargingchange', () => {}); } catch {}
      }
      if (conn && conn.removeEventListener) conn.removeEventListener('change', handleConn);
    };
  }, [setOnline]);

  return status;
}
