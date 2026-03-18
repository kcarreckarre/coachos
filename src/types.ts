export type Role = 'Duelist' | 'Controller' | 'Initiator' | 'Sentinel' | 'Flex';
export type Rank = 'Iron' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Ascendant' | 'Immortal' | 'Immortal 2' | 'Immortal 3' | 'Radiant';

export interface ReviewEntry {
  id: string;
  date: string;
  opponent?: string;
  observation: string;
  improved: string;
  needsWork: string;
}

export interface Player {
  id: string;
  name: string;
  riotId: string;
  role: string;
  secondaryRole?: string;
  mainAgent: string;
  secondaryAgents: string[];
  team?: string;
  rank?: string;
  region?: string;
  nationality?: string;
  stats: {
    mechanics: number;
    gameSense: number;
    communication: number;
    mental: number;
  };
  leadership: number;
  notes: {
    strengths: string;
    weaknesses: string;
    playstyle: string;
    trainingFocus: string;
    coachComment: string;
    lastObservation: string;
  };
  reviews: ReviewEntry[];
  lastUpdated: string;
  createdAt: string;
}
