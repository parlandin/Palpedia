import type { PalData } from "../types/PalData";

export interface BreedingResult {
  parent1: PalData;
  parent2: PalData;
  child: PalData;
  breedingType: "normal" | "unique" | "self";
}

export interface BreedingPath {
  steps: number;
  tree: BreedingStep[];
}

export interface BreedingStep {
  parent1: PalData;
  parent2: PalData;
  child: PalData;
  isResult: boolean;
  breedingType: "normal" | "unique" | "self";
}

/**
 * Calcula o breeding rank do filhote baseado nos pais
 */
export const calculateChildRank = (
  parent1Rank: number,
  parent2Rank: number
): number => {
  return Math.floor((parent1Rank + parent2Rank + 1) / 2);
};

/**
 * Verifica se é um breeding único válido
 */
export const isValidUniqueBreeding = (
  parent1: PalData,
  parent2: PalData,
  targetPal: PalData
): boolean => {
  if (
    !targetPal.isUnique ||
    !targetPal.breedUnique ||
    targetPal.breedUnique.length === 0
  ) {
    return false;
  }

  const requiredParents = targetPal.breedUnique;
  const parentIds = [
    parent1.id.toString().padStart(3, "0"),
    parent2.id.toString().padStart(3, "0"),
  ];

  // Verificar se os pais correspondem exatamente aos requeridos (em qualquer ordem)
  return (
    requiredParents.length === 2 &&
    requiredParents.every((id) => parentIds.includes(id)) &&
    parentIds.every((id) => requiredParents.includes(id))
  );
};

/**
 * Verifica se é um breeding válido para Pals que só podem ser reproduzidos consigo mesmos
 */
export const isValidSelfBreeding = (
  parent1: PalData,
  parent2: PalData,
  targetPal: PalData
): boolean => {
  if (!targetPal.breedSelf) return false;

  // Para breed_self, ambos os pais devem ser do mesmo tipo do filhote
  return parent1.id === targetPal.id && parent2.id === targetPal.id;
};

/**
 * Encontra Pals por breeding rank com lógica de proximidade
 */
export const findPalsByRank = (
  allPals: PalData[],
  targetRank: number
): PalData[] => {
  // Filtrar apenas Pals válidos para breeding normal
  const validPals = allPals.filter((pal) => !pal.isUnique && !pal.breedSelf);

  if (validPals.length === 0) {
    return [];
  }

  // Encontrar o Pal com menor distância absoluta do targetRank
  let bestPal = validPals[0];
  let minDistance = Math.abs(bestPal.breedingRank! - targetRank);

  validPals.forEach((pal) => {
    const distance = Math.abs(pal.breedingRank! - targetRank);

    if (distance < minDistance) {
      // Distância menor, este é o melhor candidato
      bestPal = pal;
      minDistance = distance;
    } else if (distance === minDistance) {
      // Empate na distância, usar critério de desempate
      // Preferir o menor rank se a distância for igual
      if (pal.breedingRank! < bestPal.breedingRank!) {
        bestPal = pal;
      } else if (pal.breedingRank === bestPal.breedingRank) {
        // Se o rank for igual, usar combi_duplicate_priority
        const currentPriority = pal.combiDuplicatePriority || 0;
        const bestPriority = bestPal.combiDuplicatePriority || 0;
        if (currentPriority < bestPriority) {
          bestPal = pal;
        }
      }
    }
  });

  return [bestPal];
};

/**
 * Encontra o resultado correto do breeding considerando regras especiais
 */
export const findBreedingResult = (
  allPals: PalData[],
  parent1: PalData,
  parent2: PalData
): PalData[] => {
  // Primeiro, verificar se algum Pal único pode ser gerado com esses pais
  for (const pal of allPals) {
    if (pal.isUnique && isValidUniqueBreeding(parent1, parent2, pal)) {
      return [pal];
    }
  }

  // Verificar se é um breeding válido para Pals breed_self
  for (const pal of allPals) {
    if (pal.breedSelf && isValidSelfBreeding(parent1, parent2, pal)) {
      return [pal];
    }
  }

  // Se não é um breeding especial, usar a lógica normal
  const childRank = calculateChildRank(
    parent1.breedingRank!,
    parent2.breedingRank!
  );
  const result = findPalsByRank(allPals, childRank);

  // Filtrar Pals únicos que não podem ser gerados com breeding normal
  return result.filter((pal) => !pal.isUnique && !pal.breedSelf);
};

