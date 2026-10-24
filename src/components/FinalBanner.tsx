import { ArrowRight, Phone } from 'lucide-react';
import { VISUAL_ASSETS } from '../data/visualAssets';
import { trackConversionEvent } from '../lib/analytics';
import { useSiteConfig } from '../lib/SiteConfigContext';
import { ResilientImage } from './ResilientImage';

interface FinalBannerProps {
  onPrimaryCta: () => void;
  onScrollToPhoneSetup: () => void;
}

export function FinalBanner({
  onPrimaryCta,
  onScrollToPhoneSetup,
}: FinalBannerProps) {
  const { config, verifiedTelHref, verifiedPhoneDisplay } = useSiteConfig();

  return (
    <section
      aria-labelledby="final-banner-heading"
      className="relative overflow-hidden border-t border-[#2A3028] bg-[#0B0D0B]"
    >
      {/* Full-Width Editorial Backdrop */}
      <div className="absolute inset-0">
        <ResilientImage
          src={VISUAL_ASSETS.closingBanner.src}
          alt={VISUAL_ASSETS.closingBanner.alt}
          fallbackLabel="Start Your Training Plan"
          className="h-full w-full object-cover object-right"
        />
        {/* Measured multi-stop dark scrim guaranteeing >4.5:1 text contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0B0D0B] via-[#0B0D0B]/90 to-[#0B0D0B]/55"
        />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#C6FF00]">
            NEXT STEP
          </p>
          <h2
            id="final-banner-heading"
            className="mt-3 font-display headline-balance text-[clamp(2.35rem,4.8vw,4rem)] font-bold leading-[1.0] text-[#F7F8F5]"
          >
            STOP WAITING FOR THE PERFECT TIME.
          </h2>
          <p className="mt-5 max-w-[54ch] text-base sm:text-lg leading-relaxed text-[#F7F8F5]/85">
            Start with a conversation. Build a realistic plan. Take your next
            step toward a stronger you.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3.5">
            <button
              type="button"
              onClick={onPrimaryCta}
              className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-md bg-[#C6FF00] px-7 py-3.5 text-sm font-bold tracking-wide text-[#0B0D0B] hover:bg-[#d4ff38] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-all duration-150 whitespace-nowrap"
            >
              <span>GET MY FREE FITNESS PLAN</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>

            {verifiedTelHref ? (
              <a
                href={verifiedTelHref}
                onClick={() =>
                  trackConversionEvent('phone_click', {
                    section_source: 'final_banner',
                  })
                }
                className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-md border border-[#2A3028] bg-[#121512]/90 px-6 py-3.5 text-sm font-semibold text-[#F7F8F5] hover:border-[#C6FF00]/70 hover:bg-[#191D19] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors whitespace-nowrap"
              >
                <Phone
                  className="h-4 w-4 text-[#C6FF00] shrink-0"
                  aria-hidden="true"
                />
                <span>CALL THE COACH</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={onScrollToPhoneSetup}
                title={config.contact.phoneSetupPlaceholder}
                className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-md border border-[#2A3028] bg-[#121512]/90 px-6 py-3.5 text-sm font-semibold text-[#F7F8F5] hover:border-[#A5AAA1]/60 hover:bg-[#191D19] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors whitespace-nowrap"
              >
                <Phone
                  className="h-4 w-4 text-[#A5AAA1] shrink-0"
                  aria-hidden="true"
                />
                <span>CALL THE COACH</span>
              </button>
            )}
          </div>

          <p className="mt-4 text-xs text-[#A5AAA1]">
            {verifiedPhoneDisplay
              ? `Direct phone line: ${verifiedPhoneDisplay}`
              : `Phone status: ${config.contact.phoneSetupPlaceholder}`}
          </p>
        </div>
      </div>
    </section>
  );
}
