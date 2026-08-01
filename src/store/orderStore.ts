import { create } from 'zustand';
import { orderApiService } from '../services/orderApiService';
import { OrderHistoryItem, OrderPayload, OrderTypeWastePayload } from '../types/order.types';

interface OrderStore {
  loading: boolean;
  error: string | null;
  myOrders: OrderHistoryItem[];
  orderActive: OrderHistoryItem[] | [];
  orderViewMap: OrderHistoryItem | null;
  submitOrder: (
    orderPayload: OrderPayload,
    items: Omit<OrderTypeWastePayload, 'order_id'>[]
  ) => Promise<boolean>;
  fetchMyOrders: () => Promise<void>;
  fetchMyOrderActive: () => Promise<void>;
  getInfoOrderMap: (item:  OrderHistoryItem) => void;
}

const useOrderStore = create<OrderStore>(set => ({
  loading: false,
  error: null,
  myOrders: [],
  orderActive: [],
  orderViewMap: null,

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

  fetchMyOrderActive: async () => {
    set({  error: null });
    try {
      const orders = await orderApiService.getMyOrderActive();
      set({  orderActive: orders });
    } catch (error: any) {
      set({
        error: error?.message || 'Error al obtener la órden',
      });
    }
  },

  getInfoOrderMap: (item: OrderHistoryItem)=> {
  set({  orderViewMap: item });
  },

}));

export default useOrderStore;

