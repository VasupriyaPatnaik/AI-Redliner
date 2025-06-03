import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, FileText, BookOpen, Settings, HelpCircle, Users } from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 z-20 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      <div
        className={`fixed inset-y-0 left-0 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary-700 transition duration-300 ease-in-out transform z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center flex-shrink-0 px-4">
          <Logo size="medium" />
          
          <button
            type="button"
            className="ml-auto flex items-center justify-center h-10 w-10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
            onClick={closeSidebar}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="mt-8 flex-1 h-0 overflow-y-auto">
          <nav className="px-2 space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100 hover:bg-primary-600'
                }`
              }
            >
              <LayoutDashboard className="mr-4 h-6 w-6" />
              Dashboard
            </NavLink>

            <NavLink
              to="/documents"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100 hover:bg-primary-600'
                }`
              }
            >
              <FileText className="mr-4 h-6 w-6" />
              Documents
            </NavLink>

            <NavLink
              to="/playbooks"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100 hover:bg-primary-600'
                }`
              }
            >
              <BookOpen className="mr-4 h-6 w-6" />
              Playbooks
            </NavLink>

            <NavLink
              to="/team"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100 hover:bg-primary-600'
                }`
              }
            >
              <Users className="mr-4 h-6 w-6" />
              Team
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100 hover:bg-primary-600'
                }`
              }
            >
              <Settings className="mr-4 h-6 w-6" />
              Settings
            </NavLink>

            <NavLink
              to="/help"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100 hover:bg-primary-600'
                }`
              }
            >
              <HelpCircle className="mr-4 h-6 w-6" />
              Help & Support
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;