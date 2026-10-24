import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Benefits } from '../components/Benefits';
import { CoachSection } from '../components/CoachSection';
import { CoachingPrograms } from '../components/CoachingPrograms';
import { FAQ } from '../components/FAQ';
import { FinalBanner } from '../components/FinalBanner';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { LeadForm } from '../components/LeadForm';
import { Navbar } from '../components/Navbar';
import { PhoneCTA } from '../components/PhoneCTA';
import { ProblemSolution } from '../components/ProblemSolution';
import { SuccessStories } from '../components/SuccessStories';
import { TrustStrip } from '../components/TrustStrip';
import { FAQ_ITEMS } from '../data/faq';
import { COACHING_PROGRAM_CARDS } from '../data/programs';
import type { COACHING_PROGRAMS, PRIMARY_GOALS } from '../lib/validation';

type ProgramChoice = (typeof COACHING_PROGRAMS)[number];
type GoalChoice = (typeof PRIMARY_GOALS)[number];

export function Home() {
  const location = useLocation();
  const [selectedProgram, setSelectedProgram] = useState<ProgramChoice | null>(
    null
  );
  const [selectedGoal, setSelectedGoal] = useState<GoalChoice | null>(null);

  const scrollToInquiryForm = useCallback(() => {
    const formSection = document.getElementById('inquiry-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const scrollToPhoneStrip = useCallback(() => {
    const phoneSection = document.getElementById('direct-phone-contact');
    if (phoneSection) {
      phoneSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleSelectProgram = useCallback(
    (programTitle: ProgramChoice, defaultGoal: GoalChoice) => {
      setSelectedProgram(programTitle);
      setSelectedGoal(defaultGoal);
      scrollToInquiryForm();
    },
    [scrollToInquiryForm]
  );

  // Support deep links from other pages (e.g. /?program=...#inquiry-form or /#coaching)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const programQuery = params.get('program');
    if (programQuery) {
      const matched = COACHING_PROGRAM_CARDS.find(
        (p) => p.title.toLowerCase() === programQuery.toLowerCase()
      );
      if (matched) {
        setSelectedProgram(matched.title);
        setSelectedGoal(matched.defaultGoal);
      }
    }

    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return () => window.clearTimeout(timer);
    }
  }, [location.hash, location.search]);

  // Accurate FAQPage JSON-LD structured data (no fabricated ratings or addresses)
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#0B0D0B] text-[#F7F8F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* SECTION A: Sticky Navigation */}
      <Navbar onOpenInquiryForm={scrollToInquiryForm} />

      <main>
        {/* SECTION B: High-Impact Hero */}
        <Hero
          onPrimaryCta={scrollToInquiryForm}
          onScrollToPhoneSetup={scrollToPhoneStrip}
        />

        {/* SECTION C: Trust and Value Strip */}
        <TrustStrip />

        {/* SECTION D: The Problem and Solution */}
        <ProblemSolution onFindPlanCta={scrollToInquiryForm} />

        {/* SECTION E: Online Coaching Programs */}
        <CoachingPrograms
          selectedProgram={selectedProgram}
          onSelectProgram={handleSelectProgram}
        />

        {/* SECTION F: How Online Coaching Works */}
        <HowItWorks onDiscussGoalsCta={scrollToInquiryForm} />

        {/* SECTION G: Coach Introduction */}
        <CoachSection onTalkAboutGoalsCta={scrollToInquiryForm} />

        {/* SECTION H: Client Success Stories */}
        <SuccessStories onStartJourneyCta={scrollToInquiryForm} />

        {/* SECTION I: Coaching Benefits */}
        <Benefits />

        {/* SECTION J: Lead Generation Form — Primary Conversion Section */}
        <LeadForm
          preselectedProgram={selectedProgram}
          preselectedGoal={selectedGoal}
        />

        {/* SECTION K: Direct Phone Contact */}
        <PhoneCTA />

        {/* SECTION L: FAQ */}
        <FAQ />

        {/* SECTION M: Final Conversion Banner */}
        <FinalBanner
          onPrimaryCta={scrollToInquiryForm}
          onScrollToPhoneSetup={scrollToPhoneStrip}
        />
      </main>

      {/* SECTION N: Footer */}
      <Footer onSelectProgramFromFooter={handleSelectProgram} />
    </div>
  );
}
