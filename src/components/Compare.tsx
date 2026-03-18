import { useState } from 'react';
import type { Player } from '../types';
import { getMentalLabel } from '../storage';

interface Props {
  players: Player[];
  onSelectPlayer: (id: string) => void;
}

export default function Compare({ players, onSelectPlayer }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const compared = selected.map(id => players.find(p => p.id === id)!).filter(Boolean);

  const COLORS = ['#ff4655', '#3b82f6', '#22c55e', '#f97316'];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compare Players</h1>
          <span className="page-subtitle">Select up to 4 players to compare side by side</span>
        </div>
      </div>

      <div className="compare-selector">
        {players.map((p) => (
          <button
            key={p.id}
            className={`compare-pill ${selected.includes(p.id) ? 'active' : ''}`}
            style={selected.includes(p.id) ? { borderColor: COLORS[selected.indexOf(p.id)] } : {}}
            onClick={() => toggle(p.id)}
          >
            {p.name} · {p.role}
          </button>
        ))}
        {players.length === 0 && <p className="dash-empty">No players to compare yet.</p>}
      </div>

      {compared.length >= 2 && (
        <div className="compare-table">
          <div className="compare-header-row">
            <div className="compare-stat-label" />
            {compared.map((p, i) => (
              <div key={p.id} className="compare-player-header" style={{ borderTopColor: COLORS[i] }}>
                <button className="compare-name-link" onClick={() => onSelectPlayer(p.id)}>{p.name}</button>
                <span className="compare-sub">{p.role} · {p.mainAgent}</span>
              </div>
            ))}
          </div>

          {([
            { label: 'Mechanics', key: 'mechanics', color: '#3b82f6' },
            { label: 'Game Sense', key: 'gameSense', color: '#8b5cf6' },
            { label: 'Communication', key: 'communication', color: '#06b6d4' },
            { label: 'Mental', key: 'mental', color: '#eab308' },
            { label: 'Leadership', key: 'leadership', color: '#ff4655', isTop: true },
          ] as { label: string; key: string; color: string; isTop?: boolean }[]).map(stat => (
            <div key={stat.key} className={`compare-row ${stat.isTop ? 'top-stat' : ''}`}>
              <div className="compare-stat-label">{stat.label}</div>
              {compared.map((p, i) => {
                const val = stat.key === 'leadership'
                  ? p.leadership
                  : p.stats[stat.key as keyof Player['stats']];
                return (
                  <div key={p.id} className="compare-stat-cell">
                    <span className="compare-val" style={{ color: COLORS[i] }}>{val}</span>
                    <div className="compare-mini-bar">
                      <div style={{ width: `${val}%`, background: COLORS[i], height: '6px', borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="compare-row">
            <div className="compare-stat-label">Mental Status</div>
            {compared.map(p => {
              const { label, color } = getMentalLabel(p.stats.mental);
              return (
                <div key={p.id} className="compare-stat-cell">
                  <span style={{ color, fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
                </div>
              );
            })}
          </div>

          <div className="compare-row">
            <div className="compare-stat-label">Rank</div>
            {compared.map(p => (
              <div key={p.id} className="compare-stat-cell">
                <span className="compare-text">{p.rank || '—'}</span>
              </div>
            ))}
          </div>

          <div className="compare-row">
            <div className="compare-stat-label">Team</div>
            {compared.map(p => (
              <div key={p.id} className="compare-stat-cell">
                <span className="compare-text">{p.team || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {compared.length < 2 && players.length >= 2 && (
        <div className="empty-state">
          <p>Select at least 2 players to compare.</p>
        </div>
      )}
    </div>
  );
}
