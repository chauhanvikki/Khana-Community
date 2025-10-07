import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "College Student & Donor",
    location: "Mumbai",
    image: "👩‍🎓",
    quote: "This platform made donating food so simple! I love how I can help feed someone in need with just a few clicks. The volunteers are amazing and always keep me updated.",
    rating: 5,
    meals: 15
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Volunteer",
    location: "Delhi",
    image: "👨‍💼",
    quote: "Being a volunteer here has been incredibly rewarding. Every pickup reminds me that small actions create big impacts. The community here is full of compassionate hearts.",
    rating: 5,
    meals: 50
  },
  {
    id: 3,
    name: "Anita Desai",
    role: "Restaurant Owner",
    location: "Bangalore",
    image: "👩‍🍳",
    quote: "Instead of wasting surplus food, we now donate it through this platform. It feels wonderful to contribute to fighting hunger while reducing waste. Highly recommended!",
    rating: 5,
    meals: 200
  },
  {
    id: 4,
    name: "Arjun Patel",
    role: "NGO Coordinator",
    location: "Ahmedabad",
    image: "🙋‍♂️",
    quote: "This platform has been a game-changer for our NGO. The connection between donors and those in need is seamless. We've been able to reach more people than ever before.",
    rating: 5,
    meals: 300
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex >= testimonialsData.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = testimonialsData.length - 1;
      return nextIndex;
    });
  };

  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <div className="relative py-20 bg-gradient-to-br from-cream-100 via-white to-cream-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <motion.div
          className="absolute top-20 left-10 text-9xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          ❤️
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-9xl"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🙏
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-saffron-500 to-accent-yellow text-white text-sm font-semibold rounded-full mb-4">
            💬 Voices of Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stories That{' '}
            <span className="bg-gradient-to-r from-saffron-500 to-accent-orange bg-clip-text text-transparent">
              Inspire
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from donors, volunteers, and partners making a difference every day
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {/* Main Card */}
          <div className="relative h-[500px] md:h-[400px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full max-w-4xl"
              >
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
                  {/* Quote Icon */}
                  <div className="absolute -top-6 left-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-accent-orange rounded-full flex items-center justify-center shadow-lg">
                      <Quote className="text-white" size={24} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 fill-accent-yellow text-accent-yellow" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote Text */}
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-handwriting italic">
                      "{currentTestimonial.quote}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
                      {/* Avatar */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron-100 to-cream-200 flex items-center justify-center text-4xl shadow-lg"
                      >
                        {currentTestimonial.image}
                      </motion.div>

                      {/* Details */}
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">
                          {currentTestimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {currentTestimonial.role} • {currentTestimonial.location}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 bg-warmGreen-100 text-warmGreen-700 rounded-full text-xs font-medium">
                            🍽️ {currentTestimonial.meals} meals contributed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              className="w-12 h-12 rounded-full bg-white border-2 border-saffron-500 text-saffron-500 flex items-center justify-center shadow-md hover:bg-saffron-500 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {testimonialsData.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  whileHover={{ scale: 1.2 }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-saffron-500'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              className="w-12 h-12 rounded-full bg-white border-2 border-saffron-500 text-saffron-500 flex items-center justify-center shadow-md hover:bg-saffron-500 hover:text-white transition-colors"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          {/* Stats Below */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-12"
          >
            {[
              { value: '1000+', label: 'Happy Donors' },
              { value: '500+', label: 'Active Volunteers' },
              { value: '10k+', label: 'Meals Served' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white rounded-2xl shadow-md"
              >
                <div className="text-3xl font-bold text-saffron-500 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
