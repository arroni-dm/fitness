import { useEffect } from 'react';
import { X } from 'lucide-react';

export interface NavItem {
  label: string;
  sectionId: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  brandName: string;
  items: NavItem[];
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
  onPrimaryCta: () => void;
}

export function MobileMenu({
  isOpen,
  brandName,
  items,
  onClose,
  onNavigateSection,
  onPrimaryCta,
}: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col justify-between border-l border-[#2A3028] bg-[#0B0D0B] p-6 transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#2A3028] pb-5">
            <span className="font-display text-xl font-bold tracking-wide text-[#F7F8F5] truncate max-w-[220px]">
              {brandName}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#2A3028] text-[#F7F8F5] hover:border-[#C6FF00] hover:text-[#C6FF00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile Primary" className="mt-6 flex flex-col divide-y divide-[#2A3028]/70">
            {items.map((item) => (
              <button
                key={item.sectionId}
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateSection(item.sectionId);
                }}
                className="flex min-h-[48px] w-full items-center justify-between py-3 text-left text-base font-medium text-[#F7F8F5] hover:text-[#C6FF00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-[#2A3028] pt-6">
          <button
            type="button"
            onClick={() => {
              onClose();
              onPrimaryCta();
            }}
            className="flex min-h-[48px] w-full items-center justify-center rounded-md bg-[#C6FF00] px-5 py-3 text-sm font-bold tracking-wide text-[#0B0D0B] hover:bg-[#d4ff38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors whitespace-nowrap"
          >
            GET YOUR FREE PLAN
          </button>
        </div>
      </div>
    </div>
  );
}
