import { Link } from 'react-router-dom';
import { ArrowRight, Home as HomeIcon } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0D0B] text-[#F7F8F5] flex flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-start justify-center px-4 py-24 sm:px-6 lg:px-8">
        <p className="font-mono-num text-xs font-semibold tracking-widest text-[#C6FF00]">
          ERROR 404
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-6xl font-bold text-[#F7F8F5]">
          PAGE NOT FOUND.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-[#A5AAA1]">
          The link you followed may be outdated or moved. Head back to the
          coaching overview or jump straight to your consultation request.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3.5">
          <Link
            to="/"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-[#C6FF00] px-6 py-3 text-sm font-bold tracking-wide text-[#0B0D0B] hover:bg-[#d4ff38] transition-colors whitespace-nowrap"
          >
            <HomeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>RETURN HOME</span>
          </Link>

          <Link
            to="/#inquiry-form"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-[#2A3028] bg-[#121512] px-6 py-3 text-sm font-semibold text-[#F7F8F5] hover:border-[#C6FF00] transition-colors whitespace-nowrap"
          >
            <span>GET MY FREE FITNESS PLAN</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
