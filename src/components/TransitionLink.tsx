import type { MouseEvent, ReactNode } from 'react';
import { forwardRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface TransitionLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const SCROLL_KEY = 'portfolio:scroll-position';

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ to, children, className, onClick }, ref) {
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

      // Just navigate - let CSS handle transitions
      navigate(to);
    };

    return (
      <a ref={ref} href={to} onClick={handleClick} className={className}>
        {children}
      </a>
    );
  },
);
