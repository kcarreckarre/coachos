import type { Page } from '../App';

interface Props {
  currentPage: Page;
  onNav: (page: Page) => void;
}

const items: { label: string; page: Page; icon: string }[] = [
  { label: 'Dashboard', page: 'dashboard', icon: '▦' },
  { label: 'Players', page: 'players', icon: '◈' },
  { label: 'Add Player', page: 'add', icon: '+' },
  { label: 'Compare', page: 'compare', icon: '⇌' },
];

export default function Sidebar({ currentPage, onNav }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">◈</span>
        <span className="logo-text">CoachOS</span>
        <span className="logo-sub">Valorant Edition</span>
      </div>
      <nav className="sidebar-nav">
        {items.map(item => (
          <button
            key={item.page}
            className={`nav-item ${currentPage === item.page ? 'active' : ''}`}
            onClick={() => onNav(item.page)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span>v1.0 MVP</span>
      </div>
    </aside>
  );
}
