import { Link } from 'react-router-dom';
import { FiBriefcase, FiSearch, FiUsers, FiCheckCircle } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Find your dream job</span>
                  <span className="block text-accent-400">or perfect candidate</span>
                </h1>
                <p className="mt-3 text-base text-white sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                   A newly launched job portal by signpost celfon.in
                  technology-connecting india's talent with their dream careers
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/jobs" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent-500 hover:bg-accent-600 md:py-4 md:text-lg md:px-10">
                      Find Jobs
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/register/employer" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      Post a Job
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 hidden lg:block">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="People working on laptops"
          />
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by thousands of companies and job seekers
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              We've helped thousands of people find their dream jobs and companies find great talent.
            </p>
          </div>
          <dl className="mt-10 text-center grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate flex items-center justify-center">
                <FiBriefcase className="mr-2 h-5 w-5 text-primary-500" />
                Active Jobs
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">5,000+</dd>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate flex items-center justify-center">
                <FiUsers className="mr-2 h-5 w-5 text-primary-500" />
                Registered Companies
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">1,500+</dd>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate flex items-center justify-center">
                <FiCheckCircle className="mr-2 h-5 w-5 text-primary-500" />
                Successful Placements
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">12,000+</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Simple steps to start your journey with JobConnect
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                  <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Create an Account</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Sign up as a job seeker or employer and complete your profile with relevant information.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                  <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Search or Post</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Job seekers can search and apply for jobs, while employers can post new job openings.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                  <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Connect and Succeed</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Employers review applications and connect with candidates to find the perfect match.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-primary-300">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/register/jobseeker" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50">
                Job Seeker
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/register/employer" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent-500 hover:bg-accent-600">
                Employer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;