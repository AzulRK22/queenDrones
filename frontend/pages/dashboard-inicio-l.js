import React, { useState, useEffect } from 'react';
import Map from '../public/src/components/Map';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, InputBase, IconButton, CircularProgress, TextField, Button } from "@mui/material";
import Sidebar2 from "../public/src/components/Sidebar2";
import styles from "../public/src/components/Dashboard.module.css";
import { getWeatherData2 } from '../public/src/services/api';
import { getCoordinatesFromPostalCode } from '../public/src/services/geocode';

const DashboardInicioL = () => {
  const [postalCode, setPostalCode] = useState(''); // Estado para almacenar el código postal
  const [coordinates, setCoordinates] = useState(null);
  const [weatherData2, setWeatherData2] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coordinates) {
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
    }
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

          {/* Campo separado para ingresar el código postal */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Ingresa tu Código Postal
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Código Postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                variant="outlined"
                sx={{ mr: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleSearch}>
                Buscar
              </Button>
            </Box>
          </Box>

          {/* Mostrar el mapa */}
          <Box sx={{ mt: 4 }}>
            {coordinates ? (
              <Map lat={coordinates.lat} lng={coordinates.lng} />
            ) : (
              <Typography>Introduce tu código postal para ver tu ubicación en el mapa.</Typography>
            )}
          </Box>

          {/* Condiciones Meteorológicas Locales */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Condiciones Meteorológicas Locales
            </Typography>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default DashboardInicioL;



