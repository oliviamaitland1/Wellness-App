import React, {useState} from 'react';

interface NutritionEntry {
  date: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionTableProps {
  entries: NutritionEntry[];
}

const NutritionTable: React.FC<NutritionTableProps> = ({entries}) => {
    const [sortConfig, setSortConfig] = useState<{key:keyof NutritionEntry;direction:'ascending' | 'descending'}>({key:'date',direction:'descending'});

  const sortedEntries = [...entries];
if (sortConfig) {
  sortedEntries.sort((a, b) => {
    const {key,direction} = sortConfig;

    if (key === 'date') {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return direction === 'ascending' ? aTime - bTime : bTime - aTime;
    }

    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
      return direction === 'ascending'
        ? (a[key] as number) - (b[key] as number)
        : (b[key] as number) - (a[key] as number);
    }

    const A = String(a[key]).toLowerCase();
    const B = String(b[key]).toLowerCase();
    if (A < B) return direction === 'ascending' ? -1 : 1;
    if (A > B) return direction === 'ascending' ? 1 : -1;
    return 0;
  });
}

  const requestSort = (key:keyof NutritionEntry) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({key,direction});
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-sm">
      {entries.length === 0 ? (
        <div className="text-center">No nutrition entries yet.</div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr>
              {['date', 'mealType', 'calories', 'protein', 'carbs', 'fat'].map((key) => (
                <th
                  key={key}
                  onClick={() => requestSort(key as keyof NutritionEntry)}
                  className="cursor-pointer text-xs uppercase opacity-70"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortConfig?.key === key && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {sortedEntries.map((entry, index) => (
          <tr key={`${entry.date}-${entry.mealType}-${index}`} className="hover:bg-white/5 transition">
                <td>{entry.date}</td>
                <td>{entry.mealType}</td>
                <td>{entry.calories}</td>
                <td>{entry.protein} g</td>
                <td>{entry.carbs} g</td>
                <td>{entry.fat} g</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NutritionTable;
