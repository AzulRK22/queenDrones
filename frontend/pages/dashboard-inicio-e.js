import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, InputBase, IconButton } from '@mui/material';
import Sidebar from "../public/src/components/Sidebar";
import Notification from "../public/src/components/Notifications";
import styles from "../public/src/components/Dashboard.module.css";

const DashboardInicioE = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkModeChange = (event) => {
    setDarkMode(event.target.checked);
  };

  const handleSearch = (event) => {
    console.log(event.target.value);
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ''}`}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.searchBar}>
              <IconButton aria-label="search" className={styles.searchIcon}>
                <img src="/icons/lupa.svg" alt="Search Icon" />
              </IconButton>
              <InputBase
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
                sx={{ marginLeft: 2, flex: 1 }}
                onChange={handleSearch}
              />
            </div>
            <div className={styles.icons}>
              <IconButton aria-label="light-mode">
                <img src="/icons/IconSet.svg" alt="Light Mode Icon" />
              </IconButton>
              <IconButton aria-label="notifications">
                <img src="/icons/Bell.svg" alt="Notifications Icon" />
              </IconButton>
            </div>
          </div>

          <Typography variant="h4" gutterBottom>
            Home
          </Typography>

          {/* Incluir el iframe con el mapa de sequías */}
          <Box sx={{ height: '500px', width: '100%', marginTop: '30px', borderRadius: '15px', overflow: 'hidden' }}>
            <iframe
              src="http://galileo.imta.mx/Sequias/moseq/mapaGob.html"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Mapa de Sequías"
            />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default DashboardInicioE;
