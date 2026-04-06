'use client';

import { TERMINALS } from '@/lib/constants';
import { getBudget } from '@/lib/scoring';

interface HeaderProps {
  salary: number;
  deposit: number;
  terminal: string;
  onSalaryChange: (salary: number) => void;
  onDepositChange: (deposit: number) => void;
  onTerminalChange: (terminal: string) => void;
  onAddClick: () => void;
  onMenuToggle: () => void;
}

export default function Header({
  salary,
  deposit,
  terminal,
  onSalaryChange,
  onDepositChange,
  onTerminalChange,
  onAddClick,
  onMenuToggle,
}: HeaderProps) {
  const budget = getBudget(salary, deposit);

  return (
    <header
      className="header"
      style={{
        background: 'var(--sidebar-bg)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '0 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <span
          style={{
            background: 'var(--green)',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          🏡
        </span>
        <span
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '-0.02em',
          }}
        >
          CommuterFinder
        </span>
      </div>

      {/* Salary Slider */}
      <div className="header-salary-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '170px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.73rem', opacity: 0.65 }}>Salary</label>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '0.9rem' }}>
            £{Math.round(salary / 1000)}k
          </span>
          <span style={{ fontSize: '0.7rem', opacity: 0.45 }}>
            → ~£{Math.round(budget / 1000)}k buying power
          </span>
        </div>
        <input
          type="range"
          min={80000}
          max={220000}
          step={5000}
          value={salary}
          onChange={(e) => onSalaryChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--green)', cursor: 'pointer' }}
        />
      </div>

      {/* Deposit Input */}
      <div className="header-deposit-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <label style={{ fontSize: '0.73rem', opacity: 0.65 }}>Deposit</label>
        <input
          type="number"
          value={Math.round(deposit / 1000)}
          onChange={(e) => onDepositChange(Number(e.target.value) * 1000)}
          style={{
            width: '68px',
            padding: '5px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            fontFamily: "'Fraunces', serif",
            fontSize: '0.88rem',
          }}
        />
        <span style={{ fontSize: '0.68rem', opacity: 0.4 }}>£k</span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

      {/* Terminal Filter */}
      <div
        className="header-terminal-group"
        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}
      >
        {TERMINALS.map((t) => (
          <button
            key={t.value}
            onClick={() => onTerminalChange(t.value)}
            className="terminal-btn"
            style={{
              padding: '5px 10px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: terminal === t.value ? 'var(--green)' : 'transparent',
              color: terminal === t.value ? '#fff' : 'rgba(255,255,255,0.65)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Add Location — hidden on mobile */}
      <div className="header-add-btn-wrap" style={{ marginLeft: 'auto', flexShrink: 0 }}>
        <button
          onClick={onAddClick}
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            border: '1px solid var(--green)',
            background: 'rgba(58,125,68,0.15)',
            color: 'var(--green)',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ✦ Add Location
        </button>
      </div>

      {/* Hamburger — shown on mobile only via CSS */}
      <button
        className="menu-toggle-btn"
        onClick={onMenuToggle}
        aria-label="Toggle location list"
        style={{ marginLeft: 'auto' }}
      >
        ☰
      </button>
    </header>
  );
}
