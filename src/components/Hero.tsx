import { ArrowRight, Phone } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { VISUAL_ASSETS } from '../data/visualAssets';
import { trackConversionEvent } from '../lib/analytics';
import { useSiteConfig } from '../lib/SiteConfigContext';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onPrimaryCta: () => void;
  onScrollToPhoneSetup: () => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero({ onPrimaryCta, onScrollToPhoneSetup }: HeroProps) {
  const { config, verifiedTelHref, verifiedPhoneDisplay } = useSiteConfig();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const headlineClauseVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.62,
        ease: EASE_OUT_EXPO,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 14,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.52,
        ease: EASE_OUT_EXPO,
      },
    },
  };

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#0B0D0B] pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24"
    >
      {/* Subtle architectural radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-[#C6FF00]/[0.04] blur-3xl"
      />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Staggered Framer Motion Entrance */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center lg:col-span-7"
          >
            <motion.p
              variants={itemVariants}
              className="mb-5 text-xs font-semibold tracking-[0.16em] text-[#C6FF00]"
            >
              ONLINE PERSONAL FITNESS COACHING
            </motion.p>

            <h1
              id="hero-heading"
              className="font-display headline-balance text-[clamp(2.65rem,5.4vw,4.75rem)] font-bold leading-[0.98] tracking-tight text-[#F7F8F5]"
            >
              <motion.span
                variants={headlineClauseVariants}
                className="inline-block mr-[0.22em]"
              >
                YOUR GOALS.
              </motion.span>
              <motion.span
                variants={headlineClauseVariants}
                className="inline-block mr-[0.22em]"
              >
                YOUR PLAN.
              </motion.span>
              <motion.span
                variants={headlineClauseVariants}
                className="inline-block text-[#C6FF00]"
              >
                YOUR STRONGER SELF.
              </motion.span>
            </h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-[60ch] text-base sm:text-lg leading-relaxed text-[#A5AAA1]"
            >
              Get personalized fitness coaching built around your goals, lifestyle, and
              schedule. Train with a clear plan, stay accountable, and build habits you
              can maintain.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3.5"
            >
              <button
                type="button"
                onClick={onPrimaryCta}
                className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-md bg-[#C6FF00] px-7 py-3.5 text-sm font-bold tracking-wide text-[#0B0D0B] hover:bg-[#d4ff38] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-all duration-150 whitespace-nowrap shrink-0"
              >
                <span>GET MY FREE FITNESS PLAN</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>

              {verifiedTelHref ? (
                <a
                  href={verifiedTelHref}
                  onClick={() =>
                    trackConversionEvent('phone_click', { section_source: 'hero' })
                  }
                  className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-md border border-[#2A3028] bg-[#121512] px-6 py-3.5 text-sm font-semibold text-[#F7F8F5] hover:border-[#C6FF00]/70 hover:bg-[#191D19] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <Phone className="h-4 w-4 text-[#C6FF00] shrink-0" aria-hidden="true" />
                  <span>CALL THE COACH</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onScrollToPhoneSetup}
                  title={config.contact.phoneSetupPlaceholder}
                  className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-md border border-[#2A3028] bg-[#121512] px-6 py-3.5 text-sm font-semibold text-[#F7F8F5] hover:border-[#A5AAA1]/60 hover:bg-[#191D19] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <Phone className="h-4 w-4 text-[#A5AAA1] shrink-0" aria-hidden="true" />
                  <span>CALL THE COACH</span>
                </button>
              )}
            </motion.div>

            {/* Microcopy & Unconfigured Phone Honesty Note */}
            <motion.div variants={itemVariants} className="mt-4 space-y-1">
              <p className="text-xs sm:text-sm text-[#A5AAA1]">
                Tell us your goals. We&apos;ll help you explore the right coaching approach.
              </p>
              {verifiedPhoneDisplay ? (
                <p className="text-xs text-[#A5AAA1]">
                  Direct line:{' '}
                  <span className="font-mono-num text-[#F7F8F5]">
                    {verifiedPhoneDisplay}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-[#A5AAA1]/80">
                  Direct phone line: {config.contact.phoneSetupPlaceholder}
                </p>
              )}
            </motion.div>

            {/* Three Concise Unboxed Value Indicators (Zero-Pill Discipline) */}
            <motion.div
              variants={itemVariants}
              className="mt-10 border-t border-[#2A3028] pt-6"
            >
              <ul
                aria-label="Key Coaching Value Indicators"
                className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-[#F7F8F5]"
              >
                <li>Personalized Coaching</li>
                <li aria-hidden="true" className="text-[#C6FF00]">
                  ·
                </li>
                <li>Flexible Online Training</li>
                <li aria-hidden="true" className="text-[#C6FF00]">
                  ·
                </li>
                <li>Progress-Focused Support</li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Right Column: Editorial Athletic Portrait */}
          <motion.div
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 18,
              scale: shouldReduceMotion ? 1 : 0.985,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.72, delay: 0.14, ease: EASE_OUT_EXPO }}
            className="relative lg:col-span-5 flex"
          >
            <div className="relative w-full overflow-hidden rounded-xl border border-[#2A3028] bg-[#191D19] min-h-[380px] sm:min-h-[460px] lg:min-h-[540px]">
              <ResilientImage
                src={VISUAL_ASSETS.heroPortrait.src}
                alt={VISUAL_ASSETS.heroPortrait.alt}
                priority
                fallbackLabel="Personalized Strength & Conditioning"
                className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
              />
              {/* Measured dark contrast scrim at base */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0D0B]/85 via-[#0B0D0B]/15 to-transparent"
              />
              {/* Subtle lime corner hairline accent */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-4 right-4 h-6 w-6 border-t border-r border-[#C6FF00]/60"
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium tracking-wider text-[#C6FF00]">
                    REMOTE COACHING STRUCTURE
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#F7F8F5]">
                    Built around your schedule, equipment, and starting level.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
