import { Button } from '@/ui/atoms/button.atom';

const navigation = [
  { name: 'Dashboard', href: '#' },
  { name: 'Match Review', href: '#' },
  { name: 'AI Insights', href: '#' },
  { name: 'Leaderboards', href: '#' },
  { name: 'Community', href: '#' },
];

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-10 py-3 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
      <div className="flex gap-6 items-center">
        <div className="flex gap-2 items-center cursor-pointer select-none">
          <img src="/assets/icon/lolo-main.webp" alt="LoLo Icon" className="w-10 h-10" />
          <div>
            <p className="text-3xl font-bold leading-none">LoLo</p>
            <p className="text-xs text-gray-400 tracking-wide">Personal AI Coach</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium tracking-wide ml-10">
          {navigation.map((nav) => (
            <a
              key={nav.name}
              href={nav.href}
              className="text-gray-300 hover:text-white transition-colors duration-150"
            >
              {nav.name}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="flat" color="primary" size="lg">
          Get Started
        </Button>
      </div>
    </nav>
  );
}
