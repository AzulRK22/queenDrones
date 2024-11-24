import React, { useState, useEffect } from "react";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import axios from "axios";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Slider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Sidebar from "../public/src/components/Sidebar";
import styles from "../public/src/components/Dashboard.module.css";
import WaypointMapWrapper from "../public/src/components/WaypointMapWrapper";
import DataTable from "../public/src/components/DataTable";

const DashboardMonitoreo = () => {
  const [missions, setMissions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Drone configuration states
  const [altitude, setAltitude] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [mode, setMode] = useState("low");
  const [visionRange, setVisionRange] = useState(50);
  const [flightTime, setFlightTime] = useState(5);

  useEffect(() => {
    const fetchMissionsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/missions");
        if (response.data && Array.isArray(response.data.missions)) {
          setMissions(response.data.missions);
        } else {
          console.error("API did not return an array of missions:", response.data);
          setMissions([]);
        }
      } catch (error) {
        console.error("Error fetching missions data:", error);
        setError("Failed to fetch missions data. Please try again later.");
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionsData();
  }, []);

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const handleGenerateRoute = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate_route",
        {
          altitude,
          speed,
          mode,
          visionRange,
          flightTime,
        }
      );
      if (response.data.success) {
        alert("Route generated successfully!");
        // Optionally, you can fetch updated missions data here
        const updatedResponse = await axios.get("http://127.0.0.1:5000/api/missions");
        setMissions(updatedResponse.data.missions || []);
      } else {
        console.error("Error generating route:", response.data.message);
      }
    } catch (error) {
      console.error("Error generating route:", error);
    }
  };

  const handleDownloadRoute = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/get_wp_file`,
        {
          responseType: 'blob',
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mission.waypoints');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading WP file:", error);
      alert("Failed to download the file. Please try again.");
    }
  };

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
            Monitoring
          </Typography>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <DataTable
              routes={missions}
              onSelectRoute={handleRouteSelect}
              onDownloadRoute={handleDownloadRoute}
            />
          )}

          <WaypointMapWrapper selectedRoute={selectedRoute} />

          <Box className={styles.configPanel}>
            <Typography variant="h6" gutterBottom>
              Drone Configuration
            </Typography>
            <Box className={styles.sliderContainer}>
              <Typography>Altitude: {altitude} m</Typography>
              <Slider
                value={altitude}
                onChange={(_, newValue) => setAltitude(newValue)}
                min={0}
                max={100}
                sx={{ color: "#FB8C00" }}
              />
            </Box>
            <Box className={styles.sliderContainer}>
              <Typography>Speed: {speed} m/s</Typography>
              <Slider
                value={speed}
                onChange={(_, newValue) => setSpeed(newValue)}
                min={0}
                max={20}
                sx={{ color: "#FB8C00" }}
              />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === "high"}
                  onChange={(e) => setMode(e.target.checked ? "high" : "low")}
                  sx={{
                    "& .MuiSwitch-switchBase": {
                      color: "#FB8C00",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#FB8C00",
                    },
                  }}
                />
              }
              label={mode === "high" ? "High Altitude" : "Low Altitude"}
            />
            <Box className={styles.sliderContainer}>
              <Typography>Vision Range: {visionRange} m</Typography>
              <Slider
                value={visionRange}
                onChange={(_, newValue) => setVisionRange(newValue)}
                min={50}
                max={500}
                sx={{ color: "#FB8C00" }}
              />
            </Box>
            <Box className={styles.sliderContainer}>
              <Typography>Flight Time: {flightTime} min</Typography>
              <Slider
                value={flightTime}
                onChange={(_, newValue) => setFlightTime(newValue)}
                min={5}
                max={60}
                sx={{ color: "#FB8C00" }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateRoute}
              sx={{ background: "#FB8C00" }}
              startIcon={<FlightTakeoffIcon />}
            >
              Generate Route
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default DashboardMonitoreo;