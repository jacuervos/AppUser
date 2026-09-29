import { create } from 'zustand';
import { orderApiService } from '../services/orderApiService';
import { OrderHistoryItem, OrderPayload, OrderTypeWastePayload } from '../types/order.types';

interface OrderStore {
  loading: boolean;
  rescheduling: boolean;
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
  rescheduleOrder: (orderId: number, date: string) => Promise<boolean>;
  getInfoOrderMap: (item:  OrderHistoryItem) => void;
}

const useOrderStore = create<OrderStore>((set, get) => ({
  loading: false,
  rescheduling: false,
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

  rescheduleOrder: async (orderId, date) => {
    const formattedDate = date.includes(' ') ? date : `${date} 00:00:00`;
    set({rescheduling: true, error: null});
    try {
      await orderApiService.rescheduleOrder(orderId, formattedDate);
      set(state => ({
        rescheduling: false,
        orderActive: state.orderActive.map(order =>
          order.id === orderId ? {...order, date: formattedDate} : order,
        ),
        myOrders: state.myOrders.map(order =>
          order.id === orderId ? {...order, date: formattedDate} : order,
        ),
      }));
      return true;
    } catch (error: any) {
      set({
        rescheduling: false,
        error: error?.message || 'Error al reprogramar la orden',
      });
      return false;
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

