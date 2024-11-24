import React from 'react';
import { useRouter } from 'next/router';
import styles from './Sidebar.module.css';

const Sidebar2 = () => {
  const router = useRouter();

  // Función para verificar si la ruta está activa
  const isActive = (pathname) => router.pathname === pathname;

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/images/logo-2.png" alt="Fire Eye Logo" />
      </div>
      <ul className={styles.nav}>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-inicio-l') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-inicio-l')}
          >
            <img src="/icons/home.svg" alt="Home Icon" className={styles.icon} />
            <span className={styles.navText}>Home</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-chat-l') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-chat-l')}
          >
            <img src="/icons/Folder.svg" alt="Reports Icon" className={styles.icon} />
            <span className={styles.navText}>Virtual Assistant</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-info-l') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-info-l')}
          >
            <img src="/icons/incidentes.svg" alt="Alert Icon" className={styles.icon} />
            <span className={styles.navText}>Information</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-recu-l') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-recu-l')}
          >
            <img src="/icons/recursos.svg" alt="Resources Icon" className={styles.icon} />
            <span className={styles.navText}>Resources</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-seti-l') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-seti-l')}
          >
            <img src="/icons/Setting.svg" alt="Settings Icon" className={styles.icon} />
            <span className={styles.navText}>Configuration</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/logout') ? styles.active : ''}`}
            onClick={() => router.push('/')}
          >
            <img src="/icons/salir.svg" alt="Logout Icon" className={styles.icon} />
            <span className={styles.navText}>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar2;