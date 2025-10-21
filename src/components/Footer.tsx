import { useState } from 'react';
import { PerformanceToggle } from './PerformanceToggle';
import { TechStackModal } from './TechStackModal';
import './Footer.css';

export function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer__container">
          <button
            className="footer__tech-button"
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2L2 6V10C2 14.5 5 18 10 18C15 18 18 14.5 18 10V6L10 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M10 6V14M6 10H14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>How I Built This</span>
          </button>

          <p className="footer__text">© Gabriel Andrade 2025</p>

          <div className="footer__performance">
            <PerformanceToggle />
          </div>
        </div>
      </footer>

      <TechStackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
