import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  yOffset = 36,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -40px 0px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 1, 0.5, 1], // Lightweight GPU-composited cubic bezier
      }}
      style={{ willChange: 'transform, opacity' }}
      className={`w-full transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};
