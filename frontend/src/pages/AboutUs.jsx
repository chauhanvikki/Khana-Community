import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, Zap, Target, Star, MessageSquare } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const AboutUs = () => {
  const stats = [
    { label: 'Meals Delivered', value: '10,000+', icon: Zap },
    { label: 'Active Volunteers', value: '500+', icon: Users },
    { label: 'Cities Covered', value: '50+', icon: Target },
    { label: 'Partners', value: '100+', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
              Our Mission to <span className="text-orange-600">End Hunger</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Khana Community was born out of a simple realization: while tons of food go to waste every day, millions go to sleep hungry. We are here to bridge that gap.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-orange-50 border border-orange-100"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">The Spark of a Mission</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Khana Community didn't start in a boardroom. It started on the streets, in the quiet observations of our founder, <span className="font-bold text-gray-900">Vishvendra Singh</span>.
                </p>
                <p>
                  Walking through the city, Vishvendra couldn't ignore the stark contrast: the abundance of food being discarded from celebratory events, and the hollow eyes of those who didn't know when their next meal would come. 
                </p>
                <p className="italic border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                  "I saw the problem not as a lack of resources, but as a lack of connection. We have enough to feed everyone; we just aren't reaching everyone."
                </p>
                <p>
                  This realization became a burden, then a passion, and finally, a platform. Khana Community is the bridge built from that empathy—a way to turn "someone else's problem" into our collective solution.
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="/founder.jpg" 
                  alt="Vishvendra Singh - Founder of Khana Community" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}

                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-2xl shadow-xl text-white max-w-xs">
                <p className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wider">Founder's Note</p>
                <p className="text-lg font-bold italic">
                  "Every plate shared is a story rewritten. Let's write a better story for our community together."
                </p>
                <p className="mt-4 font-bold">— Vishvendra Singh</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why We Do What We Do - Emotional Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">More Than Just Food</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">It's about the human connection that happens when we look out for one another.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <motion.div whileHover={{ y: -5 }} className="space-y-4">
              <div className="text-4xl text-orange-500">💔</div>
              <h3 className="text-xl font-bold text-gray-900">Healing the Disconnect</h3>
              <p className="text-gray-600">Hunger isn't just a physical pain; it's a mental weight that strips away dignity. We aim to restore hope along with health.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="space-y-4">
              <div className="text-4xl text-orange-500">🤝</div>
              <h3 className="text-xl font-bold text-gray-900">Restoring Dignity</h3>
              <p className="text-gray-600">When you donate, you aren't just giving "leftovers." You are offering a gesture of care that says, "You are seen, and you matter."</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="space-y-4">
              <div className="text-4xl text-orange-500">🌍</div>
              <h3 className="text-xl font-bold text-gray-900">Building a Legacy</h3>
              <p className="text-gray-600">We want to build a world where our children don't understand the concept of a "wasteful surplus." A world where sharing is the default.</p>
            </motion.div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default AboutUs;
