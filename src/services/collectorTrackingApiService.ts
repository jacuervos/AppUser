import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://your-api-url/api';

interface CollectorLocation {
  id: number;
  latitude: number;
  longitude: number;
  updated_at: string;
}

interface Collector {
  id: number;
  name: string;
  location: CollectorLocation | null;
}

interface TrackingResponse {
  success: boolean;
  data: {
    order_id: number;
    collector: Collector;
    pickup_location: {
      latitude: number;
      longitude: number;
    };
  };
}

interface ActiveOrdersResponse {
  success: boolean;
  data: Array<{
    id: number;
    collector: Collector | null;
    pickup_location: {
      latitude: number;
      longitude: number;
    };
    status: string;
  }>;
}

class CollectorTrackingApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token'); // Obtener del auth store
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * HU-18: Obtener la ubicación del recolector asignado
   */
  async getMyCollectorLocation(): Promise<TrackingResponse> {
    try {
      const response = await this.api.get<TrackingResponse>('/collector/location');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Obtener todas las órdenes activas con ubicación del recolector
   */
  async getActiveOrders(): Promise<ActiveOrdersResponse> {
    try {
      const response = await this.api.get<ActiveOrdersResponse>('/orders/active');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

export const collectorTrackingApiService = new CollectorTrackingApiService();
