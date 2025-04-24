/**
 * DashboardLayout Component
 * 
 * A responsive dashboard layout with:
 * - Desktop: UserProfile, Navigation sidebar and content in a row
 * - Mobile: Navigation in collapsible sidebar and content, with UserProfile hidden
 * Uses DaisyUI theming for consistent styling.
 */
import { useState, useCallback, memo } from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  PlusCircle,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Edit2,
  Home,
  ChevronRight
} from "lucide-react";
import UserProfile from "./UserProfile";
import { useAuth } from '../../hooks/useAuth';

// Memoized menu item component for better performance
const MenuItem = memo(({ item, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-accent flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 
      ${isActive 
        ? "bg-base-200 text-secondary shadow-md font-medium border-l-4 border-secondary" 
        : "text-base-content hover:bg-base-200/80 hover:scale-[1.02]"}`}
  >
    <div className={`flex-shrink-0 transition-transform duration-200 ${isActive ? "text-secondary" : "text-accent/80"}`}>
      {item.icon}
    </div>
    <span className={`${isActive ? "font-medium" : ""}`}>{item.label}</span>
    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-secondary" />}
  </button>
));

/**
 * DashboardLayout - Main layout component for the dashboard area
 * Provides navigation sidebar and content container in different arrangements
 * for desktop and mobile views
 */
const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  // Toggle sidebar visibility (for mobile)
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Close sidebar (for mobile after navigation)
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Navigation handler
  const handleNavigation = useCallback((path) => {
    navigate(path);
    closeSidebar();
  }, [navigate, closeSidebar]);

  // Dashboard navigation items
  const menuItems = [
    {
      id: "home",
      label: "Dashboard Home",
      icon: <Home className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      id: "statistics",
      label: "Channel Statistics",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/dashboard/statistics",
    },
    {
      id: "create",
      label: "Create Channel",
      icon: <PlusCircle className="w-5 h-5" />,
      path: "/dashboard/create",
    },
    {
      id: "edit",
      label: "Edit Channel",
      icon: <Settings className="w-5 h-5" />,
      path: "/dashboard/edit",
    },
    {
      id: "editMe",
      label: "Edit Profile",
      icon: <Edit2 className="w-5 h-5" />,
      path: "/dashboard/editme"
    }
  ];

  // Navigation content for reuse
  const navigationContent = (
    <>
      <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider px-3 py-2">
        Navigation
      </h3>
      
      <nav className="space-y-1 mt-2">
        {menuItems.map((item) => (
          <MenuItem 
            key={item.id}
            item={item}
            isActive={location.pathname === item.path || 
              (item.id === "home" && location.pathname === "/dashboard")}
            onClick={() => handleNavigation(item.path)}
          />
        ))}
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-lg text-left text-error hover:bg-error/10 transition-all duration-200 hover:scale-[1.02]"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden bg-base-200 shadow-sm py-3 px-4 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-base-300 transition-colors"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-secondary" />
          ) : (
            <Menu className="w-6 h-6 text-secondary" />
          )}
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-secondary">Dashboard</h1>
        </div>
      </div>

      {/* Main Content Area - Flex row on large screens */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Mobile Sidebar - Hidden on large screens */}
        <aside
          className={`fixed lg:hidden h-screen transform 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            transition-transform duration-300 ease-in-out z-30 
            bg-base-100 shadow-lg w-64`}
        >
          <div className="p-3 h-full overflow-y-auto">
            {navigationContent}
          </div>
        </aside>

        {/* Backdrop overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Desktop layout: UserProfile, Navigation, and Content in a row */}
        <div className="hidden lg:block w-64 xl:w-72 border-r border-base-200 p-4 overflow-y-auto">
          <UserProfile />
        </div>
        
        <div className="hidden lg:block w-56 xl:w-64 border-r border-base-200 p-4 overflow-y-auto">
          {navigationContent}
        </div>
        
        {/* Main Content - Takes full width on mobile, remaining space on desktop */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <div className="max-w-5xl mx-auto lg:mx-0">
            <div className="bg-gradient-to-tr from-base-200/50 to-base-100 rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300 hover:shadow-md">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;