import type { MatchRecord } from '../types';

export const matches: Record<string, MatchRecord> = {
  'match-1': {
    id: 'match-1',
    processingStatus: 'completed',
    events: [
      { id: 'evt-1', timestamp: '2026-06-21T17:00:00Z', eventType: 'pass', team: 'home', player: 'H. Nilsson' },
      { id: 'evt-2', timestamp: '2026-06-21T17:00:04Z', eventType: 'goal', team: 'home', player: 'H. Andersson' },
      { id: 'evt-3', timestamp: '2026-06-21T17:00:08Z', eventType: 'pass', team: 'away', player: 'A. Svensson' },
      { id: 'evt-4', timestamp: '2026-06-21T17:00:10Z', eventType: 'pass', team: 'home', player: 'H. Nilsson' },
      { id: 'evt-5', timestamp: '2026-06-21T17:00:12Z', eventType: 'goal', team: 'away', player: 'A. Lund' },
      { id: 'evt-6', timestamp: '2026-06-21T17:00:14Z', eventType: 'pass', team: 'away', player: 'A. Svensson' }
    ]
  }
};
