import { useState } from 'react';

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@ui/molecules/navbar.molecule';
import { Button } from '@ui/atoms/button.atom';

import { PAGES } from '@/core/app/router.app';

export function MainNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={PAGES.slice(1)} />
          <div className="flex items-center gap-4">
            <Button
              variant="flat"
              color="accent"
              size="sm"
              className="border-transparent bg-transparent font-bold text-white hover:bg-transparent hover:-translate-y-0.5 transition duration-200"
            >
              Get Started
            </Button>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen}>
            {PAGES.slice(1).map((item) => (
              <a
                key={`mobile-link-${item.id}`}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative textx-white"
              >
                <span className="block">{item.label}</span>
              </a>
            ))}

            <div className="flex w-full flex-col gap-4">
              <Button variant="flat" color="primary" size="lg">
                Get Started
              </Button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
