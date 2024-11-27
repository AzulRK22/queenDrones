import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import Sidebar2 from "../public/src/components/Sidebar2";
import styles from "../public/src/components/Dashboard.module.css";
import { getWeatherData2, getCoordinatesFromPostalCode } from '../public/src/services/api';

const Map = dynamic(() => import('../public/src/components/Map'), { ssr: false });

const DashboardInicioL = () => {
  const [postalCode, setPostalCode] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [weatherData2, setWeatherData2] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coordinates) return;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const weather = await getWeatherData2(coordinates.lat, coordinates.lng);
        setWeatherData2(weather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [coordinates]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const coords = await getCoordinatesFromPostalCode(postalCode);
      setCoordinates(coords);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar2 />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <Typography variant="h4" gutterBottom>Home</Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Ingresa tu Código Postal</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Código Postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                variant="outlined"
                sx={{ mr: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Buscar'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            {coordinates ? (
              <Map lat={coordinates.lat} lng={coordinates.lng} />
            ) : (
              <Typography>Introduce tu código postal para ver tu ubicación en el mapa.</Typography>
            )}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Condiciones Meteorológicas Locales</Typography>
            {loading ? (
              <CircularProgress />
            ) : weatherData2 ? (
              <Typography>{JSON.stringify(weatherData2)}</Typography>
            ) : (
              <Typography>No hay datos meteorológicos disponibles.</Typography>
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default DashboardInicioL;
