import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Papa from 'papaparse';

// Dynamically import Leaflet components with ssr: false
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const path_results = "uploads/";

const MapContents = ({ markers }) => {
  const L = require('leaflet');
  
  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lon]} icon={customIcon}>
          <Popup>
            <img src={marker.imagePath} alt="Marker" style={{ width: '100px', height: '75px' }} />
            <p>Lat: {marker.lat}, Lon: {marker.lon}</p>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

const StandaloneMapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState([-33.4489, -70.6693]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/results/results_log.csv', { responseType: 'text' });
        Papa.parse(response.data, {
          header: false,
          complete: (results) => {
            const data = results.data
              .filter(row => row.length === 3 && !isNaN(parseFloat(row[1])) && !isNaN(parseFloat(row[2])))
              .map(row => ({
                imagePath: path_results + row[0],
                lat: parseFloat(row[1]),
                lon: parseFloat(row[2])
              }));

            setMarkers(data);

            if (data.length > 0) {
              setMapCenter([data[0].lat, data[0].lon]);
            }
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {typeof window !== 'undefined' && (
        <MapContainer
          center={mapCenter}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <MapContents markers={markers} />
        </MapContainer>
      )}
    </div>
  );
};

export default StandaloneMapComponent;