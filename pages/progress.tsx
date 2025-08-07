import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import StatCard from '../components/StatCard';


export default function Progress() {
  const [stats, setStats] = useState({
    averageWaterIntake: 0,
    mostCommonMood: '',
    averageCalories: 0,
    averageProtein: 0,
    averageCarbs: 0,
    averageFat: 0,
    mostCommonMealType: ''
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('mood, water_intake, nutrition_log')
          .eq('user_id', user.id)
          .single();

        if (error) console.error('Error fetching user settings:', error);
        else if (data) {
          const waterIntake = data.water_intake.filter((intake: boolean) => intake).length;
          const mostCommonMood = data.mood || 'N/A';
          
          const totalMeals = data.nutrition_log.length;
          const totalCalories = data.nutrition_log.reduce((acc: number, meal: { calories: number }) => acc + meal.calories, 0);
          const totalMacros = data.nutrition_log.reduce((acc: { protein: number, fat: number, carbs: number }, meal: { macros: { protein: number, fat: number, carbs: number } }) => {
            acc.protein += meal.macros.protein;
            acc.fat += meal.macros.fat;
            acc.carbs += meal.macros.carbs;
            return acc;
          }, { protein: 0, fat: 0, carbs: 0 });

          const mealTypeCounts = data.nutrition_log.reduce((acc: Record<string, number>, meal: { type: string }) => {
            acc[meal.type] = (acc[meal.type] || 0) + 1;
            return acc;
          }, {});
          const mostCommonMealType = Object.keys(mealTypeCounts).reduce((a, b) => mealTypeCounts[a] > mealTypeCounts[b] ? a : b);

          setStats({
            averageWaterIntake: waterIntake / 8,
            mostCommonMood,
            averageCalories: totalCalories / totalMeals,
            averageProtein: totalMacros.protein / totalMeals,
            averageCarbs: totalMacros.carbs / totalMeals,
            averageFat: totalMacros.fat / totalMeals,
            mostCommonMealType
          });
        }
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard title="Average Water Intake" value={`${stats.averageWaterIntake} cups/day`} />
      <StatCard title="Most Common Mood" value={stats.mostCommonMood} />
      <StatCard title="Average Calories" value={`${stats.averageCalories} kcal`} />
      <StatCard title="Average Protein" value={`${stats.averageProtein} g`} />
      <StatCard title="Average Carbs" value={`${stats.averageCarbs} g`} />
      <StatCard title="Average Fat" value={`${stats.averageFat} g`} />
      <StatCard title="Most Common Meal Type" value={stats.mostCommonMealType} />
    </main>
  );
}