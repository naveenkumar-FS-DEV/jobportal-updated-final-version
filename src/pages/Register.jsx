import { Link } from 'react-router-dom';
import { FiBriefcase, FiUser } from 'react-icons/fi';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Choose account type</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Link 
              to="/register/jobseeker" 
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-300"
            >
              <div className="bg-primary-100 rounded-full p-4">
                <FiUser className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Job Seeker</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Looking for a job? Create an account to search and apply for jobs
              </p>
              <span className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Create a Job Seeker Account
              </span>
            </Link>
            
            <Link 
              to="/register/employer" 
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-accent-500 hover:bg-accent-50 transition-all duration-300"
            >
              <div className="bg-accent-100 rounded-full p-4">
                <FiBriefcase className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Employer</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Looking to hire? Create an account to post jobs and find candidates
              </p>
              <span className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                Create an Employer Account
              </span>
            </Link>
          </div>
          
          <div className="text-sm text-center text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;