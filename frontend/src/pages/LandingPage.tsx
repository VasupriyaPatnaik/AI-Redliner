import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, FileText, Clock, Shield, Sparkles, Sun, Moon } from 'lucide-react';
import Logo from '../components/Logo';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Logo size="medium" />
            </div>
            
            <nav className="hidden md:flex space-x-10">
              <a href="#features" className="text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Features
              </a>
              <a href="#how-it-works" className="text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                How It Works
              </a>
              <a href="#testimonials" className="text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Testimonials
              </a>
            </nav>
            
            <div className="flex items-center justify-end md:flex-1 lg:w-0">
              <button
                className="mr-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-6 w-6\" aria-hidden="true" />
                ) : (
                  <Moon className="h-6 w-6\" aria-hidden="true" />
                )}
              </button>
              <Link
                to="/dashboard"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 bg-gray-50 dark:bg-gray-900 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                      <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                        <span className="block xl:inline">Transform Legal Review</span>{' '}
                        <span className="block text-red-500 xl:inline">with AI Precision</span>
                      </h1>
                      <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                        AI Redliner turns days of manual document review into minutes. Upload your 
                        playbooks and documents, and let our AI handle the rest. Get instant 
                        redlining with highlighted conflicts, gaps, and actionable insights.
                      </p>
                      <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                          Accelerate compliance checks by up to 90%
                        </p>
                        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                          <div className="rounded-md shadow">
                            <Link
                              to="/dashboard"
                              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                            >
                              Get Started
                            </Link>
                          </div>
                          <div className="mt-3 sm:mt-0 sm:ml-3">
                            <a
                              href="#how-it-works"
                              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                            >
                              Learn More
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Legal documents being reviewed"
            />
          </div>
        </div>

        {/* Features */}
        <div id="features" className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                A better way to review legal documents
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
                Stop spending countless hours on manual review. Let AI do the heavy lifting.
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <FileText className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Instant Document Analysis</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                    Upload any document and receive detailed analysis with conflicts, gaps, and recommendations highlighted automatically.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <Clock className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">90% Time Savings</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                    What used to take days now takes minutes. Accelerate your workflow and focus on high-value tasks instead of manual review.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <Shield className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Error Reduction</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                    Eliminate nearly 100% of manual misses with AI-powered analysis that catches every inconsistency and compliance issue.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <Sparkles className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Custom Playbooks</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                    Create and store your own playbooks with defined rules that reflect your organization's specific compliance requirements.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">How It Works</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Three simple steps to transform your workflow
              </p>
            </div>

            <div className="mt-16">
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div className="relative">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mx-auto">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white text-center">Upload Your Playbooks</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300 text-center">
                    Define your rules and requirements in playbooks that will serve as the foundation for document analysis.
                  </p>
                </div>

                <div className="mt-10 lg:mt-0 relative">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mx-auto">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white text-center">Submit Documents</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300 text-center">
                    Upload any contract or policy document that needs to be analyzed against your playbooks.
                  </p>
                </div>

                <div className="mt-10 lg:mt-0 relative">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mx-auto">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white text-center">Review AI Analysis</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300 text-center">
                    Receive instant results with redlined conflicts, highlighted gaps, and actionable recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div id="testimonials" className="bg-white dark:bg-gray-800 pt-16 lg:py-24">
          <div className="pb-16 bg-primary-600 lg:pb-0 lg:z-10 lg:relative">
            <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="relative lg:-my-8">
                <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:p-0 lg:h-full">
                  <div className="aspect-w-10 aspect-h-6 rounded-xl shadow-xl overflow-hidden sm:aspect-w-16 sm:aspect-h-7 lg:aspect-none lg:h-full">
                    <img
                      className="object-cover lg:h-full lg:w-full"
                      src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Legal professional working"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:m-0 lg:col-span-2 lg:pl-8">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:px-0 lg:py-20 lg:max-w-none">
                  <blockquote>
                    <div>
                      <svg
                        className="h-12 w-12 text-white opacity-25"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="mt-6 text-2xl font-medium text-white">
                        "AI Redliner has revolutionized how our legal team handles contract review. What used to take us days now takes minutes, with better accuracy and consistency. It's a game-changer for our compliance workflow."
                      </p>
                    </div>
                    <footer className="mt-6">
                      <p className="text-base font-medium text-white">Sarah Johnson</p>
                      <p className="text-base font-medium text-primary-100">General Counsel, Fortune 500 Company</p>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              <span className="block">Ready to transform your legal workflow?</span>
              <span className="block text-primary-600">Start using AI Redliner today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Get started
                  <ArrowRight className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <Logo size="medium" />
              <p className="text-gray-400 text-base">
                Making legal document review faster, more accurate, and stress-free with the power of AI.
              </p>
              <div className="flex space-x-6">
                {/* Social links would go here */}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Product</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Security
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Guides
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Press
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Terms
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2025 AI Redliner. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;