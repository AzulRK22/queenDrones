import React, { useState, useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Override the default icon globally
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: '/leaflet/leaf1.png',
  iconRetinaUrl: '/leaflet/leaf1.png',
  iconSize: [25, 41], // Adjust these sizes as needed
  iconAnchor: [12, 41],
  shadowUrl: null, // Remove the shadow if it's not needed
});

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
    [onDragEnd]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup>Drag me to select a location!</Popup>
    </Marker>
  );
};

const WaypointMap = ({ selectedRoute }) => {
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    if (selectedRoute && selectedRoute.coordinates) {
      setCoordinates(selectedRoute.coordinates);
    }
  }, [selectedRoute]);

  const mapCenter = useMemo(() => {
    if (coordinates.length > 0) {
      return [coordinates[0].latitude, coordinates[0].longitude];
    }
    return [-33.4489, -70.6693];
  }, [coordinates]);

  return (
    <div>
      <MapContainer center={mapCenter} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {coordinates.length > 0 && (
          <Polyline positions={coordinates.map(coord => [coord.latitude, coord.longitude])} color="blue">
            {coordinates.map((coord, index) => (
              <Marker key={index} position={[coord.latitude, coord.longitude]}>
                <Popup>
                  Sequence Number: {coord.sequence_number}
                </Popup>
              </Marker>
            ))}
          </Polyline>
        )}
      </MapContainer>
    </div>
  );
};

export default WaypointMap;
