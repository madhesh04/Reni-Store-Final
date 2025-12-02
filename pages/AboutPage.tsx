import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[300px] bg-gray-900">
        <img 
          src="https://picsum.photos/seed/aboutpage-hero/1920/1080" 
          alt="Renis brand inspiration" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">About Renis</h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300">Crafting Premium Comfort</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            </div>
            <div className="md:col-span-2">
              <p className="text-lg text-gray-300">
                At Renis, our mission is to redefine the standard for men's innerwear. We were founded on the belief that everyday essentials should be anything but basic. We combine timeless design with innovative fabrics to create products that provide unparalleled comfort, support, and confidence, from the moment you get dressed to the end of your day.
              </p>
            </div>
          </div>

          <div className="my-16 border-t border-gray-800"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-white">Our Story</h2>
            </div>
            <div className="md:col-span-2 text-gray-400 space-y-4">
              <p>
                Established in 2018, Renis began as a small project driven by a big idea: to elevate men's most fundamental garments. Frustrated with the lack of options that were both comfortable and stylish, our founders set out to create a brand that men could rely on for quality and sophistication.
              </p>
              <p>
                We spent years researching materials, perfecting fits, and listening to feedback. Today, Renis is proud to offer a curated collection of innerwear that stands up to the demands of modern life while embodying a sense of understated luxury. We are more than just a brand; we are a commitment to better basics.
              </p>
            </div>
          </div>
          
           <div className="mt-20 text-center">
            <Link 
              to="/products" 
              className="inline-block bg-white text-black px-10 py-4 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300"
            >
              Explore Our Collection
            </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;