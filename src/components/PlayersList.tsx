import { useState } from 'react';
import type { Player } from '../types';
import type { Page } from '../App';
import PlayerCard from './PlayerCard';

interface Props {
  players: Player[];
  onSelectPlayer: (id: string) => void;
  onNav: (page: Page) => void;
}

const ROLES = ['All', 'Duelist', 'Controller', 'Initiator', 'Sentinel', 'Flex'];
const SORT_OPTIONS = [
  { label: 'Name', value: 'name' },
  { label: 'Leadership', value: 'leadership' },
  { label: 'Mental', value: 'mental' },
  { label: 'Mechanics', value: 'mechanics' },
  { label: 'Recently Updated', value: 'updated' },
];

export default function PlayersList({ players, onSelectPlayer, onNav }: Props) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortBy, setSortBy] = useState('updated');

  const filtered = players
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(q) ||
        p.riotId.toLowerCase().includes(q) ||
        p.mainAgent.toLowerCase().includes(q) ||
        (p.team ?? '').toLowerCase().includes(q);
      const matchRole = roleFilter === 'All' || p.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'leadership') return b.leadership - a.leadership;
      if (sortBy === 'mental') return b.stats.mental - a.stats.mental;
      if (sortBy === 'mechanics') return b.stats.mechanics - a.stats.mechanics;
      return b.lastUpdated.localeCompare(a.lastUpdated);
    });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Players</h1>
          <span className="page-subtitle">{players.length} player{players.length !== 1 ? 's' : ''} in roster</span>
        </div>
        <button className="btn-primary" onClick={() => onNav('add')}>+ Add Player</button>
      </div>

      <div className="filters-bar">
        <input
          className="search-input"
          placeholder="Search by name, Riot ID, agent, team..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="role-filters">
          {ROLES.map(r => (
            <button
              key={r}
              className={`filter-btn ${roleFilter === r ? 'active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          {players.length === 0 ? (
            <>
              <p>No players yet.</p>
              <button className="btn-primary" onClick={() => onNav('add')}>Add your first player</button>
            </>
          ) : (
            <p>No players match your filters.</p>
          )}
        </div>
      ) : (
        <div className="players-grid">
          {filtered.map(p => (
            <PlayerCard key={p.id} player={p} onClick={() => onSelectPlayer(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
