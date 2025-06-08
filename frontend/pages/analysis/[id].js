import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#EF4444', '#F59E0B', '#9CA3AF']; // conflict-red, gap-yellow, irrelevant-gray

export default function AnalysisPage() {
  const router = useRouter();
  const { id } = router.query;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);

      // Try to get existing analysis
      let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/analyze/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (!cancelled) {
          setResult(formatResult(data));
          setLoading(false);
        }
        return;
      }

      // If not found, trigger analysis
      if (res.status === 404) {
        const postRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/analyze/${id}`, { method: 'POST' });
        if (postRes.ok) {
          // After analysis, fetch again
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/analyze/${id}`);
          if (res.ok) {
            const data = await res.json();
            if (!cancelled) {
              setResult(formatResult(data));
              setLoading(false);
            }
            return;
          }
        }
        if (postRes.status === 404) {
          const errData = await postRes.json();
          setError(errData.detail || 'Analysis failed. Please try again.');
          setLoading(false);
          return;
        }
        if (!cancelled) {
          setError('Analysis failed. Please try again.');
          setLoading(false);
        }
      } else {
        if (!cancelled) {
          setError('Analysis not found.');
          setLoading(false);
        }
      }
    };

    fetchAnalysis();
    return () => { cancelled = true; };
  }, [id]);

  const handleDownload = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('AI-Redliner-Report.pdf');
  };

  const getColor = (type) => {
    switch (type) {
      case 'conflict':
        return 'border-red-500 bg-red-50';
      case 'gap':
        return 'border-yellow-500 bg-yellow-50';
      case 'irrelevant':
        return 'border-gray-400 bg-gray-100';
      default:
        return 'border-purple-500 bg-purple-50';
    }
  };

  const getEmoji = (type) => {
    switch (type) {
      case 'conflict':
        return '🔴';
      case 'gap':
        return '⚠️';
      case 'irrelevant':
        return '🚫';
      default:
        return 'ℹ️';
    }
  };

  const chartData = result
    ? ['conflict', 'gap', 'irrelevant'].map((type) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: result.redlines.filter((r) => r.type === type).length,
      }))
    : [];

  const filteredRedlines = result?.redlines.filter((r) =>
    filter === 'all' ? true : r.type === filter
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <h2
              className="text-4xl font-extrabold text-purple-800 flex items-center gap-3"
              aria-label="AI Redliner Report"
            >
              🧠 AI Redliner Report
            </h2>
            <button
              onClick={handleDownload}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              aria-label="Download PDF report"
            >
              📄 Download PDF
            </button>
          </div>

          <p className="text-gray-600">
            Instantly flags{' '}
            <strong>conflicts</strong>, <strong>gaps</strong>,{' '}
            <strong>irrelevant content</strong> for rapid correction.
          </p>

          {loading && <p className="text-gray-500">Loading analysis...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {result && (
            <>
              {/* Pie Chart */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">🧮 Summary Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} label>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                {/* Color Legend */}
                <div className="flex gap-4 mt-4 flex-wrap">
                  {chartData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-4 h-4 inline-block rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></span>
                      {entry.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Section */}
              <div id="report-content" className="space-y-8 mt-10">
                {/* Redlines Filter */}
                <div>
                  <h3 className="text-2xl font-bold text-red-600 mb-4">🔍 Redlines Detected</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['all', 'conflict', 'gap', 'irrelevant'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-3 py-1 rounded-full border ${
                          filter === type
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>

                  {filteredRedlines.length === 0 ? (
                    <p className="text-gray-500">No issues detected 🎉</p>
                  ) : (
                    <div className="space-y-4">
                      {filteredRedlines.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`border-l-4 p-4 rounded-xl shadow-md ${getColor(issue.type)} space-y-1`}
                        >
                          <div className="flex items-center gap-2 font-semibold text-lg">
                            {getEmoji(issue.type)} <span className="capitalize">{issue.type}</span>
                          </div>
                          <p className="ml-7 text-sm">{issue.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Matched Sections */}
                <div>
                  <h3 className="text-2xl font-bold text-green-600 mt-10 mb-2">✅ Matched Sections</h3>
                  {result.matched.length === 0 ? (
                    <p className="text-gray-500">No sections matched</p>
                  ) : (
                    <ul className="list-disc ml-6 text-sm text-gray-700">
                      {result.matched.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Unmatched Sections */}
                <div>
                  <h3 className="text-2xl font-bold text-yellow-600 mt-10 mb-2">❌ Unmatched Sections</h3>
                  {result.unmatched.length === 0 ? (
                    <p className="text-gray-500">All sections matched</p>
                  ) : (
                    <ul className="list-disc ml-6 text-sm text-gray-700">
                      {result.unmatched.map((u, idx) => (
                        <li key={idx}>{u}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

// Helper to format backend data to your expected result shape
function formatResult(data) {
  // You may need to adapt this if your backend returns differently
  return {
    redlines: [
      ...(data.conflicts ? data.conflicts.split('\n').filter(Boolean).map(text => ({ type: 'conflict', text })) : []),
      ...(data.gaps ? data.gaps.split('\n').filter(Boolean).map(text => ({ type: 'gap', text })) : []),
      ...(data.irrelevant ? data.irrelevant.split('\n').filter(Boolean).map(text => ({ type: 'irrelevant', text })) : []),
    ],
    matched: [],      // Fill if you have this info
    unmatched: [],    // Fill if you have this info
  };
}
