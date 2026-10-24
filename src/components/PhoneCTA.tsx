import { Phone } from 'lucide-react';
import { trackConversionEvent } from '../lib/analytics';
import { useSiteConfig } from '../lib/SiteConfigContext';

export function PhoneCTA() {
  const { config, verifiedTelHref, verifiedPhoneDisplay } = useSiteConfig();

  return (
    <section
      id="direct-phone-contact"
      aria-labelledby="phone-cta-heading"
      className="scroll-mt-24 border-t border-[#2A3028] bg-[#121512] py-14 sm:py-16"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 rounded-xl border border-[#2A3028] bg-[#191D19] p-7 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#C6FF00]">
              DIRECT PHONE CONSULTATION
            </p>
            <h2
              id="phone-cta-heading"
              className="mt-2.5 font-display headline-balance text-[clamp(1.85rem,3.2vw,2.75rem)] font-bold leading-[1.05] text-[#F7F8F5]"
            >
              PREFER A QUICK CONVERSATION?
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A5AAA1]">
              Call to discuss your fitness goals, ask questions, and learn about
              available online coaching options.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2.5 shrink-0">
            {verifiedTelHref ? (
              <>
                <a
                  href={verifiedTelHref}
                  onClick={() =>
                    trackConversionEvent('phone_click', {
                      section_source: 'direct_phone_strip',
                    })
                  }
                  className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-md bg-[#C6FF00] px-7 py-3.5 text-sm font-bold tracking-wider text-[#0B0D0B] hover:bg-[#d4ff38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors whitespace-nowrap"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>CALL NOW</span>
                </a>
                <span className="font-mono-num text-xs text-[#A5AAA1]">
                  {verifiedPhoneDisplay}
                </span>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex min-h-[50px] cursor-not-allowed items-center justify-center gap-2.5 rounded-md border border-[#2A3028] bg-[#121512] px-7 py-3.5 text-sm font-bold tracking-wider text-[#A5AAA1]/70 whitespace-nowrap"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>CALL NOW</span>
                </button>
                <p className="max-w-xs text-xs leading-relaxed text-[#A5AAA1] lg:text-right">
                  {config.contact.phoneSetupPlaceholder} — live{' '}
                  <code className="font-mono-num text-[#F7F8F5]">tel:</code>{' '}
                  calling activates automatically once configured.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
