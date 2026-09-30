import AsyncStorage from '@react-native-async-storage/async-storage';
import {Level, LevelMe} from "../types/level.types.ts";

const LEVEL_API_URL = "https://ms-level-edb3d7bpd6gmfsh2.canadacentral-01.azurewebsites.net/api";


const nameIcons = (name: string) => {
  switch (name){
    case "Semilla Verde":
      return "seedling"
    case "Aprendiz del Reciclaje":
      return "leaf"
    case "Guardián del Medio Ambiente":
      return "shield-alt"
    case "Recolector Responsable":
      return "recycle"
    case "Constructor Ecológico":
      return "hammer"
    case "Héroe Verde":
      return "star"
    case "Embajador del Reciclaje":
      return "medal"
    case "Defensor Planetario":
      return "globe-americas"
    case "Maestro Eco-Sabio":
      return "crown"
    case "Leyenda del Reciclaje":
      return "trophy"
    default:
      return "seedling"
  }
}

const levelApiService = {
  levelTypes: async (): Promise<Level[]> => {
    const token = await AsyncStorage.getItem('access_token');
    const response = await fetch(`${LEVEL_API_URL}/all-levels-user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al obtener los niveles');
    const data = await response.json();
    return data.levels.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      icon: nameIcons(item.name),
      min: item.min_point,
      max: item.max_point,
    }));
  },
};

export { levelApiService };
