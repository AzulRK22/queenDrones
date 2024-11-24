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
          <div className={styles.header}>
            <div className={styles.searchBar}>
              <IconButton aria-label="search" className={styles.searchIcon}>
                <img src="/icons/lupa.svg" alt="Search Icon" />
              </IconButton>
              <InputBase
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
                sx={{ marginLeft: 2, flex: 1 }}
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
            Incidents
          </Typography>
          <StandaloneMapComponent></StandaloneMapComponent>
        </Box>
      </div>
    </div>
  );
};

export default DashboardIncidentesE;
