import React from 'react';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-500 mb-12">Last Updated: April 25, 2026</p>

          <div className="prose prose-orange max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Khana Community platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. User Responsibilities</h2>
              <p>
                <strong>Donors:</strong> You are responsible for ensuring that all food donated is safe, fresh, and properly handled until collection.
              </p>
              <p className="mt-4">
                <strong>Volunteers:</strong> You are responsible for the safe transport and timely delivery of collected food items.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Prohibited Activities</h2>
              <p>
                Users are prohibited from:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Donating expired or unsafe food.</li>
                <li>Misrepresenting themselves or their organization.</li>
                <li>Using the platform for commercial gain.</li>
                <li>Harassing or abusing other community members.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Limitation of Liability</h2>
              <p>
                Khana Community is a platform connecting donors and volunteers. We are not responsible for the quality of food or any incidents that occur during transport, although we promote strict safety guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Account Termination</h2>
              <p>
                We reserve the right to terminate or suspend access to our platform for any user who violates these terms.
              </p>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
