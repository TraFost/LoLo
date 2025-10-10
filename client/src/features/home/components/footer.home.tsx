import { Github, Twitter } from 'lucide-react';

export default function Footer() {
  const socials = [
    { icon: <Github className="w-6 h-6" />, href: 'https://github.com' },
    { icon: <Twitter className="w-6 h-6" />, href: 'https://twitter.com' },
  ];

  return (
    <footer className="bg-black text-white border-t-2 border-primary/50 py-8 px-8 md:px-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src="/assets/icon/lolo-main.webp" alt="LoLo Logo" className="w-10" />
          <span className="text-xl md:text-2xl font-extrabold tracking-widest text-primary">
            LoLo
          </span>
        </div>

        <div className="text-sm md:text-base text-gray-400 uppercase text-center md:text-left">
          Built for Rift Rewind Hackathon 2025
        </div>

        <div className="flex gap-6">
          {socials.map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-4">
        &copy; {new Date().getFullYear()} LoLo. All rights reserved.
      </div>
    </footer>
  );
}
