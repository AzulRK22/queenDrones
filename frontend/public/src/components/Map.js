// components/Map.js

import dynamic from 'next/dynamic';
import React from 'react';

// Importa Leaflet solo en el cliente
const Map = dynamic(() => import('./MapComponent'), { ssr: false });

export default Map;






