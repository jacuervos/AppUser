import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  OrderHistoryItem,
  OrderPayload,
  OrderResponse,
  OrderTypeWastePayload,
} from '../types/order.types';

const ORDERS_API_URL = 'https://ms-order-ejh2bwafatarb7cx.canadacentral-01.azurewebsites.net/api';

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

const orderApiService = {
  createOrderWithWastes: async (
    order: OrderPayload,
    items: OrderTypeWastePayload[]
  ): Promise<OrderResponse> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${ORDERS_API_URL}/orders/with-wastes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...order, items }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear la orden');
    }
    const data = await response.json();
    return data.data;
  },

  getMyOrders: async (): Promise<OrderHistoryItem[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${ORDERS_API_URL}/orders/my-orders`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener las órdenes');
    }
    const data = await response.json();
    return data.data;
  },

  getMyOrderActive: async (): Promise<OrderHistoryItem[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${ORDERS_API_URL}/orders/active`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener las órdenes');
    }
    const data = await response.json();
    return data.data;
  },
};

export { orderApiService };

