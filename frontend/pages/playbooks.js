import { useState, useEffect, useRef } from "react";
import mammoth from "mammoth";
import {
  fetchPlaybooks,
  uploadPlaybook,
  deletePlaybook,
  updatePlaybook,
} from "../lib/api";
import Layout from "../components/Layout";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function PlaybooksPage() {
  const [form, setForm] = useState({ name: "", content: "" });
  const [playbooks, setPlaybooks] = useState([]);
  const [fileName, setFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewPlaybook, setViewPlaybook] = useState(null);
  const [editPlaybook, setEditPlaybook] = useState(null);
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [useManualInput, setUseManualInput] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(new Set());

  const itemsPerPage = 5;
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  // Dynamic import pdfjs only on client
  useEffect(() => {
    import("pdfjs-dist/build/pdf").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  useEffect(() => {
    loadPlaybooks();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timeout = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [success, error]);

  const loadPlaybooks = async () => {
    try {
      const data = await fetchPlaybooks();
      setPlaybooks(data || []);
    } catch (err) {
      setError("Failed to load playbooks");
    }
  };

  const extractTextFromPDF = async (file) => {
    if (!pdfjsLib) throw new Error("PDF.js not loaded yet");
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const typedArray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((s) => s.str).join(" ") + "\n";
          }
          resolve(text);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromDOCX = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFile = async (file) => {
    if (!file) return;

    // Check for duplicate file
    if (uploadedFiles.has(file.name)) {
      setError("This file has already been uploaded");
      return;
    }

    setFileName(file.name);
    let content = "";

    try {
      if (file.name.endsWith(".pdf")) {
        content = await extractTextFromPDF(file);
      } else if (file.name.endsWith(".docx")) {
        content = await extractTextFromDOCX(file);
      } else {
        setError("Unsupported file type. Please upload .pdf or .docx");
        return;
      }
      setForm(prev => ({ ...prev, content }));
      setUploadedFiles(prev => new Set(prev).add(file.name));
      setSuccess("File content extracted successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to parse file");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleClear = () => {
    setFileName("");
    setForm({ name: "", content: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    if (dropRef.current)
      dropRef.current.classList.add("border-purple-500", "bg-purple-50");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (dropRef.current)
      dropRef.current.classList.remove("border-purple-500", "bg-purple-50");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dropRef.current)
      dropRef.current.classList.remove("border-purple-500", "bg-purple-50");
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      setError("Playbook name and content are required");
      return;
    }

    // Check for duplicate playbook name
    if (playbooks.some(pb => pb.name.toLowerCase() === form.name.toLowerCase())) {
      setError("A playbook with this name already exists");
      return;
    }

    setLoading(true);
    try {
      const result = await uploadPlaybook(form);
      setPlaybooks((prev) => [...prev, result]);
      setForm({ name: "", content: "" });
      setFileName("");
      setSuccess("Playbook uploaded successfully!");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("Upload failed: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this playbook?")) return;
    try {
      await deletePlaybook(id);
      setPlaybooks((prev) => prev.filter((pb) => pb.id !== id));
      setSuccess("Playbook deleted");
      if (viewPlaybook?.id === id) setViewPlaybook(null);
      if (editPlaybook?.id === id) setEditPlaybook(null);
    } catch {
      setError("Failed to delete playbook");
    }
  };

  const handleDownload = (name, content) => {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name || "playbook.txt";
    link.click();
  };

  const handleEditChange = (field, value) => {
    setEditPlaybook((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    try {
      const updated = await updatePlaybook(editPlaybook.id, editPlaybook);
      setPlaybooks((prev) =>
        prev.map((pb) => (pb.id === updated.id ? updated : pb))
      );
      setSuccess("Playbook updated successfully");
      setEditPlaybook(null);
    } catch (err) {
      setError("Update failed");
    }
  };

  const filteredPlaybooks = playbooks.filter((pb) =>
    pb.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlaybooks.length / itemsPerPage);

  const paginatedPlaybooks = filteredPlaybooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Playbook Management</h1>
            <p className="text-gray-600">Create and manage your team's playbooks</p>
          </div>

          {/* Toggle between manual input or file upload */}
          <div className="mb-6 flex gap-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                !useManualInput
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setUseManualInput(false)}
              type="button"
            >
              Upload File
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                useManualInput
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setUseManualInput(true)}
              type="button"
            >
              Manual Input
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Playbook Name
              </label>
              <input
                type="text"
                placeholder="Enter unique playbook name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            {!useManualInput ? (
              <>
                {/* Drag & Drop upload area */}
                <div
                  ref={dropRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (dropRef.current) {
                      dropRef.current.querySelector("input[type=file]").click();
                    }
                  }}
                  className="mb-4 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-purple-500 hover:bg-purple-50"
                >
                  {fileName ? (
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-between w-full px-3 py-2 rounded-md bg-purple-50 border border-purple-100">
                        <span className="truncate text-purple-800">{fileName}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClear();
                          }}
                          className="text-purple-500 hover:text-purple-700"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-gray-600">
                        <span className="font-medium text-purple-600 hover:text-purple-500">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF or DOCX files only (No duplicates)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Playbook Content
                </label>
                <textarea
                  rows={10}
                  placeholder="Enter playbook content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              {fileName && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Playbook"
                )}
              </button>
            </div>
          </form>

          {/* Status messages */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Playbook List Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg font-medium text-gray-800">Your Playbooks</h2>
              <p className="text-sm text-gray-600">
                {filteredPlaybooks.length} {filteredPlaybooks.length === 1 ? "playbook" : "playbooks"} available
              </p>
            </div>
            <div className="w-full sm:w-64">
              <label htmlFor="search" className="sr-only">Search playbooks</label>
              <input
                id="search"
                type="text"
                placeholder="Search playbooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Playbook List */}
          <ul className="divide-y divide-gray-200">
            {paginatedPlaybooks.length > 0 ? (
              paginatedPlaybooks.map((pb) => (
                <li
                  key={pb.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-purple-700 truncate">
                        {pb.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {pb.content.slice(0, 150)}...
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => setViewPlaybook(pb)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-purple-700 hover:bg-purple-50"
                        title="View"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setEditPlaybook(pb)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-yellow-600 hover:bg-yellow-50"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDownload(pb.name, pb.content)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50"
                        title="Download"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pb.id)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-800">
                  No playbooks found
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {searchTerm
                    ? "Try a different search term"
                    : "Get started by uploading a new playbook"}
                </p>
              </li>
            )}
          </ul>

          {/* Pagination */}
          {paginatedPlaybooks.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredPlaybooks.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredPlaybooks.length}</span> playbooks
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-purple-50 border-purple-500 text-purple-700"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Modal */}
        {viewPlaybook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white max-w-4xl w-full rounded-lg p-6 overflow-auto max-h-[80vh] shadow-xl relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 p-1"
                onClick={() => setViewPlaybook(null)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold text-purple-700">
                  {viewPlaybook.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Playbook Details</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-gray-800">
                  {viewPlaybook.content}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editPlaybook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white max-w-4xl w-full rounded-lg p-6 overflow-auto max-h-[80vh] shadow-xl relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 p-1"
                onClick={() => setEditPlaybook(null)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Edit Playbook
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Playbook Name
                  </label>
                  <input
                    id="edit-name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-purple-500 focus:border-purple-500"
                    value={editPlaybook.name}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-1">
                    Playbook Content
                  </label>
                  <textarea
                    id="edit-content"
                    rows={12}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-purple-500 focus:border-purple-500"
                    value={editPlaybook.content}
                    onChange={(e) => handleEditChange("content", e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setEditPlaybook(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
