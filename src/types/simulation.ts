export interface BaseSimulationOptions {
  iterations: number;
  fightStyle: string;
  fightLength: number;
  targetError: number;
}

export interface SingleSimOptions extends BaseSimulationOptions {
  enableScaling: boolean;
}

export interface BestInBagOptions extends BaseSimulationOptions {
  topGearSets: number;
  minIlevel: number;
  maxIlevel: number;
  compareTopN: number;
}

export interface UpgradeFinderOptions extends BaseSimulationOptions {
  minIlevel: number;
  maxIlevel: number;
  includeRaids: boolean;
  includeDungeons: boolean;
  includeWorldDrops: boolean;
  includeWorldBosses: boolean;
  includePvP: boolean;
}

export interface BaseSimulationResult {
  dps: number;
  error: number;
}

export interface UpgradeResult extends BaseSimulationResult {
  id: number;
  name: string;
  slot: string;
  source: string;
  ilevel: number;
  dpsIncrease: number;
  dpsPercent: number;
}

export interface GearSetResult extends BaseSimulationResult {
  items: {
    slot: string;
    name: string;
    ilevel: number;
  }[];
  dpsIncrease: number;
  dpsPercent: number;
}

export const COMMON_OPTION_METADATA = {
  iterations: {
    min: 100,
    max: 100000,
    tooltip: 'Higher values provide more accurate results but take longer to simulate'
  },
  fightLength: {
    min: 60,
    max: 1000,
    tooltip: 'Duration of the simulated encounter in seconds'
  },
  targetError: {
    min: 0.1,
    max: 5,
    step: 0.1,
    tooltip: 'Lower values provide more accurate results but take longer to simulate'
  }
} as const;

export const isUpgradeResult = (result: any): result is UpgradeResult => {
  return 'dpsIncrease' in result && 'slot' in result;
};

export const isGearSetResult = (result: any): result is GearSetResult => {
  return 'items' in result && Array.isArray(result.items);
};

export type SimulationType = 'single' | 'bestInBag' | 'upgradeFinder';

export interface SimulationPageProps {
  type: SimulationType;
  title: string;
}

export interface SimulationState<T> {
  simcInput: string;
  options: T;
  isSimulating: boolean;
  output: string[];
} 