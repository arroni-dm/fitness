import { CalendarClock, ClipboardList, RefreshCw, Sliders } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Sliders,
    label: 'Coaching Tailored to You',
  },
  {
    icon: CalendarClock,
    label: 'Flexible Training Schedule',
  },
  {
    icon: ClipboardList,
    label: 'Structured Workout Plans',
  },
  {
    icon: RefreshCw,
    label: 'Ongoing Progress Reviews',
  },
] as const;

export function TrustStrip() {
  return (
    <section
      aria-label="Service Pillars"
      className="border-y border-[#2A3028] bg-[#121512]"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-[#2A3028] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {TRUST_ITEMS.map(({ icon: Icon, label }, idx) => (
            <div
              key={label}
              className={`flex items-center gap-3.5 py-5 ${
                idx === 0
                  ? 'lg:pr-6'
                  : idx === TRUST_ITEMS.length - 1
                  ? 'lg:pl-6'
                  : 'lg:px-6'
              } ${idx >= 2 ? 'sm:border-t sm:border-[#2A3028] lg:border-t-0' : ''}`}
            >
              <Icon
                className="h-4 w-4 shrink-0 text-[#C6FF00]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold tracking-tight text-[#F7F8F5]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
