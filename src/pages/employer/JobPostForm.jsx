import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/config';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const JobPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    type: 'Full-time',
    location: '',
    salary: '',
    experience: '',
    deadline: '',
  });

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Temporary'
  ];

  const experienceLevels = [
    'Entry Level',
    '1-2 Years',
    '3-5 Years',
    '5-8 Years',
    '8+ Years',
    'Senior Level'
  ];

  // Fetch job data if in edit mode
  useEffect(() => {
    const fetchJobData = async () => {
      if (id) {
        try {
          setLoading(true);
          const jobDoc = await getDoc(doc(db, 'jobs', id));
          
          if (!jobDoc.exists()) {
            toast.error('Job not found');
            navigate('/dashboard/manage-jobs');
            return;
          }
          
          const jobData = jobDoc.data();
          
          // Verify this job belongs to the current employer
          if (jobData.employerId !== currentUser.uid) {
            toast.error('You do not have permission to edit this job');
            navigate('/dashboard/manage-jobs');
            return;
          }
          
          // Format deadline for input field
          let formattedDeadline = '';
          if (jobData.deadline) {
            const deadlineDate = new Date(jobData.deadline.seconds * 1000);
            formattedDeadline = deadlineDate.toISOString().split('T')[0];
          }
          
          setFormData({
            title: jobData.title || '',
            description: jobData.description || '',
            requirements: jobData.requirements || '',
            type: jobData.type || 'Full-time',
            location: jobData.location || '',
            salary: jobData.salary || '',
            experience: jobData.experience || '',
            deadline: formattedDeadline,
          });
        } catch (error) {
          console.error('Error fetching job:', error);
          toast.error('Failed to load job data');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchJobData();
  }, [id, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['title', 'description', 'requirements', 'type', 'location'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const jobData = {
        ...formData,
        employerId: currentUser.uid,
        companyName: userData.companyName,
        deadline: formData.deadline ? new Date(formData.deadline) : null,
      };
      
      if (id) {
        // Update existing job
        const jobRef = doc(db, 'jobs', id);
        await updateDoc(jobRef, {
          ...jobData,
          updatedAt: serverTimestamp(),
        });
        
        toast.success('Job updated successfully');
      } else {
        // Create new job
        await addDoc(collection(db, 'jobs'), {
          ...jobData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        toast.success('Job posted successfully');
      }
      
      navigate('/dashboard/manage-jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard/manage-jobs')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {id ? 'Edit Job' : 'Post a New Job'}
          </h1>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="form-label">Job Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  placeholder="e.g., Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label htmlFor="type" className="form-label">Job Type</label>
                  <select
                    id="type"
                    name="type"
                    className="form-input"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-input"
                    placeholder="e.g., New York, NY or Remote"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="salary" className="form-label">Salary Range (Optional)</label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    className="form-input"
                    placeholder="e.g., $80,000 - $100,000"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="experience" className="form-label">Experience Level</label>
                  <select
                    id="experience"
                    name="experience"
                    className="form-input"
                    value={formData.experience}
                    onChange={handleChange}
                  >
                    <option value="">Select Experience Level</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="deadline" className="form-label">Application Deadline (Optional)</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    className="form-input"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="form-label">Job Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  className="form-input"
                  placeholder="Describe the role, responsibilities, and company culture..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="requirements" className="form-label">Requirements & Qualifications</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={4}
                  className="form-input"
                  placeholder="List the skills, qualifications, and experience required..."
                  value={formData.requirements}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/manage-jobs')}
                  className="btn-outline mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                        <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {id ? 'Updating Job...' : 'Posting Job...'}
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      {id ? 'Update Job' : 'Post Job'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostForm;