'use client';

import { useState } from 'react';
import { Location, Visit, PersonalRating } from '@/lib/types';

interface NotesPanelProps {
  location: Location;
  notes: string;
  visits: Visit[];
  personalRating: PersonalRating;
  onSaveNotes: (notes: string) => void;
  onAddVisit: (visit: Visit) => void;
  onRemoveVisit: (index: number) => void;
  onSaveRating: (rating: PersonalRating) => void;
}

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
      <label style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.7 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              onClick={() => onChange(value === n ? undefined : n)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: value !== undefined && n <= value ? 'var(--green)' : 'var(--border)',
                background: value !== undefined && n <= value ? 'var(--green)' : 'var(--bg)',
                color: value !== undefined && n <= value ? '#fff' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.1s',
                padding: 0,
              }}
            >
              {n}
            </button>
          ))}
        </div>
        {value !== undefined && (
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: '1.1rem',
              color: value >= 8 ? 'var(--green)' : value >= 5 ? 'var(--amber)' : 'var(--red)',
              minWidth: '28px',
            }}
          >
            {value}/10
          </span>
        )}
      </div>
    </div>
  );
}

export default function NotesPanel({
  location,
  notes,
  visits,
  personalRating,
  onSaveNotes,
  onAddVisit,
  onRemoveVisit,
  onSaveRating,
}: NotesPanelProps) {
  const [draft, setDraft] = useState(notes);
  const [visitDate, setVisitDate] = useState('');
  const [visitNote, setVisitNote] = useState('');
  const [adamScore, setAdamScore] = useState<number | undefined>(personalRating.adam);
  const [simonScore, setSimonScore] = useState<number | undefined>(personalRating.simon);

  const isDirty = draft !== notes;
  const ratingDirty = adamScore !== personalRating.adam || simonScore !== personalRating.simon;

  const handleAddVisit = () => {
    if (!visitDate) return;
    onAddVisit({ date: visitDate, note: visitNote });
    setVisitDate('');
    setVisitNote('');
  };

  return (
    <div className="notes-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Personal Assessment */}
      <div className="assessment-section">
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          Your Assessment
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
          Rate {location.name} out of 10 after visiting. Both scores are averaged and blended with the
          objective score to rerank the list.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RatingInput
            label="Adam"
            value={adamScore}
            onChange={setAdamScore}
          />
          <RatingInput
            label="Simon"
            value={simonScore}
            onChange={setSimonScore}
          />
        </div>
        <button
          onClick={() => onSaveRating({ adam: adamScore, simon: simonScore })}
          disabled={!ratingDirty}
          style={{
            marginTop: '0.75rem',
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            background: ratingDirty ? 'var(--green)' : 'var(--border)',
            color: ratingDirty ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: ratingDirty ? 'pointer' : 'default',
            transition: 'all 0.15s',
          }}
        >
          Save Assessment
        </button>
      </div>

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

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: '140px' }}>
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

        {visits.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', opacity: 0.6, padding: '1rem 0' }}>
            No visits logged yet. Plan a trip to {location.name}!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {visits.map((visit, i) => (
              <div
                key={i}
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
                <span style={{ flex: 1, color: 'var(--text-muted)' }}>{visit.note || 'No notes'}</span>
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
