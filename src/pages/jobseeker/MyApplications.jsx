import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiEye, FiSearch, FiFilter, FiCheck, FiX, FiClock,FiMapPin } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [currentUser]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      if (!currentUser) return;
      
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('jobseekerId', '==', currentUser.uid)
      );
      
      const applicationsSnapshot = await getDocs(applicationsQuery);
      
      const applicationsPromises = applicationsSnapshot.docs.map(async (appDoc) => {
        const appData = appDoc.data();
        
        // Get job details
        const jobDoc = await getDoc(doc(db, 'jobs', appData.jobId));
        const jobData = jobDoc.exists() ? jobDoc.data() : {};
        
        return {
          id: appDoc.id,
          ...appData,
          job: {
            id: appData.jobId,
            title: jobData.title || 'Unknown Job',
            companyName: jobData.companyName || 'Unknown Company',
            location: jobData.location || '',
            type: jobData.type || '',
          }
        };
      });
      
      const applicationsData = await Promise.all(applicationsPromises);
      
      // Sort applications by date (newest first)
      applicationsData.sort((a, b) => (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0));
      
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge-warning flex items-center"><FiClock className="mr-1" /> Pending</span>;
      case 'viewed':
        return <span className="badge-primary flex items-center"><FiEye className="mr-1" /> Viewed</span>;
      case 'rejected':
        return <span className="badge-error flex items-center"><FiX className="mr-1" /> Rejected</span>;
      case 'selected':
        return <span className="badge-success flex items-center"><FiCheck className="mr-1" /> Selected</span>;
      default:
        return <span className="badge-primary">{status}</span>;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
        <Link to="/dashboard/search-jobs" className="btn-primary">
          Find More Jobs
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 w-full"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full sm:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="form-input pl-10 w-full appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="viewed">Viewed</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't applied to any jobs yet.</p>
          <div className="mt-6">
            <Link to="/dashboard/search-jobs" className="btn-primary">
              Find Jobs to Apply
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <div key={application.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/jobs/${application.job.id}`} className="hover:text-primary-600">
                          {application.job.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600">{application.job.companyName}</p>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div>
                            <span className="font-medium">Applied:</span> {application.appliedAt ? format(new Date(application.appliedAt.seconds * 1000), 'MMM d, yyyy') : 'N/A'}
                          </div>
                          {application.job.location && (
                            <div className="flex items-center">
                              <FiMapPin className="mr-1 h-4 w-4" />
                              {application.job.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                      <div className="mb-2">
                        {renderStatusBadge(application.status)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {application.job.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="text-sm">
                        <span className="font-medium">Status:</span> {application.status === 'selected' ? 'You have been selected for this position!' : application.status === 'rejected' ? 'Your application was not selected.' : application.status === 'viewed' ? 'Your application has been reviewed.' : 'Your application is pending review.'}
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <Link to={`/jobs/${application.job.id}`} className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                          View Job Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-12 bg-white rounded-lg shadow">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No matching applications</h3>
              <p className="mt-1 text-sm text-gray-500">
                No applications match your current search filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyApplications;