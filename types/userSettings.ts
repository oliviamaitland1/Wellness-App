export interface NutritionLogEntry {
  mealId: string;
  mealName: string;
  calories: number;
  type: string;
  date: string;
  macros: {
    fat: number;
    protein: number;
    carbs: number;
  };
}

export interface UserSettings {
  nutrition_log: NutritionLogEntry[];
}
