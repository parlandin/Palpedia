import { PalSelector } from "../components/PalSelector";
import { BreedingPathsDisplay } from "../components/BreedingPathsDisplay";
import { usePalsData } from "../hooks/usePalsData";
import { useTreeBreedingCalculator } from "../hooks/useTreeBreedingCalculator";
import styles from "./BreedingTree.module.css";

export const BreedingTree = () => {
  const { pals, loading, error } = usePalsData();

  const {
    selectedBasePal,
    selectedTargetPal,
    breedingPaths,
    calculating,
    setSelectedBasePal,
    setSelectedTargetPal,
    calculateBreedingTree,
    resetCalculator,
    error: calculationError,
  } = useTreeBreedingCalculator(pals);

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
            Descubra todos os caminhos possíveis para obter um Pal específico
            através de breeding. Você pode começar com Pals que já possui.
          </p>
        </div>

        <div className={styles.selectionSection}>
          <div className={styles.selectorGroup}>
            <h4>Pal Base </h4>
            <p className={styles.selectorHint}>
              Pals que você já possui e quer usar como base
            </p>
            <PalSelector
              pals={pals}
              selectedPal={selectedBasePal}
              onPalSelect={setSelectedBasePal}
              placeholder="Selecione pelo menos 1."
              showRanking={false}
            />
          </div>

          <div className={styles.selectorGroup}>
            <h4>Pal Alvo *</h4>
            <p className={styles.selectorHint}>O Pal que você deseja obter</p>
            <PalSelector
              pals={pals}
              selectedPal={selectedTargetPal}
              onPalSelect={setSelectedTargetPal}
              placeholder="Selecione o Pal que deseja obter..."
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.calculateButton}
            onClick={calculateBreedingTree}
            disabled={!selectedTargetPal || calculating}
          >
            {calculating ? "🔄 Calculando..." : "🧮 Calcular Árvore"}
          </button>

          <button
            className={styles.resetButton}
            onClick={resetCalculator}
            disabled={!selectedBasePal && !selectedTargetPal}
          >
            🔄 Limpar Seleção
          </button>
        </div>

        {calculating && (
          <div className={styles.calculating}>
            <div className={styles.spinner}></div>
            <p>Calculando caminhos de breeding...</p>
            <small>Isso pode levar alguns segundos...</small>
          </div>
        )}

        {breedingPaths.length > 0 && (
          <div className={styles.results}>
            {/*  <h3>Caminhos de Breeding Encontrados</h3>
            <p className={styles.resultsCount}>
              {breedingPaths.length} caminho(s) encontrado(s)
            </p> */}
            <BreedingPathsDisplay paths={breedingPaths} />
          </div>
        )}

        {selectedTargetPal &&
          calculationError == "not_found" &&
          !calculating && (
            <div className={styles.noResults}>
              <h3>Nenhum caminho encontrado</h3>
              <p>
                Não foi possível encontrar caminhos de breeding para obter{" "}
                <strong>{selectedTargetPal.name}</strong>
                {selectedBasePal && (
                  <>
                    {" "}
                    a partir de <strong>{selectedBasePal.name}</strong>
                  </>
                )}
                .
              </p>
              <div className={styles.suggestions}>
                <h4>Sugestões:</h4>
                <ul>
                  <li>
                    Verifique se o Pal alvo pode ser obtido através de breeding.
                  </li>
                  <li>
                    Alguns Pals únicos só podem ser capturados, não criados.
                  </li>
                  <li>Tente selecionar um Pal base diferente.</li>
                  <li>
                    Pals com o ícone 🔄 só podem ser reproduzido com 2 da mesma
                    espécie.
                  </li>
                </ul>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
