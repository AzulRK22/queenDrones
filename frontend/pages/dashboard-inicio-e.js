import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography, Box, InputBase, IconButton, CircularProgress } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import Sidebar from "../public/src/components/Sidebar";
import styles from "../public/src/components/Dashboard.module.css";
import Notification from "../public/src/components/Notifications";
import { getWeatherData } from '../public/src/services/api'; 

const DashboardInicioE = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weather = await getWeatherData();
        if (weather && weather.main && weather.wind) {
          setWeatherData(weather);
        } else {
          throw new Error("Datos meteorológicos incompletos");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("No se pudieron obtener los datos meteorológicos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNotificationClick = () => {
    setShowNotification(true);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <Notification
            type="success"
            title="Inicio Exitoso"
            message="Has ingresado exitosamente al panel de emergencia."
            show={showNotification}
          />
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
              <IconButton
                aria-label="notifications"
                onClick={handleNotificationClick}
                className={showNotification ? "" : styles.notificationIcon}
              >
                <img src="/icons/Bell.svg" alt="Notifications Icon" />
              </IconButton>
            </div>
          </div>

          <Typography variant="h4" gutterBottom>
            Home
          </Typography>

          <Box sx={{ mt: 2 }}>
            <iframe
              src="https://geprif.maps.arcgis.com/apps/dashboards/262a55fd17ae4f828501be2289ae4d35"
              width="100%"
              height="500px"
              style={{ border: 'none', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}
            ></iframe>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" align='center' gutterBottom>
              Condiciones Meteorológicas
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography>{error}</Typography>
            ) : weatherData && weatherData.main && weatherData.wind ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <WbSunnyIcon fontSize="large" />
                      <Typography variant="h6">Temperatura</Typography>
                      <Typography>{weatherData.main.temp}°C</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AirIcon fontSize="large" />
                      <Typography variant="h6">Viento</Typography>
                      <Typography>{weatherData.wind.speed} m/s</Typography>
                      <Typography>{weatherData.wind.deg}°</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <OpacityIcon fontSize="large" />
                      <Typography variant="h6">Humedad</Typography>
                      <Typography>{weatherData.main.humidity}%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Typography>No se pudieron obtener los datos meteorológicos.</Typography>
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default DashboardInicioE;







