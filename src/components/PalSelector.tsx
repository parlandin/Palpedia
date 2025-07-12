import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { List } from "react-virtualized";
import "react-virtualized/styles.css"; // Estilos CSS necessários
import type { PalData } from "../types/PalData";
import { getElementIcon } from "../utils/iconHelpers";
import styles from "./PalSelector.module.css";

interface PalSelectorProps {
  pals: PalData[];
  selectedPal: PalData | null;
  onPalSelect: (pal: PalData | null) => void;
  placeholder?: string;
  showRanking?: boolean;
}

export const PalSelector = ({
  pals,
  selectedPal,
  onPalSelect,
  placeholder = "Selecione um Pal...",
  showRanking = true,
}: PalSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [listWidth, setListWidth] = useState(452);

  // Atualizar largura da lista quando o modal abre
  useEffect(() => {
    if (isModalOpen) {
      const updateWidth = () => {
        const modal = document.querySelector(`.${styles.modal}`) as HTMLElement;
        if (modal) {
          const modalWidth = modal.offsetWidth;
          const newWidth = modalWidth - 48; // Subtrair padding lateral (24px * 2)
          setListWidth(newWidth);
        }
      };

      // Aguardar o modal ser renderizado
      setTimeout(updateWidth, 10);
      window.addEventListener("resize", updateWidth);

      return () => window.removeEventListener("resize", updateWidth);
    }
  }, [isModalOpen]);

  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Fecha modal com ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  const filteredPals = useMemo(() => {
    const sorted = [...pals].sort((a, b) => a.name.localeCompare(b.name));
    if (!searchTerm) return sorted;

    return sorted.filter((pal) =>
      pal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pals, searchTerm]);

  const handlePalSelect = (pal: PalData | null) => {
    onPalSelect(pal);
    setIsModalOpen(false);
    setSearchTerm("");
  };

  const handleClearSelection = () => {
    onPalSelect(null);
    setIsModalOpen(false);
    setSearchTerm("");
  };

  const getPalPrefix = (pal: PalData): string => {
    if (pal.isUnique) return "🌟 ";
    if (pal.breedSelf) return "🔄 ";
    return "";
  };

  // Função para renderizar cada item da lista virtualizada
  const renderPalItem = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const pal = filteredPals[index];

    return (
      <div style={{ ...style, paddingLeft: 0, paddingRight: 0 }}>
        <button
          key={pal.name}
          className={`${styles.palItem} ${
            selectedPal?.id === pal.id ? styles.selected : ""
          }`}
          onClick={() => handlePalSelect(pal)}
        >
          <img
            src={pal.image || "/placeholder-pal.png"}
            alt={pal.name}
            className={styles.palItemImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-pal.png";
            }}
          />
          <div className={styles.palItemDetails}>
            <div className={styles.palItemName}>
              {getPalPrefix(pal)}
              {pal.name}
            </div>
            {showRanking && pal.breedingRank && (
              <div className={styles.palItemRank}>Rank: {pal.breedingRank}</div>
            )}
            <div className={styles.palItemElements}>
              {pal.elements.map((element) => (
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
        </button>
      </div>
    );
  };

  return (
    <div className={styles.selectorContainer}>
      <button
        type="button"
        className={styles.selectButton}
        onClick={() => setIsModalOpen(true)}
      >
        {selectedPal ? (
          <div className={styles.selectedPalPreview}>
            <img
              src={selectedPal.image || "/placeholder-pal.png"}
              alt={selectedPal.name}
              className={styles.selectedPalImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-pal.png";
              }}
            />
            <span className={styles.selectedPalName}>
              {getPalPrefix(selectedPal)}
              {selectedPal.name}
            </span>
          </div>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <span className={styles.dropdownIcon}>▼</span>
      </button>

      {isModalOpen &&
        createPortal(
          <div
            className={styles.modalOverlay}
            onClick={() => setIsModalOpen(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Selecionar Pal</h3>
                <button
                  className={styles.closeButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className={styles.searchContainer}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Pesquisar Pals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              <div className={styles.palList}>
                <button
                  className={styles.palItem}
                  onClick={handleClearSelection}
                >
                  <div className={styles.clearOption}>
                    <span>🚫 Limpar seleção</span>
                  </div>
                </button>

                {filteredPals.length > 0 ? (
                  <List
                    height={400} // Altura fixa da lista
                    rowCount={filteredPals.length}
                    rowHeight={80} // Altura de cada item
                    rowRenderer={renderPalItem}
                    width={listWidth} // Largura dinâmica
                    className={styles.virtualizedList}
                  />
                ) : (
                  <div className={styles.noPalsFound}>
                    Nenhum Pal encontrado para "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      {/*  {selectedPal && (
        <div className={styles.palInfo}>
          <img
            src={selectedPal.image || "/placeholder-pal.png"}
            alt={selectedPal.name}
            className={styles.palImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-pal.png";
            }}
          />
          <div className={styles.palDetails}>
            <div className={styles.palName}>{selectedPal.name}</div>
            {selectedPal.breedingRank && (
              <div className={styles.palRank}>
                Breeding Rank: {selectedPal.breedingRank}
              </div>
            )}
            <div className={styles.palElements}>
              Elementos: {selectedPal.elements.join(", ")}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};
