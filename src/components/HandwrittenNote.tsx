import "./HandwrittenNote.css";

interface HandwrittenNoteProps {
  text: string;
  delay?: number;
}

export function HandwrittenNote({ text }: HandwrittenNoteProps) {
  return (
    <div className="handwritten-note">
      <p className="handwritten-note__text">{text}</p>
    </div>
  );
}
