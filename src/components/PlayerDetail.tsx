import { useState } from 'react';
import type { Player, ReviewEntry } from '../types';
import { getMentalLabel } from '../storage';
import StatBar from './StatBar';
import MentalBadge from './MentalBadge';

interface Props {
  player: Player;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onSave: (player: Player) => void;
}

export default function PlayerDetail({ player, onEdit, onDelete, onBack, onSave }: Props) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState<Omit<ReviewEntry, 'id'>>({
    date: new Date().toISOString().slice(0, 10),
    opponent: '',
    observation: '',
    improved: '',
    needsWork: '',
  });

  const { color: mentalColor } = getMentalLabel(player.stats.mental);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.observation.trim()) return;
    const entry: ReviewEntry = { ...review, id: crypto.randomUUID() };
    const updated: Player = {
      ...player,
      reviews: [entry, ...player.reviews],
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    onSave(updated);
    setShowReviewForm(false);
    setReview({ date: new Date().toISOString().slice(0, 10), opponent: '', observation: '', improved: '', needsWork: '' });
  };

  const handleDeleteReview = (id: string) => {
    const updated: Player = { ...player, reviews: player.reviews.filter(r => r.id !== id) };
    onSave(updated);
  };

  const confirmDelete = () => {
    if (window.confirm(`Delete ${player.name}? This cannot be undone.`)) {
      onDelete(player.id);
    }
  };

  return (
    <div className="page detail-page">
      <div className="detail-top-bar">
        <button className="btn-back" onClick={onBack}>← Back to Players</button>
        <div className="detail-actions">
          <button className="btn-secondary" onClick={() => onEdit(player.id)}>Edit Player</button>
          <button className="btn-danger" onClick={confirmDelete}>Delete</button>
        </div>
      </div>

      <div className="detail-header">
        <div className="detail-identity">
          <h1 className="detail-name">{player.name}</h1>
          <span className="detail-riot-id">{player.riotId}</span>
          <div className="detail-tags">
            <span className="tag tag-role">{player.role}</span>
            <span className="tag tag-agent">{player.mainAgent}</span>
            {player.rank && <span className="tag">{player.rank}</span>}
            {player.team && <span className="tag">{player.team}</span>}
            {player.region && <span className="tag">{player.region}</span>}
          </div>
        </div>
        <div className="detail-leadership-badge">
          <span className="leadership-big-label">Leadership</span>
          <span className="leadership-big">{player.leadership}</span>
          <span className="leadership-formula">Game Sense × 0.5 + Comm × 0.5</span>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-left">
          <section className="detail-section">
            <h2>Main Stats</h2>
            <StatBar label="Mechanics" value={player.stats.mechanics} color="#3b82f6" />
            <StatBar label="Game Sense" value={player.stats.gameSense} color="#8b5cf6" />
            <StatBar label="Communication" value={player.stats.communication} color="#06b6d4" />
            <StatBar label="Mental" value={player.stats.mental} color={mentalColor} />
            <StatBar label="Leadership (auto)" value={player.leadership} color="#ff4655" />
          </section>

          <section className="detail-section mental-section">
            <h2>Mental Analysis</h2>
            <MentalBadge mental={player.stats.mental} size="lg" />
            <div className="mental-scale">
              <div className="mental-scale-row">
                <span style={{ color: '#ef4444' }}>0–20: Critical Risk</span>
                <span style={{ color: '#f97316' }}>21–40: Unstable</span>
                <span style={{ color: '#eab308' }}>41–60: Average</span>
                <span style={{ color: '#22c55e' }}>61–80: Strong Mental</span>
                <span style={{ color: '#a855f7' }}>81–100: Elite Mental</span>
              </div>
            </div>
          </section>
        </div>

        <div className="detail-right">
          {player.notes.strengths && (
            <section className="detail-section">
              <h2>Strengths</h2>
              <p className="note-text">{player.notes.strengths}</p>
            </section>
          )}
          {player.notes.weaknesses && (
            <section className="detail-section">
              <h2>Weaknesses</h2>
              <p className="note-text">{player.notes.weaknesses}</p>
            </section>
          )}
          {player.notes.playstyle && (
            <section className="detail-section">
              <h2>Playstyle</h2>
              <p className="note-text">{player.notes.playstyle}</p>
            </section>
          )}
          {player.notes.trainingFocus && (
            <section className="detail-section">
              <h2>Training Focus</h2>
              <p className="note-text training-focus">{player.notes.trainingFocus}</p>
            </section>
          )}
          {player.notes.coachComment && (
            <section className="detail-section">
              <h2>Coach Comment</h2>
              <p className="note-text">{player.notes.coachComment}</p>
            </section>
          )}
          {player.notes.lastObservation && (
            <section className="detail-section">
              <h2>Last Observation</h2>
              <p className="note-text">{player.notes.lastObservation}</p>
            </section>
          )}
        </div>
      </div>

      <section className="detail-section reviews-section">
        <div className="reviews-header">
          <h2>Review / Session History</h2>
          <button className="btn-secondary" onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? 'Cancel' : '+ Add Review'}
          </button>
        </div>

        {showReviewForm && (
          <form className="review-form" onSubmit={handleAddReview}>
            <div className="form-grid">
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={review.date} onChange={e => setReview(r => ({ ...r, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Opponent (optional)</label>
                <input value={review.opponent ?? ''} onChange={e => setReview(r => ({ ...r, opponent: e.target.value }))} placeholder="Team name or scrim" />
              </div>
            </div>
            <div className="form-group">
              <label>Observation *</label>
              <textarea value={review.observation} onChange={e => setReview(r => ({ ...r, observation: e.target.value }))} placeholder="What did you notice in this session?" rows={3} required />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>What improved</label>
                <textarea value={review.improved} onChange={e => setReview(r => ({ ...r, improved: e.target.value }))} placeholder="Progress since last session..." rows={2} />
              </div>
              <div className="form-group">
                <label>Still needs work</label>
                <textarea value={review.needsWork} onChange={e => setReview(r => ({ ...r, needsWork: e.target.value }))} placeholder="What stayed weak..." rows={2} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Save Review</button>
            </div>
          </form>
        )}

        {player.reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Add a session note after each scrim.</p>
        ) : (
          <div className="reviews-list">
            {player.reviews.map(r => (
              <div key={r.id} className="review-entry">
                <div className="review-meta">
                  <span className="review-date">{r.date}</span>
                  {r.opponent && <span className="review-opponent">vs {r.opponent}</span>}
                  <button className="review-delete" onClick={() => handleDeleteReview(r.id)}>✕</button>
                </div>
                <p className="review-obs">{r.observation}</p>
                {r.improved && <p className="review-sub"><span className="review-label improved">↑ Improved:</span> {r.improved}</p>}
                {r.needsWork && <p className="review-sub"><span className="review-label needs-work">→ Needs Work:</span> {r.needsWork}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="detail-footer">
        Last updated: {player.lastUpdated} · Created: {player.createdAt}
      </div>
    </div>
  );
}
