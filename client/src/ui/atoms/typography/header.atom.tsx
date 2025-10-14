import { cn } from '@/lib/utils/cn.util';

type TagVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface Props {
  tag: TagVariants;
  text: string;
  className?: string;
}

export function Header(props: Props) {
  const { tag: Tag, text, className: headerClassName } = props;

  return (
    <Tag
      className={cn(
        'text-3xl font-extrabold tracking-tight text-primary sm:text-4xl [text-wrap:balance] leading-[1.05]',
        headerClassName,
      )}
    >
      {text}
    </Tag>
  );
}
