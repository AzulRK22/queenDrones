import axios from 'axios';

// Asegúrate de que esta URL esté correctamente definida en tu archivo .env
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Reemplaza con tu clave de API



export const getWeatherData = async () => {
  try {
    const response = await axios.get(`${WEATHER_API_URL}?q=Santiago,CL&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};





