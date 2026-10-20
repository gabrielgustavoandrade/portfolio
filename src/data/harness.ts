export interface TerminalStep {
  command: string;
  output: string[];
}

/** Copy (lede, facts, note, caption) lives in i18n/messages. */
export const HARNESS = {
  name: 'Holdout',
  /** Window title of the terminal replay. */
  binary: 'holdout',
} as const;

/**
 * Captured from the CLI's session room and task C honesty check, run
 * offline in degraded mode (no model key). Only the temp root was shortened.
 */
export const HARNESS_SESSION: TerminalStep[] = [
  {
    command: 'bun src/index.ts session start demo',
    output: [
      'session_id=20261012-205802-demo',
      'path=.holdout/sessions/20261012-205802-demo',
    ],
  },
  {
    command: 'bun src/index.ts spawn --role lead --name lead --detach',
    output: ['spawned: lead pid=713596'],
  },
  {
    command: 'bun src/index.ts spawn --role worker --name worker-1 --detach',
    output: ['spawned: worker-1 pid=713651'],
  },
  {
    command: 'bun src/index.ts peers',
    output: [
      'NAME      ROLE    STATUS  PID     LAST_SEEN',
      'human     cli     —       —       —',
      'lead      lead    idle    713596  0s',
      'worker-1  worker  idle    713651  0s',
    ],
  },
  {
    command: 'bun src/index.ts tell worker-1 "ping"',
    output: ['message_id=1'],
  },
  {
    command: 'bun src/index.ts tell lead "Assign worker-1 the auth review"',
    output: ['message_id=3'],
  },
  {
    command: 'bun src/index.ts inbox',
    output: [
      '#2  worker-1 → human  msg  pending  normal',
      '[worker-1] ping',
      '',
      '#4  lead → human  msg  pending  normal',
      '[lead] Assign worker-1 the auth review',
    ],
  },
  {
    command: 'bun src/index.ts traces worker-1 --latest',
    output: [
      '{',
      '  "peer": "worker-1",',
      '  "sessionId": "20261012-205802-demo",',
      '  "startedAt": "2026-10-12T20:58:04.950Z",',
      '  "finishedAt": "2026-10-12T20:58:04.974Z",',
      '  "triggerMessageId": 1,',
      '  "status": "ok",',
      '  "output": {',
      '    "text": "[worker-1] ping",',
      '    "mode": "degraded",',
      '    "model": null',
      '  },',
      '  "steps": [',
      '    {',
      '      "node": "respond",',
      '      "mode": "degraded"',
      '    }',
      '  ],',
      '  "runId": "c2ac0578-d888-40aa-8919-7717a232f95c"',
      '}',
    ],
  },
  {
    command: 'bun src/index.ts session stop --kill-peers',
    output: ['session_id=20261012-205802-demo', 'status=stopped'],
  },
  {
    command: 'bun src/index.ts --task c --check',
    output: [
      'task c — hidden-dependency refactor',
      'goal: Bump 1.2.0 → 1.3.0. Changing src/version.ts is not enough; derived copies must move with it.',
      '',
      '  naive    FAIL  3/8 checks',
      '           - src/version.lock is 1.3.0 (lock=1.2.0)',
      '           - src/version.hex decodes to 1.3.0 (decoded=1.2.0)',
      '           - src/protocol.ts MAGIC is 10300',
      '           - src/compat.ts maps 1.2.0 and 1.3.0 → 1.3.0',
      '           - banner() agrees (app 1.2.0 magic=10200)',
      '           wrote runs/c-naive-2026-10-12T20-58-10-787Z.json',
      '',
      '  correct  PASS  8/8 checks',
      '           wrote runs/c-correct-2026-10-12T20-58-10-815Z.json',
      '',
      'evals look honest: naive fails, correct passes.',
    ],
  },
];
