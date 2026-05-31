import Link from 'next/link';

const links = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/blog', label: 'Blog' },
  { href: '/games', label: 'Games' },
  { href: '/gear', label: 'Gear' },
  { href: '/contact', label: 'Contact' },
];

export function Navigation() {
  return (
    <nav
      aria-label="Primary navigation"
      className="hidden items-center gap-6 md:flex"
    >
      {links.map((link) => (
        <Link
          className="font-mono text-xs uppercase text-muted-foreground transition-colors hover:text-primary"
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
