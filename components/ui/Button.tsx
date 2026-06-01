import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  href?: string;
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  default:
    'border border-primary bg-primary text-primary-foreground shadow-[0_0_24px_rgba(0,245,255,0.2)] hover:bg-cyan-200',
  outline:
    'border border-white/10 bg-white/[0.045] text-foreground backdrop-blur-xl hover:border-primary/70 hover:bg-white/[0.075]',
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
};

export function Button({
  asChild,
  className,
  children,
  href,
  variant = 'default',
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    className,
  );

  if (asChild && href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
