import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

interface HowItWorksProps {
  onDiscussGoalsCta: () => void;
}

const STEPS = [
  {
    stepLabel: 'STEP 01',
    title: 'Tell Us Your Goals',
    description:
      'Complete a short inquiry form describing your goals, experience, and preferred coaching option.',
  },
  {
    stepLabel: 'STEP 02',
    title: 'Discuss Your Plan',
    description:
      'The coach reviews your inquiry and contacts you using the communication method you select.',
  },
  {
    stepLabel: 'STEP 03',
    title: 'Start Your Coaching Journey',
    description:
      'After agreeing on the appropriate program, receive the onboarding instructions and begin according to the agreed schedule.',
  },
] as const;

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HowItWorks({ onDiscussGoalsCta }: HowItWorksProps) {
  const shouldReduceMotion = useReducedMotion();

  const headerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: EASE_OUT_EXPO,
      },
    },
  };

  const timelineVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.14,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const stepVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.56,
        ease: EASE_OUT_EXPO,
      },
    },
  };

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-20 border-t border-[#2A3028] bg-[#0B0D0B] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold tracking-[0.16em] text-[#C6FF00]">
            THE ONBOARDING PROCESS
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-3 font-display headline-balance text-[clamp(2rem,3.8vw,3.25rem)] font-bold leading-[1.04] text-[#F7F8F5]"
          >
            YOUR FITNESS JOURNEY, MADE SIMPLE.
          </h2>
        </motion.div>

        {/* Horizontal Timeline on Desktop / Stacked Cards on Mobile */}
        <div className="relative mt-14">
          <motion.div
            aria-hidden="true"
            initial={{
              scaleX: shouldReduceMotion ? 1 : 0,
              opacity: shouldReduceMotion ? 1 : 0,
            }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: EASE_OUT_EXPO }}
            style={{ transformOrigin: 'left center' }}
            className="hidden lg:block absolute top-6 left-0 right-0 h-[1px] bg-[#2A3028]"
          />

          <motion.div
            variants={timelineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
          >
            {STEPS.map((step) => (
              <motion.div
                key={step.stepLabel}
                variants={stepVariants}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -3,
                        transition: { duration: 0.18, ease: EASE_OUT_EXPO },
                      }
                }
                className="relative flex flex-col rounded-xl border border-[#2A3028] bg-[#191D19] p-7 sm:p-8 lg:bg-transparent lg:border-0 lg:p-0"
              >
                <div className="inline-flex h-12 w-fit items-center bg-[#0B0D0B] lg:pr-5">
                  <span className="font-mono-num text-xs font-semibold tracking-wider text-[#C6FF00] border border-[#2A3028] bg-[#121512] px-3 py-1.5 rounded-sm">
                    {step.stepLabel}
                  </span>
                </div>

                <div className="mt-5 lg:mt-7 lg:rounded-xl lg:border lg:border-[#2A3028] lg:bg-[#191D19] lg:p-8 lg:flex-1 hover:border-[#C6FF00]/45 transition-colors duration-200">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-[#F7F8F5]">
                    {step.stepLabel} — {step.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A5AAA1]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.2, ease: EASE_OUT_EXPO }}
          className="mt-12"
        >
          <button
            type="button"
            onClick={onDiscussGoalsCta}
            className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-md bg-[#C6FF00] px-6 py-3 text-sm font-bold tracking-wide text-[#0B0D0B] hover:bg-[#d4ff38] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-all duration-150 whitespace-nowrap"
          >
            <span>LET&apos;S DISCUSS MY GOALS</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
