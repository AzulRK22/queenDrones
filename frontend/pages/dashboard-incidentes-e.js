import React, { useState } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
} from "@mui/material";
import Sidebar from "../public/src/components/Sidebar";
import styles from "../public/src/components/Dashboard.module.css";


import StandaloneMapComponent from "../public/src/components/HistoricMap";


const DashboardIncidentesE = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <Typography variant="h4" gutterBottom>
            Incidents
          </Typography>
          <StandaloneMapComponent></StandaloneMapComponent>
        </Box>
      </div>
    </div>
  );
};

export default DashboardIncidentesE;
