import { useState, useEffect } from "react";
import type { PalData } from "../types/PalData";
import { loadPalsData } from "../utils/palDataLoader";

export const usePalsData = () => {
  const [pals, setPals] = useState<PalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadPalsData();
        setPals(data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar dados dos Pals");
        console.error("Erro ao carregar Pals:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getPalById = (id: number | string): PalData | undefined => {
    return pals.find((pal) => pal.id == id);
  };

  const getPalByName = (name: string): PalData | undefined => {
    return pals.find((pal) => pal.name.toLowerCase() === name.toLowerCase());
  };

  const getSortedPals = (): PalData[] => {
    return [...pals].sort((a, b) => a.name.localeCompare(b.name));
  };

  return {
    pals,
    loading,
    error,
    getPalById,
    getPalByName,
    getSortedPals,
    totalCount: pals.length,
  };
};
