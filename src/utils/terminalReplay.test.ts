import { HARNESS_SESSION } from '../data/harness';
import { buildTimeline, replayFrameAt } from './terminalReplay';

describe('terminal replay', () => {
  const timeline = buildTimeline(HARNESS_SESSION);

  it('starts on an empty prompt and ends on the full transcript', () => {
    expect(replayFrameAt(HARNESS_SESSION, timeline, 0)).toEqual({
      step: 0,
      chars: 0,
      lines: 0,
      done: false,
    });
    const end = replayFrameAt(HARNESS_SESSION, timeline, timeline.duration);
    const last = HARNESS_SESSION[HARNESS_SESSION.length - 1];
    expect(end).toEqual({
      step: HARNESS_SESSION.length - 1,
      chars: last.command.length,
      lines: last.output.length,
      done: true,
    });
  });

  it('types the command before printing output', () => {
    const first = timeline.steps[0];
    const mid = replayFrameAt(
      HARNESS_SESSION,
      timeline,
      (first.start + first.typed) / 2,
    );
    expect(mid.chars).toBeGreaterThan(0);
    expect(mid.chars).toBeLessThan(HARNESS_SESSION[0].command.length);
    expect(mid.lines).toBe(0);
  });
});
