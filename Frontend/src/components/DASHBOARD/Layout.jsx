import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  PlusCircle,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Edit2
} from "lucide-react";
import UserProfile from "./UserProfile";
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  

  const {logout} = useAuth()

  const menuItems = [
    {
      id: "statistics",
      label: "Channel Statistics",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/dashboard",
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
        id:"editMe",
        label : "Edit Me",
        icon :<Edit2 className='w-5 h-5'/>,
        path:"/dashboard/editme"

    }
  ];

  return (
    <div className="min-h-screen bg-base-100 ">
      {/* Mobile Header */}
      <div className="md:hidden bg-base-200 shadow-sm py-4 px-4 flex items-start justify-between">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-500 transition-colors fixed top-16 left-0"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-secondary" />
          ) : (
            <Menu className="w-6 h-6 text-secondary" />
          )}
        </button>
        <div className="flex-1 px-4">
          <UserProfile />
        </div>
      </div>

      <div className="flex  ">
        {/* Sidebar with increased width */}
        <div
          className={`fixed flex  md:static inset-y-0 left-0  transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out z-30 bg-base-200 md:bg-transparent  lg:w-5xl min-h-screen`}
        >
          {/* Desktop User Profile with improved spacing */}
          <div className="hidden md:block p-6 w-full max-w-2xl">
            <div className="w-full">
              <UserProfile />
            </div>
          </div>

          <div className="p-2 my-6 mt-12 h-full max-h-80 sm:mt-8 bg-base-100 shadow-xl w-1/2 min-w-[14rem]  ">
            <nav className="space-y-8  flex flex-col justify-start  ">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-accent flex items-center space-x-3 px-6 py-4 rounded-lg text-left transition-all duration-200 
                    ${
                      location.pathname === item.path
                        ? "bg-base-200 text-secondary shadow-sm scale-100"
                        : "text-secondary hover:bg-base-300 hover:scale-[1.02]"
                    }`}
                >
                  <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              
              <button
                onClick={
                  logout
                }
                className="w-full flex items-center space-x-3 px-6 py-4 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-[1.02] mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content with adjusted max-width */}
       
          <div className="max-w-4xl w-full mx-auto">
            <div className="bg-gradient-tr from-base-300 to-base-100  rounded-xl shadow-sm p-2 md:p-4 transition-all duration-300 hover:shadow-md ">
              <Outlet />
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default DashboardLayout;