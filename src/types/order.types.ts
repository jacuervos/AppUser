export interface OrderPayload {
  latitude: number;
  longitude: number;
  date: string;
}

export interface OrderResponse {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  date: string;
  state_id: number;
}

export interface OrderTypeWastePayload {
  order_id: number;
  type_waste_id: number;
  weight: number;
  points: number;
}

export interface OrderTypeWaste {
  id: number;
  order_id: number;
  type_waste_id: number;
  type_waste: string | null;
  type_waste_name: string;
  weight: number;
  points: number;
  name?: string;
}

export interface OrderState {
  id: number;
  name: string;
  color: string;
}

export interface OrderHistoryItem {
  id: number;
  latitude: number;
  longitude: number;
  date: string;
  user: Record<string, any> | null;
  collector: Record<string, any> | null;
  type_waste: OrderTypeWaste[];
  state: OrderState;
  status: string;
  items: OrderTypeWaste[];
  pickup_location: {
    latitude: string,
    longitude: string,
  };
  address: string;
}
