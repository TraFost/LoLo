import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn.utils';

const buttonVariants = cva(
  'group relative inline-block font-bold uppercase tracking-widest focus:outline-none focus:ring-2 transition-all select-none cursor-pointer',
  {
    variants: {
      variant: {
        flat: 'active:translate-y-[1px]',
        offset: '',
      },
      color: {
        primary: 'text-black [&>span:nth-child(1)]:bg-primary [&>span:nth-child(2)]:border-black',
        secondary: 'text-white [&>span:nth-child(1)]:bg-black [&>span:nth-child(2)]:border-black',
        accent: 'text-black [&>span:nth-child(1)]:bg-white [&>span:nth-child(2)]:border-black',
      },
      size: {
        sm: '[&>span:nth-child(2)]:px-5 [&>span:nth-child(2)]:py-2 text-xs',
        default: '[&>span:nth-child(2)]:px-8 [&>span:nth-child(2)]:py-3 text-sm',
        lg: '[&>span:nth-child(2)]:px-10 [&>span:nth-child(2)]:py-4 text-base',
      },
    },
    compoundVariants: [
      {
        variant: 'flat',
        color: 'primary',
        class: 'bg-primary text-white border-2 border-black hover:bg-primary/90 px-8 py-3',
      },
      {
        variant: 'flat',
        color: 'secondary',
        class: 'bg-black text-white border-2 border-black hover:bg-black/90 px-8 py-3',
      },
      {
        variant: 'flat',
        color: 'accent',
        class: 'bg-white text-black border-2 border-black hover:bg-white/90 px-8 py-3',
      },
    ],
    defaultVariants: {
      variant: 'offset',
      color: 'primary',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  color,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  if (variant === 'flat') {
    return (
      <Comp className={cn(buttonVariants({ variant, color, size, className }))} {...props}>
        {children}
      </Comp>
    );
  }

  return (
    <Comp className={cn(buttonVariants({ variant, color, size, className }))} {...props}>
      <span className="absolute inset-0 translate-x-[6px] translate-y-[6px] transition-transform duration-200 group-hover:translate-x-0 group-hover:translate-y-0"></span>
      <span className="relative inline-block border-2">{children}</span>
    </Comp>
  );
}

export { Button, buttonVariants };
