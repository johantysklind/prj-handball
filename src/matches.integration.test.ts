import request from 'supertest';
import { app } from './app';

describe('Match analytics API', () => {
  it('returns match summary', async () => {
    const response = await request(app).get('/api/matches/match-1/summary');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        matchId: 'match-1',
        processingStatus: 'completed',
        goals: { home: 1, away: 1, total: 2 },
        passTotals: { home: 2, away: 2, total: 4 }
      }
    });
  });

  it('returns timeline sorted by timestamp', async () => {
    const response = await request(app).get('/api/matches/match-1/timeline?page=1&pageSize=10');

    expect(response.status).toBe(200);

    const timestamps = response.body.data.events.map((event: { timestamp: string }) => event.timestamp);
    const sorted = [...timestamps].sort((a, b) => Date.parse(a) - Date.parse(b));

    expect(timestamps).toEqual(sorted);
    expect(response.body.data.events).toHaveLength(6);
  });

  it('supports event filtering and pagination', async () => {
    const filtered = await request(app).get('/api/matches/match-1/timeline?eventType=goal&team=away&page=1&pageSize=5');
    expect(filtered.status).toBe(200);
    expect(filtered.body.data.events).toEqual([
      {
        id: 'evt-5',
        timestamp: '2026-06-21T17:00:12Z',
        eventType: 'goal',
        team: 'away',
        player: 'A. Lund'
      }
    ]);

    const paged = await request(app).get('/api/matches/match-1/timeline?page=2&pageSize=2');
    expect(paged.status).toBe(200);
    expect(paged.body.data.events).toHaveLength(2);
    expect(paged.body.data.pagination).toEqual({
      page: 2,
      pageSize: 2,
      totalItems: 6,
      totalPages: 3,
      hasPrevious: true,
      hasNext: true
    });
  });

  it('returns explicit error for invalid query params', async () => {
    const response = await request(app).get('/api/matches/match-1/timeline?page=0');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_QUERY_PARAMETER');
    expect(response.body.error.message).toContain('page');
  });

  it('returns explicit error when match does not exist', async () => {
    const response = await request(app).get('/api/matches/missing-match/summary');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: 'MATCH_NOT_FOUND',
        message: "Match 'missing-match' was not found.",
        details: {
          matchId: 'missing-match'
        }
      }
    });
  });
});
