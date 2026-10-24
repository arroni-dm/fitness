import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { useSiteConfig } from '../lib/SiteConfigContext';

export function Terms() {
  const { config } = useSiteConfig();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0D0B] text-[#F7F8F5] flex flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C6FF00] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>BACK TO HOME</span>
        </Link>

        <h1 className="mt-6 font-display text-4xl sm:text-5xl font-bold text-[#F7F8F5]">
          TERMS AND CONDITIONS
        </h1>
        <p className="mt-2 text-xs text-[#A5AAA1]">
          Effective Date: {config.legal.effectiveDatePlaceholder} · Governing
          Jurisdiction: {config.legal.governingJurisdictionPlaceholder}
        </p>

        <div className="mt-6 rounded-xl border border-[#2A3028] bg-[#191D19] p-5 text-xs leading-relaxed text-[#A5AAA1]">
          Editable Legal Template: Update business entity, refund/cancellation
          terms, and governing jurisdiction in{' '}
          <code className="font-mono-num text-[#F7F8F5]">
            src/data/siteConfig.ts
          </code>{' '}
          before accepting paid coaching enrollments.
        </div>

        <div className="mt-10 space-y-8 text-sm sm:text-base leading-relaxed text-[#A5AAA1]">
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-[#F7F8F5]">
              1. Nature of Consultation Inquiries
            </h2>
            <p>
              Submitting a consultation form or calling to discuss online
              coaching options is free and creates no contractual obligation for
              either party. Formal coaching services begin only after you review
              and accept a dedicated coaching agreement and schedule.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-[#F7F8F5]">
              2. Fitness &amp; Medical Disclaimer
            </h2>
            <p>
              Online personal fitness coaching provides general exercise
              programming, habit structure, and accountability. Content on this
              website does not constitute medical advice, physical therapy, or
              clinical dietetic treatment. Consult a qualified physician before
              beginning a new exercise program, especially if you have
              pre-existing health conditions or injuries.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-[#F7F8F5]">
              3. Individual Results
            </h2>
            <p>
              Fitness progress depends on individual consistency, training
              history, recovery, sleep, nutrition, and lifestyle factors. We make
              no guarantees regarding specific weight changes, strength gains, or
              timelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-[#F7F8F5]">
              4. Intellectual Property
            </h2>
            <p>
              Training plans, educational guides, and website materials provided
              by {config.brandName} remain the property of the business and are
              intended solely for individual client use.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
