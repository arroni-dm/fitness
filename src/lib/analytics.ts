import { SITE_CONFIG } from '../data/siteConfig';

export type ConversionEventName =
  | 'lead_form_view'
  | 'lead_form_start'
  | 'lead_form_submit'
  | 'lead_form_success'
  | 'lead_form_error'
  | 'phone_click'
  | 'program_select';

/**
 * Strictly non-PII event metadata.
 * Names, emails, phone numbers, and free-text notes are NEVER accepted or transmitted.
 */
export interface SafeAnalyticsParams {
  program_name?: string;
  goal_category?: string;
  contact_preference?: string;
  section_source?: string;
  error_code?: string;
}

const CONSENT_STORAGE_KEY = 'coaching_analytics_consent_v1';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

let scriptsInjected = false;

export function hasConfiguredAnalyticsIds(): boolean {
  const gaId = SITE_CONFIG.analytics.gaMeasurementId;
  const gtmId = SITE_CONFIG.analytics.gtmContainerId;
  const validGa = /^G-[A-Z0-9]{6,}$/i.test(gaId);
  const validGtm = /^GTM-[A-Z0-9]{4,}$/i.test(gtmId);
  return validGa || validGtm;
}

export function getAnalyticsConsent(): 'granted' | 'denied' | 'unset' {
  if (typeof window === 'undefined') return 'unset';
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') {
      return stored;
    }
    return 'unset';
  } catch {
    return 'unset';
  }
}

export function setAnalyticsConsent(decision: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, decision);
  } catch {
    // Ignore storage quota / privacy mode restrictions
  }
  if (decision === 'granted') {
    initializeAnalyticsIfPermitted();
  }
}

export function initializeAnalyticsIfPermitted(): void {
  if (typeof window === 'undefined' || scriptsInjected) return;
  if (!hasConfiguredAnalyticsIds()) return;
  if (getAnalyticsConsent() !== 'granted') return;

  const { gaMeasurementId, gtmContainerId } = SITE_CONFIG.analytics;
  window.dataLayer = window.dataLayer || [];

  if (/^G-[A-Z0-9]{6,}$/i.test(gaMeasurementId)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`;
    document.head.appendChild(script);

    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args as unknown as Record<string, unknown>);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaMeasurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }

  if (/^GTM-[A-Z0-9]{4,}$/i.test(gtmContainerId)) {
    window.dataLayer.push({
      'gtm.start': Date.now(),
      event: 'gtm.js',
    });
    const gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmContainerId)}`;
    document.head.appendChild(gtmScript);
  }

  scriptsInjected = true;
}

export function trackConversionEvent(
  eventName: ConversionEventName,
  params: SafeAnalyticsParams = {}
): void {
  if (typeof window === 'undefined') return;
  if (!hasConfiguredAnalyticsIds()) return;
  if (getAnalyticsConsent() !== 'granted') return;

  initializeAnalyticsIfPermitted();

  const sanitizedPayload: Record<string, string> = {};
  if (params.program_name) sanitizedPayload.program_name = params.program_name;
  if (params.goal_category) sanitizedPayload.goal_category = params.goal_category;
  if (params.contact_preference) {
    sanitizedPayload.contact_preference = params.contact_preference;
  }
  if (params.section_source) sanitizedPayload.section_source = params.section_source;
  if (params.error_code) sanitizedPayload.error_code = params.error_code;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, sanitizedPayload);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...sanitizedPayload,
    });
  }
}
