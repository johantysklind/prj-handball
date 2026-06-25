import express from 'express';
import { ApiError } from './errors';
import { getMatchSummary, getTimeline } from './services/matchService';
import type { MatchEventType, Team } from './types';

const VALID_TEAMS = new Set<Team>(['home', 'away']);
const VALID_EVENT_TYPES = new Set<MatchEventType>(['goal', 'pass']);

function isTeam(input: string): input is Team {
  return VALID_TEAMS.has(input as Team);
}

function isEventType(input: string): input is MatchEventType {
  return VALID_EVENT_TYPES.has(input as MatchEventType);
}

function parsePositiveInteger(input: unknown, field: string, defaultValue: number): number {
  if (input === undefined) {
    return defaultValue;
  }

  const value = Number(input);
  if (!Number.isInteger(value) || value < 1) {
    throw new ApiError(400, 'INVALID_QUERY_PARAMETER', `Query parameter '${field}' must be a positive integer.`, {
      field,
      value: input
    });
  }
  return value;
}

function parseOptionalTeam(input: unknown): Team | undefined {
  if (input === undefined) {
    return undefined;
  }
  if (typeof input !== 'string' || !isTeam(input)) {
    throw new ApiError(400, 'INVALID_QUERY_PARAMETER', "Query parameter 'team' must be either 'home' or 'away'.", {
      field: 'team',
      value: input
    });
  }
  return input;
}

function parseOptionalEventType(input: unknown): MatchEventType | undefined {
  if (input === undefined) {
    return undefined;
  }
  if (typeof input !== 'string' || !isEventType(input)) {
    throw new ApiError(400, 'INVALID_QUERY_PARAMETER', "Query parameter 'eventType' must be either 'goal' or 'pass'.", {
      field: 'eventType',
      value: input
    });
  }
  return input;
}

export const app = express();
app.use(express.json());

app.get('/api/matches/:matchId/summary', (req, res) => {
  const summary = getMatchSummary(req.params.matchId);
  res.status(200).json({ data: summary });
});

app.get('/api/matches/:matchId/timeline', (req, res) => {
  const page = parsePositiveInteger(req.query.page, 'page', 1);
  const pageSize = parsePositiveInteger(req.query.pageSize, 'pageSize', 25);
  const team = parseOptionalTeam(req.query.team);
  const eventType = parseOptionalEventType(req.query.eventType);
  const timeline = getTimeline(req.params.matchId, { page, pageSize, team, eventType });
  res.status(200).json({ data: timeline });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? null
      }
    });
    return;
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected server error occurred.',
      details: null
    }
  });
});
