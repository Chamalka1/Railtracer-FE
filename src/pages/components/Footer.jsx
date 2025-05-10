import React from 'react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-rail-800 text-white">
      <div className="section py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-5 text-white">RailTracer</div>
            <p className="text-rail-100 mb-6">
              The most reliable rail-based parcel delivery service connecting cities across the country.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a key={social} href="#" className="bg-rail-700 p-2 rounded-full hover:bg-rail-600 transition-colors">
                  <span className="sr-only">{social}</span>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Services</h3>
            <ul className="space-y-3">
              {['Parcel Delivery', 'Express Shipping', 'Bulk Freight', 'Special Handling', 'International'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-rail-100 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Press', 'Blog', 'Partners'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-rail-100 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-3 text-rail-100">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-rail-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>No 20 Michales Street, Colpetty, Sri Lanka</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-rail-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+94 (77) 123-4567</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-rail-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>contact@railtracer.com</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Subscribe to Newsletter</h3>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full focus:outline-none bg-rail-700 rounded-l-md text-white"
                />
                <button
                  type="submit"
                  className="bg-rail-500 hover:bg-rail-400 px-4 py-2 rounded-r-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-rail-700">
        <div className="section py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-rail-300 text-sm">
              &copy; {new Date().getFullYear()} RailTracer. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-rail-300 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-rail-300 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-rail-300 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;