import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'liquid-card rounded-lg text-card-foreground transition-all duration-300',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('p-6 pb-3', className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('p-6 pt-3', className)} {...props} />;
}
