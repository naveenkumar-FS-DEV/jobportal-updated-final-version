import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiSave, FiX, FiPlus, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { userData, userRole, currentUser } = useAuth();
  const [formData, setFormData] = useState({});
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        // Common fields
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        city: userData.city || '',
        pincode: userData.pincode || '',
        
        // Jobseeker fields
        fullName: userData.fullName || '',
        location: userData.location || '',
        
        // Employer fields
        companyName: userData.companyName || '',
        companySize: userData.companySize || '',
        address: userData.address || '',
      });
      
      setSkills(userData.skills || []);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Prepare data based on user role
      const updateData = { ...formData };
      
      if (userRole === 'jobseeker') {
        updateData.skills = skills;
      }
      
      await updateDoc(userRef, updateData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderJobseekerForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input pl-10"
              value={formData.fullName || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input pl-10"
              value={formData.email || ''}
              disabled
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="form-input pl-10"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="city" className="form-label">City</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="city"
              name="city"
              className="form-input pl-10"
              value={formData.city || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="pincode" className="form-label">Pincode</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="pincode"
              name="pincode"
              className="form-input pl-10"
              value={formData.pincode || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="sm:col-span-2">
          <label htmlFor="location" className="form-label">Full Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              className="form-input pl-10"
              value={formData.location || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="form-label">Skills</label>
        <div className="mt-1">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {skill}
                  {isEditing && (
                    <button
                      type="button"
                      className="ml-2 text-primary-600 hover:text-primary-800"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No skills added yet.</p>
          )}
        </div>
        
        {isEditing && (
          <div className="mt-2 flex">
            <input
              type="text"
              className="form-input flex-1"
              placeholder="Add a skill (e.g., JavaScript, Project Management)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button
              type="button"
              className="ml-2 btn-outline flex items-center"
              onClick={handleAddSkill}
            >
              <FiPlus className="h-5 w-5 mr-1" /> Add
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderEmployerForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="companyName" className="form-label">Company Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiBriefcase className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="form-input pl-10"
              value={formData.companyName || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input pl-10"
              value={formData.email || ''}
              disabled
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="form-input pl-10"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="companySize" className="form-label">Company Size</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUsers className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="companySize"
              name="companySize"
              className="form-input pl-10"
              value={formData.companySize || ''}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="" disabled>Select Company Size</option>
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="201-500 employees">201-500 employees</option>
              <option value="501-1000 employees">501-1000 employees</option>
              <option value="1001+ employees">1001+ employees</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="city" className="form-label">City</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="city"
              name="city"
              className="form-input pl-10"
              value={formData.city || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="pincode" className="form-label">Pincode</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="pincode"
              name="pincode"
              className="form-input pl-10"
              value={formData.pincode || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="sm:col-span-2">
          <label htmlFor="address" className="form-label">Full Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input pl-10"
              value={formData.address || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input pl-10"
              value={formData.email || ''}
              disabled
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="role" className="form-label">Role</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="role"
              name="role"
              className="form-input pl-10"
              value="Administrator"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        {!isEditing ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              type="button"
              className="btn-outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary flex items-center"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            {userRole === 'jobseeker' && renderJobseekerForm()}
            {userRole === 'employer' && renderEmployerForm()}
            {userRole === 'admin' && renderAdminForm()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;