import { useState, useCallback } from "react";
import type { PalData } from "../types/PalData";
import {
  findAllBreedingPaths,
  type BreedingPath,
} from "../utils/breedingCalculator";

export const useTreeBreedingCalculator = (allPals: PalData[]) => {
  const [selectedBasePal, setSelectedBasePal] = useState<PalData | null>(null);
  const [selectedTargetPal, setSelectedTargetPal] = useState<PalData | null>(
    null
  );
  const [breedingPaths, setBreedingPaths] = useState<BreedingPath[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular árvore de breeding
  const calculateBreedingTree = useCallback(async () => {
    if (!selectedBasePal || !selectedTargetPal) {
      return;
    }
    setError(null);
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

      if (paths.length === 0) {
        setError("not_found");
        throw new Error("Nenhum caminho encontrado");
      }

      setBreedingPaths(paths);
    } catch (error) {
      console.error("Erro ao calcular árvore de breeding:", error);
      setBreedingPaths([]);
      setError("not_found");
    } finally {
      setCalculating(false);
    }
  }, [allPals, selectedBasePal, selectedTargetPal]);

  const resetCalculator = useCallback(() => {
    setSelectedBasePal(null);
    setSelectedTargetPal(null);
    setBreedingPaths([]);
  }, []);

  return {
    // Estado
    selectedBasePal,
    selectedTargetPal,
    breedingPaths,
    calculating,
    error,

    // Ações
    setSelectedBasePal,
    setSelectedTargetPal,
    calculateBreedingTree,
    resetCalculator,
  };
};
