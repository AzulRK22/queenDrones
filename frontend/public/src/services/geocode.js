import axios from 'axios';

const GEOCODE_API_URL = 'https://api.opencagedata.com/geocode/v1/json';
const GEOCODE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

export const getCoordinatesFromPostalCode = async (postalCode) => {
  try {
    const response = await axios.get(`${GEOCODE_API_URL}?q=${postalCode}&key=${GEOCODE_API_KEY}&limit=1`);
    if (response.data && response.data.results && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lng };
    } else {
      throw new Error("No se pudieron obtener las coordenadas para el código postal proporcionado.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