/**
 * Calcula breeding simples entre dois pais
 */
export const calculateSimpleBreeding = (
  allPals: PalData[],
  parent1: PalData,
  parent2: PalData
): BreedingResult | null => {
  if (!parent1 || !parent2) return null;

  const possibleChildren = findBreedingResult(allPals, parent1, parent2);

  if (possibleChildren.length === 0) return null;

  const child = possibleChildren[0];
  let breedingType: "normal" | "unique" | "self" = "normal";

  if (child.isUnique) {
    breedingType = "unique";
  } else if (child.breedSelf) {
    breedingType = "self";
  }

  return {
    parent1,
    parent2,
    child,
    breedingType,
  };
};

/**
 * Encontra todos os breeding diretos possíveis para um target
 */
export const findAllDirectBreeding = (
  allPals: PalData[],
  basePal: PalData,
  targetPal: PalData
): BreedingStep[] => {
  const directPaths: BreedingStep[] = [];

  // Verificar breeding especiais primeiro
  if (
    targetPal.isUnique &&
    targetPal.breedUnique &&
    targetPal.breedUnique.length > 0
  ) {
    // Para Pals únicos, verificar se basePal é um dos pais necessários
    const requiredParents = targetPal.breedUnique;
    const basePalId = basePal.id.toString().padStart(3, "0");

    if (requiredParents.includes(basePalId)) {
      // Encontrar o outro pai necessário
      const otherParentId = requiredParents.find((id) => id !== basePalId);
      const otherParent = allPals.find(
        (p) => p.id.toString().padStart(3, "0") === otherParentId
      );

      if (otherParent) {
        directPaths.push({
          parent1: basePal,
          parent2: otherParent,
          child: targetPal,
          isResult: true,
          breedingType: "unique",
        });
      }
    }
  }

  // Verificar breeding para Pals que só se reproduzem consigo mesmos
  if (targetPal.breedSelf && basePal.id === targetPal.id) {
    directPaths.push({
      parent1: basePal,
      parent2: basePal, // Mesmo Pal
      child: targetPal,
      isResult: true,
      breedingType: "self",
    });
  }

  // Breeding normal (apenas se o targetPal não for único nem breed_self)
  if (!targetPal.isUnique && !targetPal.breedSelf) {
    const possiblePartners = allPals.filter((pal) => pal.id !== basePal.id);

    possiblePartners.forEach((partner) => {
      const breedingResult = findBreedingResult(allPals, basePal, partner);

      // Verificar se o target está entre os possíveis filhos
      if (breedingResult.some((child) => child.id === targetPal.id)) {
        directPaths.push({
          parent1: basePal,
          parent2: partner,
          child: targetPal,
          isResult: true,
          breedingType: "normal",
        });
      }
    });
  }

  return directPaths;
};

/**
 * Encontra todos os caminhos de breeding possíveis
 */
export const findAllBreedingPaths = (
  allPals: PalData[],
  basePal: PalData,
  targetPal: PalData
): BreedingPath[] => {
  const allPaths: BreedingPath[] = [];

  // Tentar breeding direto (1 passo)
  const directPaths = findAllDirectBreeding(allPals, basePal, targetPal);
  directPaths.forEach((path) => {
    allPaths.push({
      steps: 1,
      tree: [path],
    });
  });

  // Tentar breeding em múltiplos passos (2 a 5 passos)
  for (let steps = 2; steps <= 5; steps++) {
    const multiStepPaths = findMultiStepBreeding(
      allPals,
      basePal,
      targetPal,
      steps
    );
    multiStepPaths.forEach((path) => {
      allPaths.push({
        steps: steps,
        tree: path,
      });
    });

    // Se já encontramos caminhos suficientes, parar de buscar mais passos
    if (allPaths.length >= 10) break;
  }

  // Ordenar por número de passos (breeding direto primeiro)
  allPaths.sort((a, b) => a.steps - b.steps);

  // Limitar a 10 opções para evitar sobrecarga da interface
  return allPaths.slice(0, 10);
};

