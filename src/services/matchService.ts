import { matches } from '../data/matches';
import { ApiError } from '../errors';
import type { MatchEventType, Team } from '../types';

interface TimelineParams {
  page: number;
  pageSize: number;
  eventType?: MatchEventType;
  team?: Team;
}

export function getMatchOrThrow(matchId: string) {
  const match = matches[matchId];
  if (!match) {
    throw new ApiError(404, 'MATCH_NOT_FOUND', `Match '${matchId}' was not found.`, { matchId });
  }
  return match;
}

export function getMatchSummary(matchId: string) {
  const match = getMatchOrThrow(matchId);
  const goalsHome = match.events.filter((event) => event.eventType === 'goal' && event.team === 'home').length;
  const goalsAway = match.events.filter((event) => event.eventType === 'goal' && event.team === 'away').length;
  const passesHome = match.events.filter((event) => event.eventType === 'pass' && event.team === 'home').length;
  const passesAway = match.events.filter((event) => event.eventType === 'pass' && event.team === 'away').length;

  return {
    matchId: match.id,
    processingStatus: match.processingStatus,
    goals: {
      home: goalsHome,
      away: goalsAway,
      total: goalsHome + goalsAway
    },
    passTotals: {
      home: passesHome,
      away: passesAway,
      total: passesHome + passesAway
    }
  };
}

export function getTimeline(matchId: string, params: TimelineParams) {
  const match = getMatchOrThrow(matchId);

  const filtered = match.events
    .filter((event) => (params.eventType ? event.eventType === params.eventType : true))
    .filter((event) => (params.team ? event.team === params.team : true))
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const events = filtered.slice(start, end);
  const totalItems = filtered.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / params.pageSize);

  return {
    matchId: match.id,
    events,
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      totalItems,
      totalPages,
      hasPrevious: params.page > 1,
      hasNext: params.page < totalPages
    }
  };
}
