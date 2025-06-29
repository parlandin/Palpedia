import { useEffect } from "react";
import { PalSelector } from "../components/PalSelector";
import { BreedingResultCard } from "../components/BreedingResultCard";
import { usePalsData } from "../hooks/usePalsData";
import { useSimpleBreedingCalculator } from "../hooks/useSimpleBreedingCalculator";
import styles from "./BreedingSimple.module.css";

export const BreedingSimple = () => {
  const { pals, loading, error } = usePalsData();

  const {
    selectedParent1,
    selectedParent2,
    breedingResult,
    setSelectedParent1,
    setSelectedParent2,
    calculateBreeding,
    resetCalculator,
  } = useSimpleBreedingCalculator(pals);

  // Recalcular quando os pais mudarem
  useEffect(() => {
    if (selectedParent1 && selectedParent2) {
      calculateBreeding();
    }
  }, [selectedParent1, selectedParent2, calculateBreeding]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.description}>
          <p>
            Selecione dois Pals para descobrir qual filhote eles podem gerar:
          </p>
        </div>

        <div className={styles.parentsSection}>
          <div className={styles.parentSelector}>
            <h4>Pai 1</h4>
            <PalSelector
              pals={pals}
              selectedPal={selectedParent1}
              onPalSelect={setSelectedParent1}
              placeholder="Selecione o primeiro pai..."
            />
          </div>

          <div className={styles.parentSelector}>
            <h4>Pai 2</h4>
            <PalSelector
              pals={pals}
              selectedPal={selectedParent2}
              onPalSelect={setSelectedParent2}
              placeholder="Selecione o segundo pai..."
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.resetButton} onClick={resetCalculator}>
            🔄 Resetar
          </button>
        </div>

        {breedingResult && (
          <div className={styles.resultSection}>
            <h3>Resultado do Breeding</h3>
            <BreedingResultCard result={breedingResult} />
          </div>
        )}

        {selectedParent1 && selectedParent2 && !breedingResult && (
          <div className={styles.noResult}>
            <p>
              ❌ Não foi possível encontrar um resultado para essa combinação de
              Pals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
