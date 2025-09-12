import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from './api';

// Debug log helpers: persist recent login responses to localStorage so logs
// remain visible in the browser console even after navigation. Each log
// entry expires after a short TTL and is removed via setTimeout.
const DEBUG_LOG_KEY = 'auth-debug-logs';
const DEBUG_LOG_TTL_MS = 30_000; // 30 seconds default

function readDebugLogs(): Array<{ ts: number; msg: string; data?: any; expiresAt: number }> {
  try {
    const raw = localStorage.getItem(DEBUG_LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeDebugLogs(logs: Array<{ ts: number; msg: string; data?: any; expiresAt: number }>) {
  try {
    localStorage.setItem(DEBUG_LOG_KEY, JSON.stringify(logs));
  } catch (e) {
    // ignore quota errors during debugging
  }
}

function addDebugLog(msg: string, data?: any, ttl = DEBUG_LOG_TTL_MS) {
  const logs = readDebugLogs();
  const now = Date.now();
  const entry = { ts: now, msg, data, expiresAt: now + ttl };
  const next = [entry, ...logs].slice(0, 20); // keep last 20
  writeDebugLogs(next);

  // Schedule removal after ttl so log list self-cleans even across route changes
  setTimeout(() => {
    try {
      const current = readDebugLogs().filter(l => l.expiresAt > Date.now());
      writeDebugLogs(current);
    } catch (e) {}
  }, ttl + 50);
}

// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: 'tourist' | 'authority' | 'admin';
  isKYCVerified: boolean;
  safetyScore: number;
  currentTrip?: {
    id: string;
    destination: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'completed';
  };
}

export interface Location {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
}

export interface Alert {
  id: string;
  type: 'panic' | 'geo_fence' | 'safety' | 'advisory';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location?: Location;
  timestamp: number;
  isRead: boolean;
  metadata?: Record<string, any>;
}

// Store interfaces
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;
}

interface LocationState {
  currentLocation: Location | null;
  locationHistory: Location[];
  isTracking: boolean;
  trackingConsent: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  setTrackingConsent: (consent: boolean) => void;
  addLocation: (location: Location) => void;
}

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
  clearAlerts: () => void;
}

interface AppState {
  language: string;
  isOnline: boolean;
  theme: 'light' | 'dark';
  emergencyContacts: Array<{
    id: string;
    name: string;
    phone: string;
    relationship: string;
    isPrimary: boolean;
    email?: string;
    address?: string;
  }>;
  setLanguage: (language: string) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addEmergencyContact: (contact: any) => void;
  updateEmergencyContact: (id: string, contact: any) => void;
  removeEmergencyContact: (id: string) => void;
}

// Create stores
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await authAPI.login(email, password);
          // Debug: persist the full response (sanitized) so we can inspect it
          try {
            // Console log for immediate dev visibility
            // eslint-disable-next-line no-console
            console.log('auth.login response:', res);
          } catch (e) {}
          // Persist a sanitized copy with TTL so it survives route changes
          try { addDebugLog('auth.login response', { status: (res && (res.status || 'unknown')), body: (res && (res.data || res.user || res)) }); } catch (e) {}
          // Support multiple token field names returned by backend
          const user = res.user ?? res.data?.user ?? null;
          const token = res.token ?? res.accessToken ?? res.access_token ?? res.data?.token ?? res.data?.accessToken ?? res.data?.access_token ?? null;

          // Persist token for api interceptor
          if (token) {
            try { localStorage.setItem('auth-token', token); } catch {}
          }

          set({ user, token, isAuthenticated: !!token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // logout will be defined later to clear storage as well

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      setToken: (token: string) => {
        if (token) {
          try { localStorage.setItem('auth-token', token); } catch {}
        } else {
          try { localStorage.removeItem('auth-token'); } catch {}
        }
        set({ token, isAuthenticated: !!token });
      },

      adminLogin: (user: User, token: string) => {
        if (token) {
          try { localStorage.setItem('auth-token', token); } catch {}
        }
        set({ user, token, isAuthenticated: !!token });
      },

      logout: () => {
        // override to ensure token is cleared from localStorage as well
        try { localStorage.removeItem('auth-token'); } catch {}
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      locationHistory: [],
      isTracking: false,
      trackingConsent: false,

      startTracking: () => {
        if (navigator.geolocation) {
          set({ isTracking: true });
          
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const location: Location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                timestamp: Date.now(),
                accuracy: position.coords.accuracy
              };
              
              get().addLocation(location);
            },
            (error) => {
              console.error('Geolocation error:', error);
              set({ isTracking: false });
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            }
          );
          
          // Store watchId for cleanup (in real app)
        }
      },

      stopTracking: () => {
        set({ isTracking: false });
        // Clear watch in real implementation
      },

      setTrackingConsent: (consent: boolean) => {
        set({ trackingConsent: consent });
        if (!consent) {
          get().stopTracking();
        }
      },

      addLocation: (location: Location) => {
        set((state) => ({
          currentLocation: location,
          locationHistory: [...state.locationHistory.slice(-99), location] // Keep last 100
        }));
      },
    }),
    {
      name: 'location-storage',
    }
  )
);

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: [],
      unreadCount: 0,

      addAlert: (alertData) => {
        const alert: Alert = {
          ...alertData,
          id: 'alert-' + Date.now(),
          timestamp: Date.now(),
          isRead: false,
        };

        set((state) => ({
          alerts: [alert, ...state.alerts],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (alertId: string) => {
        set((state) => {
          const updatedAlerts = state.alerts.map(alert =>
            alert.id === alertId ? { ...alert, isRead: true } : alert
          );
          const unreadCount = updatedAlerts.filter(alert => !alert.isRead).length;
          
          return { alerts: updatedAlerts, unreadCount };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          alerts: state.alerts.map(alert => ({ ...alert, isRead: true })),
          unreadCount: 0,
        }));
      },

      clearAlerts: () => {
        set({ alerts: [], unreadCount: 0 });
      },
    }),
    {
      name: 'alert-storage',
    }
  )
);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en',
      isOnline: true,
      theme: 'light',
      emergencyContacts: [],

      setLanguage: (language: string) => {
        set({ language });
      },

      setOnlineStatus: (isOnline: boolean) => {
        set({ isOnline });
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
      },

      addEmergencyContact: (contact) => {
        const newContact = {
          ...contact,
          id: 'contact-' + Date.now(),
        };
        set((state) => ({
          emergencyContacts: [...state.emergencyContacts, newContact],
        }));
      },

      updateEmergencyContact: (id: string, contactData) => {
        set((state) => ({
          emergencyContacts: state.emergencyContacts.map(contact =>
            contact.id === id ? { ...contact, ...contactData } : contact
          ),
        }));
      },

      removeEmergencyContact: (id: string) => {
        set((state) => ({
          emergencyContacts: state.emergencyContacts.filter(contact => contact.id !== id),
        }));
      },
    }),
    {
      name: 'app-storage',
    }
  )
);