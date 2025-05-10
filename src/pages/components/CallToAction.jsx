import React from 'react';
// import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-br from-rail-700 to-rail-900 text-white py-16">
      <div className="section relative overflow-hidden">
        {/* Abstract decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rail-600 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-rail-600 rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Shipping Experience?</h2>
            <p className="text-lg md:text-xl text-rail-100 max-w-2xl">
              Join thousands of satisfied customers who trust RailTracer for reliable, eco-friendly, and cost-effective parcel delivery.
            </p>
          </div>
          <div className="md:w-1/3 flex flex-col space-y-4 md:items-end">
            <button size="lg" className="bg-white text-rail-800 hover:bg-rail-100 w-full md:w-auto">
              Get Started Now
            </button>
            <button size="lg" variant="outline" className="text-white border-white hover:bg-rail-600 w-full md:w-auto">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;