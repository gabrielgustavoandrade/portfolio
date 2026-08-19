import { SmartDateInput } from '@gabrielgustavoandrade/smart-date-input';
import { useEffect, useRef, useState } from 'react';
import './LiveSmartDateInput.css';

export function LiveSmartDateInput() {
  const [value, setValue] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const input = rootRef.current?.querySelector('input');
    input?.setAttribute('aria-label', 'Try smart-date-input');
  });

  return (
    <div className="live-sdi" ref={rootRef}>
      <SmartDateInput
        value={value}
        onChange={setValue}
        showTime
        hourFormat="12"
        placeholder="next Friday at 9am"
        className="live-sdi__field"
      />
      {value !== null && (
        <p className="live-sdi__readout" aria-live="polite">
          {new Date(value).toLocaleString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      )}
    </div>
  );
}
