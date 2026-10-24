import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSiteConfig } from '../lib/SiteConfigContext';
import { MobileMenu, type NavItem } from './MobileMenu';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', sectionId: 'top' },
  { label: 'Coaching', sectionId: 'coaching' },
  { label: 'How It Works', sectionId: 'how-it-works' },
  { label: 'Success Stories', sectionId: 'success-stories' },
  { label: 'About', sectionId: 'about' },
  { label: 'FAQ', sectionId: 'faq' },
];

interface NavbarProps {
  onOpenInquiryForm?: () => void;
}

export function Navbar({ onOpenInquiryForm }: NavbarProps) {
  const { config } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigateToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(sectionId === 'top' ? '/' : `/#${sectionId}`);
      return;
    }
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrimaryCta = () => {
    if (onOpenInquiryForm && location.pathname === '/') {
      onOpenInquiryForm();
      return;
    }
    if (location.pathname !== '/') {
      navigate('/#inquiry-form');
      return;
    }
    const formEl = document.getElementById('inquiry-form');
    formEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 h-16 lg:h-20 w-full transition-colors duration-200 ${
          scrolled
            ? 'border-b border-[#2A3028] bg-[#0B0D0B]/95 backdrop-blur-md'
            : 'border-b border-transparent bg-[#0B0D0B]/70 backdrop-blur-xs'
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single text-based brand wordmark */}
          <button
            type="button"
            onClick={() => navigateToSection('top')}
            className="font-display text-xl sm:text-2xl font-bold tracking-wide text-[#F7F8F5] hover:text-[#C6FF00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C6FF00] transition-colors whitespace-nowrap shrink-0"
          >
            {config.brandName}
          </button>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#A5AAA1]"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.sectionId}
                type="button"
                onClick={() => navigateToSection(item.sectionId)}
                className="relative py-1 text-[#A5AAA1] hover:text-[#F7F8F5] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#C6FF00] hover:after:w-full after:transition-all after:duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C6FF00] whitespace-nowrap shrink-0"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action (Desktop) / Menu Toggle (Mobile) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handlePrimaryCta}
              className="hidden lg:inline-flex min-h-[42px] items-center justify-center rounded-md bg-[#C6FF00] px-5 py-2.5 text-xs font-bold tracking-wider text-[#0B0D0B] hover:bg-[#d4ff38] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-all duration-150 whitespace-nowrap shrink-0"
            >
              GET YOUR FREE PLAN
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="inline-flex lg:hidden h-11 w-11 items-center justify-center rounded-md border border-[#2A3028] bg-[#121512] text-[#F7F8F5] hover:border-[#C6FF00] hover:text-[#C6FF00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        brandName={config.brandName}
        items={NAV_ITEMS}
        onClose={() => setMobileOpen(false)}
        onNavigateSection={navigateToSection}
        onPrimaryCta={handlePrimaryCta}
      />
    </>
  );
}
