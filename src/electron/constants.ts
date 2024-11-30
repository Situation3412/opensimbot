export const PLATFORMS = {
  WINDOWS: ['win32'],
  MAC: ['darwin']
} as const;

export const UPDATE_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds 