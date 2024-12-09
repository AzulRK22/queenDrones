import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, IconButton, InputBase } from '@mui/material';
import Sidebar from "../public/src/components/Sidebar";
import styles from "../public/src/components/Dashboard.module.css";

const DashboardInicioE = () => {
  const [darkMode, setDarkMode] = useState(false);

  const sections = [
    {
      title: "Monitoring",
      description: "Map with inputs, drone configuration, anomaly detection, historical data, KPI, sensor data.",
      icon: "/icons/monitoreo.svg",
    },
    {
      title: "Reports",
      description: "Generate detailed reports based on the collected data.",
      icon: "/icons/Folder.svg",
    },
    {
      title: "Incidents",
      description: "View and manage incidents reported by the system or users.",
      icon: "/icons/incidentes.svg",
    },
    {
      title: "Virtual Assistant",
      description: "Interact with an AI-based assistant to get insights or help.",
      icon: "/icons/chat.svg",
    },
    {
      title: "About Us",
      description: "Learn more about our company and the team behind this project.",
      icon: "/icons/about.svg",
    },
  ];

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
          <Typography variant="body1" gutterBottom>
            Explore the functionalities available in the sidebar.
          </Typography>

          <Grid container spacing={3} sx={{ marginTop: 3 }}>
            {sections.map((section, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ textAlign: 'center', borderRadius: '15px', height: '100%', boxShadow: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: '#1B2A49;',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '20px auto',
                    }}
                  >
                    <img
                      src={section.icon}
                      alt={`${section.title} Icon`}
                      style={{ width: '40px', height: '40px' }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {section.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default DashboardInicioE;
