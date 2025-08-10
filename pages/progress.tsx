import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import StatCard from '../components/StatCard';
import NutritionTable from '../components/NutritionTable';
import ProgressCharts from '../components/ProgressCharts';
import router from 'next/router';
import withAuth from '../components/ProtectedRoute';

function Progress() {
  const [stats, setStats] = useState({
    averageWaterIntake: 0,
    mostCommonMood: '',
    averageCalories: 0,
    averageProtein: 0,
    averageCarbs: 0,
    averageFat: 0,
    mostCommonMealType: ''
  });

  const [data, setData] = useState({
    water_intake: [],
    mood: '',
    nutrition_log: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error } = await supabase
          .from('user_settings')
          .select('mood, water_intake, nutrition_log')
          .eq('user_id', user.id)
          .single();

        if (error) console.error('Error fetching user settings:', error);
        else if (userData) {
          setData(userData);
          const waterIntake = userData.water_intake.filter((intake: boolean) => intake).length;
          const mostCommonMood = userData.mood || 'N/A';
          
          const totalMeals = userData.nutrition_log.length;
          const totalCalories = userData.nutrition_log.reduce((acc: number, meal: { calories: number }) => acc + meal.calories, 0);
          const totalMacros = userData.nutrition_log.reduce((acc: { protein: number, fat: number, carbs: number }, meal: { macros: { protein: number, fat: number, carbs: number } }) => {
            acc.protein += meal.macros.protein;
            acc.fat += meal.macros.fat;
            acc.carbs += meal.macros.carbs;
            return acc;
          }, { protein: 0, fat: 0, carbs: 0 });

          const mealTypeCounts = userData.nutrition_log.reduce((acc: Record<string, number>, meal: { type: string }) => {
            acc[meal.type] = (acc[meal.type] || 0) + 1;
            return acc;
          }, {});
          const mostCommonMealType = Object.keys(mealTypeCounts).reduce((a, b) => mealTypeCounts[a] > mealTypeCounts[b] ? a : b);

          const waterIntakeLabels = data.water_intake.map((_, i: number) => `Cup ${i + 1}`);

          setStats({
            averageWaterIntake: waterIntake,
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
    <main className="max-w-6xl mx-auto p-6 bg-[var(--bg)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-6">
          <div className="rounded border-[var(--accent)] bg-gradient-to-br from-[var(--accent)] via-[var(--accent)] to-[var(--accent)] text-black p-3 shadow-lg shadow-[var(--accent)]/50 hover:shadow-[var(--accent)]/70 hover:-translate-y-0.5 transition-all duration-300 ease-out p-4 rounded-xl shadow-md">
            <StatCard title="Average Water Intake" value={`${stats.averageWaterIntake} cups/day`} />
            <StatCard title="Most Common Mood" value={stats.mostCommonMood} />
            <StatCard title="Average Calories" value={`${stats.averageCalories} kcal`} />
            <StatCard title="Average Protein" value={`${stats.averageProtein} g`} />
            <StatCard title="Average Carbs" value={`${stats.averageCarbs} g`} />
            <StatCard title="Average Fat" value={`${stats.averageFat} g`} />
            <StatCard title="Most Common Meal Type" value={stats.mostCommonMealType} />
          </div>
  
          <NutritionTable 
            entries={data.nutrition_log.map((item: any) => ({
              date: item.date,
              mealType: item.type,
              calories: Number(item.calories) || 0,
              protein: Number(item.macros.protein) || 0,
              carbs: Number(item.macros.carbs) || 0,
              fat: Number(item.macros.fat) || 0,
            }))}
          />
        </section>
  
        <aside className="space-y-6 lg:sticky lg:top-6 self-start">
          <div className="h-64 md:h-80">
            
            <ProgressCharts
              waterIntakeData={data.water_intake.map((intake: boolean) => (intake ? 1 : 0))}
              mealTypeCounts={data.nutrition_log.reduce((acc: Record<string, number>, meal: { type: string }) => {
                acc[meal.type] = (acc[meal.type] || 0) + 1;
                return acc;
              }, {})}
              caloriesOverTime={data.nutrition_log.map((meal: any) => ({
                date: meal.date,
                calories: Number(meal.calories) || 0
              }))}
            />
          </div>
        </aside>
      </div>
      <div className="bg-[var(--accent)] hover:bg-[var(--accent)] fixed bottom-4 right-4 text-white py-2 px-4 rounded-lg">
      <button onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
      </div>
    </main>
  );
}
export default withAuth(Progress);