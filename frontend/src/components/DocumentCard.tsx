import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, AlertCircle, Clock } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'failed';
  conflicts?: number;
  gaps?: number;
  uploadDate: string;
  thumbnail?: string;
}

interface DocumentCardProps {
  document: Document;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const getStatusBadge = () => {
    switch (document.status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
            <Clock className="mr-1 h-3 w-3" />
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
            Failed
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <Link to={`/documents/${document.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <div className="flex">
          {document.thumbnail && (
            <div className="flex-shrink-0 w-24 bg-gray-100 dark:bg-gray-700">
              <img 
                src={document.thumbnail} 
                alt={document.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 p-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {document.title}
              </h3>
              {getStatusBadge()}
            </div>
            
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Uploaded on {document.uploadDate}
            </p>
            
            {document.status === 'completed' && (
              <div className="mt-3 flex space-x-4">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {document.conflicts} conflicts
                  </span>
                </div>
                
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {document.gaps} gaps
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};