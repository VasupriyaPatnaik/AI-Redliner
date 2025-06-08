import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { fetchDocuments, uploadDocument, fetchPlaybooks, deleteDocument } from '../lib/api';
import Layout from '../components/Layout';
import mammoth from 'mammoth';
import { EyeIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);
  const [form, setForm] = useState({ name: '', content: '', playbook_id: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 5;
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // For modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalPdfFile, setModalPdfFile] = useState(null);
  const modalCanvasRef = useRef(null);

  // Load pdfjs library on client
  useEffect(() => {
    import('pdfjs-dist/build/pdf').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  useEffect(() => {
    loadDocuments();
    fetchPlaybooks().then(setPlaybooks);
  }, []);

  // Render PDF preview on upload (only page 1)
  useEffect(() => {
    if (!pdfFile || !pdfjsLib) return;

    const renderPdfPage = async () => {
      try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('Error rendering PDF preview:', err);
      }
    };

    renderPdfPage();
  }, [pdfFile, pdfjsLib]);

  // Render PDF in modal
  useEffect(() => {
    if (!modalPdfFile || !pdfjsLib) return;

    const renderPdfModal = async () => {
      try {
        const arrayBuffer = await modalPdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = modalCanvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('Error rendering PDF modal preview:', err);
      }
    };

    renderPdfModal();
  }, [modalPdfFile, pdfjsLib]);

  const loadDocuments = () => {
    fetchDocuments().then(docs => {
      const fixedDocs = docs.map(doc => ({
        ...doc,
        created_at: doc.created_at || new Date().toISOString(),
        status: doc.status || 'processing' // Changed from 'pending' to 'processing'
      }));
      setDocuments(fixedDocs);
    });
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      text += strings.join(' ') + '\n\n';
    }

    return text.trim();
  };

  const extractTextFromDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setError(null);
    setSuccessMessage('');
    setPdfFile(null);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
        setPdfFile(file);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx') ||
        file.name.endsWith('.doc')
      ) {
        text = await extractTextFromDocx(file);
      } else {
        throw new Error('Unsupported file type');
      }

      setForm(prev => ({
        ...prev,
        name: file.name.replace(/\.[^/.]+$/, ""),
        content: text
      }));
    } catch (err) {
      console.error(err);
      setError('Failed to process file. Only PDF and DOCX are supported.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      if (!form.playbook_id) {
        setError('Please select a playbook');
        setLoading(false);
        return;
      }
      if (!form.content || !form.name) {
        setError('Please upload a valid document');
        setLoading(false);
        return;
      }

      const res = await uploadDocument({
        ...form,
        status: 'processing'
      });

      if (res?.id) {
        // Add the new document with current timestamp
        const newDoc = {
          ...res,
          created_at: new Date().toISOString(),
          status: 'processing'
        };
        setDocuments(prev => [newDoc, ...prev]);
        
        setForm({ name: '', content: '', playbook_id: '' });
        setPdfFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        setSuccessMessage('Document uploaded successfully!');
        
        router.push(`/analysis/${res.id}`);
      } else {
        setError('Upload failed: Invalid response from server');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm('Are you sure you want to permanently delete this document?')) return;
    try {
      await deleteDocument(docId);
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      setSuccessMessage('Document deleted successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to delete document. Please try again.');
    }
  };

  const handleView = (doc) => {
    const isPdf = doc.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      fetch(doc.file_url || doc.url)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], doc.name, { type: 'application/pdf' });
          setModalPdfFile(file);
          setModalContent('');
          setModalOpen(true);
        })
        .catch(err => {
          console.error('Failed to fetch PDF file for preview', err);
          setError('Failed to load PDF preview');
        });
    } else {
      setModalContent(doc.content || 'No content available');
      setModalPdfFile(null);
      setModalOpen(true);
    }
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current documents for pagination
  const indexOfLastDoc = currentPage * docsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
  const currentDocs = filteredDocuments.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalPages = Math.ceil(filteredDocuments.length / docsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-purple-50 text-gray-900 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Document Analysis</h1>
              <p className="text-gray-600 mt-1">
                {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'} available
              </p>
            </div>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-700">Upload New Document</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                    <input
                      type="text"
                      placeholder="Enter document name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Playbook</label>
                    <select
                      value={form.playbook_id}
                      onChange={e => setForm({ ...form, playbook_id: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      required
                    >
                      <option value="">Select a playbook</option>
                      {playbooks.map(pb => (
                        <option key={pb.id} value={pb.id}>{pb.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (PDF/DOCX)</label>
                  <div
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-purple-400 transition-colors bg-purple-50"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="space-y-1 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF or DOCX files up to 10MB</p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {pdfFile && (
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 truncate">{form.name}</span>
                      <span className="text-xs text-gray-500">PDF Preview</span>
                    </div>
                    <canvas ref={canvasRef} className="w-full mt-2 border rounded" />
                  </div>
                )}

                {/* Status Messages */}
                {error && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-green-600">{successMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Analyze Document
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Document List Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-gray-800">Your Documents</h2>
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {currentDocs.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="divide-y divide-gray-200">
                  {currentDocs.map((doc) => (
                    <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <h3 className="text-lg font-medium text-gray-800 truncate">{doc.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(doc.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(doc)}
                            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                            title="View Document"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Document"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mt-2">No documents found</p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-purple-600 text-sm mt-2 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredDocuments.length > docsPerPage && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <div className="flex">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === number ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          )}

          {/* Modal for viewing document */}
          {modalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
              onClick={() => setModalOpen(false)}
            >
              <div
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-purple-50">
                  <h3 className="text-lg font-semibold text-purple-700">
                    {modalPdfFile ? 'PDF Preview' : 'Document Content'}
                  </h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close modal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {modalPdfFile ? (
                    <canvas ref={modalCanvasRef} className="w-full border rounded" />
                  ) : (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">{modalContent}</pre>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 p-3 flex justify-end">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}