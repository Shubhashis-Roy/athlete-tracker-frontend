import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/athletes': 'Athletes',
    '/athletes/add': 'Add Athlete',
    '/tests': 'Test Scores',
    '/leaderboard': 'Leaderboard',
  };
  
  // Check for dynamic routes
  if (pathname.startsWith('/athletes/edit/')) return 'Edit Athlete';
  if (pathname.startsWith('/athletes/')) return 'Athlete Details';
  
  return routes[pathname] || 'Dashboard';
};

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          title={pageTitle}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
