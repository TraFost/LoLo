import { useState } from 'react';
import { useNavigate } from 'react-router';

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

  const navigate = useNavigate();

  const navigateToAnalyze = () => {
    navigate('/analyze');
  };

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={PAGES.slice(2)} />
          <div className="flex items-center gap-4">
            <Button
              variant="flat"
              color="accent"
              size="sm"
              className="border-transparent bg-transparent font-bold text-white hover:bg-transparent hover:-translate-y-0.5 transition duration-200"
              onClick={navigateToAnalyze}
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
            {PAGES.slice(2).map((item) => (
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
              <Button
                variant="flat"
                color="primary"
                size="sm"
                className="font-bold text-white"
                onClick={navigateToAnalyze}
              >
                Get Started
              </Button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
