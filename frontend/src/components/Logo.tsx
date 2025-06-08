import React from 'react';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xl';
      case 'large':
        return 'text-4xl';
      case 'medium':
      default:
        return 'text-2xl';
    }
  };
  
  return (
    <div className="flex items-center">
      <BookOpen className={`text-red-500 mr-2 ${size === 'small' ? 'h-6 w-6' : size === 'large' ? 'h-10 w-10' : 'h-8 w-8'}`} />
      <span className={`font-serif font-bold ${getSizeClasses()} text-primary-700 dark:text-white`}>
        AI <span className="text-red-500">Redliner</span>
      </span>
    </div>
  );
};

export default Logo;