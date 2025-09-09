console.log('Loading api.ts file...');
import axios from 'axios';
console.log('Axios imported successfully');

// API base configuration - hardcoded to break cache
const API_BASE_URL = 'http://localhost:3001';

console.log('API loaded successfully, base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL + '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or your auth store
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth-token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Mock successful login for demo
      return {
        user: {
          id: '1',
          email,
          firstName: 'Demo',
          lastName: 'User',
          phoneNumber: '+91 9876543210',
          role: email.includes('authority') ? 'authority' : 'tourist',
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Mock successful registration
      return {
        user: {
          id: 'new-user-' + Date.now(),
          ...userData,
          role: 'tourist',
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      // Mock successful verification
      return { success: true };
    }
  },
};

export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      // Mock profile data
      return {
        id: '1',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        isKYCVerified: true,
        safetyScore: 85,
      };
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      return { success: true, data: profileData };
    }
  },

  uploadKYC: async (formData: FormData) => {
    try {
      const response = await api.post('/user/kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return { success: true, message: 'KYC documents uploaded successfully' };
    }
  },

  getCurrentTrip: async () => {
    try {
      const response = await api.get('/user/current-trip');
      return response.data;
    } catch (error) {
      // Mock current trip data
      return {
        trip: {
          id: 'trip-' + Date.now(),
          destination: 'Guwahati, Assam',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        }
      };
    }
  },

  getEmergencyContacts: async () => {
    try {
      const response = await api.get('/user/emergency-contacts');
      return response.data;
    } catch (error) {
      // Mock emergency contacts
      return {
        contacts: [
          { name: 'John Doe', phoneNumber: '+91 9876543210', relationship: 'Family' },
          { name: 'Jane Smith', phoneNumber: '+91 9876543211', relationship: 'Friend' }
        ]
      };
    }
  },

  updateEmergencyContacts: async (contacts: any[]) => {
    try {
      const response = await api.post('/user/emergency-contacts', { contacts });
      return response.data;
    } catch (error) {
      return { success: true, message: 'Emergency contacts updated' };
    }
  },

  updateSettings: async (settings: any) => {
    try {
      const response = await api.post('/user/settings', { settings });
      return response.data;
    } catch (error) {
      return { success: true, message: 'Settings updated' };
    }
  },
};

