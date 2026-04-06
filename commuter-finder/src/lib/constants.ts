export const POI_COLORS: Record<string, string> = {
  transport: '#1a2332',
  walk: '#3a7d44',
  eat: '#c05c00',
  shop: '#6f42c1',
  culture: '#0d7a8a',
};

export const POI_ICONS: Record<string, string> = {
  transport: '🚂',
  walk: '🌳',
  eat: '🍽️',
  shop: '🛍️',
  culture: '🏛️',
};

export const DEFAULT_STATE = {
  selected: 'wgc',
  crossedOff: [] as string[],
  salary: 115000,
  deposit: 40000,
  terminal: 'any',
  activeTab: 'overview',
  notes: {} as Record<string, string>,
  visits: {} as Record<string, { date: string; note: string }[]>,
  personalRatings: {} as Record<string, { adam?: number; simon?: number }>,
  customLocations: [],
};

// Blend ratio when personal assessments are present.
// 0.65 = objective score, 0.35 = personal average. Adjust to taste.
export const PERSONAL_SCORE_WEIGHT = 0.35;

export const TERMINALS = [
  { value: 'any', label: 'Any' },
  { value: "King's Cross", label: "King's Cross" },
  { value: 'St Pancras', label: 'St Pancras' },
  { value: 'Paddington', label: 'Paddington' },
  { value: 'Liverpool Street', label: 'Liverpool St' },
  { value: 'Euston', label: 'Euston' },
  { value: 'Marylebone', label: 'Marylebone' },
];
