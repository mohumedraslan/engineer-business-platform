'use client';

import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  animation?: 'bounce' | 'pulse' | 'scale' | 'glow';
  className?: string;
}

export function AnimatedButton({ 
  children, 
  animation = 'scale', 
  className, 
  ...props 
}: AnimatedButtonProps) {
  const animations = {
    bounce: {
      whileHover: { y: -2 },
      whileTap: { y: 0 }
    },
    pulse: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      animate: { scale: [1, 1.02, 1] },
      transition: { duration: 2, repeat: Infinity }
    },
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 }
    },
    glow: {
      whileHover: { 
        scale: 1.05,
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
      },
      whileTap: { scale: 0.95 }
    }
  };

  return (
    <motion.div {...animations[animation]}>
      <Button className={cn(className)} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}

export function FloatingActionButton({ 
  children, 
  className, 
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        size="lg"
        className={cn(
          "rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
