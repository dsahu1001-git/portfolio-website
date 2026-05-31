import Link from 'next/link';

const footerLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/games', label: 'Games' },
  { href: '/gear', label: 'Gear' },
  { href: '/tools/infra-cost-checklist', label: 'Tools' },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-semibold">Deepak Kumar Sahu</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Static-first personal brand site. Built to stay fast and nearly
            free.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
