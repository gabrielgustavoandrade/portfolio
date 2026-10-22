import { SmartDateInput } from '@gabrielgustavoandrade/smart-date-input';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useI18n } from '../i18n/I18nProvider';
import './LiveSmartDateInput.css';

const AUTO_TEXT = 'next friday 3pm';
const SAMPLES = ['next friday 3pm', 'tomorrow 7am', 'in 3 days'];
const TYPE_INTERVAL_MS = 55;
const AUTO_DELAY_MS = 600;

/** Write through the native setter so React's onChange sees the edit. */
function setNativeValue(input: HTMLInputElement, next: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  setter?.call(input, next);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function formatValue(value: number, locale: string) {
  return new Date(value).toLocaleString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function LiveSmartDateInput({
  autoType = false,
  instant = false,
}: {
  /** Type a sample once the panel scrolls into view. */
  autoType?: boolean;
  /** Fill samples at once instead of typing them (reduced motion). */
  instant?: boolean;
}) {
  const { t } = useI18n();
  const [value, setValue] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef(0);
  const handedOverRef = useRef(false);
  const inView = useInView(rootRef, { threshold: 0.4 });

  // The package ships without labels on its input and calendar trigger.
  useEffect(() => {
    const field = fieldRef.current;
    field
      ?.querySelector('input')
      ?.setAttribute('aria-label', t.liveDemo.inputLabel);
    const trigger = field?.querySelector('button');
    // Ours to rewrite on a language switch, unless the package names it.
    if (trigger && trigger.dataset.labelled !== 'package') {
      if (!trigger.dataset.labelled) {
        trigger.dataset.labelled = trigger.hasAttribute('aria-label')
          ? 'package'
          : 'ours';
      }
      if (trigger.dataset.labelled === 'ours') {
        trigger.setAttribute('aria-label', t.liveDemo.calendar);
      }
    }
  });

  const stopTyping = useCallback(() => {
    window.clearInterval(typingRef.current);
    typingRef.current = 0;
  }, []);

  const typeInto = useCallback(
    (
      text: string,
      { animate, focus }: { animate: boolean; focus: boolean },
    ) => {
      const input = fieldRef.current?.querySelector('input');
      if (!input) return;
      stopTyping();
      if (focus) input.focus({ preventScroll: true });
      if (!animate) {
        setNativeValue(input, text);
        return;
      }
      let length = 0;
      setNativeValue(input, '');
      typingRef.current = window.setInterval(() => {
        length += 1;
        setNativeValue(input, text.slice(0, length));
        if (length >= text.length) stopTyping();
      }, TYPE_INTERVAL_MS);
    },
    [stopTyping],
  );

  useEffect(() => {
    if (!autoType || !inView) return;
    const timer = window.setTimeout(() => {
      if (!handedOverRef.current) {
        typeInto(AUTO_TEXT, { animate: true, focus: false });
      }
    }, AUTO_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoType, inView, typeInto]);

  useEffect(() => stopTyping, [stopTyping]);

  // Any keypress or pointer press hands control to the visitor.
  const handOver = () => {
    handedOverRef.current = true;
    stopTyping();
  };

  return (
    <div
      ref={rootRef}
      className="live-sdi"
      onKeyDownCapture={handOver}
      onPointerDownCapture={handOver}
    >
      <div className="live-sdi__head">
        <span className="live-sdi__label">{t.liveDemo.live}</span>
        <span className="live-sdi__label">{t.liveDemo.fromNpm}</span>
      </div>

      <div className="live-sdi__chips">
        {SAMPLES.map((sample) => (
          <button
            key={sample}
            type="button"
            className="live-sdi__chip"
            onClick={() => typeInto(sample, { animate: !instant, focus: true })}
          >
            {sample}
          </button>
        ))}
      </div>

      <div className="live-sdi__field" ref={fieldRef}>
        <SmartDateInput
          value={value}
          onChange={setValue}
          showTime
          hourFormat="12"
          placeholder={t.liveDemo.placeholder}
          className="live-sdi__input"
        />
      </div>

      <div className="live-sdi__out">
        <span className="live-sdi__label live-sdi__label--plain">
          {t.liveDemo.valueLabel}
        </span>
        <output className="live-sdi__readout" aria-live="polite">
          {value === null
            ? 'null'
            : `${value}  →  ${formatValue(value, t.liveDemo.locale)}`}
        </output>
      </div>
    </div>
  );
}
