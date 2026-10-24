import { useState } from 'react';
import { Dumbbell } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  priority = false,
  fallbackLabel = 'Athletic Performance Coaching',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#191D19] via-[#121512] to-[#0B0D0B] p-6 text-center text-[#A5AAA1] ${className}`}
      >
        <Dumbbell className="mb-3 h-8 w-8 text-[#C6FF00]/80" aria-hidden="true" />
        <span className="font-display text-sm tracking-wide text-[#F7F8F5]">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
