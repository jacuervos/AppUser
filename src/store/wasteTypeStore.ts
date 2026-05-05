import { create } from 'zustand';
import { wasteTypeApiService } from '../services/wasteTypeApiService';
import { WasteType } from '../types/wasteType.types';

interface WasteTypeStore {
  wasteTypes: WasteType[];
  error: string | null;
  getWasteTypes: () => Promise<void>;
}

const useWasteTypeStore = create<WasteTypeStore>(set => ({
  wasteTypes: [],
  error: null,
  getWasteTypes: async () => {
    try {
      const response = await wasteTypeApiService.getWasteTypes();
      set({ wasteTypes: response, error: null });
    } catch (error: any) {
      set({ wasteTypes: [], error: error?.message || 'No se pudieron cargar los tipos de residuo. Intenta nuevamente más tarde.' });
    }
  },
}));

export default useWasteTypeStore;
