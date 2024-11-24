import axios from 'axios';

const OPENAI_API_KEY = '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'
const OPENAI_API_URL = 'https://api.openai.com/v1/completions';

export const getSafetyRecommendations = async (weather) => {
  const prompt = `
    Basado en las siguientes condiciones meteorológicas:
    Temperatura: ${weather.temperature}°C
    Velocidad del viento: ${weather.windSpeed} km/h
    Dirección del viento: ${weather.windDirection}°
    Humedad: ${weather.humidity}%
    ¿Cuáles serían las mejores recomendaciones de seguridad para el usuario?
  `;

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: "babbage-002",
          prompt,
          max_tokens: 150,
          temperature: 0.5
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].text.trim();
    } catch (error) {
      if (error.response && error.response.status === 429) {
        attempt++;
        console.warn(`Rate limit exceeded, retrying... (${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      } else {
        console.error("Error fetching safety recommendations:", error.response ? error.response.data : error.message);
        throw error;
      }
    }
  }
};


