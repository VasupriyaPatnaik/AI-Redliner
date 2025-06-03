import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Share2, Printer, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const mockDocument = {
  id: '1',
  title: 'Employment Agreement - Q2 2025',
  status: 'completed',
  conflicts: 3,
  gaps: 1,
  irrelevant: 2,
  playbook: 'Employment Agreements',
  uploadDate: 'April 15, 2025',
  content: [
    {
      type: 'normal',
      text: 'EMPLOYMENT AGREEMENT\n\nThis Employment Agreement (the "Agreement") is made and entered into as of April 15, 2025 (the "Effective Date"), by and between ABC Corporation, a Delaware corporation (the "Company"), and John Smith, an individual (the "Employee").'
    },
    {
      type: 'normal',
      text: 'RECITALS\n\nWHEREAS, the Company desires to employ the Employee on the terms and conditions set forth herein; and\n\nWHEREAS, the Employee desires to be employed by the Company on such terms and conditions.'
    },
    {
      type: 'normal',
      text: 'NOW, THEREFORE, in consideration of the mutual covenants, promises, and obligations set forth herein, the parties agree as follows:'
    },
    {
      type: 'section',
      text: '1. TERM.'
    },
    {
      type: 'normal',
      text: 'The Employee\'s employment hereunder shall be effective as of the Effective Date and shall continue until terminated according to the provisions of this Agreement.'
    },
    {
      type: 'section',
      text: '2. POSITION AND DUTIES.'
    },
    {
      type: 'redline',
      text: '2.1 Position. During the Employment Term, the Employee shall serve as the Senior Marketing Director of the Company, reporting directly to the Chief Marketing Officer. The Employee shall have such duties, authority, and responsibility as shall be determined from time to time by the Chief Marketing Officer, which duties, authority, and responsibility are consistent with the Employee\'s position.',
      note: 'Position title does not match company hierarchy standards. Should be "Director of Marketing" according to playbook.'
    },
    {
      type: 'gap',
      text: '[THIS SECTION SHOULD INCLUDE DETAILS ABOUT EMPLOYEE RESPONSIBILITIES AND PERFORMANCE EXPECTATIONS]',
      note: 'Missing required section on specific duties and responsibilities.'
    },
    {
      type: 'section',
      text: '3. PLACE OF PERFORMANCE.'
    },
    {
      type: 'normal',
      text: 'The principal place of Employee\'s employment shall be the Company\'s main office located in San Francisco, California; provided that, the Employee may be required to travel on Company business during the Employment Term.'
    },
    {
      type: 'section',
      text: '4. COMPENSATION.'
    },
    {
      type: 'redline',
      text: '4.1 Base Salary. The Company shall pay the Employee a base salary of $175,000 per year, payable in equal monthly installments in accordance with the Company\'s customary payroll practices.',
      note: 'Salary structure violates compensation guidelines. Company policy requires bi-weekly payments, not monthly.'
    },
    {
      type: 'normal',
      text: '4.2 Annual Bonus. For each complete fiscal year of the Employment Term, the Employee shall be eligible to earn an annual bonus (the "Annual Bonus") equal to up to 20% of Base Salary, based on the achievement of performance goals established by the Board.'
    },
    {
      type: 'irrelevant',
      text: '4.3 Stock Options. The Employee will be granted stock options to purchase 10,000 shares of the Company\'s common stock at an exercise price equal to the fair market value on the date of grant, which shall vest over a four-year period.',
      note: 'Stock option provisions should be in a separate equity agreement, not in the employment agreement.'
    },
    {
      type: 'section',
      text: '5. EMPLOYEE BENEFITS.'
    },
    {
      type: 'normal',
      text: 'During the Employment Term, the Employee shall be entitled to participate in all employee benefit plans, practices, and programs maintained by the Company, as in effect from time to time.'
    },
    {
      type: 'redline',
      text: '5.1 Vacation. During the Employment Term, the Employee shall be entitled to thirty (30) paid vacation days per calendar year (prorated for partial years) in accordance with the Company\'s vacation policies.',
      note: 'Vacation allowance exceeds company standard of 20 days for this position level.'
    },
    {
      type: 'section',
      text: '6. CONFIDENTIAL INFORMATION.'
    },
    {
      type: 'normal',
      text: 'The Employee understands and acknowledges that during the Employment Term, the Employee will have access to and learn about Confidential Information, as defined below.'
    }
  ]
};

const DocumentViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'document' | 'summary'>('document');
  const [showNotes, setShowNotes] = useState(true);

  // In a real app, fetch document by ID
  const document = mockDocument;

  const conflicts = document.content.filter(item => item.type === 'redline').length;
  const gaps = document.content.filter(item => item.type === 'gap').length;
  const irrelevant = document.content.filter(item => item.type === 'irrelevant').length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{document.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analyzed against <span className="font-medium">{document.playbook}</span> playbook • {document.uploadDate}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'document' 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('document')}
          >
            Document
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'summary' 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button className="btn-outline flex items-center text-sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </button>
          <button className="btn-outline flex items-center text-sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </button>
          <button className="btn-outline flex items-center text-sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {activeTab === 'document' && (
        <div className="flex space-x-6">
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Document Analysis
                </h2>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-notes"
                    checked={showNotes}
                    onChange={() => setShowNotes(!showNotes)}
                    className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4 mr-2"
                  />
                  <label htmlFor="show-notes" className="text-sm text-gray-600 dark:text-gray-300">
                    Show notes
                  </label>
                </div>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                {document.content.map((section, index) => {
                  let sectionClass = '';
                  
                  switch (section.type) {
                    case 'section':
                      sectionClass = 'font-bold text-lg mt-6 mb-2';
                      break;
                    case 'redline':
                      sectionClass = 'redline my-2 py-1';
                      break;
                    case 'gap':
                      sectionClass = 'gap my-2 py-1';
                      break;
                    case 'irrelevant':
                      sectionClass = 'irrelevant my-2 py-1';
                      break;
                    default:
                      sectionClass = 'my-2';
                  }
                  
                  return (
                    <div key={index} className="relative group">
                      <div className={sectionClass}>
                        {section.text.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < section.text.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                      
                      {showNotes && section.note && (
                        <div className="mt-1 mb-3 ml-4 pl-3 border-l-2 border-gray-300 dark:border-gray-600">
                          <p className="text-sm italic text-gray-600 dark:text-gray-400">
                            {section.note}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="w-72 space-y-4">
            <div className="glass-card p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Analysis Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Conflicts</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{conflicts}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gaps</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{gaps}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                      <XCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Irrelevant</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{irrelevant}</span>
                </div>
                
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compliance Score</span>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">78%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Key Issues
              </h3>
              
              <ul className="space-y-3 mt-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-bold text-red-600">1</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Position title doesn't align with company hierarchy
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-bold text-red-600">2</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Salary payment schedule violates company policy
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-bold text-red-600">3</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Vacation allowance exceeds standard for position level
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-bold text-yellow-600">!</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Missing section on employee duties and responsibilities
                  </p>
                </li>
              </ul>
            </div>
            
            <button className="w-full btn-primary">
              Generate Correction Report
            </button>
          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Document Summary
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Overview
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    This employment agreement between ABC Corporation and John Smith contains several
                    conflicts with the company's standard playbook for employment agreements. The document
                    has 3 major conflicts, 1 gap, and 2 irrelevant sections that should be removed or modified.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Compliance Issues
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Position Title Mismatch</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          The position "Senior Marketing Director" does not align with the company's 
                          organizational structure. The correct title should be "Director of Marketing".
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Incorrect Payment Schedule</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          The salary payment schedule is set to monthly, but company policy requires bi-weekly payments.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Excessive Vacation Allowance</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          The vacation allowance of 30 days exceeds the company standard of 20 days for this position level.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Missing Duties Section</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          The agreement is missing a required section detailing the employee's specific
                          duties and performance expectations.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Irrelevant Content
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex">
                      <XCircle className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Stock Options</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Stock option provisions should be in a separate equity agreement, not in the employment agreement.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Correct the position title to "Director of Marketing"
                      </p>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Change salary payment schedule from monthly to bi-weekly
                      </p>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Reduce vacation allowance from 30 days to 20 days
                      </p>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Add a detailed section on employee duties and responsibilities
                      </p>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Remove stock option provisions and create a separate equity agreement
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="glass-card p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Document Analysis
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Total Pages</span>
                  <span className="font-medium text-gray-900 dark:text-white">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Sections Analyzed</span>
                  <span className="font-medium text-gray-900 dark:text-white">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Analysis Duration</span>
                  <span className="font-medium text-gray-900 dark:text-white">1m 42s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Manual Review Saved</span>
                  <span className="font-medium text-text-gray-900 dark:text-white">~4 hours</span>
                </div>
                
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compliance Score</span>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">78%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Playbook Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Playbook Name</span>
                  <span className="font-medium text-gray-900 dark:text-white">Employment Agreements</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Version</span>
                  <span className="font-medium text-gray-900 dark:text-white">v2.4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Last Updated</span>
                  <span className="font-medium text-gray-900 dark:text-white">March 22, 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Rules Applied</span>
                  <span className="font-medium text-gray-900 dark:text-white">12</span>
                </div>
              </div>
              
              <div className="mt-4">
                <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                  View Playbook Details →
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 btn-outline">
                Export Report
              </button>
              <button className="flex-1 btn-primary">
                Correct Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;