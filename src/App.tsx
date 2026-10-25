/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { initializeAnalyticsIfPermitted } from './lib/analytics';
import { SiteConfigProvider, useSiteConfig } from './lib/SiteConfigContext';
const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const NotFound = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFound })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then((module) => ({ default: module.PrivacyPolicy })));
const Terms = lazy(() => import('./pages/Terms').then((module) => ({ default: module.Terms })));

function SeoAndAnalyticsSync() {
  const { config } = useSiteConfig();
  const location = useLocation();

  useEffect(() => {
    initializeAnalyticsIfPermitted();
  }, []);

  useEffect(() => {
    const baseTitle =
      config.brandName && config.brandName !== '[COACH BRAND NAME]'
        ? `${config.brandName} — Online Personal Fitness Coaching`
        : config.seo.title;

    if (location.pathname === '/privacy-policy') {
      document.title = `Privacy Policy — ${baseTitle}`;
    } else if (location.pathname === '/terms') {
      document.title = `Terms and Conditions — ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }

    const baseOrigin =
      config.seo.canonicalBaseUrl || window.location.origin;
    const canonicalUrl = `${baseOrigin.replace(/\/$/, '')}${location.pathname}`;

    let canonicalLink = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    let ogUrl = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]'
    );
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl);
  }, [config.brandName, config.seo.canonicalBaseUrl, config.seo.title, location.pathname]);

  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <SiteConfigProvider>
          <SeoAndAnalyticsSync />
          <Suspense fallback={<div role="status" aria-live="polite">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </SiteConfigProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
