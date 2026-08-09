import { create } from 'zustand';
import { blogApiService } from "../services/blogApiService";
import {InterfaceBlog} from "../types/blog.types";

interface BlogStore {
  blogs: InterfaceBlog[];
  error: string | null;
  getBlogs: () => Promise<void>;
}

const useBlogStore = create<BlogStore>(set => ({
  blogs: [],
  error: null,
  getBlogs: async () => {
    try {
      const response = await blogApiService.getBlogs();
      set({ blogs: response, error: null });
    } catch (error: any) {
      set({ blogs: [], error: error?.message || 'No se pudieron cargar los blogs. Intenta nuevamente más tarde.' });
    }
  },
}));

export default useBlogStore;
