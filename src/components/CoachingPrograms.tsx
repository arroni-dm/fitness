import { ArrowUpRight, Check } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
  COACHING_PROGRAM_CARDS,
  type CoachingProgramCard,
} from '../data/programs';
import { trackConversionEvent } from '../lib/analytics';
import { ResilientImage } from './ResilientImage';

interface CoachingProgramsProps {
  selectedProgram: string | null;
  onSelectProgram: (
    programTitle: CoachingProgramCard['title'],
    defaultGoal: CoachingProgramCard['defaultGoal']
  ) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CoachingPrograms({
  selectedProgram,
  onSelectProgram,
}: CoachingProgramsProps) {
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

  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.11,
        delayChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.58,
        ease: EASE_OUT_EXPO,
      },
    },
  };

  return (
    <section
      id="coaching"
      aria-labelledby="coaching-programs-heading"
      className="scroll-mt-20 border-t border-[#2A3028] bg-[#121512] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#C6FF00]">
              ONLINE COACHING OPTIONS
            </p>
            <h2
              id="coaching-programs-heading"
              className="mt-3 font-display headline-balance text-[clamp(2rem,3.8vw,3.25rem)] font-bold leading-[1.04] text-[#F7F8F5]"
            >
              FIND YOUR FOCUS. BUILD YOUR PLAN.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#A5AAA1]">
            Choose the coaching track closest to your goal—your program selection
            carries directly into the consultation request form below.
          </p>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2"
        >
          {COACHING_PROGRAM_CARDS.map((program) => {
            const isSelected = selectedProgram === program.title;
            return (
              <motion.article
                key={program.id}
                variants={cardVariants}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -4,
                        transition: { duration: 0.18, ease: EASE_OUT_EXPO },
                      }
                }
                className={`group flex flex-col overflow-hidden rounded-xl border bg-[#191D19] transition-colors duration-200 ${
                  isSelected
                    ? 'border-[#C6FF00]'
                    : 'border-[#2A3028] hover:border-[#C6FF00]/50'
                }`}
              >
                {/* 4:3 Editorial Program Photography */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B0D0B]">
                  <ResilientImage
                    src={program.imageSrc}
                    alt={program.imageAlt}
                    fallbackLabel={program.title}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#191D19] via-[#0B0D0B]/20 to-transparent"
                  />
                  <div className="absolute bottom-4 left-6 right-6 flex items-baseline justify-between gap-4">
                    <span className="text-xs font-medium tracking-wide text-[#A5AAA1]">
                      <span className="font-mono-num text-[#C6FF00]">
                        {program.indexLabel}
                      </span>{' '}
                      <span aria-hidden="true">·</span> {program.audienceNote}
                    </span>
                    {program.priceLabel ? (
                      <span className="font-mono-num text-xs font-semibold text-[#F7F8F5]">
                        {program.priceLabel}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8 pt-5">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F8F5]">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A5AAA1]">
                      {program.description}
                    </p>

                    {/* Three Key Inclusions */}
                    <ul className="mt-6 space-y-2.5 border-t border-[#2A3028] pt-5">
                      {program.inclusions.map((inclusion) => (
                        <li
                          key={inclusion}
                          className="flex items-start gap-2.5 text-sm text-[#F7F8F5]/90"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#C6FF00]"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          <span>{inclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        trackConversionEvent('program_select', {
                          program_name: program.title,
                          goal_category: program.defaultGoal,
                          section_source: 'programs_grid',
                        });
                        onSelectProgram(program.title, program.defaultGoal);
                      }}
                      className={`inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-xs sm:text-sm font-bold tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#C6FF00] text-[#0B0D0B] hover:bg-[#d4ff38]'
                          : 'border border-[#2A3028] bg-[#121512] text-[#F7F8F5] hover:border-[#C6FF00] hover:bg-[#C6FF00] hover:text-[#0B0D0B]'
                      }`}
                    >
                      <span>CHOOSE THIS PROGRAM</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
