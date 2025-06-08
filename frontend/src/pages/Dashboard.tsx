import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Plus, BarChart2, TrendingUp, Clock } from 'lucide-react';
import { DocumentCard } from '../components/DocumentCard';
import { StatsCard } from '../components/StatsCard';
import { UploadArea } from '../components/UploadArea';

const mockDocuments = [
  {
    id: '1',
    title: 'Employment Agreement - Q2 2025',
    status: 'completed',
    conflicts: 3,
    gaps: 1,
    uploadDate: 'April 15, 2025',
    thumbnail: 'https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '2',
    title: 'NDA - Tech Partnerships',
    status: 'in_progress',
    conflicts: 0,
    gaps: 0,
    uploadDate: 'April 14, 2025',
    thumbnail: 'https://images.pexels.com/photos/6863250/pexels-photo-6863250.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '3',
    title: 'Master Services Agreement',
    status: 'completed',
    conflicts: 5,
    gaps: 2,
    uploadDate: 'April 10, 2025',
    thumbnail: 'https://images.pexels.com/photos/6863250/pexels-photo-6863250.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="btn-outline">
            <Upload className="mr-2 h-4 w-4" /> Import
          </button>
          <button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" /> New Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
          title="Documents Analyzed" 
          value="124" 
          change="+14%" 
          icon={<FileText className="h-6 w-6 text-primary-500" />} 
        />
        <StatsCard 
          title="Time Saved" 
          value="168 hours" 
          change="+22%" 
          icon={<Clock className="h-6 w-6 text-green-500" />} 
        />
        <StatsCard 
          title="Compliance Rate" 
          value="94%" 
          change="+5%" 
          icon={<TrendingUp className="h-6 w-6 text-blue-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Documents</h2>
            <Link to="/documents" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {mockDocuments.map(doc => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload Document</h3>
              <UploadArea />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Playbooks</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-3 flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Employee Agreements</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">12 rules</span>
              </li>
              <li className="py-3 flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Non-disclosure Agreements</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">8 rules</span>
              </li>
              <li className="py-3 flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Service Agreements</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">15 rules</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link
                to="/playbooks"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Manage playbooks →
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Analytics Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Compliance Rate</span>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary-600">94%</span>
                  <span className="ml-2 text-sm text-green-600">+5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Time Saved</span>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary-600">168h</span>
                  <span className="ml-2 text-sm text-green-600">+22%</span>
                </div>
              </div>
              <div className="h-24 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="flex items-end h-full p-2">
                  {[40, 60, 30, 80, 50, 70, 90].map((height, i) => (
                    <div
                      key={i}
                      className="w-1/7 mx-px bg-primary-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/analytics"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                View detailed analytics →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;