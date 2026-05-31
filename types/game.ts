export interface GameSummary {
  slug: string;
  title: string;
  description: string;
  status: 'available' | 'planned';
  audience: string;
}

export interface GameScore {
  game: string;
  playerName: string;
  score: number;
  completedAt: string;
}
