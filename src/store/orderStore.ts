import { create } from 'zustand';
import { orderApiService } from '../services/orderApiService';
import { OrderPayload, OrderTypeWastePayload } from '../types/order.types';

interface OrderStore {
  loading: boolean;
  error: string | null;
  submitOrder: (
    orderPayload: OrderPayload,
    items: Omit<OrderTypeWastePayload, 'order_id'>[]
  ) => Promise<boolean>;
}

const useOrderStore = create<OrderStore>(set => ({
  loading: false,
  error: null,

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
}));

export default useOrderStore;
