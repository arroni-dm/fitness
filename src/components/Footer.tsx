import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { COACHING_PROGRAM_CARDS, type CoachingProgramCard } from '../data/programs';
import {
  getAnalyticsConsent,
  hasConfiguredAnalyticsIds,
  setAnalyticsConsent,
  trackConversionEvent,
} from '../lib/analytics';
import { useSiteConfig } from '../lib/SiteConfigContext';

interface FooterProps {
  onSelectProgramFromFooter?: (
    programTitle: CoachingProgramCard['title'],
    defaultGoal: CoachingProgramCard['defaultGoal']
  ) => void;
}

const FOOTER_NAV = [
  { label: 'Home', sectionId: 'top' },
  { label: 'Coaching', sectionId: 'coaching' },
  { label: 'How It Works', sectionId: 'how-it-works' },
  { label: 'Success Stories', sectionId: 'success-stories' },
  { label: 'About', sectionId: 'about' },
  { label: 'FAQ', sectionId: 'faq' },
] as const;

export function Footer({ onSelectProgramFromFooter }: FooterProps) {
  const {
    config,
    verifiedTelHref,
    verifiedPhoneDisplay,
    verifiedEmailDisplay,
  } = useSiteConfig();
  const location = useLocation();
  const navigate = useNavigate();
  const [consentState, setConsentState] = useState(() => getAnalyticsConsent());
  const analyticsActive = hasConfiguredAnalyticsIds();

  const currentYear = new Date().getFullYear();

  const handleSectionClick = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(sectionId === 'top' ? '/' : `/#${sectionId}`);
      return;
    }
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProgramLink = (program: CoachingProgramCard) => {
    trackConversionEvent('program_select', {
      program_name: program.title,
      goal_category: program.defaultGoal,
      section_source: 'footer',
    });
    if (onSelectProgramFromFooter && location.pathname === '/') {
      onSelectProgramFromFooter(program.title, program.defaultGoal);
      return;
    }
    navigate(`/?program=${encodeURIComponent(program.title)}#inquiry-form`);
  };

  const activeSocials = [
    { label: 'Instagram', url: config.socialLinks.instagram.trim() },
    { label: 'YouTube', url: config.socialLinks.youtube.trim() },
    { label: 'LinkedIn', url: config.socialLinks.linkedin.trim() },
  ].filter((item) => item.url.startsWith('https://') || item.url.startsWith('http://'));

  return (
    <footer className="border-t border-[#2A3028] bg-[#121512] text-[#A5AAA1]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Description */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="font-display text-2xl font-bold tracking-wide text-[#F7F8F5] hover:text-[#C6FF00] transition-colors"
            >
              {config.brandName}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#A5AAA1]">
              {config.tagline}
            </p>

            {activeSocials.length > 0 ? (
              <ul className="mt-6 flex items-center gap-4 text-xs font-semibold text-[#F7F8F5]">
                {activeSocials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#C6FF00] transition-colors"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold tracking-wider text-[#F7F8F5]">
              NAVIGATION
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {FOOTER_NAV.map((item) => (
                <li key={item.sectionId}>
                  <button
                    type="button"
                    onClick={() => handleSectionClick(item.sectionId)}
                    className="hover:text-[#F7F8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Coaching Program Links */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-wider text-[#F7F8F5]">
              COACHING PROGRAMS
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {COACHING_PROGRAM_CARDS.map((program) => (
                <li key={program.id}>
                  <button
                    type="button"
                    onClick={() => handleProgramLink(program)}
                    className="text-left hover:text-[#F7F8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors"
                  >
                    {program.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact Details */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-wider text-[#F7F8F5]">
              CONTACT
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="block text-xs text-[#A5AAA1]/75">Email</span>
                {verifiedEmailDisplay ? (
                  <a
                    href={`mailto:${verifiedEmailDisplay}`}
                    className="font-medium text-[#F7F8F5] hover:text-[#C6FF00] transition-colors break-all"
                  >
                    {verifiedEmailDisplay}
                  </a>
                ) : (
                  <span className="text-xs text-[#A5AAA1]">
                    {config.contact.emailSetupPlaceholder}
                  </span>
                )}
              </div>

              <div>
                <span className="block text-xs text-[#A5AAA1]/75">Phone</span>
                {verifiedTelHref && verifiedPhoneDisplay ? (
                  <a
                    href={verifiedTelHref}
                    onClick={() =>
                      trackConversionEvent('phone_click', {
                        section_source: 'footer',
                      })
                    }
                    className="font-mono-num font-medium text-[#F7F8F5] hover:text-[#C6FF00] transition-colors"
                  >
                    {verifiedPhoneDisplay}
                  </a>
                ) : (
                  <span className="text-xs text-[#A5AAA1]">
                    {config.contact.phoneSetupPlaceholder}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Analytics Consent Bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-[#2A3028] pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {config.brandName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              to="/privacy-policy"
              className="hover:text-[#F7F8F5] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#F7F8F5] transition-colors">
              Terms and Conditions
            </Link>

            {analyticsActive ? (
              <button
                type="button"
                onClick={() => {
                  const next = consentState === 'granted' ? 'denied' : 'granted';
                  setAnalyticsConsent(next);
                  setConsentState(next);
                }}
                className="text-[#A5AAA1] underline decoration-[#2A3028] underline-offset-4 hover:text-[#F7F8F5]"
              >
                Analytics: {consentState === 'granted' ? 'Enabled' : 'Disabled'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
