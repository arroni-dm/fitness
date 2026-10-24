import {
  BarChart3,
  CalendarRange,
  ClipboardCheck,
  Compass,
  SlidersHorizontal,
  UserCheck,
} from 'lucide-react';
import { useScrollReveal } from '../lib/useReveal';

const BENEFITS_LIST = [
  {
    icon: ClipboardCheck,
    title: 'Personalized Workout Plans',
    description:
      'Training sessions structured specifically for your experience level, movement comfort, and available equipment.',
  },
  {
    icon: CalendarRange,
    title: 'Flexible Online Training',
    description:
      'Complete your workouts at the times and locations that suit your weekly work and family commitments.',
  },
  {
    icon: Compass,
    title: 'Goal-Based Programming',
    description:
      'Every exercise block is selected to support your primary focus—whether body composition, muscle, or strength.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description:
      'Clear visibility into completed sessions, workload progression, and training consistency over time.',
  },
  {
    icon: UserCheck,
    title: 'Coaching Accountability',
    description:
      'Structured check-ins help you troubleshoot busy weeks early instead of restarting from scratch.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Ongoing Plan Adjustments',
    description:
      'Your program evolves constructively as your strength improves or your weekly availability shifts.',
  },
] as const;

export function Benefits() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="benefits-heading"
      className="border-t border-[#2A3028] bg-[#121512] py-20 sm:py-24"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#C6FF00]">
            WHY STRUCTURED REMOTE COACHING WORKS
          </p>
          <h2
            id="benefits-heading"
            className="mt-3 font-display headline-balance text-[clamp(2rem,3.8vw,3.25rem)] font-bold leading-[1.04] text-[#F7F8F5]"
          >
            MORE CLARITY. MORE CONSISTENCY.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS_LIST.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl border border-[#2A3028] bg-[#191D19] p-7 hover:border-[#C6FF00]/45 transition-colors duration-200"
            >
              <Icon
                className="h-5 w-5 text-[#C6FF00]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-[#F7F8F5]">
                {title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#A5AAA1]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
