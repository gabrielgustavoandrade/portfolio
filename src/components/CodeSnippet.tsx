import { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './CodeSnippet.css';

interface CodeSnippetProps {
  code: string;
  language?: string;
  speed?: number;
}

export function CodeSnippet({ code, language = 'typescript', speed = 30 }: CodeSnippetProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!isVisible || isTypingComplete) return;

    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [isVisible, currentIndex, code, speed, isTypingComplete]);

  return (
    <div ref={ref} className="code-snippet">
      <div className="code-snippet__header">
        <div className="code-snippet__dots">
          <span className="code-snippet__dot code-snippet__dot--red" />
          <span className="code-snippet__dot code-snippet__dot--yellow" />
          <span className="code-snippet__dot code-snippet__dot--green" />
        </div>
        <span className="code-snippet__language">{language}</span>
      </div>
      <pre className="code-snippet__content">
        <code>{displayedCode}</code>
        {!isTypingComplete && <span className="code-snippet__cursor">|</span>}
      </pre>
    </div>
  );
}
