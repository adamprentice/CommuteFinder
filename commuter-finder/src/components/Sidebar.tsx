'use client';

import { useState } from 'react';
import { Location, PersonalRating } from '@/lib/types';
import { calculateScore, getScoreBadgeClass, getPipClass, getCombinedScore, getPersonalScore } from '@/lib/scoring';

interface SidebarProps {
  locations: Location[];
  selected: string;
  crossedOff: string[];
  salary: number;
  deposit: number;
  terminal: string;
  isOpen: boolean;
  personalRatings: Record<string, PersonalRating>;
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
  personalRatings,
  onSelect,
  onToggleCross,
  onAddClick,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scored = locations.map((loc) => {
    const rating = personalRatings[loc.id] || {};
    const score = calculateScore(loc, salary, deposit, terminal);
    const combined = getCombinedScore(score.total, rating);
    return { loc, score, combined, rating, isCrossed: crossedOff.includes(loc.id) };
  });

  const active = scored
    .filter((s) => !s.isCrossed)
    .sort((a, b) => b.combined - a.combined);

  const removed = scored
    .filter((s) => s.isCrossed)
    .sort((a, b) => b.combined - a.combined);

  const renderCard = (item: (typeof scored)[0]) => {
    const { loc, score, combined, rating, isCrossed } = item;
    const pipClass = getPipClass(loc, salary, deposit, terminal, crossedOff);
    const badgeClass = getScoreBadgeClass(combined, isCrossed);
    const isSelected = selected === loc.id;
    const isHovered = hoveredId === loc.id;
    const personalScore = getPersonalScore(rating);
    const hasPersonal = personalScore !== null;

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
          style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '6px' }}
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
              {combined}%
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.6, marginTop: '2px' }}>
            {loc.county} &middot; {loc.commute.time} &middot; {loc.commute.terminal}
          </div>
          {/* Personal assessment indicator */}
          {hasPersonal && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
              {rating.adam !== undefined && (
                <span style={{ fontSize: '0.68rem', background: 'rgba(126,184,122,0.15)', color: '#7eb87a', padding: '1px 6px', borderRadius: '999px' }}>
                  A {rating.adam}/10
                </span>
              )}
              {rating.simon !== undefined && (
                <span style={{ fontSize: '0.68rem', background: 'rgba(126,184,122,0.15)', color: '#7eb87a', padding: '1px 6px', borderRadius: '999px' }}>
                  S {rating.simon}/10
                </span>
              )}
              <span style={{ fontSize: '0.68rem', opacity: 0.45 }}>
                obj {score.total}%
              </span>
            </div>
          )}
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
