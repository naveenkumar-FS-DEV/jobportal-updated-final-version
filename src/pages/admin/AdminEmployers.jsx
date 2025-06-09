import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiCheck, FiX, FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const employersQuery = query(collection(db, 'users'), where('role', '==', 'employer'));
      const employersSnapshot = await getDocs(employersQuery);
      
      const employersData = employersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setEmployers(employersData);
    } catch (error) {
      console.error('Error fetching employers:', error);
      toast.error('Failed to load employers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (employerId, newStatus) => {
    try {
      setProcessingId(employerId);
      
      const employerRef = doc(db, 'users', employerId);
      await updateDoc(employerRef, { status: newStatus });
      
      // Update local state
      setEmployers(employers.map(employer => 
        employer.id === employerId ? { ...employer, status: newStatus } : employer
      ));
      
      toast.success(`Employer ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating employer status:', error);
      toast.error('Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = 
      employer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Employers</h1>
      
      <div className="mb-6 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 w-full"
            placeholder="Search by company, email, or city..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Company</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Size</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredEmployers.length > 0 ? (
                filteredEmployers.map((employer) => (
                  <tr key={employer.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {employer.companyName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employer.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employer.phoneNumber}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employer.city}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employer.companySize}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {employer.status === 'pending' && (
                        <span className="badge-warning">Pending</span>
                      )}
                      {employer.status === 'approved' && (
                        <span className="badge-success">Approved</span>
                      )}
                      {employer.status === 'rejected' && (
                        <span className="badge-error">Rejected</span>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {employer.status === 'pending' && (
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleStatusChange(employer.id, 'approved')}
                            className="text-success-600 hover:text-success-900 flex items-center"
                            disabled={processingId === employer.id}
                          >
                            {processingId === employer.id ? (
                              <svg className="animate-spin h-4 w-4 mr-1\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                                <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <FiCheck className="h-5 w-5 mr-1" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(employer.id, 'rejected')}
                            className="text-error-600 hover:text-error-900 flex items-center"
                            disabled={processingId === employer.id}
                          >
                            {processingId === employer.id ? (
                              <svg className="animate-spin h-4 w-4 mr-1\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                                <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <FiX className="h-5 w-5 mr-1" />
                            )}
                            Reject
                          </button>
                        </div>
                      )}
                      {employer.status === 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(employer.id, 'approved')}
                          className="text-success-600 hover:text-success-900 flex items-center"
                          disabled={processingId === employer.id}
                        >
                          {processingId === employer.id ? (
                            <svg className="animate-spin h-4 w-4 mr-1\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                              <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <FiCheck className="h-5 w-5 mr-1" />
                          )}
                          Approve
                        </button>
                      )}
                      {employer.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange(employer.id, 'rejected')}
                          className="text-error-600 hover:text-error-900 flex items-center"
                          disabled={processingId === employer.id}
                        >
                          {processingId === employer.id ? (
                            <svg className="animate-spin h-4 w-4 mr-1\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                              <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <FiX className="h-5 w-5 mr-1" />
                          )}
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No employers found matching your search criteria.' 
                      : 'No employers registered yet.'}
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

export default AdminEmployers;