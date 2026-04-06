'use client';

import { Location, Visit, PersonalRating } from '@/lib/types';
import { calculateScore, getHeaderScoreColor } from '@/lib/scoring';
import OverviewPanel from './OverviewPanel';
import MapPanel from './MapPanel';
import StatsPanel from './StatsPanel';
import NotesPanel from './NotesPanel';

interface DetailViewProps {
  location: Location;
  salary: number;
  deposit: number;
  terminal: string;
  crossedOff: string[];
  activeTab: string;
  notes: string;
  visits: Visit[];
  personalRating: PersonalRating;
  onToggleCross: (id: string) => void;
  onTabChange: (tab: string) => void;
  onSaveNotes: (locationId: string, notes: string) => void;
  onAddVisit: (locationId: string, visit: Visit) => void;
  onRemoveVisit: (locationId: string, index: number) => void;
  onSaveRating: (locationId: string, rating: PersonalRating) => void;
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'map', label: 'Map & POIs' },
  { id: 'stats', label: 'Full Stats & Score' },
  { id: 'notes', label: 'Notes & Visits' },
];

export default function DetailView({
  location,
  salary,
  deposit,
  terminal,
  crossedOff,
  activeTab,
  notes,
  visits,
  personalRating,
  onToggleCross,
  onTabChange,
  onSaveNotes,
  onAddVisit,
  onRemoveVisit,
  onSaveRating,
}: DetailViewProps) {
  const isCrossed = crossedOff.includes(location.id);
  const score = calculateScore(location, salary, deposit, terminal);
  const scoreColor = getHeaderScoreColor(score.total);

  return (
    <>
      <div className="loc-header">
        <div className="loc-title-block">
          <div className="loc-h1">{location.name}</div>
          <div className="loc-subtitle">
            {location.county} · {location.commute.terminal} via {location.commute.line}
          </div>
        </div>
        <div className="loc-header-actions">
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div className="header-score-wrap">
              <div className="header-score-num" style={{ color: scoreColor }}>{score.total}%</div>
              <div className="header-score-label">Match score</div>
            </div>
            {isCrossed && (
              <button
                onClick={() => onToggleCross(location.id)}
                style={{
                  fontSize: 11, padding: '4px 10px', border: '1px solid #aaa',
                  borderRadius: 20, cursor: 'pointer', background: 'white', color: '#555',
                }}
              >
                ↩ Restore
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="panels-wrapper">
        {activeTab === 'overview' && (
          <div className="panel active">
            <OverviewPanel
              location={location}
              salary={salary}
              deposit={deposit}
              crossedOff={isCrossed}
              onToggleCross={() => onToggleCross(location.id)}
            />
          </div>
        )}
        {activeTab === 'map' && (
          <div className="panel active">
            <MapPanel location={location} />
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="panel active">
            <StatsPanel
              location={location}
              salary={salary}
              deposit={deposit}
              terminal={terminal}
            />
          </div>
        )}
        {activeTab === 'notes' && (
          <div className="panel active">
            <NotesPanel
              location={location}
              notes={notes}
              visits={visits}
              personalRating={personalRating}
              onSaveNotes={(n) => onSaveNotes(location.id, n)}
              onAddVisit={(v) => onAddVisit(location.id, v)}
              onRemoveVisit={(i) => onRemoveVisit(location.id, i)}
              onSaveRating={(r) => onSaveRating(location.id, r)}
            />
          </div>
        )}
      </div>
    </>
  );
}
