import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Components
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployerRegister from './pages/EmployerRegister';
import JobseekerRegister from './pages/JobseekerRegister';
import JobListing from './pages/JobListing';
import JobDetails from './pages/JobDetails';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import JobPostForm from './pages/employer/JobPostForm';
import ManageJobs from './pages/employer/ManageJobs';
import Applications from './pages/employer/Applications';
import ApplicantDetails from './pages/employer/ApplicantDetails';
import SearchJobs from './pages/jobseeker/SearchJobs';
import MyApplications from './pages/jobseeker/MyApplications';
import ResumeBuilder from './pages/jobseeker/ResumeBuilder';
import AdminEmployers from './pages/admin/AdminEmployers';
import AdminJobseekers from './pages/admin/AdminJobseekers';

function App() {
  const { currentUser, userRole, loading } = useAuth();

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (loading) {
      return <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>;
    }
    
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" />;
    }
    
    return children;
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="register/employer" element={<EmployerRegister />} />
          <Route path="register/jobseeker" element={<JobseekerRegister />} />
          <Route path="jobs" element={<JobListing />} />
          <Route path="jobs/:id" element={<JobDetails />} />
        </Route>
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Employer Routes */}
          <Route path="post-job" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <JobPostForm />
            </ProtectedRoute>
          } />
          <Route path="edit-job/:id" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <JobPostForm />
            </ProtectedRoute>
          } />
          <Route path="manage-jobs" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <ManageJobs />
            </ProtectedRoute>
          } />
          <Route path="applications" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <Applications />
            </ProtectedRoute>
          } />
          <Route path="applications/:id" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <ApplicantDetails />
            </ProtectedRoute>
          } />
          
          {/* Jobseeker Routes */}
          <Route path="search-jobs" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <SearchJobs />
            </ProtectedRoute>
          } />
          <Route path="my-applications" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <MyApplications />
            </ProtectedRoute>
          } />
          <Route path="resume-builder" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="admin/employers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEmployers />
            </ProtectedRoute>
          } />
          <Route path="admin/jobseekers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminJobseekers />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
      <ScrollToTop />
    </>
  );
}

export default App;