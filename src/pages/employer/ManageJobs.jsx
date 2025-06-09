import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, doc, deleteDoc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ManageJobs = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteJob, setDeleteJob] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [applications, setApplications] = useState({});

  useEffect(() => {
    fetchJobs();
  }, [currentUser]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      if (!currentUser) return;
      
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('employerId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsData = jobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setJobs(jobsData);
      
      // Fetch application counts for each job
      const applicationCounts = {};
      for (const job of jobsData) {
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('jobId', '==', job.id)
        );
        const applicationsSnapshot = await getDocs(applicationsQuery);
        applicationCounts[job.id] = applicationsSnapshot.size;
      }
      
      setApplications(applicationCounts);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openDeleteModal = (job) => {
    setDeleteJob(job);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteJob(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteJob) return;
    
    try {
      // Check if there are applications for this job
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('jobId', '==', deleteJob.id)
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);
      
      if (!applicationsSnapshot.empty) {
        // Delete all applications for this job
        const deletePromises = applicationsSnapshot.docs.map(appDoc => 
          deleteDoc(doc(db, 'applications', appDoc.id))
        );
        await Promise.all(deletePromises);
      }
      
      // Delete the job
      await deleteDoc(doc(db, 'jobs', deleteJob.id));
      
      toast.success('Job deleted successfully');
      
      // Update the local state
      setJobs(jobs.filter(job => job.id !== deleteJob.id));
      
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Jobs</h1>
        <Link to="/dashboard/post-job" className="btn-primary flex items-center">
          <FiPlus className="mr-2" /> Post a Job
        </Link>
      </div>
      
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="form-input pl-10"
          placeholder="Search jobs by title, location, or type..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <FiPlus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs posted yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new job posting.</p>
          <div className="mt-6">
            <Link to="/dashboard/post-job" className="btn-primary">
              Post a Job
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Job Title</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Posted</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Applications</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {job.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.type}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.location}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {job.createdAt ? format(new Date(job.createdAt.seconds * 1000), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <Link 
                        to="/dashboard/applications" 
                        className="text-primary-600 hover:text-primary-900"
                      >
                        {applications[job.id] || 0} applications
                      </Link>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end space-x-3">
                        <Link to={`/jobs/${job.id}`} className="text-gray-600 hover:text-gray-900">
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <Link to={`/dashboard/edit-job/${job.id}`} className="text-primary-600 hover:text-primary-900">
                          <FiEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(job)}
                          className="text-error-600 hover:text-error-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-3 py-4 text-sm text-center text-gray-500">
                    No jobs matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiTrash2 className="h-6 w-6 text-error-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Job</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the job "{deleteJob?.title}"? This action cannot be undone and will also delete all applications received for this job.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 text-base font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;