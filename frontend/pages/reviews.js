import { useEffect, useState } from 'react';
import { fetchReviews, fetchDocuments } from '../lib/api';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const REVIEWS_PER_PAGE = 5;

  useEffect(() => {
    Promise.all([fetchReviews(), fetchDocuments()])
      .then(([reviewsData, documentsData]) => {
        setReviews(reviewsData);
        setDocuments(documentsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const getDocument = (id) => documents.find(d => d.id === id);

  const getFilteredReviews = () => {
    if (!search.trim()) return reviews;
    return reviews.filter(r => {
      const doc = getDocument(r.document_id);
      const docName = doc?.name?.toLowerCase() || '';
      const combined = `${docName} ${r.conflicts} ${r.gaps} ${r.irrelevant}`.toLowerCase();
      return combined.includes(search.toLowerCase());
    });
  };

  const paginatedReviews = () => {
    const filtered = getFilteredReviews();
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return filtered.slice(start, start + REVIEWS_PER_PAGE);
  };

  const totalPages = Math.ceil(getFilteredReviews().length / REVIEWS_PER_PAGE);

  return (
    <Layout>
      <div className="min-h-screen bg-purple-50 text-gray-800 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-purple-900">Review Analysis Results</h2>
            </div>
            
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search by document name, conflicts, gaps..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : paginatedReviews().length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-purple-100 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-purple-800">No reviews found</h3>
              <p className="mt-2 text-purple-600">{search ? 'Try a different search term' : 'No reviews have been generated yet'}</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {paginatedReviews().map(r => {
                const doc = getDocument(r.document_id);
                return (
                  <li key={r.id} className="bg-white p-6 rounded-xl shadow-md border border-purple-100 hover:shadow-lg transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-purple-800">{doc?.name || `Document #${r.document_id}`}</h3>
                        {doc?.created_at && (
                          <p className="text-sm text-purple-500 mt-1">
                            Analyzed on {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {doc?.url && (
                          <>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm hover:bg-purple-100 transition flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Preview
                            </a>
                            <a href={doc.url} download className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm hover:bg-purple-100 transition flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </a>
                          </>
                        )}
                        <Link href={`/analysis/${r.document_id}`} className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition flex items-center gap-1">
                          View Analysis
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2 text-purple-700 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <h4 className="font-semibold">Conflicts</h4>
                        </div>
                        <p className="text-purple-800 whitespace-pre-line">{r.conflicts || 'No conflicts found'}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2 text-purple-700 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          <h4 className="font-semibold">Gaps</h4>
                        </div>
                        <p className="text-purple-800 whitespace-pre-line">{r.gaps || 'No gaps identified'}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2 text-purple-700 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          <h4 className="font-semibold">Irrelevant Content</h4>
                        </div>
                        <p className="text-purple-800 whitespace-pre-line">{r.irrelevant || 'No irrelevant content'}</p>
                      </div>

                      {r.corrections && (
                        <div className="bg-purple-100 p-4 rounded-lg border border-purple-200 col-span-full">
                          <div className="flex items-center gap-2 text-purple-800 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h4 className="font-semibold">Suggested Corrections</h4>
                          </div>
                          <p className="text-purple-900 whitespace-pre-line">{r.corrections}</p>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-purple-700">
                Showing {(currentPage - 1) * REVIEWS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * REVIEWS_PER_PAGE, getFilteredReviews().length)} of{' '}
                {getFilteredReviews().length} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <div className="flex items-center">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 mx-1 rounded-lg ${currentPage === pageNum ? 'bg-purple-600 text-white' : 'bg-white text-purple-700 hover:bg-purple-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}