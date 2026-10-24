import { ArrowRight } from 'lucide-react';
import { useSiteConfig } from '../lib/SiteConfigContext';
import { useScrollReveal } from '../lib/useReveal';
import { ResilientImage } from './ResilientImage';

interface CoachSectionProps {
  onTalkAboutGoalsCta: () => void;
}

export function CoachSection({ onTalkAboutGoalsCta }: CoachSectionProps) {
  const { config } = useSiteConfig();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const { coach } = config;

  return (
    <section
      id="about"
      aria-labelledby="coach-heading"
      className="scroll-mt-20 border-t border-[#2A3028] bg-[#121512] py-20 sm:py-24"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Portrait Column */}
          <div className="lg:col-span-5 flex">
            <div className="relative w-full overflow-hidden rounded-xl border border-[#2A3028] bg-[#191D19] min-h-[380px] sm:min-h-[460px]">
              <ResilientImage
                src={coach.portraitSrc}
                alt={coach.portraitAlt}
                fallbackLabel={coach.name}
                className="h-full w-full object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0D0B]/85 via-transparent to-transparent"
              />
              <div className="absolute bottom-5 left-6 right-6">
                <p className="font-display text-2xl font-bold tracking-tight text-[#F7F8F5]">
                  {coach.name}
                </p>
                <p className="mt-0.5 text-xs tracking-wide text-[#A5AAA1]">
                  Online Personal Fitness Coach
                  {coach.verifiedExperience ? (
                    <>
                      {' '}
                      <span aria-hidden="true">·</span> {coach.verifiedExperience}
                    </>
                  ) : null}
                </p>
              </div>
            </div>
          </div>

          {/* Bio & Philosophy Column */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#C6FF00]">
              MEET YOUR COACH
            </p>
            <h2
              id="coach-heading"
              className="mt-3 font-display headline-balance text-[clamp(2rem,3.8vw,3.25rem)] font-bold leading-[1.04] text-[#F7F8F5]"
            >
              {coach.headline}
            </h2>

            {/* Philosophy Callout — Hairline Surface, No Thick Left Border */}
            <blockquote className="mt-6 rounded-xl border border-[#2A3028] bg-[#191D19] p-6 text-base sm:text-lg font-medium leading-relaxed text-[#F7F8F5]">
              &ldquo;{coach.philosophyQuote}&rdquo;
            </blockquote>

            <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-[#A5AAA1]">
              {coach.biographyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Specialties & Verified Qualifications */}
            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#2A3028] pt-6 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-[#F7F8F5]">
                  COACHING FOCUS AREAS
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-[#A5AAA1]">
                  {coach.specialties.map((specialty) => (
                    <li key={specialty} className="flex items-baseline gap-2">
                      <span aria-hidden="true" className="text-[#C6FF00]">
                        /
                      </span>
                      <span>{specialty}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-wider text-[#F7F8F5]">
                  QUALIFICATIONS &amp; CREDENTIALS
                </h3>
                {coach.verifiedQualifications.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-[#A5AAA1]">
                    {coach.verifiedQualifications.map((cred) => (
                      <li key={cred} className="flex items-baseline gap-2">
                        <span aria-hidden="true" className="text-[#C6FF00]">
                          /
                        </span>
                        <span>{cred}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-[#A5AAA1]/85">
                    {coach.qualificationsPlaceholder}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-9">
              <button
                type="button"
                onClick={onTalkAboutGoalsCta}
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-md bg-[#C6FF00] px-6 py-3 text-sm font-bold tracking-wide text-[#0B0D0B] hover:bg-[#d4ff38] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-all duration-150 whitespace-nowrap"
              >
                <span>LET&apos;S TALK ABOUT YOUR GOALS</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
