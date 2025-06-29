import { SearchBox } from "../components/SearchBox";
import { PalCard } from "../components/PalCard";
import { usePalSearch } from "../hooks/usePalSearch";
import styles from "./PalsList.module.css";

export const PalsList = () => {
  const { filteredPals, updateFilters, totalPals, filteredCount } =
    usePalSearch();

  return (
    <div className={styles.container}>
      <SearchBox onSearch={updateFilters} />

      <div className={styles.resultsInfo}>
        Mostrando {filteredCount} de {totalPals} Pals
      </div>

      {filteredPals.length === 0 ? (
        <div className={styles.noResults}>
          <h3>Nenhum Pal encontrado</h3>
          <p>Tente ajustar os filtros de busca</p>
        </div>
      ) : (
        <div className={styles.palsGrid}>
          {filteredPals.map((pal) => (
            <PalCard key={pal.id} pal={pal} />
          ))}
        </div>
      )}
    </div>
  );
};
