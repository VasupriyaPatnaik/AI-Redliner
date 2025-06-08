import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon?: ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-500\" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500\" aria-hidden="true" />
            )}
          </div>
          <div className="ml-2 flex items-baseline text-sm font-semibold">
            <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              {change}
            </span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};