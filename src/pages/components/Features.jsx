import React from 'react';
import { Package, MessageSquare, Calendar, MapPin } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Package className="h-8 w-8 text-rail-500" />,
      title: "Parcel Management",
      description: "Easily manage all your parcels in one place. Send, receive, and track packages across the rail network with real-time updates."
    },
    {
      icon: <MapPin className="h-8 w-8 text-rail-500" />,
      title: "Real-time Tracking",
      description: "Track your parcels in real-time with accurate GPS positioning, estimated arrival times, and transit notifications."
    },
    {
      icon: <Calendar className="h-8 w-8 text-rail-500" />,
      title: "Schedule Management",
      description: "Access train schedules, plan your shipments, and receive alerts about any changes or delays that might affect your parcels."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-rail-500" />,
      title: "Complaint Management",
      description: "Easily submit and track complaints or inquiries. Our customer service team will respond promptly to resolve any issues."
    }
  ];

  return (
    <section id="features" className="bg-white py-24">
      <div className="section">
        <h2 className="section-title text-center">Powerful Features for <span className="text-rail-500">Seamless Shipping</span></h2>
        <p className="section-subtitle text-center mx-auto max-w-3xl">
          RailTracer provides everything you need to manage your rail-based shipments efficiently and confidently.
        </p>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card group hover:-translate-y-2"
            >
              <div className="bg-rail-50 inline-flex p-4 rounded-full mb-6 group-hover:bg-rail-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-rail-800 mb-3">{feature.title}</h3>
              <p className="text-track-500">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-rail-50 to-rail-100 rounded-xl p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h3 className="text-2xl font-bold text-rail-800 mb-4">Stats That Matter</h3>
              <p className="text-track-500 mb-6">Our rail-based shipping network provides excellent service across the country.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: "99.8%", label: "On-Time Delivery" },
                  { value: "350+", label: "Cities Served" },
                  { value: "3.2M+", label: "Parcels Monthly" },
                  { value: "24/7", label: "Support" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-rail-600">{stat.value}</div>
                    <div className="text-sm text-track-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/3 flex justify-center">
              <svg viewBox="0 0 200 200" className="w-48 h-48">
                <path fill="#9b87f5" d="M47.7,-57.2C59,-44.7,63.5,-26.8,67.4,-7.8C71.2,11.3,74.4,31.5,65.8,44.2C57.2,56.8,36.8,61.9,17.5,65.5C-1.9,69.1,-20.2,71.1,-35.8,64.5C-51.3,57.8,-64.1,42.4,-69.7,24.8C-75.4,7.3,-74,-12.3,-65.9,-27.9C-57.9,-43.5,-43.1,-55,-28.1,-65.5C-13,-76.1,2.2,-85.7,16.8,-82.5C31.5,-79.3,36.5,-69.6,47.7,-57.2Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;