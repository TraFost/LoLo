import { motion } from 'motion/react';

import { cn } from '@/lib/utils/cn.util';
import { fadeInUp } from '@/lib/utils/motion.util';

type TagVariants = 'p' | 'span';

interface Props {
  tag: TagVariants;
  text: string;
  className?: string;
  animate?: boolean;
}

export function Description(props: Props) {
  const { tag: Tag, text, className: headerClassName, animate } = props;

  const classNames = cn('mt-4 text-base text-gray-400 sm:text-lg', headerClassName);

  if (animate) {
    const motionTagMap = {
      p: motion.p,
      span: motion.span,
    } as const;

    const MotionTag = motionTagMap[Tag];

    return (
      <MotionTag className={classNames} variants={fadeInUp}>
        {text}
      </MotionTag>
    );
  }

  return <Tag className={classNames}>{text}</Tag>;
}
