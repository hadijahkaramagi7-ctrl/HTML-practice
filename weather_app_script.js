// Weather App using Open-Meteo API (free, no API key required)

const cityInput = document.getElementById('cityInput');
const result = document.getElementById('result');

// Weather code to description mapping (from Open-Meteo docs)
const weatherCodes = {
  0: 'Clear sky',
  1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
  80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
};

// Get weather for the city entered by the user
async function getWeather() {
  const city = cityInput.value.trim();

  // Validate input
  if (city === '') {
    result.innerHTML = '<p class="error">Please enter a city name.</p>';
    return;
  }

  result.innerHTML = '<p class="hint">Loading...</p>';

  try {
    // Step 1: Find the city's coordinates using the geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    // Condition: check if the city was found
    if (!geoData.results || geoData.results.length === 0) {
      result.innerHTML = '<p class="error">City not found. Try another name.</p>';
      return;
    }

    const place = geoData.results[0];
    const { latitude, longitude, name, country } = place;

    // Step 2: Fetch the weather for those coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const w = weatherData.current_weather;

    // Condition: make sure weather data exists
    if (!w) {
      result.innerHTML = '<p class="error">Could not fetch weather data.</p>';
      return;
    }

    const description = weatherCodes[w.weathercode] || 'Unknown';

    // Step 3: Show the result
    result.innerHTML = `
      <div class="city-name">${name}, ${country}</div>
      <div class="temperature">${w.temperature}°C</div>
      <div class="condition">${description}</div>
      <div class="details">
        <div><strong>${w.windspeed} km/h</strong>Wind</div>
        <div><strong>${w.winddirection}°</strong>Direction</div>
      </div>
    `;
  } catch (error) {
    result.innerHTML = '<p class="error">Something went wrong. Check your internet.</p>';
    console.error(error);
  }
}

// Allow pressing Enter to search
cityInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    getWeather();
  }
});
