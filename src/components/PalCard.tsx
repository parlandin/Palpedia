import type { PalData } from "../types/PalData";
import {
  getElementIcon,
  getWorkSkillIcon,
  formatWorkSkillName,
} from "../utils/iconHelpers";
import styles from "./PalCard.module.css";

interface PalCardProps {
  pal: PalData;
}

export const PalCard = ({ pal }: PalCardProps) => {
  const getElementClass = (element: string) => {
    return `element${element.toLowerCase()}`;
  };

  return (
    <div className={styles.palCard}>
      <img
        src={pal.image || "/placeholder-pal.png"}
        alt={pal.name}
        className={styles.palImage}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder-pal.png";
        }}
      />

      <div className={styles.palContent}>
        <div className={styles.palHeader}>
          <h3 className={styles.palName}>{pal.name}</h3>
          <span className={styles.palId}>
            #{pal.id.toString().padStart(3, "0")}
          </span>
        </div>

        <div className={styles.palElements}>
          {pal.elements.map((element) => (
            <span
              key={element}
              className={`${styles.elementTag} ${
                styles[getElementClass(element)]
              }`}
            >
              <img
                src={getElementIcon(element)}
                alt={element}
                className={styles.elementIcon}
              />
              {element}
            </span>
          ))}
        </div>

        {Object.keys(pal.workSuitability).length > 0 && (
          <div className={styles.workSkills}>
            <h4>Habilidades de Trabalho</h4>
            {Object.entries(pal.workSuitability).map(([skill, level]) => (
              <span key={skill} className={styles.skillItem}>
                <img
                  src={getWorkSkillIcon(skill)}
                  alt={formatWorkSkillName(skill)}
                  className={styles.skillIcon}
                />
                {formatWorkSkillName(skill)} Lv.{level}
              </span>
            ))}
          </div>
        )}

        {pal.drops && pal.drops.length > 0 && (
          <div className={styles.drops}>
            <h4>Drops</h4>
            {pal.drops.map((drop) => (
              <span key={drop} className={styles.dropItem}>
                {drop}
              </span>
            ))}
          </div>
        )}

        {/*  {pal.breedingRank && (
          <div className={styles.breedingRank}>
            <strong>Ranking de Breeding: {pal.breedingRank}</strong>
          </div>
        )} */}
      </div>
    </div>
  );
};
