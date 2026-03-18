import type { Player } from '../types';
import type { Page } from '../App';
import { getMentalLabel } from '../storage';

interface Props {
  players: Player[];
  onSelectPlayer: (id: string) => void;
  onNav: (page: Page) => void;
}

export default function Dashboard({ players, onSelectPlayer, onNav }: Props) {
  const topLeadership = [...players].sort((a, b) => b.leadership - a.leadership).slice(0, 3);
  const topMental = [...players].sort((a, b) => b.stats.mental - a.stats.mental).slice(0, 3);
  const needsAttention = [...players].filter(p => p.stats.mental <= 40 || p.leadership < 40).slice(0, 3);
  const recent = [...players].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 3);

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span className="page-subtitle">Quick overview of your player pool</span>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{players.length}</span>
          <span className="stat-card-label">Total Players</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{players.filter(p => p.leadership >= 70).length}</span>
          <span className="stat-card-label">IGL Candidates</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{players.filter(p => p.stats.mental <= 40).length}</span>
          <span className="stat-card-label">Mental Risks</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {players.length > 0 ? Math.round(players.reduce((s, p) => s + p.leadership, 0) / players.length) : '—'}
          </span>
          <span className="stat-card-label">Avg Leadership</span>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="empty-state">
          <p>No players yet. Start by adding your first player.</p>
          <button className="btn-primary" onClick={() => onNav('add')}>Add Player</button>
        </div>
      ) : (
        <div className="dashboard-grid">
          <DashSection title="Top Leadership Candidates" players={topLeadership} onSelect={onSelectPlayer} badge="leadership" />
          <DashSection title="Best Mental" players={topMental} onSelect={onSelectPlayer} badge="mental" />
          <DashSection title="Needs Attention" players={needsAttention} onSelect={onSelectPlayer} badge="mental" warn />
          <DashSection title="Recently Updated" players={recent} onSelect={onSelectPlayer} badge="updated" />
        </div>
      )}
    </div>
  );
}

function DashSection({
  title, players, onSelect, badge, warn
}: {
  title: string;
  players: Player[];
  onSelect: (id: string) => void;
  badge: 'leadership' | 'mental' | 'updated';
  warn?: boolean;
}) {
  return (
    <div className={`dash-section ${warn ? 'warn' : ''}`}>
      <h2 className="dash-section-title">{title}</h2>
      {players.length === 0 ? <p className="dash-empty">None</p> : (
        <ul className="dash-list">
          {players.map(p => {
            const { label: mentalLabel, color: mentalColor } = getMentalLabel(p.stats.mental);
            return (
              <li key={p.id} className="dash-item" onClick={() => onSelect(p.id)}>
                <div className="dash-item-info">
                  <span className="dash-item-name">{p.name}</span>
                  <span className="dash-item-sub">{p.role} · {p.mainAgent}</span>
                </div>
                <div className="dash-item-badge">
                  {badge === 'leadership' && <span className="badge-val">{p.leadership} LDR</span>}
                  {badge === 'mental' && <span className="badge-val" style={{ color: mentalColor }}>{mentalLabel}</span>}
                  {badge === 'updated' && <span className="badge-val">{p.lastUpdated}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
