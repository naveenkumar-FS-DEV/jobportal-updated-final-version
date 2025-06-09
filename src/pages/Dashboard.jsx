import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  FiSearch, 
  FiFileText, 
  FiPlusCircle, 
  FiList, 
  FiMail, 
  FiBriefcase, 
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';

const Dashboard = () => {
  const { userRole, userData, currentUser } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && userRole) {
      fetchStats();
    }
  }, [currentUser, userRole]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      let statsData = [];

      if (userRole === 'jobseeker') {
        // Get applications count
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('jobseekerId', '==', currentUser.uid)
        );
        const applicationsSnapshot = await getDocs(applicationsQuery);
        const totalApplications = applicationsSnapshot.size;

        // Count by status
        const applications = applicationsSnapshot.docs.map(doc => doc.data());
        const pendingApplications = applications.filter(app => app.status === 'pending').length;
        const viewedApplications = applications.filter(app => app.status === 'viewed').length;
        const selectedApplications = applications.filter(app => app.status === 'selected').length;

        statsData = [
          { label: 'Applications Sent', value: totalApplications.toString(), icon: FiFileText, color: 'text-blue-600' },
          { label: 'Under Review', value: viewedApplications.toString(), icon: FiTrendingUp, color: 'text-green-600' },
          { label: 'Pending Reviews', value: pendingApplications.toString(), icon: FiClock, color: 'text-orange-600' },
          { label: 'Selected', value: selectedApplications.toString(), icon: FiCheckCircle, color: 'text-purple-600' }
        ];
      } else if (userRole === 'employer') {
        // Get jobs count
        const jobsQuery = query(
          collection(db, 'jobs'),
          where('employerId', '==', currentUser.uid)
        );
        const jobsSnapshot = await getDocs(jobsQuery);
        const totalJobs = jobsSnapshot.size;

        // Get all applications for employer's jobs
        const jobIds = jobsSnapshot.docs.map(doc => doc.id);
        let totalApplications = 0;
        let pendingApplications = 0;
        let selectedApplications = 0;

        for (const jobId of jobIds) {
          const applicationsQuery = query(
            collection(db, 'applications'),
            where('jobId', '==', jobId)
          );
          const applicationsSnapshot = await getDocs(applicationsQuery);
          totalApplications += applicationsSnapshot.size;

          const applications = applicationsSnapshot.docs.map(doc => doc.data());
          pendingApplications += applications.filter(app => app.status === 'pending').length;
          selectedApplications += applications.filter(app => app.status === 'selected').length;
        }

        statsData = [
          { label: 'Active Jobs', value: totalJobs.toString(), icon: FiBriefcase, color: 'text-blue-600' },
          { label: 'Total Applications', value: totalApplications.toString(), icon: FiFileText, color: 'text-green-600' },
          { label: 'Pending Reviews', value: pendingApplications.toString(), icon: FiClock, color: 'text-orange-600' },
          { label: 'Hired Candidates', value: selectedApplications.toString(), icon: FiCheckCircle, color: 'text-purple-600' }
        ];
      } else if (userRole === 'admin') {
        // Get employers count
        const employersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'employer')
        );
        const employersSnapshot = await getDocs(employersQuery);
        const totalEmployers = employersSnapshot.size;

        // Count employer statuses
        const employers = employersSnapshot.docs.map(doc => doc.data());
        const pendingEmployers = employers.filter(emp => emp.status === 'pending').length;
        const approvedEmployers = employers.filter(emp => emp.status === 'approved').length;
        const rejectedEmployers = employers.filter(emp => emp.status === 'rejected').length;

        // Get jobseekers count
        const jobseekersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'jobseeker')
        );
        const jobseekersSnapshot = await getDocs(jobseekersQuery);
        const totalJobseekers = jobseekersSnapshot.size;

        // Get total jobs count
        const allJobsSnapshot = await getDocs(collection(db, 'jobs'));
        const totalJobs = allJobsSnapshot.size;

        statsData = [
          { label: 'Total Employers', value: totalEmployers.toString(), icon: FiBriefcase, color: 'text-blue-600' },
          { label: 'Total Jobseekers', value: totalJobseekers.toString(), icon: FiUsers, color: 'text-green-600' },
          { label: 'Pending Approvals', value: pendingEmployers.toString(), icon: FiClock, color: 'text-orange-600' },
          { label: 'Active Jobs', value: totalJobs.toString(), icon: FiCheckCircle, color: 'text-purple-600' }
        ];
      }

      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to default stats
      setStats(getDefaultStats());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultStats = () => {
    switch (userRole) {
      case 'jobseeker':
        return [
          { label: 'Applications Sent', value: '0', icon: FiFileText, color: 'text-blue-600' },
          { label: 'Under Review', value: '0', icon: FiTrendingUp, color: 'text-green-600' },
          { label: 'Pending Reviews', value: '0', icon: FiClock, color: 'text-orange-600' },
          { label: 'Selected', value: '0', icon: FiCheckCircle, color: 'text-purple-600' }
        ];
      
      case 'employer':
        return [
          { label: 'Active Jobs', value: '0', icon: FiBriefcase, color: 'text-blue-600' },
          { label: 'Total Applications', value: '0', icon: FiFileText, color: 'text-green-600' },
          { label: 'Pending Reviews', value: '0', icon: FiClock, color: 'text-orange-600' },
          { label: 'Hired Candidates', value: '0', icon: FiCheckCircle, color: 'text-purple-600' }
        ];
      
      case 'admin':
        return [
          { label: 'Total Employers', value: '0', icon: FiBriefcase, color: 'text-blue-600' },
          { label: 'Total Jobseekers', value: '0', icon: FiUsers, color: 'text-green-600' },
          { label: 'Pending Approvals', value: '0', icon: FiClock, color: 'text-orange-600' },
          { label: 'Active Jobs', value: '0', icon: FiCheckCircle, color: 'text-purple-600' }
        ];
      
      default:
        return [];
    }
  };

  const getWelcomeMessage = () => {
    const name = userData?.fullName || userData?.companyName || 'User';
    
    switch (userRole) {
      case 'jobseeker':
        return `Welcome back, ${name}! Ready to find your next opportunity?`;
      case 'employer':
        return `Welcome back, ${name}! Let's find great talent for your company.`;
      case 'admin':
        return `Welcome back, ${name}! Manage the platform efficiently.`;
      default:
        return `Welcome back, ${name}!`;
    }
  };

  const getQuickActions = () => {
    switch (userRole) {
      case 'jobseeker':
        return [
          {
            title: 'Find Jobs',
            description: 'Search and apply for jobs that match your skills',
            icon: FiSearch,
            link: '/dashboard/search-jobs',
            color: 'bg-blue-500'
          },
          {
            title: 'My Applications',
            description: 'Track your job applications and their status',
            icon: FiFileText,
            link: '/dashboard/my-applications',
            color: 'bg-green-500'
          },
          {
            title: 'Resume Builder',
            description: 'Create and download your professional resume',
            icon: FiFileText,
            link: '/dashboard/resume-builder',
            color: 'bg-purple-500'
          }
        ];
      
      case 'employer':
        return [
          {
            title: 'Post a Job',
            description: 'Create a new job posting to attract candidates',
            icon: FiPlusCircle,
            link: '/dashboard/post-job',
            color: 'bg-blue-500'
          },
          {
            title: 'Manage Jobs',
            description: 'View and edit your existing job postings',
            icon: FiList,
            link: '/dashboard/manage-jobs',
            color: 'bg-green-500'
          },
          {
            title: 'Applications',
            description: 'Review applications from job seekers',
            icon: FiMail,
            link: '/dashboard/applications',
            color: 'bg-orange-500'
          }
        ];
      
      case 'admin':
        return [
          {
            title: 'Manage Employers',
            description: 'Review and approve employer registrations',
            icon: FiBriefcase,
            link: '/dashboard/admin/employers',
            color: 'bg-blue-500'
          },
          {
            title: 'Manage Jobseekers',
            description: 'View and manage jobseeker accounts',
            icon: FiUsers,
            link: '/dashboard/admin/jobseekers',
            color: 'bg-green-500'
          }
        ];
      
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {getWelcomeMessage()}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6 animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 sm:h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-4 sm:p-6 block"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className={`${action.color} rounded-lg p-2 sm:p-3`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="ml-3 sm:ml-4 text-base sm:text-lg font-medium text-gray-900 truncate">
                    {action.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="text-center py-6 sm:py-8">
            <FiClock className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your recent activities will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;