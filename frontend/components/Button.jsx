import React from 'react';
import { motion } from 'framer-motion';

// Primary Button - Gradient with warm colors
export const PrimaryButton = ({ 
  children, 
  onClick, 
  icon: Icon, 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-8 py-4
        bg-gradient-to-r from-saffron-500 to-accent-orange
        text-white font-semibold rounded-xl
        shadow-lg hover:shadow-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {Icon && <Icon size={20} />}
        {children}
      </span>
    </motion.button>
  );
};

// Secondary Button - Outlined
export const SecondaryButton = ({ 
  children, 
  onClick, 
  icon: Icon, 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-4
        bg-white text-saffron-500
        border-2 border-saffron-500
        font-semibold rounded-xl
        hover:bg-saffron-500 hover:text-white
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {Icon && <Icon size={20} />}
        {children}
      </span>
    </motion.button>
  );
};

// Ghost Button - Minimal
export const GhostButton = ({ 
  children, 
  onClick, 
  icon: Icon, 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3
        text-gray-700 font-medium
        hover:text-saffron-500
        hover:bg-cream-100
        rounded-lg
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {Icon && <Icon size={18} />}
        {children}
      </span>
    </motion.button>
  );
};

// Icon Button - Circular with icon only
export const IconButton = ({ 
  icon: Icon, 
  onClick, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const variantClasses = {
    default: 'bg-white text-gray-700 hover:bg-gray-50',
    primary: 'bg-gradient-to-r from-saffron-500 to-accent-orange text-white',
    success: 'bg-warmGreen-500 text-white hover:bg-warmGreen-600',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        flex items-center justify-center
        shadow-md hover:shadow-lg
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
    </motion.button>
  );
};

// Floating Action Button - With pulse animation
export const FAB = ({ 
  icon: Icon, 
  onClick, 
  className = '',
  label,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        fixed bottom-8 right-8 z-50
        w-16 h-16
        bg-gradient-to-r from-saffron-500 to-accent-orange
        text-white
        rounded-full
        shadow-2xl hover:shadow-warm
        flex items-center justify-center
        ${className}
      `}
      {...props}
    >
      {/* Pulse Ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-saffron-500 opacity-50"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      
      {Icon && <Icon size={28} />}
      
      {/* Tooltip */}
      {label && (
        <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      )}
    </motion.button>
  );
};

// Button Group - For multiple related buttons
export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      {children}
    </div>
  );
};

export default {
  Primary: PrimaryButton,
  Secondary: SecondaryButton,
  Ghost: GhostButton,
  Icon: IconButton,
  FAB: FAB,
  Group: ButtonGroup,
};
