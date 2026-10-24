import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faq';
import { useScrollReveal } from '../lib/useReveal';

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-20 border-t border-[#2A3028] bg-[#0B0D0B] py-20 sm:py-24"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#C6FF00]">
              COMMON QUESTIONS
            </p>
            <h2
              id="faq-heading"
              className="mt-3 font-display headline-balance text-[clamp(2rem,3.8vw,3.25rem)] font-bold leading-[1.04] text-[#F7F8F5]"
            >
              CLEAR ANSWERS BEFORE YOU START.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#A5AAA1]">
              Everything you need to know about how remote workout programming,
              equipment flexibility, and progress reviews work.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-[#2A3028] rounded-xl border border-[#2A3028] bg-[#191D19]">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openId === item.id;
                const panelId = `faq-panel-${item.id}`;
                const triggerId = `faq-trigger-${item.id}`;

                return (
                  <div key={item.id} className="px-6 sm:px-8">
                    <h3>
                      <button
                        id={triggerId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleItem(item.id)}
                        className="flex min-h-[60px] w-full items-center justify-between gap-4 py-5 text-left text-base sm:text-lg font-semibold text-[#F7F8F5] hover:text-[#C6FF00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-colors"
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="font-mono-num text-xs text-[#C6FF00]">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span>{item.question}</span>
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-[#A5AAA1] transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#C6FF00]' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className={`grid transition-all duration-200 ease-out ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100 pb-6'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pl-7 text-sm sm:text-base leading-relaxed text-[#A5AAA1]">
                          {item.answer}
                        </p>
                        {item.policyNote ? (
                          <p className="mt-2.5 pl-7 text-xs text-[#A5AAA1]/80">
                            {item.policyNote}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
