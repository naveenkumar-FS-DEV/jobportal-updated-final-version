import { Link } from 'react-router-dom';
// Removed react-icons import as it caused a compilation error.
// Using inline SVG icons instead for better compatibility.

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white font-inter">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Signpost4jobs</h3>
            <p className="text-gray-300 text-sm">
              Connecting talented professionals with great companies. Find your dream job or the perfect candidate today.
            </p>
          </div>

          {/* For Job Seekers */}
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

          {/* For Employers */}
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

          {/* Connect With Us / Contact Info */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-4">
              {/* Twitter Icon (FiTwitter equivalent) */}
              <a href="#" className="text-gray-300 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.7 5 4.9 9 5.1 0-.4 0-.8.1-1.2C12.4 8.2 13.9 6.8 15.6 5.6 18.2 4.2 20.7 4 22 4Z" />
                </svg>
              </a>
              {/* LinkedIn Icon (FiLinkedin equivalent) */}
              <a href="#" className="text-gray-300 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* GitHub Icon (FiGithub equivalent) */}
              <a href="#" className="text-gray-300 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3.5 0 4.3-2.2 4.3-5.2 0-1.1-.2-2.3-.7-3.4 0 0-1.4 0-4.3 1.3A9.2 9.2 0 0 0 12 5.8c-1 .2-2 .5-3 1-2.9-1.3-4.3-1.3-4.3-1.3-.5 1.1-.7 2.3-.7 3.4 0 3 0 4.8 4.3 5.2a4.8 4.8 0 0 0-1 3.2v4" />
                  <path d="M9 18c-3.1 0-4.3-3.2-4.3-5.2s1.4-5.2 4.3-5.2c2.9 0 4.3 2.2 4.3 5.2s-1.4 5.2-4.3 5.2Z" />
                </svg>
              </a>
              {/* Instagram Icon (FiInstagram equivalent) */}
              <a href="#" className="text-gray-300 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.5" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>

            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2">
              Contact Information
            </h3>
            <p className="text-gray-300 text-sm">
              Signpost Celfon.in Technology
            </p>
            <p className="text-gray-300 text-sm mt-1">
              46, SIGNPOST TOWERS, FIRST FLOOR, SIDCO INDUSTRIAL ESTATE, TAMIL NADU, COIMBATORE - 641 021.
            </p>
            <p className="text-gray-300 text-sm mt-1">
              <b>Phone:</b> 95145 55132
            </p>
            <p className="text-gray-300 text-sm mt-1">
              <b>Email:</b> drshivakumaarj.md@signpostphonebook.in
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            &copy; {currentYear} Signpost4jobs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
