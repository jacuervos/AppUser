import { create } from 'zustand';
import { tipApiService } from "../services/tipApiService.ts";
import {InterfaceTip} from "../types/tip.types.ts";

interface TipStore {
  tips: InterfaceTip[];
  error: string | null;
  getTips: () => Promise<void>;
}

const useTipStore = create<TipStore>(set => ({
  tips: [],
  error: null,
  getTips: async () => {
    try {
      const response = await tipApiService.getTips();
      set({ tips: response, error: null });
    } catch (error: any) {
      set({ tips: [], error: error?.message || 'No se pudieron cargar los tips. Intenta nuevamente más tarde.' });
    }
  },
}));

export default useTipStore;
