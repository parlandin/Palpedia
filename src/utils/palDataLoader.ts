import type { PalData } from "../types/PalData";

// Interface para o JSON original
export interface OriginalPalData {
  id: string;
  name: string;
  picture: string;
  element: string[];
  work_suitability: Record<string, number>;
  drops: string[];
  breeding_rank: number;
  wiki_url: string;
  local_icon?: string;
  combi_duplicate_priority?: number;
  isUnique?: boolean;
  breed_self?: boolean;
  breed_unique?: { id: string }[];
}

export const transformPalData = (
  originalData: OriginalPalData[]
): PalData[] => {
  return originalData.map((pal) => ({
    // Manter ID como string para suportar variações como "096B"
    id: pal.id,
    name: pal.name,
    // Corrigir caminho da imagem - arquivos no public são servidos na raiz
    image: pal.local_icon
      ? pal.local_icon.replace("public/", "/")
      : pal.picture,
    elements: pal.element,
    workSuitability: pal.work_suitability || {},
    drops: pal.drops || [],
    breedingRank: pal.breeding_rank,
    wiki: pal.wiki_url,
    isUnique: pal.isUnique || false,
    breedSelf: pal.breed_self || false,
    breedUnique: pal.breed_unique?.map((p) => p.id) || [],
    combiDuplicatePriority: pal.combi_duplicate_priority || 0,
  }));
};

export const loadPalsData = async (): Promise<PalData[]> => {
  try {
    // Arquivo JSON deve estar no diretório public para ser acessível
    const response = await fetch("/pal.json");
    const originalData: OriginalPalData[] = await response.json();
    return transformPalData(originalData);
  } catch (error) {
    console.error("Erro ao carregar dados dos Pals:", error);
    return [];
  }
};
