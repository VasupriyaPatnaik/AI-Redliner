import React, { useState } from 'react';
import { Upload, File } from 'lucide-react';

export const UploadArea: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  return (
    <div className="w-full">
      {selectedFile ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-primary-500 dark:border-primary-400">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <File className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button 
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setSelectedFile(null)}
            >
              Change File
            </button>
            <button className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Start Analysis
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`bg-white dark:bg-gray-800 p-8 rounded-lg border-2 border-dashed transition-all duration-200 ${
            dragActive 
              ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Upload your document
            </h3>
            
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Drag and drop your file here, or
            </p>
            
            <div className="mt-4">
              <label className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                <span>Browse Files</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                  accept=".pdf,.docx,.doc,.txt"
                />
              </label>
            </div>
            
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: PDF, DOCX, DOC, TXT
            </p>
          </div>
        </div>
      )}
    </div>
  );
};