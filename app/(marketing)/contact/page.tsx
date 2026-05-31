import type { Metadata } from 'next';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { SocialLinks } from '@/components/marketing/SocialLinks';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Contact',
  description:
    'Contact Deepak Kumar Sahu for platform engineering, DevOps, leadership, and collaboration.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <p className="font-mono text-sm text-primary">Contact</p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Let&apos;s talk platform engineering, leadership, or a practical
          collaboration.
        </h1>
        <p className="mt-5 text-muted-foreground">
          The form is wired to a static-friendly API route and can use Resend
          once the key is configured.
        </p>
        <div className="mt-8">
          <SocialLinks />
        </div>
      </div>
      <form
        action="/api/contact"
        className="space-y-4 rounded-xl border border-border bg-card p-6"
        method="post"
      >
        <Input name="name" placeholder="Your name" required />
        <Input
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
        <Input name="subject" placeholder="Subject" required />
        <Textarea
          name="message"
          placeholder="What should we talk about?"
          required
        />
        <Button type="submit">Send message</Button>
      </form>
    </section>
  );
}
