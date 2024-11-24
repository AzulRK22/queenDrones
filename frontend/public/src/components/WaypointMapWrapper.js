import dynamic from 'next/dynamic';
import { useState } from 'react';

const WaypointMap = dynamic(() => import('./WaypointMap'), {
  ssr: false,
});

const WaypointMapWrapper = ({ selectedRoute }) => {
  return <WaypointMap selectedRoute={selectedRoute} />;
};

export default WaypointMapWrapper;
