import fatLossImage from '../assets/images/program_fat_loss_1792823465267.jpg';
import muscleBuildingImage from '../assets/images/program_muscle_building_1792823466933.jpg';
import strengthImage from '../assets/images/program_strength_performance_1792823468104.jpg';
import completeCoachingImage from '../assets/images/program_complete_coaching_1792823469893.jpg';
import type { COACHING_PROGRAMS, PRIMARY_GOALS } from '../lib/validation';

export interface CoachingProgramCard {
  id: string;
  indexLabel: string;
  audienceNote: string;
  priceLabel: string | null;
  imageSrc: string;
  imageAlt: string;
  title: Exclude<(typeof COACHING_PROGRAMS)[number], 'Not Sure Yet'>;
  description: string;
  inclusions: string[];
  defaultGoal: (typeof PRIMARY_GOALS)[number];
}

export const COACHING_PROGRAM_CARDS: CoachingProgramCard[] = [
  {
    id: 'fat-loss',
    indexLabel: '01',
    audienceNote: 'BUILD CONSISTENCY',
    priceLabel: null,
    imageSrc: fatLossImage,
    imageAlt: 'Athlete training as part of a fat loss program',
    title: 'Fat Loss Coaching',
    description:
      'A sustainable training approach shaped around your routine, experience, and fat loss goals.',
    inclusions: [
      'Training plan tailored to your starting point',
      'Progress check-ins and plan adjustments',
      'Practical habits that fit your schedule',
    ],
    defaultGoal: 'Fat Loss',
  },
  {
    id: 'muscle-building',
    indexLabel: '02',
    audienceNote: 'BUILD MUSCLE',
    priceLabel: null,
    imageSrc: muscleBuildingImage,
    imageAlt: 'Athlete strength training for muscle building',
    title: 'Muscle Building',
    description:
      'Structured resistance training designed around your experience, equipment, and weekly availability.',
    inclusions: [
      'Goal-oriented strength training structure',
      'Exercise options for available equipment',
      'Progress check-ins and plan adjustments',
    ],
    defaultGoal: 'Muscle Building',
  },
  {
    id: 'strength-performance',
    indexLabel: '03',
    audienceNote: 'GET STRONGER',
    priceLabel: null,
    imageSrc: strengthImage,
    imageAlt: 'Athlete performing a strength training exercise',
    title: 'Strength and Performance',
    description:
      'A focused training plan to support strength and performance goals at a manageable pace.',
    inclusions: [
      'Training built around your performance goals',
      'Flexible sessions based on your equipment',
      'Progress reviews to guide next steps',
    ],
    defaultGoal: 'Strength and Performance',
  },
  {
    id: 'complete-coaching',
    indexLabel: '04',
    audienceNote: 'FULL-SCOPE SUPPORT',
    priceLabel: null,
    imageSrc: completeCoachingImage,
    imageAlt: 'Coach supporting a client during a training session',
    title: 'Complete Online Coaching',
    description:
      'A flexible starting point for people looking for ongoing structure across their fitness goals.',
    inclusions: [
      'A plan aligned with your goals and schedule',
      'Support with training consistency',
      'Regular progress reviews and adjustments',
    ],
    defaultGoal: 'General Fitness',
  },
];