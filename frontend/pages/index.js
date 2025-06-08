import Link from 'next/link';
import Layout from '../components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-purple-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-purple-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-purple-600">AI Redliner</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automate your document review process with powerful AI analysis. 
            Identify conflicts, gaps, and inconsistencies in seconds.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: '📘',
                title: 'Create Playbooks',
                description: 'Define your standards and requirements for consistent reviews',
                link: '/playbooks',
                color: 'bg-purple-100 text-purple-800'
              },
              {
                icon: '📄',
                title: 'Upload Documents',
                description: 'Analyze contracts, policies, or any text documents',
                link: '/documents',
                color: 'bg-blue-100 text-blue-800'
              },
              {
                icon: '🔍',
                title: 'Review Results',
                description: 'See detailed analysis and suggested improvements',
                link: '/reviews',
                color: 'bg-green-100 text-green-800'
              }
            ].map((feature, index) => (
              <Link 
                key={index} 
                href={feature.link}
                className="group"
              >
                <div className="h-full p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all hover:border-purple-200">
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/documents"
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Get Started - Upload Document
            </Link>
            <Link
              href="/playbooks"
              className="px-6 py-3 bg-white text-purple-700 font-medium rounded-lg shadow-sm border border-purple-200 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Create Playbook First
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}