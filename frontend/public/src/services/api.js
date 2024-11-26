import axios from 'axios';

// Asegúrate de que esta URL esté correctamente definida en tu archivo .env
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Reemplaza con tu clave de API

// frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
const response = await fetch(`${API_BASE_URL}/api/missions`);


export async function getMissions() {
    const response = await fetch(`${API_BASE_URL}/api/missions`);
    if (!response.ok) {
        throw new Error("Failed to fetch missions");
    }
    return response.json();
}



export const getWeatherData = async () => {
  try {
    const response = await axios.get(`${WEATHER_API_URL}?q=Santiago,CL&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};



export const getWeatherData2 = async (lat, lng) => {
  if (typeof window === "undefined") {
    // Avoid fetching during SSR
    return null;
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL}/weather?lat=${lat}&lng=${lng}`);
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  return response.json();
};

export async function getServerSideProps() {
  // Skip fetching data during the build
  if (process.env.NODE_ENV === "production") {
    return { props: { data: [] } };
  }

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/missions`);
    const data = await res.json();
    return { props: { data } };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { data: [] } }; // Return empty data on error
  }
}


