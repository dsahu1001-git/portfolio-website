import Link from 'next/link';
import { Github, Linkedin, RadioTower } from 'lucide-react';

const footerLinks = [
  { href: 'https://github.com/dsahu1001-git', label: 'GitHub', icon: Github },
  {
    href: 'https://www.linkedin.com/in/dsahu1001',
    label: 'LinkedIn',
    icon: Linkedin,
  },
  { href: '/work', label: 'ReadCV', icon: RadioTower },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0e0e0e]/85">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-heading text-sm font-semibold">DEEPAK_SAHU</p>
          <p className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_#00f5ff]" />
            Active node / Bengaluru, India
          </p>
        </div>
        <nav className="flex flex-wrap gap-4" aria-label="Social signals">
          {footerLinks.map(({ href, icon: Icon, label }) => (
            <Link
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase text-muted-foreground transition-colors hover:text-primary"
              href={href}
              key={href}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              target={href.startsWith('http') ? '_blank' : undefined}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
