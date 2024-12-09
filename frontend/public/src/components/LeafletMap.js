import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const LeafletMap = () => {
  useEffect(() => {
    const map = L.map('custom-map').setView([23.6345, -102.5528], 5); // Centrado en México

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Suponiendo que tienes un archivo geojson con los datos de sequía
    fetch('/path-to-drought-geojson.json')
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          style: function (feature) {
            return {
              color: feature.properties.severity === 'Severe' ? 'red' : 'orange',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.5,
            };
          },
        }).addTo(map);
      })
      .catch(err => console.error('Error loading drought data:', err));

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

