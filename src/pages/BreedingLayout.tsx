import { Outlet, Link, useLocation } from "react-router-dom";
import styles from "./BreedingLayout.module.css";

export const BreedingLayout = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          <h2 className={styles.navTitle}>🧬 Calculadora de Breeding</h2>
          <div className={styles.navTabs}>
            <Link
              to="/breeding/simple"
              className={`${styles.navTab} ${
                location.pathname === "/breeding/simple" ? styles.active : ""
              }`}
            >
              🥚 Breeding Simples
            </Link>
            <Link
              to="/breeding/tree"
              className={`${styles.navTab} ${
                location.pathname === "/breeding/tree" ? styles.active : ""
              }`}
            >
              🌳 Árvore de Breeding
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};
