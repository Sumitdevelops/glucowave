import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, ClipboardList, Bell, User, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, createContext, useContext } from 'react';

// ── Shared context so DashboardLayout can read collapsed state ──
export const SidebarContext = createContext({ collapsed: false });
export const useSidebar = () => useContext(SidebarContext);

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: ClipboardList, label: 'Logs', path: '/dashboard' },
  { icon: Bell, label: 'Alerts', path: '/alerts' },
  { icon: User, label: 'Profile', path: '/dashboard' },
];

export default function Sidebar({ onCollapse }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapse?.(next);   // notify parent (DashboardLayout)
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 z-50 flex flex-col transition-all duration-300 overflow-hidden
        ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`p-6 flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center flex-shrink-0">
          <Activity size={22} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <h2 className="font-bold text-gray-900 font-[Poppins]">GlucoWave</h2>
            <p className="text-xs text-gray-500">AI Monitor</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                  ${collapsed ? 'justify-center px-3' : ''}`
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 text-sm"
        >
          {collapsed
            ? <ChevronRight size={18} />
            : <><ChevronLeft size={18} /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}