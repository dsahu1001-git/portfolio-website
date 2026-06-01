import type { Metadata } from 'next';
import { ContactForm } from '@/components/marketing/ContactForm';
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
        <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
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
      <ContactForm />
    </section>
  );
}
