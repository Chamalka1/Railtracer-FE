import React from "react";
// import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
import heroImage from "../../Assets/firstslide.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-white to-rail-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
      <div className="railroad-track absolute bottom-0 w-full"></div>
      <div className="section flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-rail-800 leading-tight mb-6">
            Ship Your Parcels <span className="text-rail-500">Fast & Secure</span> by Train
          </h1>
          <p className="text-lg md:text-xl text-track-500 mb-8 max-w-lg">
            RailTracer provides an efficient, eco-friendly, and reliable way to send your parcels across the country. Track in real-time and manage your shipments with ease.
          </p>
          <div className="flex flex-wrap gap-4">
            {/* <button size="lg" className="bg-rail-500 hover:bg-rail-600 btn btn-primary">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </button> */}
            <button onClick={()=>navigate('/track')} size="lg" variant="outline" className="btn btn-primary">
              Track Parcel
            </button>
          </div>
          <div className="mt-8 flex items-center space-x-4 text-sm text-track-500">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-signal-green mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-signal-green mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure Shipping</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-signal-green mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>24/7 Tracking</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 z-10 animate-slide-in-right">
          <div className="relative">
            <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-xl font-bold text-rail-800">Parcel Tracking</div>
                  <div className="text-sm text-track-400">Enter your tracking number</div>
                </div>
                <div className="bg-rail-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rail-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h5"/>
                    <path d="M13 22V7"/>
                    <path d="m16 22 5-5"/>
                    <path d="m16 17 5 5"/>
                    <path d="m7 12 3 3 3-3"/>
                  </svg>
                </div>
              </div>
              <div className="border border-gray-200 rounded overflow-hidden flex mb-4">
                <input type="text" className="flex-1 py-2 px-4 outline-none text-track-800" placeholder="Enter tracking number..." />
                <button className="bg-rail-500 text-white px-4 font-medium">Track</button>
              </div>
              <div className="text-xs text-track-400 italic">Example: RT-12345678-XYZ</div>
              
              <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                <div className="text-sm font-semibold text-rail-800 mb-4">Popular Routes</div>
                <div className="space-y-3">
                  {[
                    { from: "Galle", to: "Colombo" },
                    { from: "Colombo", to: "Kandy" },
                    { from: "Jaffna", to: "Anuradhapura" },
                  ].map((route, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-rail-300 rounded-full mr-2"></div>
                        <span>{route.from}</span>
                      </div>
                      <div className="border-t border-dotted border-gray-300 flex-1 mx-2"></div>
                      <div>{route.to}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full bg-rail-200 rounded-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Train animation at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden h-6">
        <div className="animate-train-move">
          <div className="flex items-center">
            <div className="bg-rail-700 h-4 w-8 rounded-r-md"></div>
            <div className="bg-rail-600 h-5 w-6 rounded-sm"></div>
            <div className="bg-rail-500 h-6 w-12 rounded-md flex items-center justify-center">
              <div className="bg-yellow-400 h-2 w-2 rounded-full"></div>
            </div>
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-rail-400 h-5 w-10 rounded-sm ml-1 flex items-center justify-center">
                <div className="bg-rail-200 h-2 w-4 rounded-sm"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
