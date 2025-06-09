import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiArrowLeft, FiCheck, FiX, FiEye, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ApplicantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id, currentUser]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      
      if (!id || !currentUser) return;
      
      const applicationDoc = await getDoc(doc(db, 'applications', id));
      
      if (!applicationDoc.exists()) {
        toast.error('Application not found');
        navigate('/dashboard/applications');
        return;
      }
      
      const applicationData = applicationDoc.data();
      
      // Get job details
      const jobDoc = await getDoc(doc(db, 'jobs', applicationData.jobId));
      
      if (!jobDoc.exists()) {
        toast.error('Job not found');
        navigate('/dashboard/applications');
        return;
      }
      
      const jobData = jobDoc.data();
      
      // Verify this job belongs to the current employer
      if (jobData.employerId !== currentUser.uid) {
        toast.error('You do not have permission to view this application');
        navigate('/dashboard/applications');
        return;
      }
      
      // Get jobseeker details
      const jobseekerDoc = await getDoc(doc(db, 'users', applicationData.jobseekerId));
      const jobseekerData = jobseekerDoc.exists() ? jobseekerDoc.data() : {};
      
      // Update application status to 'viewed' if it's 'pending'
      if (applicationData.status === 'pending') {
        await updateDoc(doc(db, 'applications', id), { status: 'viewed' });
        applicationData.status = 'viewed';
      }
      
      setApplication({
        id,
        ...applicationData,
        job: {
          id: jobDoc.id,
          ...jobData
        },
        jobseeker: {
          id: applicationData.jobseekerId,
          fullName: jobseekerData.fullName || 'Unknown User',
          email: jobseekerData.email || '',
          phoneNumber: jobseekerData.phoneNumber || '',
          city: jobseekerData.city || '',
          pincode: jobseekerData.pincode || '',
          location: jobseekerData.location || '',
          skills: jobseekerData.skills || [],
        }
      });
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast.error('Failed to load application details');
      navigate('/dashboard/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      
      await updateDoc(doc(db, 'applications', id), { 
        status: newStatus,
        updatedAt: new Date()
      });
      
      setApplication(prev => ({
        ...prev,
        status: newStatus
      }));
      
      toast.success(`Application marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center p-12 bg-white rounded-lg shadow">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Application not found</h3>
        <p className="mt-1 text-sm text-gray-500">The application you're looking for doesn't exist or you don't have permission to view it.</p>
        <div className="mt-6">
          <Link to="/dashboard/applications" className="btn-primary">
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => navigate('/dashboard/applications')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Application Details
        </h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {application.jobseeker.fullName}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Applied for {application.job.title}
            </p>
          </div>
          <div className="flex space-x-2">
            {application.status === 'viewed' && (
              <>
                <button
                  type="button"
                  className="btn-success flex items-center"
                  onClick={() => handleStatusChange('selected')}
                  disabled={updatingStatus}
                >
                  {updatingStatus ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FiCheck className="mr-2" />
                  )}
                  Select Candidate
                </button>
                <button
                  type="button"
                  className="btn-error flex items-center"
                  onClick={() => handleStatusChange('rejected')}
                  disabled={updatingStatus}
                >
                  {updatingStatus ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FiX className="mr-2" />
                  )}
                  Reject
                </button>
              </>
            )}
            {application.status === 'rejected' && (
              <button
                type="button"
                className="btn-success flex items-center"
                onClick={() => handleStatusChange('selected')}
                disabled={updatingStatus}
              >
                {updatingStatus ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FiCheck className="mr-2" />
                )}
                Select Candidate
              </button>
            )}
            {application.status === 'selected' && (
              <button
                type="button"
                className="btn-error flex items-center"
                onClick={() => handleStatusChange('rejected')}
                disabled={updatingStatus}
              >
                {updatingStatus ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FiX className="mr-2" />
                )}
                Reject
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Application status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {application.status === 'pending' && (
                  <span className="badge-warning">Pending</span>
                )}
                {application.status === 'viewed' && (
                  <span className="badge-primary flex items-center">
                    <FiEye className="mr-1" /> Viewed
                  </span>
                )}
                {application.status === 'selected' && (
                  <span className="badge-success flex items-center">
                    <FiCheck className="mr-1" /> Selected
                  </span>
                )}
                {application.status === 'rejected' && (
                  <span className="badge-error flex items-center">
                    <FiX className="mr-1" /> Rejected
                  </span>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Applied for</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link to={`/jobs/${application.job.id}`} className="text-primary-600 hover:text-primary-900">
                  {application.job.title}
                </Link>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Applied on</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {application.appliedAt ? format(new Date(application.appliedAt.seconds * 1000), 'MMMM d, yyyy') : 'N/A'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {application.jobseeker.fullName}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <FiMail className="mr-2 text-gray-400" />
                <a href={`mailto:${application.jobseeker.email}`} className="text-primary-600 hover:text-primary-900">
                  {application.jobseeker.email}
                </a>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <FiPhone className="mr-2 text-gray-400" />
                <a href={`tel:${application.jobseeker.phoneNumber}`} className="text-primary-600 hover:text-primary-900">
                  {application.jobseeker.phoneNumber}
                </a>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-start">
                <FiMapPin className="mr-2 text-gray-400 mt-0.5" />
                <div>
                  {application.jobseeker.city}{application.jobseeker.pincode ? `, ${application.jobseeker.pincode}` : ''}
                  {application.jobseeker.location && (
                    <p className="text-gray-500 mt-1">{application.jobseeker.location}</p>
                  )}
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Skills</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {application.jobseeker.skills && application.jobseeker.skills.length > 0 ? (
                    application.jobseeker.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No skills listed</span>
                  )}
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cover letter</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {application.coverLetter ? (
                  <p className="whitespace-pre-wrap">{application.coverLetter}</p>
                ) : (
                  <p className="text-gray-500">No cover letter provided</p>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;