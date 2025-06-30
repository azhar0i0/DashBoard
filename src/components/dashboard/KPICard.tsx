
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: 'blue' | 'emerald' | 'orange' | 'red' | 'purple';
}

const colorVariants = {
  blue: 'from-blue-500 to-blue-600',
  emerald: 'from-emerald-500 to-emerald-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
};

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-lg bg-gradient-to-br shadow-md",
            colorVariants[color]
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {change && (
            <span className={cn(
              "text-sm font-medium px-2 py-1 rounded-full",
              changeType === 'positive' && "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/20",
              changeType === 'negative' && "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/20",
              changeType === 'neutral' && "text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700"
            )}>
              {change}
            </span>
          )}
        </div>
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
};

export default KPICard;
