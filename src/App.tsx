import { useState } from 'react';
import type { Player } from './types';
import { loadPlayers, savePlayers } from './storage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PlayersList from './components/PlayersList';
import PlayerDetail from './components/PlayerDetail';
import PlayerForm from './components/PlayerForm';
import Compare from './components/Compare';
import './App.css';

export type Page = 'dashboard' | 'players' | 'add' | 'detail' | 'compare';

function App() {
  const [players, setPlayers] = useState<Player[]>(loadPlayers());
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const persist = (updated: Player[]) => {
    setPlayers(updated);
    savePlayers(updated);
  };

  const handleSave = (player: Player) => {
    const existing = players.find(p => p.id === player.id);
    if (existing) {
      persist(players.map(p => p.id === player.id ? player : p));
    } else {
      persist([...players, player]);
    }
    setEditId(null);
    setPage('players');
  };

  const handleDelete = (id: string) => {
    persist(players.filter(p => p.id !== id));
    setPage('players');
  };

  const handleSelectPlayer = (id: string) => {
    setSelectedId(id);
    setPage('detail');
  };

  const handleEdit = (id: string) => {
    setEditId(id);
    setPage('add');
  };

  const handleNav = (p: Page) => {
    if (p === 'add') setEditId(null);
    setPage(p);
  };

  const selectedPlayer = players.find(p => p.id === selectedId) ?? null;
  const editPlayer = editId ? players.find(p => p.id === editId) ?? null : null;

  return (
    <div className="app">
      <Sidebar currentPage={page} onNav={handleNav} />
      <main className="main-content">
        {page === 'dashboard' && (
          <Dashboard players={players} onSelectPlayer={handleSelectPlayer} onNav={handleNav} />
        )}
        {page === 'players' && (
          <PlayersList players={players} onSelectPlayer={handleSelectPlayer} onNav={handleNav} />
        )}
        {page === 'add' && (
          <PlayerForm player={editPlayer} onSave={handleSave} onCancel={() => setPage('players')} />
        )}
        {page === 'detail' && selectedPlayer && (
          <PlayerDetail
            player={selectedPlayer}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBack={() => setPage('players')}
            onSave={handleSave}
          />
        )}
        {page === 'compare' && (
          <Compare players={players} onSelectPlayer={handleSelectPlayer} />
        )}
      </main>
    </div>
  );
}

export default App;
