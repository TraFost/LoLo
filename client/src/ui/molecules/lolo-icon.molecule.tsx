import { motion, useReducedMotion } from 'motion/react';
import { scaleIn } from '@/lib/utils/motion.util';

export default function LoloIcon({
  size = 'xl',
  animation = 'float',
}: {
  size?: 'sm' | 'xl';
  animation?: 'float' | 'spin';
}) {
  const reduce = useReducedMotion();

  // Size configuration
  const containerSize = size === 'sm' ? 'max-w-24' : 'max-w-[36rem]';
  const blurSize = size === 'sm' ? 'blur-[60px]' : 'blur-[120px]';

  // Animation variants
  const imageAnimations = {
    float: {
      animate: !reduce ? { rotate: [0, 2, -2, 0] } : undefined,
      transition: !reduce
        ? {
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        : undefined,
    },
    spin: {
      animate: !reduce ? { rotate: 360 } : undefined,
      transition: !reduce
        ? {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }
        : undefined,
    },
  };

  const glowAnimations = {
    float: {
      animate: !reduce
        ? {
            opacity: [0.55, 0.85, 0.55],
            scale: [0.95, 1.05, 0.95],
          }
        : undefined,
      transition: !reduce
        ? {
            duration: 6.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        : undefined,
    },
    spin: {
      animate: !reduce
        ? {
            opacity: [0.4, 0.8, 0.4],
          }
        : undefined,
      transition: !reduce
        ? {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        : undefined,
    },
  };

  const currentImageAnim = imageAnimations[animation];
  const currentGlowAnim = glowAnimations[animation];

  return (
    <motion.div variants={scaleIn} className="order-1 md:order-2 relative">
      <div className={`relative mx-auto w-full ${containerSize}`}>
        <div className="relative aspect-[4/3]">
          <motion.div
            aria-hidden
            className={`absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(83,90,255,0.45)_0%,rgba(22,24,56,0.6)_55%,transparent_85%)] ${blurSize}`}
            animate={currentGlowAnim.animate}
            transition={currentGlowAnim.transition}
          />

          <picture className="absolute inset-0 m-auto h-full w-full">
            <source srcSet="/assets/icon/lolo-main.webp" type="image/webp" />
            <motion.img
              src="/assets/hero/lolo-main.webp"
              alt="LoLo icon"
              className="h-full w-full object-contain"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              sizes={
                size === 'xl' ? '(min-width: 1024px) 36rem, (min-width: 768px) 28rem, 70vw' : '6rem'
              }
              animate={currentImageAnim.animate}
              transition={currentImageAnim.transition}
            />
          </picture>
        </div>
      </div>
    </motion.div>
  );
}
