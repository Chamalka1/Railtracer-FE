import React, { useState } from "react";
// import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
const Navbars = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-rail-500 font-bold text-2xl">RailTracer</span>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <a href="#features" className="border-transparent text-gray-600 hover:text-rail-500 hover:border-rail-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Features
              </a>
              <a href="#how-it-works" className="border-transparent text-gray-600 hover:text-rail-500 hover:border-rail-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                How It Works
              </a>
              <a href="#contact" className="border-transparent text-gray-600 hover:text-rail-500 hover:border-rail-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button onClick={()=>navigate('/login')} variant="outline" className="mr-4 btn btn-primary">Login</button>
            {/* <Button className="bg-rail-500 hover:bg-rail-600">Sign Up</Button> */}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rail-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="#features"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-rail-300 hover:text-rail-500"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-rail-300 hover:text-rail-500"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#contact"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-rail-300 hover:text-rail-500"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4 space-x-3">
                <button onClick={()=>navigate('/login')} variant="outline" className="w-full justify-center btn btn-primary">Login</button>
                {/* <button className="w-full justify-center bg-rail-500 hover:bg-rail-600">Sign Up</button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbars;
