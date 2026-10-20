import { useEffect, useMemo, useRef, useState } from 'react';
import type { TerminalStep } from '../data/harness';
import { useInView } from '../hooks/useInView';
import { useI18n } from '../i18n/I18nProvider';
import {
  buildTimeline,
  type ReplayFrame,
  replayFrameAt,
  sameFrame,
} from '../utils/terminalReplay';

const PROMPT = '$';

/**
 * Types a recorded CLI session into a terminal card once it scrolls into
 * view. `seek` (0–1) freezes the replay; reduced motion shows the final
 * transcript.
 */
export function TerminalReplay({
  steps,
  title,
  reducedMotion,
  seek = null,
}: {
  steps: TerminalStep[];
  title: string;
  reducedMotion: boolean;
  seek?: number | null;
}) {
  const { t } = useI18n();
  const timeline = useMemo(() => buildTimeline(steps), [steps]);
  const frozen = reducedMotion || seek !== null;
  const rootRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLElement>(null);
  const followRef = useRef(true);
  const [run, setRun] = useState(0);
  const inView = useInView(rootRef, { threshold: 0.35, skip: frozen });
  const [frame, setFrame] = useState<ReplayFrame>(() =>
    replayFrameAt(
      steps,
      timeline,
      frozen ? (seek ?? 1) * timeline.duration : 0,
    ),
  );

  // `run` restarts the replay (Replay button).
  // biome-ignore lint/correctness/useExhaustiveDependencies: run is a restart key
  useEffect(() => {
    if (frozen) {
      setFrame(replayFrameAt(steps, timeline, (seek ?? 1) * timeline.duration));
      return;
    }
    if (!inView) return;

    followRef.current = true;
    let raf = 0;
    let start = 0;
    let current = replayFrameAt(steps, timeline, 0);
    setFrame(current);
    const tick = (now: number) => {
      if (!start) start = now;
      const next = replayFrameAt(steps, timeline, now - start);
      if (!sameFrame(next, current)) {
        current = next;
        setFrame(next);
      }
      if (!next.done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [frozen, seek, inView, steps, timeline, run]);

  // Keep the newest line in view unless the visitor scrolled up.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs per frame
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen || (reducedMotion && seek === null)) return;
    if (followRef.current) screen.scrollTop = screen.scrollHeight;
  }, [frame, reducedMotion, seek]);

  const onScroll = () => {
    const screen = screenRef.current;
    if (!screen) return;
    followRef.current =
      screen.scrollHeight - screen.scrollTop - screen.clientHeight < 24;
  };

  const shown = steps.slice(0, frame.step + 1);

  return (
    <div ref={rootRef} className="terminal card">
      <div className="terminal__chrome">
        <span className="terminal__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="terminal__title">{title}</span>
        {!frozen ? (
          <button
            type="button"
            className="terminal__replay"
            onClick={() => setRun((value) => value + 1)}
            disabled={!frame.done}
          >
            {t.terminal.replay}
          </button>
        ) : (
          <span />
        )}
      </div>
      <section
        ref={screenRef}
        className="terminal__screen"
        onScroll={onScroll}
        aria-label={t.terminal.transcript(title)}
        aria-busy={!frame.done}
      >
        {shown.map((step, index) => {
          const current = index === frame.step;
          const command = current
            ? step.command.slice(0, frame.chars)
            : step.command;
          const output = current
            ? step.output.slice(0, frame.lines)
            : step.output;
          const typing = current && !frame.done && frame.lines === 0;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed recording
            <div key={index} className="terminal__step">
              <div className="terminal__command">
                <span className="terminal__prompt">{PROMPT}</span> {command}
                {typing ? <span className="terminal__caret" /> : null}
              </div>
              {output.length ? (
                <pre className="terminal__output">{output.join('\n')}</pre>
              ) : null}
            </div>
          );
        })}
      </section>
    </div>
  );
}
