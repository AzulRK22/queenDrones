import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
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
  TextField,
  Tab,
  Tabs,
} from "@mui/material";
import Sidebar from "../public/src/components/Sidebar";
import styles from "../public/src/components/Dashboard.module.css";

// Importamos dinámicamente Leaflet para evitar errores en el servidor
const LeafletMap = dynamic(
  () => import("../public/src/components/LeafletMap"),
  {
    ssr: false, // Desactiva el renderizado en el servidor
  }
);

// Importamos el componente de WaypointMapWrapper
import WaypointMapWrapper from "../public/src/components/HistoricMap";

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

  // Input fields for latitude, longitude, and area
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [area, setArea] = useState("");

  // Tab state for switching between maps
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchMissionsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/missions");
        if (response.data && Array.isArray(response.data.missions)) {
          setMissions(response.data.missions);
        } else {
          console.error(
            "API did not return an array of missions:",
            response.data
          );
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
        const updatedResponse = await axios.get(
          "http://127.0.0.1:5000/api/missions"
        );
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
      const response = await axios.get(`http://127.0.0.1:5000/get_wp_file`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mission.waypoints");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading WP file:", error);
      alert("Failed to download the file. Please try again.");
    }
  };

  const handleTabChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <Typography variant="h4" gutterBottom>
            Monitoring
          </Typography>

          {/* Tabs for multiple maps */}
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Map with Inputs" />
            <Tab label="Drone Configuration" />
            <Tab label="Anomaly detection" />
            <Tab label="Historical Data" />
            <Tab label="KPI Dashboard" />
            <Tab label="Sensor Data" />
          </Tabs>

          {/* Tab 1: Map with Inputs */}
          {value === 0 && (
            <div>
              {/* Using an iframe to load the HTML file */}
              <iframe
                src="/htmls/cdmx_map2.html" // Path relative to the public folder
                width="100%"
                height="600px"
                frameBorder="0"
                title="CDMX Map"
                style={{ border: "none", height: "500px" }} // Adjust height to fit screen
              ></iframe>

              <Box>
                <TextField
                  label="Latitude"
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ marginBottom: 1 }} // Reduced margin for closer spacing
                />
                <TextField
                  label="Longitude"
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ marginBottom: 1 }} // Reduced margin for closer spacing
                />
                <TextField
                  label="Area (km²)"
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ marginBottom: 2 }} // Reduced margin for closer spacing
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // Add logic to send data when implemented
                    alert("Data submitted: Latitude, Longitude, Area");
                  }}
                  sx={{ background: "#FB8C00" }}
                >
                  Submit Data
                </Button>
              </Box>
            </div>
          )}

          {/* Tab 2: Initial Map & Drone Configuration */}
          {value === 1 && (
            <div>
              <WaypointMapWrapper />
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
                      onChange={(e) =>
                        setMode(e.target.checked ? "high" : "low")
                      }
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
                    min={5}
                    max={120}
                    sx={{ color: "#FB8C00" }}
                  />
                </Box>
                <Box className={styles.sliderContainer}>
                  <Typography>Flight Time: {flightTime} min</Typography>
                  <Slider
                    value={flightTime}
                    onChange={(_, newValue) => setFlightTime(newValue)}
                    min={5}
                    max={120}
                    sx={{ color: "#FB8C00" }}
                  />
                </Box>
                {/* Alineación de los botones */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateRoute}
                    sx={{ background: "#FB8C00" }}
                  >
                    Generate Route
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadRoute}
                    sx={{ background: "#FB8C00" }}
                  >
                    Download Route
                  </Button>
                </Box>
              </Box>
            </div>
          )}

          {/* Tab 3: Anomaly detection */}
          {value === 2 && (
            <div>
              {/* Using an iframe to load the anomaly detection page */}
              <iframe
                src="/htmls/anomaly.html" // Path relative to the public folder
                width="100%"
                height="600px"
                frameBorder="0"
                title="Anomaly Detection"
                style={{ border: "none", height: "500px" }} // Adjust height to fit screen
              ></iframe>
            </div>
          )}

          {/* Tab 4: Historical Data*/}
          {value === 3 && (
            <div>
              {/* Using an iframe to load the anomaly detection page */}
              <iframe
                src="/htmls/historical.html" // Path relative to the public folder
                width="100%"
                height="600px"
                frameBorder="0"
                title="Historical Data"
                style={{ border: "none", height: "500px" }} // Adjust height to fit screen
              ></iframe>
            </div>
          )}


          {/* Tab 4: KPI Dashboard*/}
           {value === 4 && (
            <div>
              {/* Using an iframe to load the anomaly detection page */}
              <iframe
                src="/htmls/kpi_dashboard.html" // Path relative to the public folder
                width="100%"
                height="600px"
                frameBorder="0"
                title="KPI Dashboard"
                style={{ border: "none", height: "500px" }} // Adjust height to fit screen
              ></iframe>
            </div>
          )}

          {/* Tab 4: KPI Dashboard*/}
          {value === 5 && (
            <div>
              {/* Using an iframe to load the anomaly detection page */}
              <iframe
                src="/htmls/sensor_data.html" // Path relative to the public folder
                width="100%"
                height="600px"
                frameBorder="0"
                title="Sensor Data"
                style={{ border: "none", height: "500px" }} // Adjust height to fit screen
              ></iframe>
            </div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default DashboardMonitoreo;
