export interface Level {
  id: string;
  name: string;
  icon: string;
  min: number;
  max: number;
}

export interface LevelMe {
  user_id: number;
  level_id: number;
}