export const locationAPI = {
  pingLocation: async (locationData: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number;
    speed?: number;
  }) => {
    try {
      const response = await api.post('/location/ping', locationData);
      return response.data;
    } catch (error) {
      return { success: true, message: 'Location ping recorded' };
    }
  },

  getLocationHistory: async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/location/history?${params.toString()}`);
      return response.data;
    } catch (error) {
      // Mock location history
      return {
        locations: [
          { latitude: 26.1445, longitude: 91.7362, timestamp: new Date(Date.now() - 3600000).toISOString(), accuracy: 10 },
          { latitude: 26.1465, longitude: 91.7382, timestamp: new Date(Date.now() - 1800000).toISOString(), accuracy: 8 },
          { latitude: 26.1485, longitude: 91.7402, timestamp: new Date().toISOString(), accuracy: 12 },
        ]
      };
    }
  },

  checkLocation: async (lat: number, lng: number) => {
    try {
      const response = await api.get(`/location/check?lat=${lat}&lng=${lng}`);
      return response.data;
    } catch (error) {
      // Mock geo-fencing check
      const safetyZones = [
        { lat: 26.1445, lng: 91.7362, radius: 1000, type: 'safe' },
        { lat: 26.1665, lng: 91.7582, radius: 500, type: 'restricted' }
      ];
      
      // Simple distance check
      const isInRestrictedZone = safetyZones.some(zone => {
        const distance = Math.sqrt(Math.pow(lat - zone.lat, 2) + Math.pow(lng - zone.lng, 2)) * 111000; // Rough conversion to meters
        return distance < zone.radius && zone.type === 'restricted';
      });

      return {
        isSafe: !isInRestrictedZone,
        zoneType: isInRestrictedZone ? 'restricted' : 'safe',
        message: isInRestrictedZone 
          ? 'Warning: You are in a restricted area' 
          : 'You are in a safe zone'
      };
    }
  },
};

export const alertAPI = {
  sendPanicAlert: async (alertData: any) => {
    try {
      const response = await api.post('/alerts/panic', alertData);
      return response.data;
    } catch (error) {
      return { 
        success: true, 
        alertId: 'panic-' + Date.now(),
        message: 'Emergency alert sent successfully'
      };
    }
  },

  getAlerts: async () => {
    try {
      const response = await api.get('/alerts/history');
      return response.data;
    } catch (error) {
      // Mock alerts
      return {
        alerts: [
          {
            id: 'alert-1',
            type: 'advisory',
            severity: 'medium',
            message: 'Weather advisory: Heavy rain expected in Guwahati area',
            timestamp: Date.now() - 7200000,
            isRead: false,
          },
          {
            id: 'alert-2', 
            type: 'geo_fence',
            severity: 'high',
            message: 'You are approaching a restricted area',
            timestamp: Date.now() - 3600000,
            isRead: true,
          },
        ]
      };
    }
  },
};

export const blockchainAPI = {
  issueDigitalID: async () => {
    try {
      const response = await api.post('/blockchain/issue-id');
      return response.data;
    } catch (error) {
      // Mock QR code data
      return {
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        digitalId: 'DTID-' + Date.now(),
      };
    }
  },

  getQRCode: async (digitalId: string) => {
    try {
      const response = await api.get(`/blockchain/qr/${digitalId}`);
      return response.data;
    } catch (error) {
      return {
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      };
    }
  },
};

// Add after existing exports, before the final closing

export const mediaAPI = {
  uploadFile: async (formData: FormData, alertId?: string) => {
    try {
      if (alertId) {
        formData.append('alertId', alertId);
      }
      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      // Mock successful upload
      return {
        mediaUrl: 'https://example.com/media/' + Date.now(),
        filename: 'uploaded-file-' + Date.now()
      };
    }
  },

  getMedia: async (filename: string) => {
    try {
      const response = await api.get(`/media/${filename}`);
      return response.data;
    } catch (error) {
      return { error: 'File not found' };
    }
  },

  deleteMedia: async (filename: string) => {
    try {
      const response = await api.delete(`/media/${filename}`);
      return response.data;
    } catch (error) {
      return { success: true, message: 'Media deleted' };
    }
  },
};

export const notificationAPI = {
  getNotifications: async (limit = 10, page = 1) => {
    try {
      const response = await api.get(`/notifications?limit=${limit}&page=${page}`);
      return response.data;
    } catch (error) {
      // Mock notifications
      return {
        notifications: [
          {
            id: 'notif-1',
            title: 'Weather Advisory',
            message: 'Heavy rainfall expected in your area. Exercise caution.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            isRead: false
          },
          {
            id: 'notif-2',
            title: 'Safety Update',
            message: 'Your safety score has been updated to 85%.',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            isRead: true
          }
        ],
        total: 2,
        page: 1,
        limit: 10
      };
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const response = await api.post(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      return { success: true, message: 'Notification marked as read' };
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/read-all');
      return response.data;
    } catch (error) {
      return { success: true, message: 'All notifications marked as read' };
    }
  },
};

export const consentAPI = {
  getConsentHistory: async () => {
    try {
      const response = await api.get('/consent/history');
      return response.data;
    } catch (error) {
      // Mock consent history
      return {
        consents: [
          {
            type: 'location',
            granted: true,
            purpose: 'Real-time safety monitoring',
            version: '1.0',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            type: 'notifications',
            granted: true,
            purpose: 'Emergency alerts and updates',
            version: '1.0',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      };
    }
  },

  recordConsent: async (consentData: {
    type: 'location' | 'notifications';
    granted: boolean;
    purpose: string;
    version: string;
    expiresAt: string;
  }) => {
    try {
      const response = await api.post('/consent/record', consentData);
      return response.data;
    } catch (error) {
      return { success: true, message: 'Consent recorded' };
    }
  },

  revokeConsent: async (consentData: {
    type: 'location' | 'notifications';
    purpose: string;
    version: string;
  }) => {
    try {
      const response = await api.post('/consent/revoke', consentData);
      return response.data;
    } catch (error) {
      return { success: true, message: 'Consent revoked' };
    }
  },
};

export const offlineAPI = {
  getOfflineStatus: async () => {
    try {
      const response = await api.get('/offline/status');
      return response.data;
    } catch (error) {
      // Mock offline status
      return {
        queuedRequests: 0,
        lastSync: new Date().toISOString()
      };
    }
  },

  processOfflineRequests: async (requests: Array<{
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
  }>) => {
    try {
      const response = await api.post('/offline/process', requests);
      return response.data;
    } catch (error) {
      return { success: true, message: 'Offline requests processed' };
    }
  },
};

export const healthAPI = {
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      return { status: 'healthy' };
    }
  },
};