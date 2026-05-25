import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import Contact from '../components/Contact';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <div className="py-12">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
