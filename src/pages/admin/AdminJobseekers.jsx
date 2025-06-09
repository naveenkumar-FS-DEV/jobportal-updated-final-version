import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminJobseekers = () => {
  const [jobseekers, setJobseekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchJobseekers();
  }, []);

  const fetchJobseekers = async () => {
    try {
      setLoading(true);
      const jobseekersQuery = query(collection(db, 'users'), where('role', '==', 'jobseeker'));
      const jobseekersSnapshot = await getDocs(jobseekersQuery);
      
      const jobseekersData = jobseekersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Extract unique cities for filtering
      const uniqueCities = [...new Set(jobseekersData.map(j => j.city).filter(Boolean))];
      setCities(uniqueCities.sort());
      
      setJobseekers(jobseekersData);
    } catch (error) {
      console.error('Error fetching jobseekers:', error);
      toast.error('Failed to load jobseekers');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobseekers = jobseekers.filter(jobseeker => {
    const matchesSearch = 
      jobseeker.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobseeker.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobseeker.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCity = cityFilter === 'all' || jobseeker.city === cityFilter;
    
    return matchesSearch && matchesCity;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Jobseekers</h1>
      
      <div className="mb-6 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 w-full"
            placeholder="Search by name, email, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="form-input pl-10 w-full appearance-none"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Skills</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredJobseekers.length > 0 ? (
                filteredJobseekers.map((jobseeker) => (
                  <tr key={jobseeker.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {jobseeker.fullName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{jobseeker.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{jobseeker.phoneNumber}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{jobseeker.city}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {jobseeker.skills && jobseeker.skills.length > 0 ? (
                          jobseeker.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400">No skills listed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-sm text-gray-500">
                    {searchTerm || cityFilter !== 'all' 
                      ? 'No jobseekers found matching your search criteria.' 
                      : 'No jobseekers registered yet.'}
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

export default AdminJobseekers;