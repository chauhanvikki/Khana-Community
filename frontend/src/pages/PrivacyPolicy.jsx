import React from 'react';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-500 mb-12">Last Updated: April 25, 2026</p>

          <div className="prose prose-orange max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us when you create an account, list food for donation, or sign up as a volunteer. This includes:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Name and contact information (email address, phone number).</li>
                <li>Profile information and images.</li>
                <li>Location data for matching donations with volunteers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Facilitate food donations and collections.</li>
                <li>Communicate with you about your account and activities.</li>
                <li>Improve our platform and user experience.</li>
                <li>Ensure the safety and security of our community.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Data Sharing</h2>
              <p>
                We do not sell your personal data. We only share information necessary to fulfill the mission:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Donors' location and contact info is shared with the assigned volunteer.</li>
                <li>Volunteers' name and photo is shared with the donor for verification.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Security</h2>
              <p>
                We take reasonable measures to protect your personal information from loss, theft, and unauthorized access.
              </p>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
