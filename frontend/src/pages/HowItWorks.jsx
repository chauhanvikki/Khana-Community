import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket, Truck, HeartHandshake, CheckCircle, PackageSearch, Smartphone } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const HowItWorks = () => {
  const donorSteps = [
    { title: 'Post Food', desc: 'List surplus food with details and photos on our platform.', icon: Smartphone },
    { title: 'Verification', desc: 'Our team or volunteers quickly verify the listing for safety.', icon: PackageSearch },
    { title: 'Handover', desc: 'A volunteer arrives to collect the food at your convenience.', icon: HeartHandshake }
  ];

  const volunteerSteps = [
    { title: 'Find Task', desc: 'Browse available food collection tasks in your local area.', icon: Smartphone },
    { title: 'Collect', desc: 'Pick up the food from the donor following safety guidelines.', icon: ShoppingBasket },
    { title: 'Deliver', desc: 'Drop off the food at designated shelters or needy communities.', icon: Truck }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-3 bg-green-100 rounded-2xl mb-6"
          >
            <CheckCircle className="text-green-600 w-8 h-8 mx-auto" />
          </motion.div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Simple Steps to <span className="text-green-600">Make an Impact</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform connects those with surplus food to those who can deliver it. It's fast, safe, and transparent.
          </p>
        </div>
      </section>

      {/* Donors Journey */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Donors</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {donorSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center group"
              >
                {i < 2 && (
                  <div className="hidden lg:block absolute top-12 left-2/3 w-full border-t-2 border-dashed border-orange-200"></div>
                )}
                <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-orange-500 transition-colors duration-300">
                  <step.icon size={40} className="text-orange-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteers Journey */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Volunteers</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {volunteerSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center group"
              >
                {i < 2 && (
                  <div className="hidden lg:block absolute top-12 left-2/3 w-full border-t-2 border-dashed border-green-200"></div>
                )}
                <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-green-500 transition-colors duration-300">
                  <step.icon size={40} className="text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-8">Ready to start?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform">
              Join as Donor
            </button>
            <button className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform">
              Become a Volunteer
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
