export interface OrderPayload {
  latitude: number;
  longitude: number;
  date: string;
  state_id: number;
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
