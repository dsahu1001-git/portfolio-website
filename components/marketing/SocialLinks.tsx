import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

const links = [
  { href: 'https://github.com/dsahu1001', label: 'GitHub', icon: Github },
  {
    href: 'https://www.linkedin.com/in/dsahu1001',
    label: 'LinkedIn',
    icon: Linkedin,
  },
  { href: 'mailto:hello@deepaksahu.dev', label: 'Email', icon: Mail },
];

export function SocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            aria-label={link.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
            href={link.href}
            key={link.href}
            rel="noopener noreferrer"
            target={link.href.startsWith('http') ? '_blank' : undefined}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </Link>
        );
      })}
    </div>
  );
}
