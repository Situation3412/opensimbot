export const FIGHT_STYLES = [
  { value: 'Patchwerk', label: 'Patchwerk (Tank & Spank)' },
  { value: 'HeavyMovement', label: 'Heavy Movement' },
  { value: 'LightMovement', label: 'Light Movement' }
] as { value: string; label: string; }[];

export type FightStyle = typeof FIGHT_STYLES[number]['value']; 