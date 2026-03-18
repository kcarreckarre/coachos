# CoachOS — Valorant Edition

A coaching and scouting app for esports coaches who want structured player evaluation, clear coaching notes, and fast player comparison — all in one place.

## What it does

CoachOS helps a coach answer the key questions about every player:

- Who is this player and what role do they play?
- What are their strongest qualities and weaknesses?
- Can they become an IGL?
- What is their mental level under pressure?
- What should we work on next with them?

## Features

### Player Cards
Every player is shown as a quick-scan card with name, Riot ID, role, main agent, all four stat bars, leadership score, and mental status badge.

### Stat System
Each player is rated 0–100 on four core dimensions:

| Stat | Description |
|------|-------------|
| **Mechanics** | Aim, movement, execution |
| **Game Sense** | Reads, positioning, decision-making |
| **Communication** | Callouts, clarity, mid-round comms |
| **Mental** | Resilience, tilt resistance, pressure handling |

**Leadership is auto-calculated:**
```
Leadership = (Game Sense × 0.5) + (Communication × 0.5)
```

**Mental scale:**
- 0–20: Critical Risk
- 21–40: Unstable
- 41–60: Average
- 61–80: Strong Mental
- 81–100: Elite Mental

### Dashboard
Quick overview of the full roster: total players, IGL candidates, mental risks, average leadership, and top performers by category.

### Player Detail Page
Full scouting file per player: identity, stats, coaching notes (strengths, weaknesses, playstyle, training focus, coach comment), mental analysis, and a full session/review log.

### Review History
After every scrim or session, log a review with date, opponent, observation, what improved, and what still needs work. Builds a progression timeline per player.

### Compare Mode
Select 2–4 players and compare all stats side by side with color-coded bars. Useful for choosing starters, captains, or identifying replacements.

### Filters & Search
Search by name, Riot ID, agent, or team. Filter by role. Sort by leadership, mental, mechanics, or recently updated.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **localStorage** — no backend, data stays in your browser
- Pure CSS with a dark esports theme

## Getting Started

```bash
git clone https://github.com/kcarreckarre/coachos
cd coachos
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Roadmap (v2)

- Progression charts over time
- Map-specific notes (best map, weak side, etc.)
- Team builder
- Player type tags (Entry, Anchor, IGL Candidate, Silent Carry, etc.)
- Export player reports as PDF
- AI-generated summary from coaching notes

## Philosophy

> The app gives structure, but the coach keeps the final judgment.

All numbers are coach-assigned. The app creates consistency and memory — it does not replace the human eye.
