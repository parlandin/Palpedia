import { useState } from "react";
import type { SearchFilters } from "../types/PalData";
import { palElements, workSkills } from "../data/palsData";
import {
  getElementIcon,
  getWorkSkillIcon,
  formatWorkSkillName,
} from "../utils/iconHelpers";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: (filters: SearchFilters) => void;
}

export const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    name: "",
    element: "",
    workSkill: "",
  });

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchGrid}>
        <input
          type="text"
          placeholder="Buscar por nome..."
          className={styles.searchInput}
          value={filters.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />

        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>Elementos:</label>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                !filters.element ? styles.active : ""
              }`}
              onClick={() => handleInputChange("element", "")}
            >
              Todos
            </button>
            {palElements.map((element) => (
              <button
                key={element}
                className={`${styles.filterButton} ${
                  filters.element === element ? styles.active : ""
                }`}
                onClick={() => handleInputChange("element", element)}
                title={element}
              >
                <img
                  src={getElementIcon(element)}
                  alt={element}
                  className={styles.filterIcon}
                />
                <span className={styles.filterText}>{element}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>Habilidades:</label>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                !filters.workSkill ? styles.active : ""
              }`}
              onClick={() => handleInputChange("workSkill", "")}
            >
              Todas
            </button>
            {workSkills.map((skill) => (
              <button
                key={skill}
                className={`${styles.filterButton} ${
                  filters.workSkill === skill ? styles.active : ""
                }`}
                onClick={() => handleInputChange("workSkill", skill)}
                title={formatWorkSkillName(skill)}
              >
                <img
                  src={getWorkSkillIcon(skill)}
                  alt={formatWorkSkillName(skill)}
                  className={styles.filterIcon}
                />
                <span className={styles.filterText}>
                  {formatWorkSkillName(skill)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
