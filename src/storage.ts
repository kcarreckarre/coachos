import type { Player } from './types';

const KEY = 'coach_app_players';

const RANK_SCORE: Record<string, number> = {
  'Iron': 0, 'Bronze': 8, 'Silver': 16, 'Gold': 24,
  'Platinum': 32, 'Diamond': 40, 'Ascendant': 52,
  'Immortal': 64, 'Immortal 2': 72, 'Immortal 3': 80, 'Radiant': 100,
};

export type Grade = 'D' | 'C' | 'B' | 'A' | 'S';
export interface GradeResult { grade: Grade; score: number; color: string; }

export function getPlayerGrade(player: Player): GradeResult {
  const { mechanics, gameSense, communication, mental } = player.stats;
  const statScore = mechanics * 0.28 + gameSense * 0.28 + communication * 0.22 + mental * 0.22;
  const rankScore = RANK_SCORE[player.rank ?? ''] ?? 0;
  const score = Math.round(statScore * 0.8 + rankScore * 0.2);

  let grade: Grade;
  let color: string;
  if (score >= 82) { grade = 'S'; color = '#a855f7'; }
  else if (score >= 66) { grade = 'A'; color = '#22c55e'; }
  else if (score >= 50) { grade = 'B'; color = '#3b82f6'; }
  else if (score >= 34) { grade = 'C'; color = '#eab308'; }
  else { grade = 'D'; color = '#ef4444'; }

  return { grade, score, color };
}

export function loadPlayers(): Player[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePlayers(players: Player[]): void {
  localStorage.setItem(KEY, JSON.stringify(players));
}

export function calcLeadership(gameSense: number, communication: number): number {
  return Math.round(gameSense * 0.5 + communication * 0.5);
}

export function getMentalLabel(mental: number): { label: string; color: string } {
  if (mental <= 20) return { label: 'Critical Risk', color: '#ef4444' };
  if (mental <= 40) return { label: 'Unstable', color: '#f97316' };
  if (mental <= 60) return { label: 'Average', color: '#eab308' };
  if (mental <= 80) return { label: 'Strong Mental', color: '#22c55e' };
  return { label: 'Elite Mental', color: '#a855f7' };
}
