import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface NewsletterSignupProps {
  compact?: boolean;
}

export function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  return (
    <form
      action="/api/newsletter"
      className={
        compact
          ? 'flex flex-col gap-3 sm:flex-row'
          : 'grid gap-3 sm:grid-cols-[1fr_auto]'
      }
      method="post"
    >
      <Input
        aria-label="Email address"
        name="email"
        placeholder="you@example.com"
        type="email"
      />
      <Button type="submit">Join newsletter</Button>
    </form>
  );
}
