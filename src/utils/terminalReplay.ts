import type { TerminalStep } from '../data/harness';

/** Replay pacing, in milliseconds. */
export const REPLAY_TIMING = {
  beforeCommand: 520,
  perChar: 24,
  afterCommand: 260,
  perLine: 55,
  /** Long dumps (JSON) scroll faster. */
  perLineLong: 22,
  longOutput: 8,
} as const;

interface StepTimeline {
  start: number;
  typed: number;
  end: number;
  perLine: number;
}

export interface ReplayTimeline {
  steps: StepTimeline[];
  duration: number;
}

export function buildTimeline(steps: TerminalStep[]): ReplayTimeline {
  let cursor = 0;
  const timeline = steps.map((step) => {
    const start = cursor + REPLAY_TIMING.beforeCommand;
    const typed = start + step.command.length * REPLAY_TIMING.perChar;
    const perLine =
      step.output.length > REPLAY_TIMING.longOutput
        ? REPLAY_TIMING.perLineLong
        : REPLAY_TIMING.perLine;
    const end =
      typed + REPLAY_TIMING.afterCommand + step.output.length * perLine;
    cursor = end;
    return { start, typed, end, perLine };
  });
  return { steps: timeline, duration: cursor };
}

export interface ReplayFrame {
  /** Steps fully or partly on screen. */
  step: number;
  /** Characters of the current command typed so far. */
  chars: number;
  /** Output lines of the current step shown so far. */
  lines: number;
  done: boolean;
}

export function replayFrameAt(
  steps: TerminalStep[],
  timeline: ReplayTimeline,
  ms: number,
): ReplayFrame {
  if (ms >= timeline.duration) {
    const last = steps.length - 1;
    return {
      step: last,
      chars: steps[last].command.length,
      lines: steps[last].output.length,
      done: true,
    };
  }
  let index = timeline.steps.findIndex((step) => ms < step.end);
  if (index < 0) index = steps.length - 1;
  const step = timeline.steps[index];
  const command = steps[index].command;
  const chars = Math.max(
    0,
    Math.min(
      command.length,
      Math.floor((ms - step.start) / REPLAY_TIMING.perChar),
    ),
  );
  const outputStart = step.typed + REPLAY_TIMING.afterCommand;
  const lines =
    ms < outputStart
      ? 0
      : Math.min(
          steps[index].output.length,
          Math.floor((ms - outputStart) / step.perLine) + 1,
        );
  return { step: index, chars, lines, done: false };
}

export function sameFrame(a: ReplayFrame, b: ReplayFrame) {
  return (
    a.step === b.step &&
    a.chars === b.chars &&
    a.lines === b.lines &&
    a.done === b.done
  );
}
