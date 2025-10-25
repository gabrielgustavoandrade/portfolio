import { useEffect, useState } from 'react';
import './HandwrittenNote.css';

interface HandwrittenNoteProps {
  text: string;
  delay?: number;
}

export function HandwrittenNote({ text, delay = 2000 }: HandwrittenNoteProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) return null;

  return (
    <div className="handwritten-note">
      <p className="handwritten-note__text">{text}</p>
    </div>
  );
}
