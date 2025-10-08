import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock,
  Heart,
  Phone
} from 'lucide-react';

const DonationCard = ({ donation, onClick, index = 0 }) => {
  // Status configuration
  const statusConfig = {
    available: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      icon: Clock,
      label: 'Available'
    },
    claimed: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      icon: User,
      label: 'In Progress'
    },
    delivered: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      icon: CheckCircle,
      label: 'Delivered'
    },
    completed: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      icon: CheckCircle,
      label: 'Completed'
    }
  };

  const currentStatus = statusConfig[donation.status] || statusConfig.available;
  const StatusIcon = currentStatus.icon;

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-[#FFF8E7] to-[#FFD54F]/20 overflow-hidden">
        {donation.imageUrl ? (
          <motion.img
            variants={imageVariants}
            whileHover="hover"
            src={donation.imageUrl}
            alt={donation.foodName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl opacity-40"
            >
              🍱
            </motion.div>
          </div>
        )}
        
        {/* Status Badge */}
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className={`absolute top-4 left-4 px-3 py-1.5 ${currentStatus.bg} ${currentStatus.text} rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm border ${currentStatus.border}`}
        >
          <StatusIcon size={14} />
          {currentStatus.label}
        </motion.div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF9933] hover:text-white transition-colors group"
        >
          <Heart size={18} className="group-hover:fill-current" />
        </motion.button>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title and Quantity */}
        <div>
          <h3 className="text-xl font-bold text-[#333333] mb-1 group-hover:text-[#FF9933] transition-colors">
            {donation.foodName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <Package size={16} className="text-[#FF9933]" />
            <span className="font-medium">{donation.quantity}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-[#4CAF50] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#333333]">Location</p>
              <p className="text-sm text-[#666666] truncate">{donation.location}</p>
            </div>
          </div>

          {/* Pickup Date */}
          <div className="flex items-start gap-3">
            <Calendar size={18} className="text-[#FFD54F] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#333333]">Pickup Date</p>
              <p className="text-sm text-[#666666]">
                {new Date(donation.pickupDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Donor/Volunteer Info */}
          {donation.donorId && (
            <div className="flex items-start gap-3">
              <User size={18} className="text-[#FF9933] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#333333]">
                  {donation.claimedBy ? 'Donor' : 'Donated by'}
                </p>
                <p className="text-sm text-[#666666]">
                  {donation.donorId.name || 'Anonymous'}
                </p>
              </div>
            </div>
          )}

          {/* Volunteer Info (for donors) */}
          {donation.claimedBy && (
            <div className="flex items-start gap-3">
              <User size={18} className="text-[#4CAF50] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#333333]">Volunteer</p>
                <p className="text-sm text-[#666666]">{donation.claimedBy.name}</p>
              </div>
            </div>
          )}

          {/* Phone */}
          {donation.phoneNo && (
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-[#2196F3] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#333333]">Contact</p>
                <p className="text-sm text-[#666666]">{donation.phoneNo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
        >
          {donation.status === 'available' && (
            <>
              <CheckCircle size={18} />
              Accept Task
            </>
          )}
          {donation.status === 'claimed' && (
            <>
              <Clock size={18} />
              View Details
            </>
          )}
          {donation.status === 'completed' && (
            <>
              <Heart size={18} />
              Thank You
            </>
          )}
        </motion.button>
      </div>

      {/* Decorative Bottom Border */}
      <motion.div
        className="h-1 bg-gradient-to-r from-[#FF9933] via-[#FFD54F] to-[#4CAF50]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      />
    </motion.div>
  );
};

// Grid Container Component
export const DonationGrid = ({ donations, onCardClick }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {donations.map((donation, index) => (
        <DonationCard
          key={donation._id}
          donation={donation}
          index={index}
          onClick={() => onCardClick && onCardClick(donation)}
        />
      ))}
    </motion.div>
  );
};

export default DonationCard;
