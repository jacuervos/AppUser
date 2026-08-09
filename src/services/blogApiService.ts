import AsyncStorage from '@react-native-async-storage/async-storage';
import {InterfaceBlog, InterfaceBlogResponse} from "../types/blog.types.ts";

const BLOG_API_URL = 'https://ms-blogs-byhxgdcbdbbsg4aa.canadacentral-01.azurewebsites.net/api';

const blogApiService = {
  getBlogs: async (): Promise<InterfaceBlog[]> => {
    const token = await AsyncStorage.getItem('access_token');
    const response = await fetch(`${BLOG_API_URL}/blogs_app`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al obtener blogs');
    const resp: InterfaceBlogResponse = await  response.json();
    return resp.data
  },
};

export { blogApiService };
