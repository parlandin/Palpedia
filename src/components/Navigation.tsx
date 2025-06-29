import { Link, useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          🐾 Palpedia
        </Link>

        <div className={styles.navLinks}>
          <Link
            to="/"
            className={`${styles.navLink} ${
              location.pathname === "/" ? styles.active : ""
            }`}
          >
            Lista de Pals
          </Link>
          <Link
            to="/breeding"
            className={`${styles.navLink} ${
              location.pathname.startsWith("/breeding") ? styles.active : ""
            }`}
          >
            Calculadora de Breeding
          </Link>
        </div>
      </div>
    </nav>
  );
};
