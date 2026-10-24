import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import {
  getAnalyticsConsent,
  hasConfiguredAnalyticsIds,
  setAnalyticsConsent,
} from '../lib/analytics';
import { useSiteConfig } from '../lib/SiteConfigContext';

export function PrivacyPolicy() {
  const { config, verifiedEmailDisplay } = useSiteConfig();
  const [consent, setConsent] = useState(() => getAnalyticsConsent());

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
          PRIVACY POLICY
        </h1>
        <p className="mt-2 text-xs text-[#A5AAA1]">
          Effective Date: {config.legal.effectiveDatePlaceholder} · Data
          Controller: {config.legal.dataControllerPlaceholder}
        </p>

        <div className="mt-6 rounded-xl border border-[#2A3028] bg-[#191D19] p-5 text-xs leading-relaxed text-[#A5AAA1]">
          Editable Legal Notice: Review and customize the placeholders in{' '}
          <code className="font-mono-num text-[#F7F8F5]">
            src/data/siteConfig.ts
          </code>{' '}
          and this template with qualified legal counsel to reflect your exact
          business entity and jurisdiction before launch.
        </div>

        <div className="mt-10 space-y-8 text-sm sm:text-base leading-relaxed text-[#A5AAA1]">
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-[#F7F8F5]">
              1. Information We Collect
            </h2>
            <p>
              When you submit a coaching consultation inquiry on this website, we
              collect only the contact and training preference details you choose
              to share: your full name, email address, phone number, primary
              fitness goal, preferred coaching program, optional experience
              level, preferred contact method, best time to contact, and any
              short additional notes you enter.
            </p>
            <p>
              Please do not submit sensitive medical records, diagnostic history,
              or payment details through the initial consultation request form.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-[#F7F8F5]">
              2. How Your Information Is Used
            </h2>
            <p>
              Your inquiry information is used solely to review your fitness
              goals, respond via your selected communication method, and discuss
              whether an online coaching program is suitable for you. We do not
              sell or rent personal inquiry records to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-[#F7F8F5]">
              3. Server Storage &amp; Lead Delivery
            </h2>
            <p>
              Submitted inquiries are validated on the server and stored in a
              restricted server-side database. Where configured by the business
              owner, inquiries may also trigger an encrypted notification to a
              designated coach inbox or customer relationship management (CRM)
              webhook.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-[#F7F8F5]">
              4. Conversion Analytics &amp; Your Consent Choice
            </h2>
            <p>
              When analytics measurement IDs are configured, aggregate conversion
              events (such as program selection or completed form submissions)
              may be measured without transmitting names, emails, phone numbers,
              or free-text messages. Tracking remains off until a valid
              measurement ID is configured and consent is granted.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-[#2A3028] bg-[#121512] p-4">
              <span className="text-xs text-[#F7F8F5]">
                Analytics Measurement Preference (
                {hasConfiguredAnalyticsIds()
                  ? `Currently: ${consent}`
                  : 'No Measurement ID Configured — Tracking Inactive'}
                ):
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAnalyticsConsent('granted');
                    setConsent('granted');
                  }}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                    consent === 'granted'
                      ? 'bg-[#C6FF00] text-[#0B0D0B]'
                      : 'border border-[#2A3028] text-[#F7F8F5] hover:border-[#C6FF00]'
                  }`}
                >
                  Allow Analytics
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnalyticsConsent('denied');
                    setConsent('denied');
                  }}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                    consent === 'denied'
                      ? 'bg-[#F7F8F5] text-[#0B0D0B]'
                      : 'border border-[#2A3028] text-[#F7F8F5] hover:border-[#F7F8F5]'
                  }`}
                >
                  Decline Analytics
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-[#F7F8F5]">
              5. Data Access, Correction &amp; Deletion
            </h2>
            <p>
              You may request access to, correction of, or deletion of your
              inquiry details at any time by contacting{' '}
              {verifiedEmailDisplay ? (
                <a
                  href={`mailto:${verifiedEmailDisplay}`}
                  className="text-[#F7F8F5] underline decoration-[#C6FF00]/70 underline-offset-4"
                >
                  {verifiedEmailDisplay}
                </a>
              ) : (
                <span className="text-[#F7F8F5]">
                  {config.contact.emailSetupPlaceholder}
                </span>
              )}
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
