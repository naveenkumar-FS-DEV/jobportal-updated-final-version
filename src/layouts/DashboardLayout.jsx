import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react'; // Import useEffect for screen size handling
import {
  FiHome,
  FiUser,
  FiBriefcase,
  FiFileText,
  FiUsers,
  FiSearch,
  FiPlusCircle,
  FiList,
  FiMail,
  FiSettings, // Not used but good to keep if planned for future
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

const DashboardLayout = () => {
  const { userRole, logout, userData } = useAuth();
  const location = useLocation();
  // Initialize sidebarOpen based on screen size: open on large, closed on small
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  // Effect to update sidebarOpen when window resizes
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getNavigationItems = () => {
    const commonItems = [
      { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
      { path: '/dashboard/profile', icon: FiUser, label: 'Profile' },
    ];

    if (userRole === 'jobseeker') {
      return [
        ...commonItems,
        { path: '/dashboard/search-jobs', icon: FiSearch, label: 'Find Jobs' },
        { path: '/dashboard/my-applications', icon: FiFileText, label: 'My Applications' },
        { path: '/dashboard/resume-builder', icon: FiFileText, label: 'Resume Builder' },
      ];
    }

    if (userRole === 'employer') {
      return [
        ...commonItems,
        { path: '/dashboard/post-job', icon: FiPlusCircle, label: 'Post Job' },
        { path: '/dashboard/manage-jobs', icon: FiList, label: 'Manage Jobs' },
        { path: '/dashboard/applications', icon: FiMail, label: 'Applications' },
      ];
    }

    if (userRole === 'admin') {
      return [
        ...commonItems,
        { path: '/dashboard/admin/employers', icon: FiBriefcase, label: 'Manage Employers' },
        { path: '/dashboard/admin/jobseekers', icon: FiUsers, label: 'Manage Jobseekers' },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  // Function to close sidebar, used on link clicks and mobile close button
  const closeSidebar = () => {
    // Only close on small screens to maintain desktop behavior
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay - only visible when sidebar is open on small screens */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile close button - positioned inside the sidebar */}
        <div className="lg:hidden absolute top-4 right-4 z-50"> {/* Adjusted position */}
          <button
            type="button"
            className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 text-gray-500 hover:text-gray-900"
            onClick={closeSidebar}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center" onClick={closeSidebar}>
            <span className="ml-2 text-xl font-bold text-primary-600">Signpost4jobs</span>
          </Link>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userData?.fullName || userData?.companyName || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            <FiLogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header (hamburger menu) */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-2 flex items-center justify-between">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)} // Open sidebar on click
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center">
              <FiBriefcase className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-lg font-bold text-primary-600">Signpost4jobs</span>
            </Link>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;