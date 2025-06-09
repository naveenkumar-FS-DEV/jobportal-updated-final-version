import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiSearch, FiFilter, FiMapPin, FiBriefcase, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ReactPaginate from 'react-paginate';

const JOBS_PER_PAGE = 10;

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastDoc, setLastDoc] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      let jobsQuery;
      if (currentPage === 0) {
        jobsQuery = query(
          collection(db, 'jobs'),
          orderBy('createdAt', 'desc'),
          limit(JOBS_PER_PAGE)
        );
      } else {
        jobsQuery = query(
          collection(db, 'jobs'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(JOBS_PER_PAGE)
        );
      }
      
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsData = jobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Get total count for pagination
      const totalQuery = query(collection(db, 'jobs'));
      const totalSnapshot = await getDocs(totalQuery);
      const totalPages = Math.ceil(totalSnapshot.size / JOBS_PER_PAGE);
      
      setPageCount(totalPages);
      setLastDoc(jobsSnapshot.docs[jobsSnapshot.docs.length - 1]);
      
      // Extract unique locations and job types for filtering
      // Use Set to ensure uniqueness and convert back to array
      const uniqueLocations = [...new Set(jobsData.map(job => job.location?.trim()))].filter(Boolean);
      const uniqueTypes = [...new Set(jobsData.map(job => job.type?.trim()))].filter(Boolean);
      
      setLocations(uniqueLocations.sort());
      setTypes(uniqueTypes.sort());
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    
    const matchesLocation = locationFilter === 'all' || job.location === locationFilter;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Available Jobs
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Find the perfect job for your skills and career goals
        </p>
      </div>
      
      <div className="mb-10 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10 w-full"
              placeholder="Search jobs by title, company, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-2/5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBriefcase className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="form-input pl-10 w-full appearance-none"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Job Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="form-input pl-10 w-full appearance-none"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          <Link to={`/jobs/${job.id}`} className="hover:text-primary-600">
                            {job.title}
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-3">{job.companyName}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 sm:ml-4 flex flex-col sm:items-end">
                        <span className="badge-primary mb-2">{job.type}</span>
                        {job.salary && (
                          <span className="text-sm text-gray-600">{job.salary}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-500 mt-2 mb-4">
                      <div className="flex items-center mr-4 mb-2">
                        <FiMapPin className="mr-1 h-4 w-4" />
                        {job.location}
                      </div>
                      {job.experience && (
                        <div className="flex items-center mr-4 mb-2">
                          <FiBriefcase className="mr-1 h-4 w-4" />
                          {job.experience}
                        </div>
                      )}
                      <div className="flex items-center mb-2">
                        <FiClock className="mr-1 h-4 w-4" />
                        Posted {job.createdAt ? format(new Date(job.createdAt.seconds * 1000), 'MMM d, yyyy') : 'Recently'}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="flex justify-end">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="btn-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || typeFilter !== 'all' || locationFilter !== 'all'
                    ? 'Try adjusting your search filters to find more jobs.'
                    : 'There are no job listings available at the moment.'}
                </p>
              </div>
            )}
          </div>
          
          {pageCount > 1 && (
            <div className="mt-8">
              <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName="flex justify-center space-x-2"
                pageClassName="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                previousClassName="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                nextClassName="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                activeClassName="bg-primary-50 border-primary-500 text-primary-600"
                disabledClassName="opacity-50 cursor-not-allowed"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobListing;