import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { WorkDetail } from '../components/WorkDetail';
import { projects } from '../data/projects';
import { useViewTransition } from '../hooks/useViewTransition';

const LAST_FOCUSED_CARD_KEY = 'work:last-focused-slug';
const SCROLL_KEY = 'portfolio:scroll-position';

export function WorkDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = projects.find((item) => item.slug === slug);
  const startViewTransition = useViewTransition();
  const supportsNativeViewTransition =
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    typeof document.startViewTransition === 'function';

  useEffect(() => {
    if (slug) {
      sessionStorage.setItem(LAST_FOCUSED_CARD_KEY, slug);
    }
    // Scroll to top when opening detail page
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    // Redirect to home if project not found
    navigate('/');
    return null;
  }

  const handleClose = () => {
    sessionStorage.setItem(LAST_FOCUSED_CARD_KEY, project.slug);
    startViewTransition(() => {
      navigate('/');

      const savedScroll = sessionStorage.getItem(SCROLL_KEY);
      if (!savedScroll) return;

      if (supportsNativeViewTransition) {
        window.scrollTo(0, parseInt(savedScroll, 10));
      } else {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        });
      }
    });
  };

  return (
    <>
      <WorkDetail project={project} onClose={handleClose} />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
