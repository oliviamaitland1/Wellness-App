import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="p-4 m-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
};

export default StatCard;
