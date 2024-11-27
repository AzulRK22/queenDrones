import axios from 'axios';

// Base API URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_BUILD ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"; // Fallback to localhost for development

// Weather API configuration
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Ensure this is set in your environment

/**
 * Fetches all missions from the backend.
 */
export async function getMissions() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/missions`);
    if (!response.ok) {
      throw new Error("Failed to fetch missions");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching missions:", error);
    throw error; // Rethrow to handle in the calling component
  }
}

/**
 * Fetches weather data from the backend.
 */
export const getWeatherData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/weather`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

/**
 * Fetches weather data for specific latitude and longitude.
 * Avoids fetching during Server-Side Rendering (SSR).
 */
export const getWeatherData2 = async (lat, lng) => {
  if (typeof window === "undefined") {
    return null; // Avoid fetching during SSR
  }

  try {
    const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lng=${lng}`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data for coordinates:", error);
    throw error;
  }
};

/**
 * Fetches coordinates based on a postal code.
 * Uses Axios for backend API calls.
 */
export const getCoordinatesFromPostalCode = async (postalCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/geocode`, {
      params: { postalCode },
    });
    return response.data; // Assumes backend returns { lat: ..., lng: ... }
  } catch (error) {
    console.error("Error fetching coordinates from postal code:", error);
    throw error;
  }
};

/**
 * For Server-Side Props fetching during SSR (Next.js only).
 * Returns empty data during build for production.
 */
export async function getServerSideProps() {
  if (process.env.NODE_ENV === "production") {
    return { props: { data: [] } }; // Skip fetching during build
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/missions`);
    if (!response.ok) {
      throw new Error("Failed to fetch data during SSR");
    }
    const data = await response.json();
    return { props: { data } };
  } catch (error) {
    console.error("Error fetching data during SSR:", error);
    return { props: { data: [] } }; // Return empty data on error
  }
}

/**
 * Fetches weather data directly from OpenWeatherMap API.
 * Can be used if your backend doesn’t proxy weather data.
 */
export const fetchOpenWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric', // Adjust as needed
      },
    });
    return response.data; // Assumes the API returns JSON
  } catch (error) {
    console.error("Error fetching OpenWeather data:", error);
    throw error;
  }
};
