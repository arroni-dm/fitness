import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, CheckCircle2, Loader2 } from 'lucide-react';
import {
  COACHING_PROGRAMS,
  CONTACT_METHODS,
  CONTACT_TIMES,
  PRIMARY_GOALS,
  TRAINING_EXPERIENCE_LEVELS,
  leadSubmissionSchema,
  type LeadSubmissionInput,
  type ValidatedLeadSubmission,
} from '../lib/validation';
import { trackConversionEvent } from '../lib/analytics';

interface LeadFormProps {
  preselectedProgram: (typeof COACHING_PROGRAMS)[number] | null;
  preselectedGoal: (typeof PRIMARY_GOALS)[number] | null;
}

interface SubmissionSuccessData {
  inquiryId: string;
  receivedAt: string;
  storedPersistently: boolean;
  webhookDelivered: boolean;
  emailDelivered: boolean;
}

const FORM_BENEFITS = [
  'No obligation or upfront payment required to inquire',
  'Personal review of your goals, schedule, and starting experience',
  'Follow-up via your preferred channel (Phone Call, WhatsApp, or Email)',
  'Clear guidance on which online coaching option fits your routine',
] as const;

export function LeadForm({ preselectedProgram, preselectedGoal }: LeadFormProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTrackedView = useRef(false);
  const hasTrackedStart = useRef(false);
  const [formStartedAt] = useState<number>(() => Date.now());
  const [serverError, setServerError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SubmissionSuccessData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadSubmissionInput, unknown, ValidatedLeadSubmission>({
    resolver: zodResolver(leadSubmissionSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      primaryGoal: 'Fat Loss',
      preferredProgram: 'Not Sure Yet',
      experienceLevel: '',
      preferredContactMethod: 'Phone Call',
      bestTimeToContact: 'Flexible',
      additionalInfo: '',
      consentAccepted: false,
      companyWebsite: '',
      formStartedAt,
    },
  });

  const watchedProgram = watch('preferredProgram');

  // Sync program card selection into form without wiping user's typed fields
  useEffect(() => {
    if (preselectedProgram) {
      setValue('preferredProgram', preselectedProgram, { shouldValidate: true });
    }
    if (preselectedGoal) {
      setValue('primaryGoal', preselectedGoal, { shouldValidate: true });
    }
  }, [preselectedProgram, preselectedGoal, setValue]);

  // Track lead_form_view once when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasTrackedView.current) {
            hasTrackedView.current = true;
            trackConversionEvent('lead_form_view', {
              section_source: 'primary_lead_form',
            });
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleFirstInteraction = () => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackConversionEvent('lead_form_start', {
        program_name: watchedProgram,
      });
    }
  };

  const onSubmit = async (data: ValidatedLeadSubmission) => {
    setServerError(null);

    trackConversionEvent('lead_form_submit', {
      program_name: data.preferredProgram,
      goal_category: data.primaryGoal,
      contact_preference: data.preferredContactMethod,
    });

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          formStartedAt,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.ok) {
        if (payload?.fieldErrors && typeof payload.fieldErrors === 'object') {
          for (const [key, msg] of Object.entries(payload.fieldErrors)) {
            if (typeof msg === 'string') {
              setError(key as keyof LeadSubmissionInput, {
                type: 'server',
                message: msg,
              });
            }
          }
        }

        const errorCode =
          typeof payload?.code === 'string' ? payload.code : `HTTP_${response.status}`;
        trackConversionEvent('lead_form_error', {
          error_code: errorCode,
          program_name: data.preferredProgram,
        });

        setServerError(
          typeof payload?.message === 'string'
            ? payload.message
            : 'Unable to submit your inquiry right now. Your details have been kept—please try again.'
        );
        return;
      }

      // Fire lead_form_success ONLY after confirmed server-side acceptance
      trackConversionEvent('lead_form_success', {
        program_name: data.preferredProgram,
        goal_category: data.primaryGoal,
        contact_preference: data.preferredContactMethod,
      });

      setSuccessData({
        inquiryId: payload.inquiryId,
        receivedAt: payload.receivedAt,
        storedPersistently: Boolean(payload.delivery?.storedPersistently),
        webhookDelivered: Boolean(payload.delivery?.webhookDelivered),
        emailDelivered: Boolean(payload.delivery?.emailDelivered),
      });
    } catch {
      trackConversionEvent('lead_form_error', {
        error_code: 'NETWORK_ERROR',
        program_name: data.preferredProgram,
      });
      setServerError(
        'Network connection interrupted while sending your inquiry. Your form entries remain intact—please try again.'
      );
    }
  };

  const inputBaseClass =
    'mt-1.5 block w-full rounded-md border bg-[#121512] px-3.5 py-3 text-sm text-[#F7F8F5] placeholder-[#A5AAA1]/55 focus:border-[#C6FF00] focus:outline-none focus:ring-1 focus:ring-[#C6FF00] transition-colors';

  return (
    <section
      id="inquiry-form"
      ref={sectionRef}
      aria-labelledby="lead-form-heading"
      className="scroll-mt-20 border-t border-[#2A3028] bg-[#0B0D0B] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Column: Headline, Supporting Copy & Adjacent Benefit List */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#C6FF00]">
              FREE CONSULTATION INQUIRY
            </p>
            <h2
              id="lead-form-heading"
              className="mt-3 font-display headline-balance text-[clamp(2.1rem,4vw,3.4rem)] font-bold leading-[1.02] text-[#F7F8F5]"
            >
              LET&apos;S BUILD YOUR FITNESS PLAN.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#A5AAA1]">
              Share a few details about your goals. We&apos;ll use them to
              understand what kind of online coaching may suit you.
            </p>

            <ul className="mt-8 space-y-4 border-t border-[#2A3028] pt-7">
              {FORM_BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[#F7F8F5]/90"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#C6FF00]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs leading-relaxed text-[#A5AAA1]">
              Please keep your notes focused on training goals, schedule, and
              equipment access—do not include sensitive medical records in this
              inquiry form.
            </p>
          </div>

          {/* Right Column: Elevated Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-[#2A3028] bg-[#191D19] p-6 sm:p-8 lg:p-10">
              {successData ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="py-6 transition-opacity duration-300"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]">
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#34D399]">
                    YOUR INQUIRY HAS BEEN RECEIVED.
                  </h3>

                  <p className="mt-3 max-w-xl text-base leading-relaxed text-[#F7F8F5]">
                    Thank you for reaching out. The coach will review your details
                    and contact you using your preferred method.
                  </p>

                  <div className="mt-6 border-t border-[#2A3028] pt-5 text-xs text-[#A5AAA1] space-y-1.5">
                    <p>
                      Confirmation Reference:{' '}
                      <span className="font-mono-num text-[#F7F8F5]">
                        {successData.inquiryId}
                      </span>
                    </p>
                    <p>
                      Status: Saved securely to the server inquiry database
                      {successData.emailDelivered
                        ? ' · Coach email notification sent'
                        : ''}
                      {successData.webhookDelivered ? ' · CRM webhook synced' : ''}.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  noValidate
                  onFocus={handleFirstInteraction}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {preselectedProgram ? (
                    <div
                      role="status"
                      className="flex items-center justify-between gap-3 border-b border-[#2A3028] pb-4 text-xs sm:text-sm text-[#F7F8F5]"
                    >
                      <span>
                        Program preselected:{' '}
                        <strong className="text-[#C6FF00]">
                          {watchedProgram}
                        </strong>
                      </span>
                      <span className="text-[#A5AAA1]">Editable below</span>
                    </div>
                  ) : null}

                  {serverError ? (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="flex items-start gap-3 rounded-md border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200"
                    >
                      <AlertCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                        aria-hidden="true"
                      />
                      <span>{serverError}</span>
                    </div>
                  ) : null}

                  {/* Anti-spam honeypot field (hidden from assistive tech and visual layout) */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="companyWebsite">
                      Leave this field blank
                    </label>
                    <input
                      id="companyWebsite"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register('companyWebsite')}
                    />
                  </div>

                  {/* 1. Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold tracking-wide text-[#F7F8F5]"
                    >
                      Full Name <span className="text-[#C6FF00]">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Alex Morgan"
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={
                        errors.fullName ? 'fullName-error' : undefined
                      }
                      className={`${inputBaseClass} ${
                        errors.fullName ? 'border-red-400' : 'border-[#2A3028]'
                      }`}
                      {...register('fullName')}
                    />
                    {errors.fullName ? (
                      <p
                        id="fullName-error"
                        role="alert"
                        className="mt-1.5 text-xs text-red-300"
                      >
                        {errors.fullName.message}
                      </p>
                    ) : null}
                  </div>

                  {/* 2 & 3. Email + Phone */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold tracking-wide text-[#F7F8F5]"
                      >
                        Email Address <span className="text-[#C6FF00]">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="alex@example.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`${inputBaseClass} ${
                          errors.email ? 'border-red-400' : 'border-[#2A3028]'
                        }`}
                        {...register('email')}
                      />
                      {errors.email ? (
                        <p
                          id="email-error"
                          role="alert"
                          className="mt-1.5 text-xs text-red-300"
                        >
                          {errors.email.message}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-semibold tracking-wide text-[#F7F8F5]"
                      >
                        Phone Number <span className="text-[#C6FF00]">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+1 (555) 234-5678"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        className={`${inputBaseClass} ${
                          errors.phone ? 'border-red-400' : 'border-[#2A3028]'
                        }`}
                        {...register('phone')}
                      />
                      {errors.phone ? (
                        <p
                          id="phone-error"
                          role="alert"
                          className="mt-1.5 text-xs text-red-300"
                        >
                          {errors.phone.message}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* 4 & 5. Primary Fitness Goal + Preferred Coaching Program */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="primaryGoal"
                        className="block text-xs font-semibold tracking-wide text-[#F7F8F5]"
                      >
                        Primary Fitness Goal{' '}
                        <span className="text-[#C6FF00]">*</span>
                      </label>
                      <select
                        id="primaryGoal"
                        aria-invalid={Boolean(errors.primaryGoal)}
                        aria-describedby={
                          errors.primaryGoal ? 'primaryGoal-error' : undefined
                        }
                        className={`${inputBaseClass} ${
                          errors.primaryGoal ? 'border-red-400' : 'border-[#2A3028]'
                        }`}
                        {...register('primaryGoal')}
                      >
                        {PRIMARY_GOALS.map((goal) => (
                          <option key={goal} value={goal}>
                            {goal}
                          </option>
                        ))}
                      </select>
                      {errors.primaryGoal ? (
                        <p
                          id="primaryGoal-error"
                          role="alert"
                          className="mt-1.5 text-xs text-red-300"
                        >
                          {errors.primaryGoal.message}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="preferredProgram"
                        className="block text-xs font-semibold tracking-wide text-[#F7F8F5]"
                      >
                        Preferred Coaching Program
                      </label>
                      <select
                        id="preferredProgram"
                        aria-invalid={Boolean(errors.preferredProgram)}
                        className={`${inputBaseClass} ${
                          errors.preferredProgram
                            ? 'border-red-400'
                            : 'border-[#2A3028]'
                        }`}
                        {...register('preferredProgram')}
                      >
                        {COACHING_PROGRAMS.map((program) => (
                          <option key={program} value={program}>
                            {program}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 6, 7 & 8. Experience + Contact Method + Best Time */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="experienceLevel"
                        className="block text-xs font-semibold tracking-wide text-[#F7F8F5]"
                      >
                        Training Experience{' '}
                        <span className="font-normal text-[#A5AAA1]">
                          (Optional)
                        </span>
                      </label>
                      <select
                        id="experienceLevel"
                        className={`${inputBaseClass} border-[#2A3028]`}
                        {...register('experienceLevel')}
                      >
                        <option value="">Select level</option>
                        {TRAINING_EXPERIENCE_LEVELS.filter(Boolean).map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="preferredContactMethod"
                        className="block text-xs font-semibold tracking-wide text-[#F7F8F5]"
                      >
                        Preferred Contact{' '}
                        <span className="text-[#C6FF00]">*</span>
                      </label>
                      <select
                        id="preferredContactMethod"
                        aria-invalid={Boolean(errors.preferredContactMethod)}
                        className={`${inputBaseClass} ${
                          errors.preferredContactMethod
                            ? 'border-red-400'
                            : 'border-[#2A3028]'
                        }`}
                        {...register('preferredContactMethod')}
                      >
                        {CONTACT_METHODS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="bestTimeToContact"
                        className="block text-xs font-semibold tracking-wide text-[#F7F8F5]"
                      >
                        Best Time{' '}
                        <span className="font-normal text-[#A5AAA1]">
                          (Optional)
                        </span>
                      </label>
                      <select
                        id="bestTimeToContact"
                        className={`${inputBaseClass} border-[#2A3028]`}
                        {...register('bestTimeToContact')}
                      >
                        <option value="">Select time</option>
                        {CONTACT_TIMES.filter(Boolean).map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 9. Additional Information */}
                  <div>
                    <label
                      htmlFor="additionalInfo"
                      className="block text-xs font-semibold tracking-wide text-[#F7F8F5]"
                    >
                      Additional Information{' '}
                      <span className="font-normal text-[#A5AAA1]">
                        (Optional — schedule, gym/home setup, or questions)
                      </span>
                    </label>
                    <textarea
                      id="additionalInfo"
                      rows={3}
                      maxLength={800}
                      placeholder="For example: Training 3 days per week before work with adjustable dumbbells..."
                      aria-invalid={Boolean(errors.additionalInfo)}
                      aria-describedby={
                        errors.additionalInfo ? 'additionalInfo-error' : undefined
                      }
                      className={`${inputBaseClass} resize-y ${
                        errors.additionalInfo ? 'border-red-400' : 'border-[#2A3028]'
                      }`}
                      {...register('additionalInfo')}
                    />
                    {errors.additionalInfo ? (
                      <p
                        id="additionalInfo-error"
                        role="alert"
                        className="mt-1.5 text-xs text-red-300"
                      >
                        {errors.additionalInfo.message}
                      </p>
                    ) : null}
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-1">
                    <div className="flex items-start gap-3">
                      <input
                        id="consentAccepted"
                        type="checkbox"
                        aria-invalid={Boolean(errors.consentAccepted)}
                        aria-describedby={
                          errors.consentAccepted ? 'consent-error' : undefined
                        }
                        className="mt-1 h-4 w-4 shrink-0 rounded border-[#2A3028] bg-[#121512] accent-[#C6FF00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00]"
                        {...register('consentAccepted')}
                      />
                      <label
                        htmlFor="consentAccepted"
                        className="text-xs sm:text-sm leading-relaxed text-[#A5AAA1]"
                      >
                        I consent to having my contact details and coaching
                        preferences processed so the coach can respond to my
                        inquiry, in accordance with the{' '}
                        <Link
                          to="/privacy-policy"
                          className="text-[#F7F8F5] underline decoration-[#C6FF00]/70 underline-offset-4 hover:text-[#C6FF00]"
                        >
                          Privacy Policy
                        </Link>
                        . <span className="text-[#C6FF00]">*</span>
                      </label>
                    </div>
                    {errors.consentAccepted ? (
                      <p
                        id="consent-error"
                        role="alert"
                        className="mt-1.5 text-xs text-red-300"
                      >
                        {errors.consentAccepted.message}
                      </p>
                    ) : null}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-md bg-[#C6FF00] px-7 py-3.5 text-sm font-bold tracking-wider text-[#0B0D0B] hover:bg-[#d4ff38] disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF00] transition-all duration-150 whitespace-nowrap"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2
                            className="h-4 w-4 animate-spin shrink-0"
                            aria-hidden="true"
                          />
                          <span>SUBMITTING INQUIRY...</span>
                        </>
                      ) : (
                        <span>REQUEST MY FREE CONSULTATION</span>
                      )}
                    </button>

                    <p className="mt-3 text-center text-xs text-[#A5AAA1]">
                      Your information will be used to respond to your coaching
                      inquiry. See our{' '}
                      <Link
                        to="/privacy-policy"
                        className="underline decoration-[#2A3028] underline-offset-4 hover:text-[#F7F8F5]"
                      >
                        Privacy Policy
                      </Link>{' '}
                      for details.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
