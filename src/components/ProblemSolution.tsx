import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../lib/useReveal';

interface ProblemSolutionProps {
  onFindPlanCta: () => void;
}

const SOLUTION_PILLARS = [
  {
    index: '01',
    title: 'No More Guesswork',
    description:
      'Get a structured training approach aligned with your goals and current experience.',
    spanClass: 'lg:col-span-5',
  },
  {
    index: '02',
    title: 'Fitness That Fits Your Schedule',
    description:
      'Explore online coaching designed to work around your daily commitments.',
    spanClass: 'lg:col-span-7',
  },
  {
    index: '03',
    title: 'Progress With Purpose',
    description:
      'Review your progress and adapt your training as your needs evolve.',
    spanClass: 'lg:col-span-12',
  },
] as const;

export function ProblemSolution({ onFindPlanCta }: ProblemSolutionProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="problem-solution-heading"
      className="bg-[#0B0D0B] py-20 sm:py-24"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <div className="max-w-3xl">
          <h2
            id="problem-solution-heading"
            className="font-display headline-balance text-[clamp(2rem,3.8vw,3.25rem)] font-bold leading-[1.04] text-[#F7F8F5]"
          >
            YOU DON&apos;T NEED ANOTHER RANDOM WORKOUT.
          </h2>
          <p className="mt-4 max-w-[62ch] text-base sm:text-lg leading-relaxed text-[#A5AAA1]">
            You need a plan that fits your life, clear direction, and a coaching
            approach that helps you stay consistent.
          </p>
        </div>

        {/* Asymmetric Bento Grid of Three Visually Distinctive Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {SOLUTION_PILLARS.map((card, index) => (
            <article
              key={card.index}
              className={`${card.spanClass} group flex flex-col justify-between rounded-xl border border-[#2A3028] bg-[#191D19] p-7 sm:p-8 hover:border-[#C6FF00]/45 transition-colors duration-200`}
            >
              <div className={index === 2 ? 'lg:flex lg:items-baseline lg:justify-between lg:gap-12' : ''}>
                <div>
                  <span className="font-mono-num text-xs font-medium text-[#C6FF00]">
                    {card.index}.
                  </span>
                  <h3 className="mt-3 font-display text-2xl sm:text-[1.75rem] font-bold tracking-tight text-[#F7F8F5]">
                    {card.title}
                  </h3>
                </div>
                <p
                  className={`mt-3 text-base leading-relaxed text-[#A5AAA1] ${
                    index === 2 ? 'lg:mt-0 lg:max-w-xl' : 'max-w-[52ch]'
                  }`}
                >
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <button
            type="button"
            onClick={onFindPlanCta}
            className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-md bg-[#C6FF00] px-6 py-3 text-sm font-bold tracking-wide text-[#0B0D0B] hover:bg-[#d4ff38] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-all duration-150 whitespace-nowrap"
          >
            <span>FIND MY COACHING PLAN</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
