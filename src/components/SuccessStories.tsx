import { ArrowRight, FileCheck2 } from 'lucide-react';
import { useSiteConfig } from '../lib/SiteConfigContext';
import { useScrollReveal } from '../lib/useReveal';
import { ResilientImage } from './ResilientImage';

interface SuccessStoriesProps {
  onStartJourneyCta: () => void;
}

const CASE_STUDY_PILLARS = [
  {
    index: '01',
    label: 'Starting Context & Goal',
    detail:
      'Documents the client’s initial routine, weekly schedule constraints, and personal training objective.',
  },
  {
    index: '02',
    label: 'Structured Coaching Approach',
    detail:
      'Outlines training frequency, equipment setup, and how workouts were adjusted across review cycles.',
  },
  {
    index: '03',
    label: 'Verified Progress Milestones',
    detail:
      'Shares authentic, client-approved feedback on consistency, movement confidence, and habit sustainability.',
  },
] as const;

export function SuccessStories({ onStartJourneyCta }: SuccessStoriesProps) {
  const { config } = useSiteConfig();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const stories = config.successStories;

  return (
    <section
      id="success-stories"
      aria-labelledby="success-stories-heading"
      className="scroll-mt-20 border-t border-[#2A3028] bg-[#0B0D0B] py-20 sm:py-24"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#C6FF00]">
            CLIENT EXPERIENCES
          </p>
          <h2
            id="success-stories-heading"
            className="mt-3 font-display headline-balance text-[clamp(2rem,3.8vw,3.25rem)] font-bold leading-[1.04] text-[#F7F8F5]"
          >
            EVERY JOURNEY STARTS SOMEWHERE.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#A5AAA1]">
            Individual outcomes vary based on starting point, consistency, and
            schedule. Every case study published here reflects real, client-approved
            coaching experiences.
          </p>
        </div>

        {stories.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2">
            {stories.map((story) => (
              <article
                key={story.id}
                className="flex flex-col justify-between rounded-xl border border-[#2A3028] bg-[#191D19] p-7 sm:p-8"
              >
                <div>
                  {story.approvedPhotoSrc ? (
                    <div className="mb-6 aspect-[16/10] overflow-hidden rounded-lg bg-[#0B0D0B]">
                      <ResilientImage
                        src={story.approvedPhotoSrc}
                        alt={
                          story.approvedPhotoAlt ||
                          `Approved client progress photo for ${story.clientIdentifier}`
                        }
                        fallbackLabel={story.clientIdentifier}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <p className="text-xs font-medium text-[#A5AAA1]">
                    <span className="text-[#F7F8F5] font-semibold">
                      {story.clientIdentifier}
                    </span>{' '}
                    <span aria-hidden="true">·</span> {story.duration}
                  </p>

                  <h3 className="mt-3 font-display text-2xl font-bold text-[#F7F8F5]">
                    Goal: {story.originalGoal}
                  </h3>

                  <p className="mt-2 text-sm text-[#A5AAA1]">
                    Approach: {story.coachingApproach}
                  </p>

                  <blockquote className="mt-5 border-t border-[#2A3028] pt-5 text-sm sm:text-base leading-relaxed text-[#F7F8F5]">
                    &ldquo;{story.clientFeedback}&rdquo;
                  </blockquote>
                </div>

                {story.verifiedProgressIndicators.length > 0 ? (
                  <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#2A3028] pt-4 text-xs text-[#C6FF00]">
                    {story.verifiedProgressIndicators.map((indicator, idx) => (
                      <li key={indicator} className="inline-flex items-center gap-3">
                        {idx > 0 ? (
                          <span aria-hidden="true" className="text-[#2A3028]">
                            ·
                          </span>
                        ) : null}
                        <span>{indicator}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          /* Elegant Owner-Ready Placeholder State — Zero Fabricated Testimonials */
          <div className="mt-12 rounded-xl border border-[#2A3028] bg-[#191D19] p-7 sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C6FF00]">
                  <FileCheck2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>VERIFIED CASE STUDIES ONLY</span>
                </div>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-[#F7F8F5]">
                  Client Stories Reserved for Approved Experiences
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A5AAA1]">
                  Rather than displaying stock testimonials or unverified transformation
                  claims, this section is ready for authentic client case studies once
                  written permission is collected. Add verified entries anytime in{' '}
                  <code className="font-mono-num text-xs text-[#F7F8F5]">
                    src/data/siteConfig.ts
                  </code>
                  .
                </p>
              </div>

              <button
                type="button"
                onClick={onStartJourneyCta}
                className="inline-flex min-h-[46px] w-fit items-center justify-center gap-2 rounded-md border border-[#2A3028] bg-[#121512] px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wide text-[#F7F8F5] hover:border-[#C6FF00] hover:text-[#C6FF00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors whitespace-nowrap shrink-0"
              >
                <span>START YOUR OWN PLAN</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#2A3028] pt-8 md:grid-cols-3">
              {CASE_STUDY_PILLARS.map((item) => (
                <div key={item.index}>
                  <span className="font-mono-num text-xs text-[#C6FF00]">
                    {item.index}.
                  </span>
                  <h4 className="mt-2 text-base font-semibold text-[#F7F8F5]">
                    {item.label}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#A5AAA1]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
