import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ProgressChartsProps {
  waterIntakeData: number[]; // array of 0/1 you pass in
  mealTypeCounts: Record<string, number>;
  caloriesOverTime: { date: string; calories: number }[];
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({
  waterIntakeData,
  mealTypeCounts,
  caloriesOverTime
}) => {
  // ---- WATER: collapse to a single "Today" bar (sum of entries) ----
  const cupsToday = (Array.isArray(waterIntakeData) ? waterIntakeData : [])
    .reduce((s, v) => s + (Number(v) || 0), 0);
  const waterIntakeLabels = cupsToday > 0 ? ['Today'] : [];
  const waterIntakeValues = cupsToday > 0 ? [cupsToday] : [];
  // ---------------------------------------------------------------

  const mealTypeLabels = Object.keys(mealTypeCounts);
  const mealTypeValues = Object.values(mealTypeCounts);

  const caloriesLabels = caloriesOverTime.map(entry => entry.date);
  const caloriesValues = caloriesOverTime.map(entry => entry.calories);

  const hasWater = waterIntakeValues.length > 0;
  const hasTypes = mealTypeValues.some(n => Number(n) > 0);
  const hasCalories = caloriesValues.some(n => Number(n) > 0);

  // hide all charts when nothing real to show
  if (!(hasWater || hasTypes || hasCalories)) {
    return (
      <div className="h-full rounded-xl border border-dashed border-gray-300 grid place-items-center text-sm text-gray-500">
        No data yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {hasWater && (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-sm mt-6">
          <Bar
            data={{
              labels: waterIntakeLabels, // ["Today"]
              datasets: [{
                label: 'Cups Today',
                data: waterIntakeValues,  // [cupsToday]
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                maxBarThickness: 64,      // ✅ valid on dataset
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: { display: true, text: 'Water Intake' },
                legend: { display: false },
              },
              scales: {
                x: {
                  ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 },
                  grid: { display: false },
                },
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1, precision: 0 },
                  suggestedMax: Math.max(1, Math.ceil(cupsToday + 1)),
                },
              },
            }}
          />
        </div>
      )}

      {hasTypes && (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-sm mt-6">
          <Pie
            data={{
              labels: mealTypeLabels,
              datasets: [{
                data: mealTypeValues,
                backgroundColor: [
                  'rgba(255, 159, 64, 0.5)',
                  'rgba(54, 162, 235, 0.5)',
                  'rgba(255, 206, 86, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                ],
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: { display: true, text: 'Meal Type Distribution' },
              },
            }}
          />
        </div>
      )}

      {hasCalories && (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-sm mt-6">
          <Line
            data={{
              labels: caloriesLabels,
              datasets: [{
                label: 'Calories',
                data: caloriesValues,
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: { display: true, text: 'Calories Over Time' },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProgressCharts;
