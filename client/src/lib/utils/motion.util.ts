import type { Variants, Easing } from 'motion/react';

const EASE: Easing = [0.16, 1, 0.3, 1];

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: EASE,
    },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: EASE,
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: EASE,
    },
  },
};

export const floatUpDown: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4.2,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

export const createStaggerContainer = (delayChildren = 0.1, staggerChildren = 0.12): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
});
