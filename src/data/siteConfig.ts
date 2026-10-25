import coachPortrait from '../assets/images/coach_editorial_portrait_1792823471551.jpg';

export interface SiteConfig {
  brandName: string;
  tagline: string;
  seo: {
    title: string;
    description: string;
    canonicalBaseUrl: string;
  };
  contact: {
    businessPhone: string;
    businessEmail: string;
    phoneSetupPlaceholder: string;
    emailSetupPlaceholder: string;
  };
  legal: {
    effectiveDatePlaceholder: string;
    dataControllerPlaceholder: string;
    governingJurisdictionPlaceholder: string;
  };
  socialLinks: {
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  analytics: {
    gaMeasurementId: string;
    gtmContainerId: string;
  };
  coach: {
    name: string;
    portraitSrc: string;
    portraitAlt: string;
    verifiedExperience: string;
    headline: string;
    philosophyQuote: string;
    biographyParagraphs: string[];
    specialties: string[];
    verifiedQualifications: string[];
    qualificationsPlaceholder: string;
  };
  successStories: {
    id: string;
    clientIdentifier: string;
    duration: string;
    originalGoal: string;
    coachingApproach: string;
    clientFeedback: string;
    verifiedProgressIndicators: string[];
    approvedPhotoSrc?: string;
    approvedPhotoAlt?: string;
  }[];
}

export const SITE_CONFIG: SiteConfig = {
  brandName: '[COACH BRAND NAME]',
  tagline:
    'Personalized online fitness coaching built around your goals, schedule, and starting point.',
  seo: {
    title: 'Online Personal Fitness Coaching',
    description:
      'Explore personalized online fitness coaching and request a free consultation.',
    canonicalBaseUrl: '',
  },
  contact: {
    businessPhone: '',
    businessEmail: '',
    phoneSetupPlaceholder: 'Phone number not configured',
    emailSetupPlaceholder: 'Email address not configured',
  },
  legal: {
    effectiveDatePlaceholder: 'Add effective date',
    dataControllerPlaceholder: 'Add business name and contact details',
    governingJurisdictionPlaceholder: 'Add governing jurisdiction',
  },
  socialLinks: {
    instagram: '',
    youtube: '',
    linkedin: '',
  },
  analytics: {
    gaMeasurementId: '',
    gtmContainerId: '',
  },
  coach: {
    name: 'Your Coach',
    portraitSrc: coachPortrait,
    portraitAlt: 'Fitness coach portrait',
    verifiedExperience: '',
    headline: 'Personal coaching, grounded in your goals.',
    philosophyQuote:
      'A useful plan is one that fits your life and gives you a clear next step.',
    biographyParagraphs: [
      'Online coaching can help bring structure to your training, with an approach shaped around your goals, schedule, and available equipment.',
      'Add a coach biography here to share your background and how you work with clients.',
    ],
    specialties: [
      'Fat loss and general fitness',
      'Muscle building',
      'Strength and performance',
    ],
    verifiedQualifications: [],
    qualificationsPlaceholder: 'Verified coach qualifications will be listed here.',
  },
  successStories: [],
};

export function sanitizeTelHref(phone: string): string | null {
  const trimmedPhone = phone.trim();
  const digits = trimmedPhone.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return null;
  if (!/^\+?[0-9][0-9\s().-]*[0-9]$/.test(trimmedPhone)) return null;
  return `tel:${trimmedPhone.replace(/[\s().-]/g, '')}`;
}