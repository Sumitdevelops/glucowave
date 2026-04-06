import { useState } from 'react';
import Sidebar from './Sidebar';
import LogEntryModal from '../LogEntryModal';

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-gradient-to-b from-orange-50 via-orange-50 to-white">
      <Sidebar onCollapse={setCollapsed} />

      {/* Main content with proper spacing for sidebar */}
      <main
        className={`flex-1 transition-all duration-300 overflow-hidden ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="h-full overflow-y-auto overflow-x-hidden p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      <LogEntryModal />
    </div>
  );
}