import { useNavigate, useLocation } from 'react-router-dom';
import { MouseEvent, ReactNode } from 'react';

interface TransitionLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const SCROLL_KEY = 'portfolio:scroll-position';

export function TransitionLink({ to, children, className, onClick }: TransitionLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Save scroll position when navigating away from home page
    if (location.pathname === '/') {
      sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
    }

    if (onClick) {
      onClick();
    }

    // Use View Transitions API for SPA navigation
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        navigate(to);
      });
    } else {
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
