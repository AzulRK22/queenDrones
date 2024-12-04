import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const LeafletMap = () => {
  useEffect(() => {
    const map = L.map('custom-map').setView([19.07500770940618, -98.91338570692821], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([19.07500770940618, -98.91338570692821]).addTo(map)
      .bindPopup('Estás aquí.')
      .openPopup();

  }, []);

  return (
    <div
      id="custom-map"
      style={{
        height: '500px',
        width: '100%',
        marginTop: '30px',
        borderRadius: '15px',
        overflow: 'hidden',
        border: '2px solid #007BFF',
      }}
    />
  );
};

export default LeafletMap;
