'use client';

import { Location } from '@/lib/types';
import {
  calculateScore,
  getAffordability,
  getBudget,
  formatPrice,
  formatSeasonTicket,
  stars,
  SCORE_WEIGHTS,
} from '@/lib/scoring';

interface StatsPanelProps {
  location: Location;
  salary: number;
  deposit: number;
  terminal: string;
}

export default function StatsPanel({ location, salary, deposit, terminal }: StatsPanelProps) {
  const score = calculateScore(location, salary, deposit, terminal);
  const aff = getAffordability(location, salary, deposit);
  const budget = getBudget(salary, deposit);

  const components = [
    { label: 'Commute', value: score.components.commute, max: SCORE_WEIGHTS.commute, color: 'var(--blue, #4a90d9)' },
    { label: 'Affordability', value: score.components.affordability, max: SCORE_WEIGHTS.affordability, color: 'var(--green)' },
    { label: 'Crime & Safety', value: score.components.crime, max: SCORE_WEIGHTS.crime, color: 'var(--red)' },
    { label: 'Lifestyle', value: score.components.lifestyle, max: SCORE_WEIGHTS.lifestyle, color: 'var(--amber)' },
  ];

  return (
    <div className="stats-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Score Breakdown */}
      <div className="score-breakdown">
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Score Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {components.map((comp) => (
            <div key={comp.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '3px' }}>
                <span>{comp.label}</span>
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                  {comp.value}/{comp.max}
                </span>
              </div>
              <div
                style={{
                  height: '8px',
                  background: 'var(--border)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(comp.value / comp.max) * 100}%`,
                    background: comp.color,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Total Score</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.3rem' }}>
            {score.total}%
          </span>
        </div>
      </div>

      {/* Full Stats Table */}
      <div className="stats-table">
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Full Details
        </h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.84rem',
          }}
        >
          <tbody>
            {[
              ['Location', location.name],
              ['County', location.county],
              ['Commute Time', location.commute.time],
              ['Terminal', location.commute.terminal],
              ['Line', location.commute.line],
              ['Frequency', location.commute.freq],
              ['Season Ticket', formatSeasonTicket(location.seasonTicket.annual)],
              ['Buy Price', `${formatPrice(location.costs.buyLow)} - ${formatPrice(location.costs.buyHigh)}`],
              ['Rent Price', `${formatPrice(location.costs.rentLow)} - ${formatPrice(location.costs.rentHigh)}`],
              ['Budget', `£${Math.round(budget / 1000)}k`],
              ['Affordability', aff],
              ...(location.lastTrain
                ? [
                    ['Last Train Departs', location.lastTrain.departs],
                    ['Last Train Arrives', location.lastTrain.arrives],
                    ['Last Train Note', location.lastTrain.note],
                  ]
                : []),
              ['Dog Walking', `${stars(location.lifestyle.dogWalking)} - ${location.lifestyle.dogWalkingNotes}`],
              ['Dining', `${stars(location.lifestyle.dining)} - ${location.lifestyle.diningNotes}`],
              ['Shopping', `${stars(location.lifestyle.shopping)} - ${location.lifestyle.shoppingNotes}`],
              ['Character', `${stars(location.lifestyle.character)} - ${location.lifestyle.characterNotes}`],
              ...(location.crime
                ? [
                    ['Crime Force', location.crime.force],
                    ['Overall vs National', `${location.crime.overallVsNational}%`],
                    ['Burglary vs National', `${location.crime.burglaryVsNational}%`],
                    ['LGBT+ Risk', location.crime.lgbtRisk],
                  ]
                : []),
              ['Coordinates', `${location.lat}, ${location.lng}`],
              ['POIs', `${location.pois.length} locations`],
            ].map(([label, value], i) => (
              <tr
                key={i}
                style={{
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <td
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    width: '160px',
                  }}
                >
                  {label}
                </td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
