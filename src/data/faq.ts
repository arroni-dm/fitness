export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  policyNote?: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'how-online-coaching-works',
    question: 'How does online fitness coaching work?',
    answer:
      'Start with a consultation request and share your goals, experience, schedule, and available equipment. The coach can then discuss an appropriate training approach and how progress reviews would work.',
  },
  {
    id: 'equipment',
    question: 'Do I need access to a fully equipped gym?',
    answer:
      'Not necessarily. Share what equipment you have access to in your inquiry so the coach can discuss suitable exercise options with you.',
  },
  {
    id: 'program-choice',
    question: 'Which coaching program should I choose?',
    answer:
      'Choose the option closest to your current goal. If you are unsure, select “Not Sure Yet” on the inquiry form and describe what you would like help with.',
  },
  {
    id: 'progress',
    question: 'How is progress reviewed?',
    answer:
      'The coaching approach can include progress check-ins and plan adjustments. The details should be discussed with the coach during your consultation.',
  },
  {
    id: 'consultation-cost',
    question: 'Does sending an inquiry commit me to a paid program?',
    answer:
      'No. Sending a consultation inquiry does not create a coaching agreement or require payment. Any service terms should be reviewed and agreed before coaching begins.',
  },
  {
    id: 'health',
    question: 'Can online coaching provide medical advice?',
    answer:
      'No. Fitness coaching is not a substitute for medical advice, diagnosis, or treatment. Consult a qualified healthcare professional before starting a new exercise program, especially if you have a health condition or injury.',
    policyNote:
      'Please do not include sensitive medical records in the inquiry form.',
  },
];