import { useState, useCallback } from "react";
import type { PalData } from "../types/PalData";
import {
  calculateSimpleBreeding,
  type BreedingResult,
} from "../utils/breedingCalculator";

export const useSimpleBreedingCalculator = (allPals: PalData[]) => {
  const [selectedParent1, setSelectedParent1] = useState<PalData | null>(null);
  const [selectedParent2, setSelectedParent2] = useState<PalData | null>(null);
  const [breedingResult, setBreedingResult] = useState<BreedingResult | null>(
    null
  );

  // Calcular breeding simples
  const calculateBreeding = useCallback(() => {
    if (!selectedParent1 || !selectedParent2) {
      setBreedingResult(null);
      return;
    }

    const result = calculateSimpleBreeding(
      allPals,
      selectedParent1,
      selectedParent2
    );
    setBreedingResult(result);
  }, [allPals, selectedParent1, selectedParent2]);

  // Resetar calculadora simples
  const resetCalculator = useCallback(() => {
    setSelectedParent1(null);
    setSelectedParent2(null);
    setBreedingResult(null);
  }, []);

  return {
    // Estado
    selectedParent1,
    selectedParent2,
    breedingResult,

    // Ações
    setSelectedParent1,
    setSelectedParent2,
    calculateBreeding,
    resetCalculator,
  };
};
