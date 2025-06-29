export interface PalData {
  id: string; // Alterado para string para suportar IDs como "096B"
  name: string;
  image?: string;
  elements: string[];
  workSuitability: WorkSuitability;
  drops?: string[];
  breedingRank?: number;
  breedingEfficiency?: number;
  wiki?: string;
  isUnique?: boolean;
  breedSelf?: boolean;
  breedUnique?: string[];
  combiDuplicatePriority?: number;
}

export interface WorkSuitability {
  [key: string]: number;
}

export interface BreedingCombination {
  parent1: string;
  parent2: string;
  child: string;
  rank1: number;
  rank2: number;
  childRank: number;
}

export interface SearchFilters {
  name: string;
  element: string;
  workSkill: string;
}

export interface BreedingCalculatorState {
  parent1: PalData | null;
  parent2: PalData | null;
  possibleChildren: PalData[];
  breedingPaths: BreedingPath[];
}

export interface BreedingPath {
  steps: BreedingStep[];
  targetPal: PalData;
  complexity: number;
}

export interface BreedingStep {
  parent1: PalData;
  parent2: PalData;
  result: PalData;
  generation: number;
}
