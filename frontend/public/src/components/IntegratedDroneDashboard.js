import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Slider, Switch, FormControlLabel } from "@mui/material";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import DownloadIcon from '@mui/icons-material/Download';
import L from 'leaflet';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DraggablePin = ({ position, onDragEnd }) => {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          onDragEnd(marker.getLatLng());
        }
      },
    }),
    [onDragEnd],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })}
    >
      <Popup>Drag me to select a location!</Popup>
    </Marker>
  );
};

const IntegratedDroneDashboard = () => {
  const [altitude, setAltitude] = useState(50);
  const [speed, setSpeed] = useState(10);
  const [mode, setMode] = useState(false);
  const [visionRange, setVisionRange] = useState(100);
  const [flightTime, setFlightTime] = useState(20);
  const [isRouteCalculated, setIsRouteCalculated] = useState(false);
  const [waypoints, setWaypoints] = useState([]);
  const [pinPosition, setPinPosition] = useState([-33.0472, -71.6127]);

  const handlePinDragEnd = (newPosition) => {
    setPinPosition([newPosition.lat, newPosition.lng]);
    // Fetch new waypoints when pin is dragged
    fetchWaypoints(newPosition.lat, newPosition.lng);
  };

  const fetchWaypoints = (lat, lng) => {
    axios.post('http://localhost:5000/generate_waypoints', { 
      lat, 
      lng,
      altitude,
      speed,
      mode: mode ? "Altura Alta" : "Altura Baja",
      visionRange,
      flightTime
    })
      .then(response => {
        if (Array.isArray(response.data.waypoints)) {
          setWaypoints(response.data.waypoints);
          setIsRouteCalculated(true);
        } else {
          console.error('Unexpected response format:', response.data);
          setWaypoints([]);
        }
      })
      .catch(error => {
        console.error('Error fetching waypoints:', error);
        setWaypoints([]);
      });
  };

  const handleCalculateRoute = () => {
    fetchWaypoints(pinPosition[0], pinPosition[1]);
  };

  const handleDownload = () => {
    if (isRouteCalculated) {
      console.log("Downloading WP File...");
      // Add your download logic here
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Drone Flight Path Planner
      </Typography>
      
      <Box sx={{ flex: 1, mb: 2 }}>
        <MapContainer
          center={pinPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains='abcd'
            maxZoom={20}
          />
          <DraggablePin position={pinPosition} onDragEnd={handlePinDragEnd} />
          {waypoints.length > 0 && (
            <Polyline positions={waypoints} color="blue" />
          )}
        </MapContainer>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ width: '48%' }}>
          <Typography variant="h6" gutterBottom>
            Drone Configuration
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography>Overlap: {altitude} %</Typography>
            <Slider
              value={altitude}
              onChange={(_, newValue) => setAltitude(newValue)}
              min={0}
              max={100}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography>Speed: {speed} m/s</Typography>
            <Slider
              value={speed}
              onChange={(_, newValue) => setSpeed(newValue)}
              min={0}
              max={20}
            />
          </Box>
          <FormControlLabel
            control={<Switch checked={mode} onChange={(e) => setMode(e.target.checked)} />}
            label={mode ? "Altura Alta" : "Altura Baja"}
          />
          <Box sx={{ mb: 2 }}>
            <Typography>Vision Range: {visionRange} m</Typography>
            <Slider
              value={visionRange}
              onChange={(_, newValue) => setVisionRange(newValue)}
              min={50}
              max={500}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography>Flight Time: {flightTime} min</Typography>
            <Slider
              value={flightTime}
              onChange={(_, newValue) => setFlightTime(newValue)}
              min={5}
              max={60}
            />
          </Box>
        </Box>
        
        <Box sx={{ width: '48%' }}>
          <Typography variant="h6" gutterBottom>
            Waypoints
          </Typography>
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {waypoints.map((wp, index) => (
              <Typography key={index} variant="body2">
                {index + 1}: Latitude: {wp[0].toFixed(6)}, Longitude: {wp[1].toFixed(6)}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleCalculateRoute}
          startIcon={<FlightTakeoffIcon />}
        >
          Generate Flight Path
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
          disabled={!isRouteCalculated}
        >
          Download WP File
        </Button>
      </Box>
    </Box>
  );
};

export default IntegratedDroneDashboard;