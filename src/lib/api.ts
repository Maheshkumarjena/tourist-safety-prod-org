console.log('Loading api.ts file...');
import axios from 'axios';
console.log('Axios imported successfully');

// API base configuration - use localhost:3000 as provided
const API_BASE_URL = 'http://localhost:3000';

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
      // Bubble up real errors to the caller so failures can be handled centrally
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin registration (secure)
  adminRegister: async (adminData: any) => {
    try {
      const response = await api.post('/admin/register', adminData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Per spec the app uses POST for updating profile
  updateProfile: async (profileData: any) => {
    try {
      const response = await api.post('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadKYC: async (formData: FormData) => {
    try {
      const response = await api.post('/user/kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentTrip: async () => {
    try {
      const response = await api.get('/user/current-trip');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmergencyContacts: async () => {
    try {
      const response = await api.get('/user/emergency-contacts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateEmergencyContacts: async (contacts: any[]) => {
    try {
      const response = await api.post('/user/emergency-contacts', { contacts });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSettings: async (settings: any) => {
    try {
      const response = await api.post('/user/settings', { settings });
      return response.data;
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  },

  checkLocation: async (lat: number, lng: number) => {
    try {
      const response = await api.get(`/location/check?lat=${lat}&lng=${lng}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const alertAPI = {
  sendPanicAlert: async (alertData: any) => {
    try {
      const response = await api.post('/alerts/panic', alertData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAlerts: async () => {
    try {
      const response = await api.get('/alerts/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const blockchainAPI = {
  issueDigitalID: async () => {
    try {
      const response = await api.post('/blockchain/issue-id');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getQRCode: async (digitalId: string) => {
    try {
      const response = await api.get(`/blockchain/qr/${digitalId}`);
      return response.data;
    } catch (error) {
      throw error;
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
      throw error;
    }
  },

  getMedia: async (filename: string) => {
    try {
      const response = await api.get(`/media/${filename}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMedia: async (filename: string) => {
    try {
      const response = await api.delete(`/media/${filename}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const notificationAPI = {
  getNotifications: async (limit = 10, page = 1) => {
    try {
      const response = await api.get(`/notifications?limit=${limit}&page=${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const response = await api.post(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const consentAPI = {
  getConsentHistory: async () => {
    try {
      const response = await api.get('/consent/history');
      return response.data;
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  },
};

export const offlineAPI = {
  getOfflineStatus: async () => {
    try {
      const response = await api.get('/offline/status');
      return response.data;
    } catch (error) {
      throw error;
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
      throw error;
    }
  },
};

export const healthAPI = {
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};