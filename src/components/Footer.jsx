import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Signpost4jobs</h3>
            <p className="text-gray-300 text-sm">
              Connecting talented professionals with great companies. Find your dream job or the perfect candidate today.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              For Job Seekers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-gray-300 hover:text-white text-sm">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register/jobseeker" className="text-gray-300 hover:text-white text-sm">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white text-sm">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              For Employers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register/employer" className="text-gray-300 hover:text-white text-sm">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/register/employer" className="text-gray-300 hover:text-white text-sm">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white text-sm">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <FiTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FiLinkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FiGithub className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FiInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            &copy; {currentYear} JobConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;