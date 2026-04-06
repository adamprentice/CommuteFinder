export interface Commute {
  time: string;
  timeMin: number;
  terminal: string;
  line: string;
  freq: string;
}

export interface SeasonTicket {
  annual: number;
}

export interface Costs {
  buyLow: number;
  buyHigh: number;
  rentLow: number;
  rentHigh: number;
}

export interface LastTrain {
  departs: string;
  arrives: string;
  note: string;
}

export interface Crime {
  force: string;
  overallVsNational: number;
  burglaryVsNational: number;
  lgbtRisk: 'lower' | 'similar' | 'higher';
  lgbtNote: string;
  positives: string[];
  concerns: string[];
  source: string;
}

export interface Lifestyle {
  dogWalking: number;
  dogWalkingNotes: string;
  dining: number;
  diningNotes: string;
  shopping: number;
  shoppingNotes: string;
  character: number;
  characterNotes: string;
}

export interface POI {
  name: string;
  lat: number;
  lng: number;
  type: 'transport' | 'walk' | 'eat' | 'shop' | 'culture';
  desc: string;
}

export interface Location {
  id: string;
  name: string;
  county: string;
  lat: number;
  lng: number;
  commute: Commute;
  seasonTicket: SeasonTicket;
  costs: Costs;
  lastTrain?: LastTrain;
  crime?: Crime;
  lifestyle: Lifestyle;
  recommendation: string;
  pois: POI[];
}

export interface Visit {
  date: string;
  note: string;
}

export interface AppState {
  selected: string;
  crossedOff: string[];
  salary: number;
  deposit: number;
  terminal: string;
  activeTab: string;
  notes: Record<string, string>;
  visits: Record<string, Visit[]>;
  customLocations: Location[];
}

export interface ScoreComponents {
  commute: number;
  affordability: number;
  crime: number;
  lifestyle: number;
}

export interface ScoreResult {
  total: number;
  components: ScoreComponents;
}

export type Affordability = 'comfortable' | 'tight' | 'over';
