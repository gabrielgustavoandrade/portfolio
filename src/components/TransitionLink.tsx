import type { MouseEvent, ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';

interface TransitionLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const SCROLL_KEY = 'portfolio:scroll-position';

export function TransitionLink({
  to,
  children,
  className,
  onClick,
}: TransitionLinkProps) {
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

    // Simple page crossfade with View Transitions API
    if (
      'startViewTransition' in document &&
      typeof (document as any).startViewTransition === 'function'
    ) {
      (document as any).startViewTransition(() => {
        flushSync(() => {
          navigate(to);
        });
      });
    } else {
      // Fallback for browsers without View Transitions support
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
