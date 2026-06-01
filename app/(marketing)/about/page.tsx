import type { Metadata } from 'next';
import { SocialLinks } from '@/components/marketing/SocialLinks';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'About',
  description:
    'The personal story behind Deepak Kumar Sahu and the platform engineering brand.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <section className="systems-grid border-b border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <p className="font-mono text-xs uppercase text-primary">About / Origin</p>
        <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
          I build teams and platforms that make delivery boring in the best way.
        </h1>
        <div className="mt-8">
          <SocialLinks />
        </div>
      </div>
      <div className="border-l border-primary/50 pl-6 text-lg leading-8 text-muted-foreground sm:pl-8">
        <div className="space-y-5">
        <p>
          I was the founding DevOps hire at Storable India&apos;s GCC, where I
          built DevOps, SRE, platform engineering, and observability practices
          from the ground up.
        </p>
        <p>
          Across 13+ years, I have worked from hands-on infrastructure
          operations to engineering leadership, covering Azure production
          clusters, enterprise CI/CD, IPL-scale streaming infrastructure, cloud
          migrations, GitOps, and internal developer platforms.
        </p>
        <p>
          This site is the next version of that story: a career portfolio and a
          technical blog first, with a few lightweight interactive extras added
          only to make the site more useful and engaging.
        </p>
        </div>
      </div>
      </div>
    </section>
  );
}
