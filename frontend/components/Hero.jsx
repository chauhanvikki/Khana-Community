import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Package, TrendingUp } from 'lucide-react';

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const statsData = [
    { icon: Package, value: "10,000+", label: "Meals Donated" },
    { icon: Users, value: "500+", label: "Active Volunteers" },
    { icon: Heart, value: "50+", label: "Partner NGOs" },
    { icon: TrendingUp, value: "95%", label: "Impact Rate" }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFF0CC] overflow-hidden">
      {/* Floating Food Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <motion.div
          className="absolute top-20 left-10 text-8xl"
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          🍚
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-6xl"
          animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🍞
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-7xl"
          animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          🥘
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-40 text-5xl"
          animate={{ y: [15, -15, 15], rotate: [0, -5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🥗
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#FF9933] to-[#FFD54F] text-white text-sm font-semibold rounded-full shadow-lg">
                🇮🇳 Fighting Hunger, Spreading Hope
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#333333] leading-tight"
            >
              Share Food,{' '}
              <span className="bg-gradient-to-r from-[#FF9933] to-[#FF6F00] bg-clip-text text-transparent">
                Share Love
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-[#666666] leading-relaxed"
            >
              Join our community of compassionate donors and dedicated volunteers. 
              Together, we're bridging the gap between surplus and need, 
              one meal at a time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="flex items-center justify-center gap-2">
                  <Heart size={20} fill="white" />
                  Donate Food
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-[#FF9933] border-2 border-[#FF9933] font-semibold rounded-xl hover:bg-[#FF9933] hover:text-white transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <Users size={20} />
                  Volunteer Now
                </span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-[#FF9933] to-[#FFD54F] flex items-center justify-center text-white font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#333333]">10,000+ Donors</p>
                <p className="text-xs text-[#666666]">Making a difference daily</p>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Animated Illustration */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            {/* Main Card with Parallax Effect */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative bg-white rounded-3xl p-8 shadow-2xl border border-[#FFD54F]/20"
            >
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#FF9933] to-[#FFD54F] rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] rounded-full opacity-20 blur-xl"></div>

              {/* Illustration Content */}
              <div className="relative space-y-6">
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-32 h-32 bg-gradient-to-br from-[#FF9933] to-[#FFD54F] rounded-full flex items-center justify-center text-6xl shadow-lg"
                  >
                    🤝
                  </motion.div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#333333] mb-2">
                    Building Connections
                  </h3>
                  <p className="text-[#666666]">
                    Connecting generous donors with those in need
                  </p>
                </div>

                {/* Impact Badges */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-[#FFF8E7] to-white p-4 rounded-xl border border-[#FFD54F]/30"
                  >
                    <div className="text-3xl font-bold text-[#FF9933]">5k+</div>
                    <div className="text-sm text-[#666666]">Daily Meals</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-[#FFF8E7] to-white p-4 rounded-xl border border-[#FFD54F]/30"
                  >
                    <div className="text-3xl font-bold text-[#4CAF50]">98%</div>
                    <div className="text-sm text-[#666666]">Satisfaction</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#FF9933] to-[#FFD54F] rounded-full mb-3"
                >
                  <Icon size={24} className="text-white" />
                </motion.div>
                <div className="text-3xl font-bold text-[#333333] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#666666]">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[#FF9933] rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-[#FF9933] rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
