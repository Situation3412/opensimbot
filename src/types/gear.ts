export interface GearSlot {
  id: string;
  label: string;
  enabled: boolean;
}

export const GEAR_SLOTS: GearSlot[] = [
  { id: 'head', label: 'Head', enabled: true },
  { id: 'neck', label: 'Neck', enabled: true },
  { id: 'shoulders', label: 'Shoulders', enabled: true },
  { id: 'back', label: 'Back', enabled: true },
  { id: 'chest', label: 'Chest', enabled: true },
  { id: 'wrists', label: 'Wrists', enabled: true },
  { id: 'hands', label: 'Hands', enabled: true },
  { id: 'waist', label: 'Waist', enabled: true },
  { id: 'legs', label: 'Legs', enabled: true },
  { id: 'feet', label: 'Feet', enabled: true },
  { id: 'finger1', label: 'Ring 1', enabled: true },
  { id: 'finger2', label: 'Ring 2', enabled: true },
  { id: 'trinket1', label: 'Trinket 1', enabled: true },
  { id: 'trinket2', label: 'Trinket 2', enabled: true },
  { id: 'mainhand', label: 'Main Hand', enabled: true },
  { id: 'offhand', label: 'Off Hand', enabled: true },
]; 