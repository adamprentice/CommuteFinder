'use client';

import { useState } from 'react';
import { Location, Visit } from '@/lib/types';

interface NotesPanelProps {
  location: Location;
  notes: string;
  visits: Visit[];
  onSaveNotes: (notes: string) => void;
  onAddVisit: (visit: Visit) => void;
  onRemoveVisit: (index: number) => void;
}

export default function NotesPanel({
  location,
  notes,
  visits,
  onSaveNotes,
  onAddVisit,
  onRemoveVisit,
}: NotesPanelProps) {
  const [draft, setDraft] = useState(notes);
  const [visitDate, setVisitDate] = useState('');
  const [visitNote, setVisitNote] = useState('');
  const isDirty = draft !== notes;

  const handleAddVisit = () => {
    if (!visitDate) return;
    onAddVisit({ date: visitDate, note: visitNote });
    setVisitDate('');
    setVisitNote('');
  };

  return (
    <div className="notes-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Notes */}
      <div className="notes-section">
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1rem', fontWeight: 600, marginBottom: '0.6rem' }}>
          Notes for {location.name}
        </h3>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add your personal notes about this location..."
          style={{
            width: '100%',
            minHeight: '140px',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.88rem',
            lineHeight: 1.6,
            resize: 'vertical',
          }}
        />
        <button
          onClick={() => onSaveNotes(draft)}
          disabled={!isDirty}
          style={{
            marginTop: '0.5rem',
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            background: isDirty ? 'var(--green)' : 'var(--border)',
            color: isDirty ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: isDirty ? 'pointer' : 'default',
            transition: 'all 0.15s',
          }}
        >
          Save Notes
        </button>
      </div>

      {/* Visit Log */}
      <div className="visits-section">
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1rem', fontWeight: 600, marginBottom: '0.6rem' }}>
          Visit Log
        </h3>

        {/* Add Visit Form */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-end',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <label style={{ fontSize: '0.72rem', opacity: 0.6 }}>Date</label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '0.85rem',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
            <label style={{ fontSize: '0.72rem', opacity: 0.6 }}>Note</label>
            <input
              type="text"
              value={visitNote}
              onChange={(e) => setVisitNote(e.target.value)}
              placeholder="How was the visit?"
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '0.85rem',
              }}
            />
          </div>
          <button
            onClick={handleAddVisit}
            disabled={!visitDate}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: visitDate ? 'var(--green)' : 'var(--border)',
              color: visitDate ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: visitDate ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
            }}
          >
            + Add
          </button>
        </div>

        {/* Visit List */}
        {visits.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', opacity: 0.6, padding: '1rem 0' }}>
            No visits logged yet. Plan a trip to {location.name}!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {visits.map((visit, i) => (
              <div
                key={i}
                className="visit-entry"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  background: 'var(--surface)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, flexShrink: 0 }}>
                  {visit.date}
                </span>
                <span style={{ flex: 1, color: 'var(--text-muted)' }}>
                  {visit.note || 'No notes'}
                </span>
                <button
                  onClick={() => onRemoveVisit(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--red)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: '2px 6px',
                    opacity: 0.6,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
