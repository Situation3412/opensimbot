import { SimcVersion } from '../electron/types';

export function compareVersions(a: SimcVersion, b: SimcVersion): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

export function versionToString(version: SimcVersion): string {
  return `${version.major}.${version.minor}.${version.patch}`;
}

export function parseVersion(versionString: string): SimcVersion | null {
  const match = versionString.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10)
  };
} 