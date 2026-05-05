import { WasteType } from '../types/wasteType.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WASTE_API_URL = 'https://ms-waste-grdgd2heasd6dagx.centralus-01.azurewebsites.net/api';

const nameIcons = (name: string) => {
  switch (name){
    case "Plástico":
        return "bottle-water"
    case "Carton":
      return "box"
    case "Papel":
      return "book"
    case "Vidrio":
      return "bottle-droplet"
    default:
      return "trash"
  }
}
const wasteTypeApiService = {
  getWasteTypes: async (): Promise<WasteType[]> => {
    const token = await AsyncStorage.getItem('access_token');
    const response = await fetch(`${WASTE_API_URL}/type-wastes/active`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al obtener tipos de residuo');
    const data = await response.json();
    return data.data.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      icon: nameIcons(item.name),
      points: item.points || 0,
      selected: false,
    }));
  },
};

export { wasteTypeApiService };
