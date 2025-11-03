import { Github } from 'lucide-react';

import { PAGES } from '@/core/app/router.app';

const SOCIALS = [{ icon: <Github className="w-6 h-6" />, href: 'https://github.com/TraFost/LoLo' }];

export function Footer() {
  return (
    <footer className="bg-black text-white border border-t-primary py-8 px-8 md:px-24">
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          {SOCIALS.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <ul className="flex gap-5">
          {PAGES.slice(2).map((page) => (
            <li key={page.id}>
              <a className="hover:text-primary transition-colors" href={page.path}>
                {page.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </footer>
  );
}
