'use client';

import { useState, useEffect, useCallback } from 'react';
import { Location, AppState, Visit, PersonalRating } from '@/lib/types';
import { DEFAULT_STATE } from '@/lib/constants';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DetailView from '@/components/DetailView';
import AIModal from '@/components/AIModal';

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [state, setState] = useState<AppState>({ ...DEFAULT_STATE, customLocations: [] });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [locsRes, stateRes] = await Promise.all([
          fetch('/api/locations'),
          fetch('/api/state'),
        ]);
        const locsData = await locsRes.json();
        const stateData = await stateRes.json();
        setLocations(locsData);
        setState(prev => ({ ...prev, ...stateData }));
      } catch (e) {
        console.error('Failed to load data:', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const persistState = useCallback(async (updates: Partial<AppState>) => {
    setState(prev => {
      const next = { ...prev, ...updates };
      fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      }).catch(console.error);
      return next;
    });
  }, []);

  const handleSalaryChange = useCallback((salary: number) => {
    persistState({ salary });
  }, [persistState]);

  const handleDepositChange = useCallback((deposit: number) => {
    persistState({ deposit });
  }, [persistState]);

  const handleTerminalChange = useCallback((terminal: string) => {
    persistState({ terminal });
  }, [persistState]);

  const handleSelect = useCallback((id: string) => {
    persistState({ selected: id, activeTab: 'overview' });
  }, [persistState]);

  const handleToggleCross = useCallback((id: string) => {
    setState(prev => {
      const crossedOff = prev.crossedOff.includes(id)
        ? prev.crossedOff.filter(x => x !== id)
        : [...prev.crossedOff, id];
      const next = { ...prev, crossedOff };
      fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      }).catch(console.error);
      return next;
    });
  }, []);

  const handleSaveNotes = useCallback(async (locationId: string, notes: string) => {
    setState(prev => ({
      ...prev,
      notes: { ...prev.notes, [locationId]: notes },
    }));
    await fetch(`/api/locations/${locationId}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
  }, []);

  const handleAddVisit = useCallback(async (locationId: string, visit: Visit) => {
    const res = await fetch(`/api/locations/${locationId}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visit),
    });
    const visits = await res.json();
    setState(prev => ({
      ...prev,
      visits: { ...prev.visits, [locationId]: visits },
    }));
  }, []);

  const handleRemoveVisit = useCallback(async (locationId: string, index: number) => {
    const res = await fetch(`/api/locations/${locationId}/visits`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index }),
    });
    const visits = await res.json();
    setState(prev => ({
      ...prev,
      visits: { ...prev.visits, [locationId]: visits },
    }));
  }, []);

  const handleAddLocation = useCallback((location: Location) => {
    setLocations(prev => [...prev, location]);
    setState(prev => {
      const next = {
        ...prev,
        selected: location.id,
        activeTab: 'overview',
        customLocations: [...prev.customLocations, location],
      };
      fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      }).catch(console.error);
      return next;
    });
    setModalOpen(false);
  }, []);

  const handleSaveRating = useCallback(async (locationId: string, rating: PersonalRating) => {
    setState(prev => ({
      ...prev,
      personalRatings: { ...prev.personalRatings, [locationId]: rating },
    }));
    await fetch(`/api/locations/${locationId}/rating`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rating),
    });
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  const selectedLocation = locations.find(l => l.id === state.selected) || locations[0];

  return (
    <>
      <Header
        salary={state.salary}
        deposit={state.deposit}
        terminal={state.terminal}
        onSalaryChange={handleSalaryChange}
        onDepositChange={handleDepositChange}
        onTerminalChange={handleTerminalChange}
        onAddClick={() => setModalOpen(true)}
        onMenuToggle={() => setSidebarOpen(prev => !prev)}
      />
      <div className="app-body">
        {/* Mobile sidebar backdrop */}
        <div
          className={`sidebar-backdrop${sidebarOpen ? ' visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
        <Sidebar
          locations={locations}
          selected={state.selected}
          crossedOff={state.crossedOff}
          salary={state.salary}
          deposit={state.deposit}
          terminal={state.terminal}
          isOpen={sidebarOpen}
          personalRatings={state.personalRatings || {}}
          onSelect={(id) => { handleSelect(id); setSidebarOpen(false); }}
          onToggleCross={handleToggleCross}
          onAddClick={() => { setModalOpen(true); setSidebarOpen(false); }}
        />
        <main className="main-content">
          {selectedLocation && (
            <DetailView
              location={selectedLocation}
              salary={state.salary}
              deposit={state.deposit}
              terminal={state.terminal}
              crossedOff={state.crossedOff}
              activeTab={state.activeTab}
              notes={state.notes[selectedLocation.id] || ''}
              visits={state.visits[selectedLocation.id] || []}
              personalRating={state.personalRatings?.[selectedLocation.id] || {}}
              onToggleCross={handleToggleCross}
              onTabChange={handleTabChange}
              onSaveNotes={handleSaveNotes}
              onAddVisit={handleAddVisit}
              onRemoveVisit={handleRemoveVisit}
              onSaveRating={handleSaveRating}
            />
          )}
        </main>
      </div>
      <AIModal
        isOpen={modalOpen}
        salary={state.salary}
        deposit={state.deposit}
        onClose={() => setModalOpen(false)}
        onAddLocation={handleAddLocation}
      />
    </>
  );
}
