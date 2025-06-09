import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Applications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, [currentUser]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      if (!currentUser) return;
      
      // First, get all jobs by this employer
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('employerId', '==', currentUser.uid)
      );
      
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsData = jobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setJobs(jobsData);
      
      // If no jobs, exit early
      if (jobsData.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }
      
      // Get all applications for these jobs
      const jobIds = jobsData.map(job => job.id);
      
      // We need to run separate queries for each job ID, since Firestore doesn't support array-contains-any with where-in
      const allApplications = [];
      
      for (const jobId of jobIds) {
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('jobId', '==', jobId)
        );
        
        const applicationsSnapshot = await getDocs(applicationsQuery);
        
        for (const appDoc of applicationsSnapshot.docs) {
          const appData = appDoc.data();
          
          // Get job details
          const job = jobsData.find(j => j.id === appData.jobId);
          
          // Get jobseeker details
          const jobseekerDoc = await getDoc(doc(db, 'users', appData.jobseekerId));
          const jobseekerData = jobseekerDoc.exists() ? jobseekerDoc.data() : {};
          
          allApplications.push({
            id: appDoc.id,
            ...appData,
            job: job || { title: 'Unknown Job' },
            jobseeker: {
              id: appData.jobseekerId,
              name: jobseekerData.fullName || 'Unknown User',
              email: jobseekerData.email || '',
              phone: jobseekerData.phoneNumber || '',
              city: jobseekerData.city || '',
              skills: jobseekerData.skills || [],
            }
          });
        }
      }
      
      // Sort applications by date (newest first)
      allApplications.sort((a, b) => (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0));
      
      setApplications(allApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleJobFilterChange = (e) => {
    setJobFilter(e.target.value);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.jobseeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    const matchesJob = jobFilter === 'all' || app.jobId === jobFilter;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Job Applications</h1>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 w-full"
            placeholder="Search by applicant name or job title..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="form-input pl-10 w-full appearance-none"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="viewed">Viewed</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="form-input pl-10 w-full appearance-none"
            value={jobFilter}
            onChange={handleJobFilterChange}
          >
            <option value="all">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
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
          <p className="mt-1 text-sm text-gray-500">You haven't received any job applications yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Applicant</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Job Title</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Applied Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {application.jobseeker.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{application.job.title}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {application.appliedAt ? format(new Date(application.appliedAt.seconds * 1000), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {application.status === 'pending' && (
                        <span className="badge-warning">Pending</span>
                      )}
                      {application.status === 'viewed' && (
                        <span className="badge-primary">Viewed</span>
                      )}
                      {application.status === 'selected' && (
                        <span className="badge-success">Selected</span>
                      )}
                      {application.status === 'rejected' && (
                        <span className="badge-error">Rejected</span>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        to={`/dashboard/applications/${application.id}`}
                        className="text-primary-600 hover:text-primary-900 flex items-center justify-end"
                      >
                        <FiEye className="h-5 w-5 mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-3 py-4 text-sm text-center text-gray-500">
                    No applications matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applications;