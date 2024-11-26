import axios from 'axios';

const GEOCODE_API_URL = 'https://api.opencagedata.com/geocode/v1/json';
const GEOCODE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

export const getCoordinatesFromPostalCode = async (postalCode) => {
  if (typeof window === "undefined") {
    // Avoid fetching during SSR
    return null;
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL}/geocode?postalCode=${postalCode}`);
  if (!response.ok) {
    throw new Error("Failed to fetch coordinates");
  }
  return response.json();
};