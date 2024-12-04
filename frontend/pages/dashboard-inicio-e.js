import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import Sidebar from "../public/src/components/Sidebar";
import Notification from "../public/src/components/Notifications";
import styles from "../public/src/components/Dashboard.module.css";

// Importamos dinámicamente Leaflet para evitar errores en el servidor
const LeafletMap = dynamic(() => import('../public/src/components/LeafletMap'), {
  ssr: false, // Desactiva el renderizado en el servidor
});

const DashboardInicioE = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 'bold',
              color: '#FFFFF',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            Home
          </Typography>

          {/* Mapa dinámico */}
          <LeafletMap />
        </Box>
      </div>
    </div>
  );
};

export default DashboardInicioE;
