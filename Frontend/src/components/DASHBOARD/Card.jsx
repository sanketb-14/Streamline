// src/components/DASHBOARD/pages/Card.jsx
import { motion } from 'framer-motion';
import React from 'react';

export const Card = React.memo(({ children, className = "" }) => (
  <motion.div
    className={`bg-gradient-to-br from-base-100 to-base-200 h-auto min-h-[4rem] p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all ${className}`}
    variants={{ 
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 15 }
      }
    }}
    whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
  >
    {children}
  </motion.div>
));

Card.displayName = 'Card';