import type { BreedingResult } from "../utils/breedingCalculator";
import { getElementIcon } from "../utils/iconHelpers";
import styles from "./BreedingResultCard.module.css";

interface BreedingResultCardProps {
  result: BreedingResult | null;
}

export const BreedingResultCard = ({ result }: BreedingResultCardProps) => {
  if (!result) {
    return null;
  }

  return (
    <div className={styles.resultCard}>
      <div className={styles.formula}>
        <div className={styles.parent}>
          <img
            src={result.parent1.image || "/placeholder-pal.png"}
            alt={result.parent1.name}
            className={styles.parentImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-pal.png";
            }}
          />
          <span className={styles.parentName}>{result.parent1.name}</span>
        </div>

        <div className={styles.plus}>+</div>

        <div className={styles.parent}>
          <img
            src={result.parent2.image || "/placeholder-pal.png"}
            alt={result.parent2.name}
            className={styles.parentImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-pal.png";
            }}
          />
          <span className={styles.parentName}>{result.parent2.name}</span>
        </div>

        <div className={styles.equals}>=</div>

        <div className={styles.child}>
          <img
            src={result.child.image || "/placeholder-pal.png"}
            alt={result.child.name}
            className={styles.childImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-pal.png";
            }}
          />
          <div className={styles.childInfo}>
            <div className={styles.childName}>{result.child.name}</div>
            {result.child.breedingRank && (
              <div className={styles.childRank}>
                Rank: {result.child.breedingRank}
              </div>
            )}
            <div className={styles.childElements}>
              {result.child.elements.map((element) => (
                <span key={element} className={styles.elementTag}>
                  <img
                    src={getElementIcon(element)}
                    alt={element}
                    className={styles.elementIcon}
                  />
                  {element}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
