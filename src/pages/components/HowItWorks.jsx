import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Register & Log In",
      description: "Create your account with a few simple steps and start using RailTracer services immediately."
    },
    {
      number: "02",
      title: "Schedule Your Shipment",
      description: "Select origin, destination, and preferred delivery date for your parcel through our easy-to-use interface."
    },
    {
      number: "03",
      title: "Drop Off or Request Pickup",
      description: "Drop your package at the nearest rail station or request a pickup from your location."
    },
    {
      number: "04",
      title: "Track in Real-Time",
      description: "Monitor your parcel's journey with real-time tracking and receive notifications at each milestone."
    }
  ];

  return (
    <section id="how-it-works" className="bg-rail-50 py-24">
      <div className="section">
        <h2 className="section-title text-center">How <span className="text-rail-500">RailTracer</span> Works</h2>
        <p className="section-subtitle text-center mx-auto max-w-3xl">
          Shipping your parcels via rail has never been easier. Follow these simple steps to get started.
        </p>
        
        <div className="mt-16">
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-rail-200 -translate-x-1/2 z-0"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 mb-12 md:mb-24">
                <div className={`flex flex-col md:flex-row md:items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Step number bubble - always centered on mobile, alternating sides on desktop */}
                  <div className="mx-auto md:mx-0 flex-shrink-0 flex items-center justify-center w-16 h-16 bg-white rounded-full border-4 border-rail-300 text-rail-800 font-bold text-xl mb-4 md:mb-0">
                    {step.number}
                  </div>
                  
                  {/* Content - always below on mobile, alternating sides on desktop with appropriate spacing */}
                  <div className={`bg-white rounded-lg shadow-lg p-6 md:p-8 md:w-5/12 ${
                    index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'
                  }`}>
                    <h3 className="text-xl font-bold text-rail-800 mb-3">{step.title}</h3>
                    <p className="text-track-500">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <button className="btn-primary">Start Shipping Today</button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
