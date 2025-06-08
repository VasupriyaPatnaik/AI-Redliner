import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { User, LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) setLoggedInUser(JSON.parse(storedUser));
  }, []);

  const isActive = (pathname) => router.pathname === pathname;

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    setShowMenu(false);
    router.push('/');
  };

  return (
    <nav className="flex items-center w-full">
      {/* Logo (left) */}
      <div className="flex items-center">
        <div className="bg-purple-100 p-2 rounded-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-purple-600" 
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
        <h1 className="ml-3 text-2xl font-bold text-gray-800 hidden md:block">
          <span className="text-purple-600">AI</span> Redliner
        </h1>
      </div>

      {/* Navbar Links (center) */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className={`flex items-center gap-2 px-1 py-2 font-medium transition-colors ${
              isActive('/')
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-300'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </Link>

          <Link
            href="/playbooks"
            className={`flex items-center gap-2 px-1 py-2 font-medium transition-colors ${
              isActive('/playbooks')
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-300'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Playbooks</span>
          </Link>

          <Link
            href="/documents"
            className={`flex items-center gap-2 px-1 py-2 font-medium transition-colors ${
              isActive('/documents')
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-300'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Documents</span>
          </Link>

          <Link
            href="/reviews"
            className={`flex items-center gap-2 px-1 py-2 font-medium transition-colors ${
              isActive('/reviews')
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-300'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Reviews</span>
          </Link>
        </div>
      </div>

      {/* Login/Signup or User Menu (right) */}
      <div className="flex items-center ml-auto">
        {loggedInUser ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 text-purple-700 font-medium"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{loggedInUser.username}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-20">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    alert('Settings page not implemented yet.');
                  }}
                  className="flex items-center w-full px-4 py-2 hover:bg-purple-50 text-gray-700"
                >
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 hover:bg-purple-50 text-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="px-3 py-1.5 text-sm font-medium rounded-md text-purple-700 hover:bg-purple-50 transition-colors"
          >
            Log In / Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}