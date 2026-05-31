import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-ring',
        className,
      )}
      {...props}
    />
  );
}
