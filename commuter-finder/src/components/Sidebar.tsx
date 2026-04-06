'use client';

import { useState } from 'react';
import { Location } from '@/lib/types';
import { calculateScore, getScoreBadgeClass, getPipClass } from '@/lib/scoring';

interface SidebarProps {
  locations: Location[];
  selected: string;
  crossedOff: string[];
  salary: number;
  deposit: number;
  terminal: string;
  isOpen: boolean;
  onSelect: (id: string) => void;
  onToggleCross: (id: string) => void;
  onAddClick: () => void;
}

export default function Sidebar({
  locations,
  selected,
  crossedOff,
  salary,
  deposit,
  terminal,
  isOpen,
  onSelect,
  onToggleCross,
  onAddClick,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scored = locations.map((loc) => ({
    loc,
    score: calculateScore(loc, salary, deposit, terminal),
    isCrossed: crossedOff.includes(loc.id),
  }));

  const active = scored
    .filter((s) => !s.isCrossed)
    .sort((a, b) => b.score.total - a.score.total);

  const removed = scored
    .filter((s) => s.isCrossed)
    .sort((a, b) => b.score.total - a.score.total);

  const renderCard = (item: (typeof scored)[0]) => {
    const { loc, score, isCrossed } = item;
    const pipClass = getPipClass(loc, salary, deposit, terminal, crossedOff);
    const badgeClass = getScoreBadgeClass(score.total, isCrossed);
    const isSelected = selected === loc.id;
    const isHovered = hoveredId === loc.id;

    return (
      <div
        key={loc.id}
        className={`sidebar-card ${isSelected ? 'sidebar-card-selected' : ''} ${isCrossed ? 'sidebar-card-crossed' : ''}`}
        onClick={() => onSelect(loc.id)}
        onMouseEnter={() => setHoveredId(loc.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          padding: '0.65rem 0.75rem',
          borderRadius: '8px',
          cursor: 'pointer',
          background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
          border: isSelected ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
          opacity: isCrossed ? 0.5 : 1,
          transition: 'all 0.15s',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem',
        }}
      >
        {/* Status pip */}
        <span
          className={`pip ${pipClass}`}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            flexShrink: 0,
            marginTop: '6px',
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span
              style={{
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: isCrossed ? 'line-through' : 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {loc.name}
            </span>
            <span
              className={`score-badge ${badgeClass}`}
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: '0.8rem',
                padding: '1px 7px',
                borderRadius: '999px',
                flexShrink: 0,
              }}
            >
              {score.total}%
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.6, marginTop: '2px' }}>
            {loc.county} &middot; {loc.commute.time} &middot; {loc.commute.terminal}
          </div>
        </div>

        {/* Dismiss/Restore button on hover */}
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCross(loc.id);
            }}
            style={{
              position: 'absolute',
              right: '6px',
              top: '6px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '0.7rem',
              padding: '2px 6px',
            }}
          >
            {isCrossed ? 'Restore' : '✕'}
          </button>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`sidebar${isOpen ? ' sidebar-mobile-open' : ''}`}
      style={{
        width: '272px',
        minWidth: '272px',
        background: 'var(--sidebar-bg)',
        color: '#fff',
        overflowY: 'auto',
        padding: '0.75rem 0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.45, padding: '0.5rem 0.75rem 0.25rem' }}>
        Locations
      </div>

      {active.map(renderCard)}

      {removed.length > 0 && (
        <>
          <div
            style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              opacity: 0.35,
              padding: '0.75rem 0.75rem 0.25rem',
              marginTop: '0.5rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            Removed
          </div>
          {removed.map(renderCard)}
        </>
      )}

      <div className="sidebar-add">
        <button className="sidebar-add-btn" onClick={onAddClick}>
          ✦ Research a new town with AI
        </button>
      </div>
    </aside>
  );
}
