import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography, Box, InputBase, IconButton, CircularProgress } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import Sidebar from "../public/src/components/Sidebar";
import Notification from "../public/src/components/Notifications";
import styles from "../public/src/components/Dashboard.module.css";

// Importamos las librerías necesarias de Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const DashboardInicioE = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Obtener las coordenadas del usuario
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (err) => {
            console.error("Error obteniendo la ubicación:", err);
            setError("No se pudo obtener la ubicación.");
          }
        );
      } else {
        setError("La geolocalización no está soportada en este navegador.");
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=YOUR_API_KEY&units=metric&lang=es`
        );
        const data = await response.json();
        if (data.cod !== 200) {
          throw new Error('No se pudieron obtener los datos del clima');
        }
        setWeatherData(data);
      } catch (err) {
        console.error("Error obteniendo los datos del clima:", err);
        setError("No se pudieron obtener los datos meteorológicos.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

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
                placeholder="Buscar"
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

          {/* Mapa de México con Leaflet */}
          <Box sx={{ mt: 2 }}>
            <MapContainer center={[23.6345, -102.5528]} zoom={6} style={{ height: '500px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Puedes agregar un marcador si deseas */}
              <Marker position={[23.6345, -102.5528]}>
                <Popup>
                  ¡Bienvenido a México!
                </Popup>
              </Marker>
            </MapContainer>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Condiciones Meteorológicas
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography>{error}</Typography>
            ) : weatherData ? (
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
