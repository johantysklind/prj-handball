export type Team = 'home' | 'away';
export type MatchEventType = 'goal' | 'pass';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface MatchEvent {
  id: string;
  timestamp: string;
  eventType: MatchEventType;
  team: Team;
  player: string;
}

export interface MatchRecord {
  id: string;
  processingStatus: ProcessingStatus;
  events: MatchEvent[];
}
