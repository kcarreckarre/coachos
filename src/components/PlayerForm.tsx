import { useState, useEffect } from 'react';
import type { Player } from '../types';
import { calcLeadership } from '../storage';

interface Props {
  player: Player | null;
  onSave: (player: Player) => void;
  onCancel: () => void;
}

const ROLES = ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Flex'];
const AGENTS = [
  'Brimstone', 'Viper', 'Omen', 'Astra', 'Harbor', 'Clove',
  'Sova', 'Breach', 'Skye', 'Kay/O', 'Fade', 'Gekko',
  'Jett', 'Phoenix', 'Reyna', 'Raze', 'Yoru', 'Neon', 'Iso', 'Waylay',
  'Sage', 'Cypher', 'Killjoy', 'Chamber', 'Deadlock', 'Vyse',
  'Other'
];
const RANKS = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Immortal 2', 'Immortal 3', 'Radiant'];

function blank(): Player {
  const now = new Date().toISOString().slice(0, 10);
  return {
    id: crypto.randomUUID(),
    name: '',
    riotId: '',
    role: 'Controller',
    secondaryRole: '',
    mainAgent: 'Omen',
    secondaryAgents: [],
    team: '',
    rank: '',
    region: '',
    nationality: '',
    stats: { mechanics: 50, gameSense: 50, communication: 50, mental: 50 },
    leadership: 50,
    notes: { strengths: '', weaknesses: '', playstyle: '', trainingFocus: '', coachComment: '', lastObservation: '' },
    reviews: [],
    lastUpdated: now,
    createdAt: now,
  };
}

export default function PlayerForm({ player, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Player>(player ?? blank());

  useEffect(() => {
    setForm(player ?? blank());
  }, [player]);

  const setStat = (key: keyof Player['stats'], val: number) => {
    const updated = { ...form, stats: { ...form.stats, [key]: val } };
    updated.leadership = calcLeadership(updated.stats.gameSense, updated.stats.communication);
    updated.lastUpdated = new Date().toISOString().slice(0, 10);
    setForm(updated);
  };

  const setField = (key: keyof Player, val: string) => {
    setForm(f => ({ ...f, [key]: val, lastUpdated: new Date().toISOString().slice(0, 10) }));
  };

  const setNote = (key: keyof Player['notes'], val: string) => {
    setForm(f => ({ ...f, notes: { ...f.notes, [key]: val }, lastUpdated: new Date().toISOString().slice(0, 10) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Player name is required.');
    onSave({ ...form, leadership: calcLeadership(form.stats.gameSense, form.stats.communication) });
  };

  const isEdit = !!player;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Player' : 'Add Player'}</h1>
          <span className="page-subtitle">{isEdit ? `Editing ${player!.name}` : 'Create a new player profile'}</span>
        </div>
      </div>

      <form className="player-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <h2 className="form-section-title">Identity</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Player Name *</label>
              <input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Name or alias" required />
            </div>
            <div className="form-group">
              <label>Riot ID</label>
              <input value={form.riotId} onChange={e => setField('riotId', e.target.value)} placeholder="Name#TAG" />
            </div>
            <div className="form-group">
              <label>Main Role</label>
              <select value={form.role} onChange={e => setField('role', e.target.value)}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Secondary Role</label>
              <select value={form.secondaryRole ?? ''} onChange={e => setField('secondaryRole', e.target.value)}>
                <option value="">None</option>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Main Agent</label>
              <select value={form.mainAgent} onChange={e => setField('mainAgent', e.target.value)}>
                {AGENTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Team</label>
              <input value={form.team ?? ''} onChange={e => setField('team', e.target.value)} placeholder="Team name" />
            </div>
            <div className="form-group">
              <label>Rank</label>
              <select value={form.rank ?? ''} onChange={e => setField('rank', e.target.value)}>
                <option value="">Unknown</option>
                {RANKS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Region</label>
              <input value={form.region ?? ''} onChange={e => setField('region', e.target.value)} placeholder="EU, NA, etc." />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2 className="form-section-title">Evaluation</h2>
          <div className="stats-form">
            {(['mechanics', 'gameSense', 'communication', 'mental'] as const).map(key => (
              <div className="stat-input-group" key={key}>
                <label>
                  {key === 'gameSense' ? 'Game Sense' : key.charAt(0).toUpperCase() + key.slice(1)}
                  <span className="stat-input-val">{form.stats[key]}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.stats[key]}
                  onChange={e => setStat(key, Number(e.target.value))}
                />
              </div>
            ))}
            <div className="leadership-display">
              <span>Leadership (auto)</span>
              <span className="leadership-auto">{form.leadership}</span>
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2 className="form-section-title">Coaching Notes</h2>
          <div className="notes-grid">
            <div className="form-group full">
              <label>Strengths</label>
              <textarea value={form.notes.strengths} onChange={e => setNote('strengths', e.target.value)} placeholder="What is this player good at?" rows={3} />
            </div>
            <div className="form-group full">
              <label>Weaknesses</label>
              <textarea value={form.notes.weaknesses} onChange={e => setNote('weaknesses', e.target.value)} placeholder="What needs improvement?" rows={3} />
            </div>
            <div className="form-group full">
              <label>Playstyle</label>
              <textarea value={form.notes.playstyle} onChange={e => setNote('playstyle', e.target.value)} placeholder="How does this player approach the game?" rows={2} />
            </div>
            <div className="form-group full">
              <label>Training Focus</label>
              <textarea value={form.notes.trainingFocus} onChange={e => setNote('trainingFocus', e.target.value)} placeholder="What should we work on next?" rows={2} />
            </div>
            <div className="form-group full">
              <label>Coach Comment</label>
              <textarea value={form.notes.coachComment} onChange={e => setNote('coachComment', e.target.value)} placeholder="Your overall impression..." rows={2} />
            </div>
            <div className="form-group full">
              <label>Last Observation</label>
              <textarea value={form.notes.lastObservation} onChange={e => setNote('lastObservation', e.target.value)} placeholder="Latest thing you noticed..." rows={2} />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary">{isEdit ? 'Save Changes' : 'Create Player'}</button>
        </div>
      </form>
    </div>
  );
}
