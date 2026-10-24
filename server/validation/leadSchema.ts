import { z } from 'zod';

export const PRIMARY_GOALS = [
  'Fat Loss',
  'Muscle Building',
  'Strength and Performance',
  'General Fitness',
  'Other',
] as const;

export const COACHING_PROGRAMS = [
  'Fat Loss Coaching',
  'Muscle Building',
  'Strength and Performance',
  'Complete Online Coaching',
  'Not Sure Yet',
] as const;

export const TRAINING_EXPERIENCE_LEVELS = [
  '',
  'Beginner',
  'Intermediate',
  'Advanced',
] as const;

export const CONTACT_METHODS = [
  'Phone Call',
  'WhatsApp',
  'Email',
] as const;

export const CONTACT_TIMES = [
  '',
  'Morning',
  'Afternoon',
  'Evening',
  'Flexible',
] as const;

const stripControlChars = (val: string) =>
  val.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();

const PHONE_REGEX = /^\+?[0-9][0-9\s().-]{6,22}[0-9]$/;

export const leadSubmissionSchema = z.object({
  fullName: z
    .string()
    .transform(stripControlChars)
    .pipe(
      z
        .string()
        .min(2, 'Please enter your full name (at least 2 characters).')
        .max(100, 'Name must be 100 characters or fewer.')
    ),
  email: z
    .string()
    .transform((v) => stripControlChars(v).toLowerCase())
    .pipe(
      z
        .string()
        .min(1, 'Please enter your email address.')
        .email('Please enter a valid email address (for example, alex@domain.com).')
        .max(160, 'Email must be 160 characters or fewer.')
    ),
  phone: z
    .string()
    .transform(stripControlChars)
    .pipe(
      z
        .string()
        .min(7, 'Please enter a valid phone number including area or country code.')
        .max(25, 'Phone number is too long.')
        .refine(
          (val) => {
            const digitsOnly = val.replace(/\D/g, '');
            return digitsOnly.length >= 7 && digitsOnly.length <= 15 && PHONE_REGEX.test(val);
          },
          {
            message: 'Enter a valid phone number (7–15 digits, optional + country code).',
          }
        )
    ),
  primaryGoal: z.enum(PRIMARY_GOALS, {
    message: 'Please select your primary fitness goal.',
  }),
  preferredProgram: z.enum(COACHING_PROGRAMS, {
    message: 'Please select a preferred coaching program.',
  }),
  experienceLevel: z
    .enum(TRAINING_EXPERIENCE_LEVELS)
    .optional()
    .default(''),
  preferredContactMethod: z.enum(CONTACT_METHODS, {
    message: 'Please choose how you prefer to be contacted.',
  }),
  bestTimeToContact: z
    .enum(CONTACT_TIMES)
    .optional()
    .default(''),
  additionalInfo: z
    .string()
    .optional()
    .default('')
    .transform((v) => stripControlChars(v ?? ''))
    .pipe(
      z
        .string()
        .max(
          800,
          'Please keep additional notes under 800 characters and avoid sharing medical history.'
        )
    ),
  consentAccepted: z.boolean().refine((val) => val === true, {
    message: 'Please confirm your consent so we can respond to your inquiry.',
  }),
  // Anti-spam honeypot field — must remain empty for legitimate users
  companyWebsite: z.string().optional().default(''),
  // Optional form open timestamp (ms) to block instant automated bots
  formStartedAt: z.number().optional(),
});

export type LeadSubmissionInput = z.input<typeof leadSubmissionSchema>;
export type ValidatedLeadSubmission = z.output<typeof leadSubmissionSchema>;
