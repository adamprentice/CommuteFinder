'use client';

import { useState, useCallback } from 'react';
import { Location } from '@/lib/types';

interface AIModalProps {
  isOpen: boolean;
  salary: number;
  deposit: number;
  onClose: () => void;
  onAddLocation: (location: Location) => void;
}

type ModalState = 'idle' | 'loading' | 'preview' | 'error';

interface ResearchStep {
  label: string;
  done: boolean;
}

const EXAMPLE_TOWNS = ['Ware', 'Royston', 'Hatfield', 'Potters Bar', 'Hertford', 'Chingford'];

const RESEARCH_STEPS: string[] = [
  'Searching train routes...',
  'Checking property prices...',
  'Analysing crime data...',
  'Evaluating lifestyle...',
  'Generating recommendation...',
];

export default function AIModal({ isOpen, salary, deposit, onClose, onAddLocation }: AIModalProps) {
  const [state, setState] = useState<ModalState>('idle');
  const [query, setQuery] = useState('');
  const [steps, setSteps] = useState<ResearchStep[]>([]);
  const [preview, setPreview] = useState<Location | null>(null);
  const [error, setError] = useState('');

  const reset = useCallback(() => {
    setState('idle');
    setQuery('');
    setSteps([]);
    setPreview(null);
    setError('');
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSearch = async (town?: string) => {
    const searchTerm = town || query.trim();
    if (!searchTerm) return;

    setState('loading');
    setSteps(RESEARCH_STEPS.map((label) => ({ label, done: false })));

    // Animate steps in parallel with the API call
    const animateSteps = async () => {
      for (let i = 0; i < RESEARCH_STEPS.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        setSteps((prev) => prev.map((s, idx) => (idx <= i ? { ...s, done: true } : s)));
      }
    };

    const fetchData = fetch('/api/ai/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ townName: searchTerm, salary, deposit }),
    });

    try {
      const [, res] = await Promise.all([animateSteps(), fetchData]);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Research failed: ${res.statusText}`);
      }

      // Mark all steps done
      setSteps((prev) => prev.map((s) => ({ ...s, done: true })));
      setPreview(data);
      await new Promise((resolve) => setTimeout(resolve, 350));
      setState('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  };

  const handleAdd = () => {
    if (preview) {
      onAddLocation(preview);
      handleClose();
    }
  };

  const stars = (n: number) => '\u2605'.repeat(n) + '\u2606'.repeat(5 - n);

  if (!isOpen) return null;

  return (
    <div
      className="ai-modal-overlay"
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="ai-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          width: '520px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
          padding: '1.5rem',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
            ✦ AI Location Research
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Idle State */}
        {state === 'idle' && (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter a town name to research..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                }}
              />
              <button
                onClick={() => handleSearch()}
                disabled={!query.trim()}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: query.trim() ? 'var(--green)' : 'var(--border)',
                  color: query.trim() ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: query.trim() ? 'pointer' : 'default',
                }}
              >
                Research
              </button>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Try one of these:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {EXAMPLE_TOWNS.map((town) => (
                <button
                  key={town}
                  onClick={() => {
                    setQuery(town);
                    handleSearch(town);
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '999px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {town}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {state === 'loading' && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            {/* Animated orb */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--green), var(--amber))',
                margin: '0 auto 1rem',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <style>{`
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.15); opacity: 1; }
              }
            `}</style>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>
              Researching {query}...
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left', maxWidth: '280px', margin: '0 auto' }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.82rem',
                    color: step.done ? 'var(--green)' : 'var(--text-muted)',
                    transition: 'color 0.3s',
                  }}
                >
                  <span>{step.done ? '\u2713' : '\u25CB'}</span>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview State */}
        {state === 'preview' && preview && (
          <div>
            <div
              style={{
                background: 'var(--surface)',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
                {preview.name}
              </h3>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {preview.county}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div>
                  <span style={{ opacity: 0.6 }}>Commute:</span> {preview.commute.time}
                </div>
                <div>
                  <span style={{ opacity: 0.6 }}>Terminal:</span> {preview.commute.terminal}
                </div>
                <div>
                  <span style={{ opacity: 0.6 }}>Buy:</span> £{Math.round(preview.costs.buyLow / 1000)}k-£{Math.round(preview.costs.buyHigh / 1000)}k
                </div>
                <div>
                  <span style={{ opacity: 0.6 }}>Rent:</span> £{Math.round(preview.costs.rentLow / 1000)}k-£{Math.round(preview.costs.rentHigh / 1000)}k
                </div>
              </div>

              {/* Lifestyle Stars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                <div>Dog Walking: <span style={{ color: 'var(--amber)' }}>{stars(preview.lifestyle.dogWalking)}</span></div>
                <div>Dining: <span style={{ color: 'var(--amber)' }}>{stars(preview.lifestyle.dining)}</span></div>
                <div>Shopping: <span style={{ color: 'var(--amber)' }}>{stars(preview.lifestyle.shopping)}</span></div>
                <div>Character: <span style={{ color: 'var(--amber)' }}>{stars(preview.lifestyle.character)}</span></div>
              </div>

              {/* Recommendation */}
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                {preview.recommendation}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={reset}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Discard
              </button>
              <button
                onClick={handleAdd}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--green)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Add Location
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--red)', marginBottom: '1rem' }}>
              {error}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={handleClose}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={reset}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--green)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
