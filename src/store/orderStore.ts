import { create } from 'zustand';
import { orderApiService } from '../services/orderApiService';
import { OrderHistoryItem, OrderPayload, OrderTypeWastePayload } from '../types/order.types';

interface OrderStore {
  loading: boolean;
  error: string | null;
  myOrders: OrderHistoryItem[];
  submitOrder: (
    orderPayload: OrderPayload,
    items: Omit<OrderTypeWastePayload, 'order_id'>[]
  ) => Promise<boolean>;
  fetchMyOrders: () => Promise<void>;
}

const useOrderStore = create<OrderStore>(set => ({
  loading: false,
  error: null,
  myOrders: [],

  submitOrder: async (orderPayload, items) => {
    set({ loading: true, error: null });
    try {
      await orderApiService.createOrderWithWastes(orderPayload, items as OrderTypeWastePayload[]);
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({
        loading: false,
        error: error?.message || 'Error al guardar la solicitud',
      });
      return false;
    }
  },

  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await orderApiService.getMyOrders();
      set({ loading: false, myOrders: orders });
    } catch (error: any) {
      set({
        loading: false,
        error: error?.message || 'Error al obtener las órdenes',
      });
    }
  },
}));

export default useOrderStore;

