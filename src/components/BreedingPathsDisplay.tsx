import type { BreedingPath } from "../utils/breedingCalculator";
import styles from "./BreedingPathsDisplay.module.css";

interface BreedingPathsDisplayProps {
  paths: BreedingPath[];
}

export const BreedingPathsDisplay = ({ paths }: BreedingPathsDisplayProps) => {
  if (paths.length === 0) {
    return null;
  }

  return (
    <div className={styles.pathsContainer}>
      <h3 className={styles.title}>
        🌳 Caminhos de Breeding Encontrados ({paths.length})
      </h3>

      <div className={styles.pathsList}>
        {paths.map((path, pathIndex) => (
          <div key={pathIndex} className={styles.pathCard}>
            <div className={styles.pathHeader}>
              <h4>
                Opção {pathIndex + 1} -{" "}
                {path.steps === 1 ? "Breeding Direto" : `${path.steps} passos`}
              </h4>
              <div className={styles.pathComplexity}>
                Complexidade:{" "}
                {path.steps === 1
                  ? "Baixa"
                  : path.steps <= 3
                  ? "Média"
                  : "Alta"}
              </div>
            </div>

            <div className={styles.stepsContainer}>
              {path.tree.map((step, stepIndex) => (
                <div key={stepIndex} className={styles.breedingStep}>
                  <div className={styles.stepNumber}>Passo {stepIndex + 1}</div>

                  <div className={styles.stepContent}>
                    <div className={styles.breedingFormula}>
                      <div className={styles.parent}>
                        <img
                          src={step.parent1.image || "/placeholder-pal.png"}
                          alt={step.parent1.name}
                          className={styles.palImage}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-pal.png";
                          }}
                        />
                        <div className={styles.palInfo}>
                          <div className={styles.palName}>
                            {step.parent1.name}
                          </div>
                          <div className={styles.palRank}>
                            Rank: {step.parent1.breedingRank || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className={styles.plus}>+</div>

                      <div className={styles.parent}>
                        <img
                          src={step.parent2.image || "/placeholder-pal.png"}
                          alt={step.parent2.name}
                          className={styles.palImage}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-pal.png";
                          }}
                        />
                        <div className={styles.palInfo}>
                          <div className={styles.palName}>
                            {step.parent2.name}
                          </div>
                          <div className={styles.palRank}>
                            Rank: {step.parent2.breedingRank || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className={styles.equals}>=</div>

                      <div
                        className={`${styles.child} ${
                          step.isResult
                            ? styles.finalResult
                            : styles.intermediate
                        }`}
                      >
                        <img
                          src={step.child.image || "/placeholder-pal.png"}
                          alt={step.child.name}
                          className={styles.palImage}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-pal.png";
                          }}
                        />
                        <div className={styles.palInfo}>
                          <div className={styles.palName}>
                            {step.child.name}
                          </div>
                          <div className={styles.palRank}>
                            Rank: {step.child.breedingRank || "N/A"}
                          </div>
                          {step.isResult && (
                            <div className={styles.resultBadge}>
                              Resultado Final!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
