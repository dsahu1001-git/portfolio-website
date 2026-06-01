import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

const links = [
  { href: 'https://github.com/dsahu1001-git', label: 'GitHub', icon: Github },
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.045] text-muted-foreground backdrop-blur-xl transition-all hover:border-primary/70 hover:text-primary hover:shadow-[0_0_18px_rgba(0,245,255,0.18)]"
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
