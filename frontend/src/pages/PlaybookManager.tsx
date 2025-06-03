import React, { useState } from 'react';
import { Plus, File, Edit2, Trash2, Settings, InfoIcon, Search } from 'lucide-react';

const mockPlaybooks = [
  {
    id: '1',
    name: 'Employment Agreements',
    rules: 12,
    lastUpdated: 'March 22, 2025',
    createdBy: 'Sarah Johnson',
  },
  {
    id: '2',
    name: 'Non-disclosure Agreements',
    rules: 8,
    lastUpdated: 'February 14, 2025',
    createdBy: 'Michael Chen',
  },
  {
    id: '3',
    name: 'Service Agreements',
    rules: 15,
    lastUpdated: 'April 1, 2025',
    createdBy: 'Sarah Johnson',
  },
  {
    id: '4',
    name: 'Software License Agreements',
    rules: 20,
    lastUpdated: 'January 10, 2025',
    createdBy: 'David Rodriguez',
  },
  {
    id: '5',
    name: 'Contractor Agreements',
    rules: 14,
    lastUpdated: 'March 5, 2025',
    createdBy: 'Emily Watson',
  },
];

const PlaybookManager: React.FC = () => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Playbooks</h1>
        <button className="btn-primary flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Create Playbook
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Playbooks</h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search playbooks"
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rules
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created By
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockPlaybooks.map((playbook) => (
                    <tr 
                      key={playbook.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                        selectedPlaybook === playbook.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                      onClick={() => setSelectedPlaybook(playbook.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <File className="h-5 w-5 text-primary-500 mr-3" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {playbook.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{playbook.rules}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{playbook.lastUpdated}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{playbook.createdBy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button 
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {selectedPlaybook ? (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Playbook Details</h2>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {mockPlaybooks.find(p => p.id === selectedPlaybook)?.name}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rules</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {mockPlaybooks.find(p => p.id === selectedPlaybook)?.rules} rules defined
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {mockPlaybooks.find(p => p.id === selectedPlaybook)?.lastUpdated}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {mockPlaybooks.find(p => p.id === selectedPlaybook)?.createdBy}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Sample Rules</h3>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex items-start">
                      <InfoIcon className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Employee Age</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Must include section specifying minimum employee age of 18 years.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex items-start">
                      <InfoIcon className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Schedule</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          All payments must be on bi-weekly schedule.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex items-start">
                      <InfoIcon className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Position Title</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Must use approved titles from company organizational chart.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 btn-outline text-sm">
                    View All Rules
                  </button>
                  <button className="flex-1 btn-primary text-sm">
                    Edit Playbook
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 text-center">
              <File className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Playbook Selected</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Select a playbook from the list to view its details
              </p>
            </div>
          )}
          
          <div className="glass-card p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Playbook Usage
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Documents Analyzed</span>
                <span className="font-medium text-gray-900 dark:text-white">124</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Average Compliance Score</span>
                <span className="font-medium text-gray-900 dark:text-white">86%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Most Common Issue</span>
                <span className="font-medium text-gray-900 dark:text-white">Missing Sections</span>
              </div>
            </div>
            
            <div className="mt-4">
              <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                View Analytics →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybookManager;