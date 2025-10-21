import { Hero } from '../components/Hero';
import { WorkList } from '../components/WorkList';
import { BlogList } from '../components/BlogList';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { projects } from '../data/projects';
import { posts } from '../data/posts';

export function HomePage() {
  const handleWorkClick = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Hero onWorkClick={handleWorkClick} onContactClick={handleContactClick} />
      <WorkList projects={projects} />
      <BlogList posts={posts} />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
