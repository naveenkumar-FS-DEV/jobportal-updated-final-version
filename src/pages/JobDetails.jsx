import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiArrowLeft, FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole, userData } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id, currentUser]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      
      if (!id) return;
      
      const jobDoc = await getDoc(doc(db, 'jobs', id));
      
      if (!jobDoc.exists()) {
        toast.error('Job not found');
        navigate('/jobs');
        return;
      }
      
      const jobData = jobDoc.data();
      setJob({
        id,
        ...jobData
      });
      
      // Check if user has already applied to this job
      if (currentUser && userRole === 'jobseeker') {
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('jobId', '==', id),
          where('jobseekerId', '==', currentUser.uid)
        );
        
        const applicationsSnapshot = await getDocs(applicationsQuery);
        setHasApplied(!applicationsSnapshot.empty);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!currentUser) {
      toast.error('Please sign in to apply for jobs');
      navigate('/login');
      return;
    }
    
    if (userRole !== 'jobseeker') {
      toast.error('Only jobseekers can apply for jobs');
      return;
    }
    
    try {
      setApplying(true);
      
      // Create application
      await addDoc(collection(db, 'applications'), {
        jobId: id,
        jobseekerId: currentUser.uid,
        status: 'pending',
        appliedAt: new Date(),
        coverLetter: coverLetter.trim(),
      });
      
      toast.success('Application submitted successfully');
      setHasApplied(true);
      setCoverLetter('');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Job not found</h3>
          <p className="mt-1 text-sm text-gray-500">The job you're looking for doesn't exist or has been removed.</p>
          <div className="mt-6">
            <Link to="/jobs" className="btn-primary">
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2 h-5 w-5" />
          Back to Jobs
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="mt-1 text-lg text-gray-600">{job.companyName}</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <span className="badge-primary text-sm">{job.type}</span>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FiMapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700">{job.location}</span>
            </div>
            
            {job.salary && (
              <div className="flex items-center">
                <FiDollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">{job.salary}</span>
              </div>
            )}
            
            {job.experience && (
              <div className="flex items-center">
                <FiBriefcase className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">{job.experience}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <FiClock className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700">
                Posted {job.createdAt ? format(new Date(job.createdAt.seconds * 1000), 'MMMM d, yyyy') : 'Recently'}
              </span>
            </div>
            
            {job.deadline && (
              <div className="flex items-center">
                <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">
                  Apply before {format(new Date(job.deadline.seconds * 1000), 'MMMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Job Description</h2>
          <div className="text-gray-700 prose max-w-none">
            <p className="whitespace-pre-line">{job.description}</p>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Requirements & Qualifications</h2>
          <div className="text-gray-700 prose max-w-none">
            <p className="whitespace-pre-line">{job.requirements}</p>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          {!currentUser ? (
            <div className="text-center">
              <p className="mb-4 text-gray-700">Sign in to apply for this job</p>
              <div className="flex justify-center space-x-4">
                <Link to="/login" className="btn-primary">
                  Sign In
                </Link>
                <Link to="/register/jobseeker" className="btn-outline">
                  Create Account
                </Link>
              </div>
            </div>
          ) : userRole === 'jobseeker' ? (
            hasApplied ? (
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <div className="flex justify-center">
                  <FiCheckCircle className="h-12 w-12 text-success-500 mb-2" />
                </div>
                <h3 className="text-lg font-medium text-success-800">Application Submitted</h3>
                <p className="text-success-700 mt-1">You have already applied for this job.</p>
                <div className="mt-4">
                  <Link to="/dashboard/my-applications" className="btn-primary">
                    View My Applications
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Apply for this Job</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      id="coverLetter"
                      rows={6}
                      className="form-input"
                      placeholder="Introduce yourself and explain why you're a good fit for this position..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="btn-primary flex items-center"
                      onClick={handleApply}
                      disabled={applying}
                    >
                      {applying ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                            <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : userRole === 'employer' && job.employerId === currentUser.uid ? (
            <div className="flex justify-between items-center">
              <p className="text-gray-700">You posted this job</p>
              <Link to="/dashboard/manage-jobs" className="btn-primary">
                Manage Your Jobs
              </Link>
            </div>
          ) : (
            <p className="text-center text-gray-700">Only jobseekers can apply for jobs</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;