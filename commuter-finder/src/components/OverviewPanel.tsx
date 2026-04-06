'use client';

import { Location } from '@/lib/types';
import {
  getAffordability,
  getBudget,
  formatPrice,
  formatSeasonTicket,
  getLastTrainBadge,
  affClass,
  affIcon,
  stars,
} from '@/lib/scoring';

interface OverviewPanelProps {
  location: Location;
  salary: number;
  deposit: number;
  crossedOff: boolean;
  onToggleCross: () => void;
}

export default function OverviewPanel({
  location,
  salary,
  deposit,
  crossedOff,
  onToggleCross,
}: OverviewPanelProps) {
  const aff = getAffordability(location, salary, deposit);
  const budget = getBudget(salary, deposit);
  const ltBadge = location.lastTrain ? getLastTrainBadge(location.lastTrain.departs) : null;

  const affMessages = {
    comfortable: `Comfortably within budget (£${Math.round(budget / 1000)}k)`,
    tight: `Tight but possible on your budget (£${Math.round(budget / 1000)}k)`,
    over: `Over budget (£${Math.round(budget / 1000)}k) - may need higher deposit or salary`,
  };

  const affBgColors = {
    comfortable: 'var(--green-light)',
    tight: 'var(--amber-light)',
    over: 'var(--red-light)',
  };

  const affTextColors = {
    comfortable: 'var(--green-text)',
    tight: 'var(--amber-text)',
    over: 'var(--red-text)',
  };

  return (
    <div className="overview-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Crossed-off banner */}
      {crossedOff && (
        <div
          className="crossed-off-banner"
          style={{
            padding: '0.6rem 1rem',
            background: 'var(--red-light)',
            color: 'var(--red-text)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
          }}
        >
          <span>This location has been crossed off your list</span>
          <button
            onClick={onToggleCross}
            style={{
              background: 'none',
              border: '1px solid var(--red-text)',
              color: 'var(--red-text)',
              borderRadius: '6px',
              padding: '3px 10px',
              cursor: 'pointer',
              fontSize: '0.78rem',
            }}
          >
            Restore
          </button>
        </div>
      )}

      {/* Affordability banner */}
      <div
        className={`affordability-banner ${affClass(aff)}`}
        style={{
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          background: affBgColors[aff],
          color: affTextColors[aff],
          fontSize: '0.85rem',
          fontWeight: 500,
        }}
      >
        {affIcon(aff)} {affMessages[aff]}
      </div>

      {/* Our Assessment */}
      <div className="assessment-section">
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>
          Our Assessment
        </h3>
        <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
          {location.recommendation}
        </p>
      </div>

      {/* Key Figures */}
      <div className="key-figures">
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1rem', fontWeight: 600, marginBottom: '0.6rem' }}>
          Key Figures
        </h3>
        <div
          className="key-figures-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div className="key-figure-card" style={{ background: 'var(--surface)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, marginBottom: '4px' }}>Commute</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem' }}>{location.commute.time}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{location.commute.line}</div>
          </div>

          <div className="key-figure-card" style={{ background: 'var(--surface)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, marginBottom: '4px' }}>Season Ticket</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem' }}>{formatSeasonTicket(location.seasonTicket.annual)}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>per year</div>
          </div>

          <div className="key-figure-card" style={{ background: 'var(--surface)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, marginBottom: '4px' }}>Buy Price</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem' }}>
              {formatPrice(location.costs.buyLow)}&ndash;{formatPrice(location.costs.buyHigh)}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>2-3 bed</div>
          </div>

          <div className="key-figure-card" style={{ background: 'var(--surface)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, marginBottom: '4px' }}>Rent Price</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem' }}>
              {formatPrice(location.costs.rentLow)}&ndash;{formatPrice(location.costs.rentHigh)}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>pcm</div>
          </div>

          {location.lastTrain && (
            <div className="key-figure-card" style={{ background: 'var(--surface)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, marginBottom: '4px' }}>Last Train</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem' }}>
                {location.lastTrain.departs}
              </div>
              {ltBadge && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: ltBadge.bg,
                    color: ltBadge.color,
                    fontWeight: 500,
                  }}
                >
                  {ltBadge.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lifestyle */}
      <div className="lifestyle-section">
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1rem', fontWeight: 600, marginBottom: '0.6rem' }}>
          Lifestyle
        </h3>
        <div
          className="lifestyle-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {[
            { label: 'Dog Walking', rating: location.lifestyle.dogWalking, notes: location.lifestyle.dogWalkingNotes, icon: '🐕' },
            { label: 'Dining', rating: location.lifestyle.dining, notes: location.lifestyle.diningNotes, icon: '🍽️' },
            { label: 'Shopping', rating: location.lifestyle.shopping, notes: location.lifestyle.shoppingNotes, icon: '🛍️' },
            { label: 'Character', rating: location.lifestyle.character, notes: location.lifestyle.characterNotes, icon: '🏘️' },
          ].map((item) => (
            <div
              key={item.label}
              className="lifestyle-card"
              style={{
                background: 'var(--surface)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '4px' }}>
                <span>{item.icon}</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.label}</span>
              </div>
              <div style={{ color: 'var(--amber)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                {stars(item.rating)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                {item.notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crime & Safety */}
      {location.crime && (
        <div className="crime-section">
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1rem', fontWeight: 600, marginBottom: '0.6rem' }}>
            Crime &amp; Safety
          </h3>

          <div
            className="crime-grid crime-grid-3col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            <div style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>Overall vs National</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem', color: location.crime.overallVsNational <= 0 ? 'var(--green)' : 'var(--red)' }}>
                {location.crime.overallVsNational > 0 ? '+' : ''}{location.crime.overallVsNational}%
              </div>
            </div>
            <div style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>Burglary vs National</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem', color: location.crime.burglaryVsNational <= 0 ? 'var(--green)' : 'var(--red)' }}>
                {location.crime.burglaryVsNational > 0 ? '+' : ''}{location.crime.burglaryVsNational}%
              </div>
            </div>
            <div style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>LGBT+ Risk</div>
              <div style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: '1.1rem',
                color: location.crime.lgbtRisk === 'lower' ? 'var(--green)' : location.crime.lgbtRisk === 'higher' ? 'var(--red)' : 'var(--amber)',
              }}>
                {location.crime.lgbtRisk}
              </div>
              {location.crime.lgbtNote && (
                <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '2px' }}>{location.crime.lgbtNote}</div>
              )}
            </div>
          </div>

          {/* Positives */}
          {location.crime.positives.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--green)', marginBottom: '4px' }}>Positives</div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {location.crime.positives.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Concerns */}
          {location.crime.concerns.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--red)', marginBottom: '4px' }}>Concerns</div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {location.crime.concerns.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ fontSize: '0.7rem', opacity: 0.4, fontStyle: 'italic', marginTop: '0.5rem' }}>
            Source: {location.crime.source}. Crime data is indicative only and may not reflect current conditions.
          </div>
        </div>
      )}
    </div>
  );
}
