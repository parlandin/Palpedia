import { useState, useMemo } from "react";
import type { SearchFilters } from "../types/PalData";
import { usePalsData } from "./usePalsData";

export const usePalSearch = () => {
  const { pals } = usePalsData();
  const [filters, setFilters] = useState<SearchFilters>({
    name: "",
    element: "",
    workSkill: "",
  });

  const filteredPals = useMemo(() => {
    return pals.filter((pal) => {
      const matchesName =
        filters.name === "" ||
        pal.name.toLowerCase().includes(filters.name.toLowerCase());

      const matchesElement =
        filters.element === "" || pal.elements.includes(filters.element);

      const matchesWorkSkill =
        filters.workSkill === "" ||
        Object.keys(pal.workSuitability).includes(filters.workSkill);

      return matchesName && matchesElement && matchesWorkSkill;
    });
  }, [pals, filters]);

  const updateFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return {
    filters,
    filteredPals,
    updateFilters,
    totalPals: pals.length,
    filteredCount: filteredPals.length,
  };
};
