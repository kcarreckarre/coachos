import type { Player } from '../types';
import { getMentalLabel, getPlayerGrade } from '../storage';
import StatBar from './StatBar';

interface Props {
  player: Player;
  onClick: () => void;
}

export default function PlayerCard({ player, onClick }: Props) {
  const { label: mentalLabel, color: mentalColor } = getMentalLabel(player.stats.mental);
  const { grade, color: gradeColor } = getPlayerGrade(player);

  return (
    <div className="player-card" onClick={onClick}>
      <div className="card-header">
        <div className="card-header-left">
          {player.avatar && <img src={player.avatar} alt={player.name} className="card-avatar" onError={e => (e.currentTarget.style.display = 'none')} />}
          <div>
            <h3 className="card-name">{player.name}</h3>
            <span className="card-riot-id">{player.riotId}</span>
          </div>
        </div>
        <div className="card-role-agent">
          <span className="player-grade" style={{ color: gradeColor, borderColor: gradeColor }}>{grade}</span>
          <span className="card-role">{player.role}</span>
          <span className="card-agent">{player.mainAgent}</span>
        </div>
      </div>

      <div className="card-stats">
        <StatBar label="Mechanics" value={player.stats.mechanics} color="#3b82f6" />
        <StatBar label="Game Sense" value={player.stats.gameSense} color="#8b5cf6" />
        <StatBar label="Communication" value={player.stats.communication} color="#06b6d4" />
        <StatBar label="Mental" value={player.stats.mental} color={mentalColor} />
      </div>

      <div className="card-footer">
        <div className="leadership-score">
          <span className="leadership-label">Leadership</span>
          <span className="leadership-value">{player.leadership}</span>
        </div>
        <span className="mental-badge-sm" style={{ color: mentalColor, borderColor: mentalColor }}>
          {mentalLabel}
        </span>
      </div>

      {player.notes.strengths && (
        <p className="card-summary">{player.notes.strengths.slice(0, 90)}{player.notes.strengths.length > 90 ? '…' : ''}</p>
      )}

      <div className="card-meta">
        {player.team && <span className="card-team">{player.team}</span>}
        {player.rank && <span className="card-rank">{player.rank}</span>}
        <span className="card-updated">Updated {player.lastUpdated}</span>
      </div>
    </div>
  );
}
