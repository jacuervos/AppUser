import { create } from 'zustand';
import {levelApiService} from "../services/levelApiService.ts";
import {Level} from "../types/level.types.ts";

interface LevelStore {
  levels: Level[];
  error: string | null;
  getLevels: () => Promise<void>;
}

const useLevelStore = create<LevelStore>(set => ({
  levels: [],
  error: null,
  getLevels: async () => {
    try {
      const response = await levelApiService.levelTypes();
      set({ levels: response, error: null });
    } catch (error: any) {
      set({ levels: [], error: error?.message || 'No se pudieron cargar los tipos de niveles. Intenta nuevamente más tarde.' });
    }
  },
}));

export default useLevelStore;