/**
 * Encontra breeding em múltiplos passos
 */
export const findMultiStepBreeding = (
  allPals: PalData[],
  basePal: PalData,
  targetPal: PalData,
  maxSteps: number
): BreedingStep[][] => {
  const allPaths: BreedingStep[][] = [];
  const maxIntermediaries = 15; // Limitar para performance

  if (maxSteps < 2) return [];

  // Função recursiva para encontrar caminhos
  function findPathsRecursive(
    currentPal: PalData,
    target: PalData,
    currentPath: BreedingStep[],
    remainingSteps: number
  ) {
    if (remainingSteps <= 0) return;

    // Tentar breeding direto para o último passo
    if (remainingSteps === 1) {
      const directPaths = findAllDirectBreeding(allPals, currentPal, target);
      directPaths.forEach((directPath) => {
        const completePath = [
          ...currentPath,
          { ...directPath, isResult: true },
        ];
        allPaths.push(completePath);
      });
      return;
    }

    // Buscar intermediários possíveis
    const sortedPals = [...allPals]
      .filter(
        (pal) =>
          pal.id !== currentPal.id &&
          pal.id !== target.id &&
          !currentPath.some((step) => step.child.id === pal.id) // Evitar loops
      )
      .sort(
        (a, b) =>
          Math.abs(a.breedingRank! - target.breedingRank!) -
          Math.abs(b.breedingRank! - target.breedingRank!)
      )
      .slice(0, maxIntermediaries);

    for (const intermediary of sortedPals) {
      const stepOptions = findAllDirectBreeding(
        allPals,
        currentPal,
        intermediary
      );

      stepOptions.slice(0, 2).forEach((step) => {
        // Máximo 2 opções por intermediário
        const newPath = [...currentPath, { ...step, isResult: false }];
        findPathsRecursive(intermediary, target, newPath, remainingSteps - 1);
      });

      // Limitar o número total de caminhos para evitar explosão combinatorial
      if (allPaths.length >= 20) break;
    }
  }

  findPathsRecursive(basePal, targetPal, [], maxSteps);

  return allPaths.slice(0, 8); // Limitar a 8 caminhos por número de passos
};

/**
 * Verifica se um breeding é possível considerando apenas ranks
 */
export const canBreedByRank = (
  allPals: PalData[],
  parent1: PalData,
  parent2: PalData,
  targetPal: PalData
): boolean => {
  if (
    !parent1.breedingRank ||
    !parent2.breedingRank ||
    !targetPal.breedingRank
  ) {
    return false;
  }

  const expectedChildRank = calculateChildRank(
    parent1.breedingRank,
    parent2.breedingRank
  );
  const possibleChildren = findPalsByRank(allPals, expectedChildRank);

  return possibleChildren.some((child) => child.id === targetPal.id);
};

/**
 * Encontra os melhores parceiros para um Pal criar um target específico
 */
export const findBestPartnersForTarget = (
  allPals: PalData[],
  basePal: PalData,
  targetPal: PalData
): PalData[] => {
  if (!basePal.breedingRank || !targetPal.breedingRank) {
    return [];
  }

  // Calcular qual seria o rank necessário do segundo pai
  // targetRank = (rank1 + rank2 + 1) / 2
  // rank2 = (targetRank * 2) - rank1 - 1
  const neededRank = targetPal.breedingRank * 2 - basePal.breedingRank - 1;

  // Encontrar Pals com rank próximo ao necessário
  const possiblePartners = allPals
    .filter(
      (pal) =>
        pal.id !== basePal.id &&
        pal.breedingRank &&
        Math.abs(pal.breedingRank - neededRank) <= 50 // Tolerância de 50 ranks
    )
    .sort(
      (a, b) =>
        Math.abs(a.breedingRank! - neededRank) -
        Math.abs(b.breedingRank! - neededRank)
    );

  // Verificar quais realmente geram o target
  return possiblePartners
    .filter((partner) => canBreedByRank(allPals, basePal, partner, targetPal))
    .slice(0, 10); // Limitar a 10 melhores opções
};
