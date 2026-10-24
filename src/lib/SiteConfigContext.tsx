import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SITE_CONFIG, sanitizeTelHref, type SiteConfig } from '../data/siteConfig';

interface DeliveryConfigState {
  persistentStorageBackend: 'sqlite' | 'json-file';
  webhookConfigured: boolean;
  emailConfigured: boolean;
  missingOptionalEnvVars: string[];
}

interface RuntimeSiteContextValue {
  config: SiteConfig;
  verifiedTelHref: string | null;
  verifiedPhoneDisplay: string | null;
  verifiedEmailDisplay: string | null;
  deliveryConfig: DeliveryConfigState | null;
}

const RuntimeSiteContext = createContext<RuntimeSiteContextValue>({
  config: SITE_CONFIG,
  verifiedTelHref: sanitizeTelHref(SITE_CONFIG.contact.businessPhone),
  verifiedPhoneDisplay: SITE_CONFIG.contact.businessPhone || null,
  verifiedEmailDisplay: SITE_CONFIG.contact.businessEmail || null,
  deliveryConfig: null,
});

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [serverOverrides, setServerOverrides] = useState<{
    businessName: string | null;
    businessPhone: string | null;
    businessEmail: string | null;
    publicSiteUrl: string | null;
    delivery: DeliveryConfigState | null;
  }>({
    businessName: null,
    businessPhone: null,
    businessEmail: null,
    publicSiteUrl: null,
    delivery: null,
  });

  useEffect(() => {
    let active = true;
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setServerOverrides({
          businessName: data.businessName || null,
          businessPhone: data.businessPhone || null,
          businessEmail: data.businessEmail || null,
          publicSiteUrl: data.publicSiteUrl || null,
          delivery: data.delivery || null,
        });
      })
      .catch(() => {
        // Safe fallback to static SITE_CONFIG if offline
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<RuntimeSiteContextValue>(() => {
    const mergedPhone =
      (serverOverrides.businessPhone ?? SITE_CONFIG.contact.businessPhone).trim();
    const mergedEmail =
      (serverOverrides.businessEmail ?? SITE_CONFIG.contact.businessEmail).trim();
    const mergedBrand =
      serverOverrides.businessName && serverOverrides.businessName !== '[COACH BRAND NAME]'
        ? serverOverrides.businessName
        : SITE_CONFIG.brandName;

    const mergedConfig: SiteConfig = {
      ...SITE_CONFIG,
      brandName: mergedBrand,
      seo: {
        ...SITE_CONFIG.seo,
        canonicalBaseUrl:
          serverOverrides.publicSiteUrl || SITE_CONFIG.seo.canonicalBaseUrl,
      },
      contact: {
        ...SITE_CONFIG.contact,
        businessPhone: mergedPhone,
        businessEmail: mergedEmail,
      },
    };

    const telHref = sanitizeTelHref(mergedPhone);
    const emailValid =
      mergedEmail && !mergedEmail.startsWith('[') && mergedEmail.includes('@')
        ? mergedEmail
        : null;

    return {
      config: mergedConfig,
      verifiedTelHref: telHref,
      verifiedPhoneDisplay: telHref ? mergedPhone : null,
      verifiedEmailDisplay: emailValid,
      deliveryConfig: serverOverrides.delivery,
    };
  }, [serverOverrides]);

  return (
    <RuntimeSiteContext.Provider value={value}>
      {children}
    </RuntimeSiteContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(RuntimeSiteContext);
}
