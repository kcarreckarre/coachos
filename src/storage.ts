import type { Player } from './types';

const KEY = 'coach_app_players';

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
