import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { CraftProof } from '../components/CraftProof';
import { Experience } from '../components/Experience';
import { Footer } from '../components/Footer';
import { Fourier } from '../components/Fourier';
import { Harness } from '../components/Harness';
import { Hero } from '../components/Hero';
import { Work } from '../components/Work';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useI18n } from '../i18n/I18nProvider';

export function HomePage() {
  const { hash } = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const { t } = useI18n();

  useEffect(() => {
    if (!hash) return;

    const id = hash.slice(1);
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash, reducedMotion]);

  return (
    <div className="home">
      <a href="#main-content" className="skip-link">
        {t.skipLink}
      </a>
      <Hero reducedMotion={reducedMotion} />
      <main id="main-content">
        <Work reducedMotion={reducedMotion} />
        <Harness reducedMotion={reducedMotion} />
        <CraftProof reducedMotion={reducedMotion} />
        <Fourier reducedMotion={reducedMotion} />
        <Experience reducedMotion={reducedMotion} />
        {/* About and Contact share one band on wide screens. */}
        <div className="closing">
          <About reducedMotion={reducedMotion} />
          <Contact reducedMotion={reducedMotion} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
