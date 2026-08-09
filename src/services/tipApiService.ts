import AsyncStorage from '@react-native-async-storage/async-storage';
import {InterfaceTip, InterfaceTipResponse} from "../types/tip.types.ts";

const TIP_API_URL = 'https://ms-tip-cybgcee7gbh5cfgu.canadacentral-01.azurewebsites.net/api';

const tipApiService = {
  getTips: async (): Promise<InterfaceTip[]> => {
    const token = await AsyncStorage.getItem('access_token');
    const response = await fetch(`${TIP_API_URL}/tips_app`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al obtener tips');
    const resp: InterfaceTipResponse = await  response.json();
    return resp.data
  },
};

export { tipApiService };
