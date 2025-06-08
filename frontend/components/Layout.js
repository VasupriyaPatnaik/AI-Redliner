import Navbar from './Navbar';
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>AI Redliner</title>
        <meta name="description" content="Automated document analysis and review tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Navbar />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} AI Redliner. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
