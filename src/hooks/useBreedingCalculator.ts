import { useState, useCallback } from "react";
import type { PalData } from "../types/PalData";
import {
  calculateSimpleBreeding,
  findAllBreedingPaths,
  type BreedingResult,
  type BreedingPath,
} from "../utils/breedingCalculator";

export const useBreedingCalculator = (allPals: PalData[]) => {
  const [selectedParent1, setSelectedParent1] = useState<PalData | null>(null);
  const [selectedParent2, setSelectedParent2] = useState<PalData | null>(null);
  const [selectedBasePal, setSelectedBasePal] = useState<PalData | null>(null);
  const [selectedTargetPal, setSelectedTargetPal] = useState<PalData | null>(
    null
  );

  const [breedingResult, setBreedingResult] = useState<BreedingResult | null>(
    null
  );
  const [breedingPaths, setBreedingPaths] = useState<BreedingPath[]>([]);
  const [calculating, setCalculating] = useState(false);

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

  // Calcular árvore de breeding
  const calculateBreedingTree = useCallback(async () => {
    if (!selectedBasePal || !selectedTargetPal) {
      return;
    }

    setCalculating(true);

    try {
      // Usar setTimeout para não bloquear a UI durante o cálculo
      const paths = await new Promise<BreedingPath[]>((resolve) => {
        setTimeout(() => {
          const result = findAllBreedingPaths(
            allPals,
            selectedBasePal,
            selectedTargetPal
          );
          resolve(result);
        }, 100);
      });

      setBreedingPaths(paths);
    } catch (error) {
      console.error("Erro ao calcular árvore de breeding:", error);
      setBreedingPaths([]);
    } finally {
      setCalculating(false);
    }
  }, [allPals, selectedBasePal, selectedTargetPal]);

  // Resetar calculadora simples
  const resetSimpleCalculator = useCallback(() => {
    setSelectedParent1(null);
    setSelectedParent2(null);
    setBreedingResult(null);
  }, []);

  // Resetar calculadora de árvore
  const resetTreeCalculator = useCallback(() => {
    setSelectedBasePal(null);
    setSelectedTargetPal(null);
    setBreedingPaths([]);
  }, []);

  return {
    // Estado
    selectedParent1,
    selectedParent2,
    selectedBasePal,
    selectedTargetPal,
    breedingResult,
    breedingPaths,
    calculating,

    // Ações
    setSelectedParent1,
    setSelectedParent2,
    setSelectedBasePal,
    setSelectedTargetPal,
    calculateBreeding,
    calculateBreedingTree,
    resetSimpleCalculator,
    resetTreeCalculator,
  };
};
