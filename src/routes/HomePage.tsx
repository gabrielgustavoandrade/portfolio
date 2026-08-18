import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { About } from '../components/About';
import { BlogList } from '../components/BlogList';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { WorkList } from '../components/WorkList';
import { posts } from '../data/posts';
import { openSourceProjects, projects } from '../data/projects';

export function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.slice(1);
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <div className="home">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Hero />
      <main id="main-content">
        <WorkList projects={projects} />
        <WorkList
          projects={openSourceProjects}
          id="open-source"
          title="Open Source"
          subtitle="Side projects and tools I built and published."
        />
        <BlogList posts={posts} />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
