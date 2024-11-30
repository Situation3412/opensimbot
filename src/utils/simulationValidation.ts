import { SimulationType } from '../types/simulation';
import { GearSlot } from '../types/gear';

export const validateSimulation = (
  type: SimulationType,
  simcInput: string,
  gearSlots?: GearSlot[]
): { isValid: boolean; error?: string } => {
  if (!simcInput.trim()) {
    return { isValid: false, error: 'Please enter character data' };
  }

  if (type === 'bestInBag' && gearSlots && !gearSlots.some(slot => slot.enabled)) {
    return { isValid: false, error: 'Please select at least one gear slot to optimize' };
  }

  return { isValid: true };
}; 